# -*- coding: utf-8 -*-
"""
从「图标总览.png」重新切一套干净图标。

旧版脚本按大区域等分，容易把文字、虚线边框和过多留白切进去。
这一版使用图标本体裁剪框，做边缘背景透明化、自动裁边，并输出统一画布。
"""
from __future__ import annotations

import os
from collections import deque
from dataclasses import dataclass
from typing import Iterable

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "图标总览.png")
OUT_ROOT = os.path.join(ROOT, "assets", "icons")
PREVIEW = os.path.join(ROOT, "assets", "icons", "_preview.png")


@dataclass(frozen=True)
class IconSpec:
    subdir: str
    name: str
    box: tuple[int, int, int, int]
    canvas: tuple[int, int]
    max_side: int
    threshold: int = 24


def row_specs(
    subdir: str,
    names: list[str],
    x0: int,
    x1: int,
    y0: int,
    y1: int,
    canvas: tuple[int, int],
    max_side: int,
    threshold: int = 24,
) -> list[IconSpec]:
    cw = (x1 - x0) / len(names)
    specs: list[IconSpec] = []
    for i, name in enumerate(names):
        left = round(x0 + i * cw)
        right = round(x0 + (i + 1) * cw)
        specs.append(IconSpec(subdir, name, (left, y0, right, y1), canvas, max_side, threshold))
    return specs


def centered_row_specs(
    subdir: str,
    names: list[str],
    first_cx: float,
    step_x: float,
    cy: float,
    crop: tuple[int, int],
    canvas: tuple[int, int],
    max_side: int,
    threshold: int = 24,
) -> list[IconSpec]:
    specs: list[IconSpec] = []
    cw, ch = crop
    for i, name in enumerate(names):
        cx = first_cx + i * step_x
        box = (
            round(cx - cw / 2),
            round(cy - ch / 2),
            round(cx + cw / 2),
            round(cy + ch / 2),
        )
        specs.append(IconSpec(subdir, name, box, canvas, max_side, threshold))
    return specs


def center_specs(
    subdir: str,
    names: list[str],
    centers: list[tuple[float, float]],
    crop: tuple[int, int],
    canvas: tuple[int, int],
    max_side: int,
    threshold: int = 24,
) -> list[IconSpec]:
    specs: list[IconSpec] = []
    cw, ch = crop
    for name, (cx, cy) in zip(names, centers):
        box = (
            round(cx - cw / 2),
            round(cy - ch / 2),
            round(cx + cw / 2),
            round(cy + ch / 2),
        )
        specs.append(IconSpec(subdir, name, box, canvas, max_side, threshold))
    return specs


SPECS: list[IconSpec] = [
    # 底部 tab：只取图标，不带中文标签。
    *centered_row_specs(
        "tab",
        ["home", "category", "event", "mine"],
        104,
        122,
        416,
        (104, 82),
        (144, 144),
        118,
        26,
    ),
    # 功能图标三行。
    *center_specs(
        "func",
        ["camera", "album", "search", "filter", "calendar", "edit", "delete", "export", "stats", "tag"],
        [(89, 616), (182, 619), (280.5, 619.5), (371, 619), (464, 618), (558.5, 618.5), (655.5, 617.5), (747.5, 626), (840.5, 618.5), (939.5, 618)],
        (86, 58),
        (112, 112),
        92,
        30,
    ),
    *center_specs(
        "func",
        ["backup", "restore", "encrypt", "settings", "favorite", "share", "remind", "trash", "pdf", "excel"],
        [(83.5, 735), (179, 736), (275.5, 735), (368, 736.5), (465.5, 736.5), (561, 736.5), (654.5, 736.5), (744, 737.5), (840.5, 737), (936, 737.5)],
        (86, 68),
        (112, 112),
        92,
        30,
    ),
    *center_specs(
        "func",
        ["important", "reimburse", "memorial", "travel", "medical", "shopping", "other"],
        [(85.5, 857), (190, 856), (295.5, 858.5), (411, 857), (524.5, 858), (639, 861), (745, 858.5), (839, 859.5)],
        (90, 72),
        (112, 112),
        92,
        30,
    ),
    # 分类图标。
    *center_specs(
        "category",
        ["dining", "shopping", "travel", "medical", "fun", "utility", "reimburse", "misc"],
        [(96, 1037), (209, 1037), (327.5, 1038), (442, 1038.5), (557, 1041.5), (677, 1039), (784.5, 1036.5), (881.5, 1037.5)],
        (98, 64),
        (128, 128),
        104,
        32,
    ),
    # 标签样式保留整枚标签（含中文），作为完整标签贴纸资源。
    *row_specs(
        "tag",
        ["reimburse", "important", "memorial", "travel", "other"],
        50,
        974,
        1172,
        1230,
        (240, 88),
        224,
        22,
    ),
    # 场景图标：只取篮子插画，不带中文标签。
    *center_specs(
        "scene",
        [
            "basket_groceries",
            "basket_shopping",
            "basket_travel",
            "basket_medical",
            "basket_bill",
            "basket_misc",
        ],
        [(111, 1352.5), (253.5, 1353), (398.5, 1351.5), (527, 1350), (659, 1356.5), (927, 1357)],
        (128, 108),
        (180, 180),
        154,
        34,
    ),
]


def distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> int:
    return abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2])


def corner_bg(im: Image.Image) -> tuple[int, int, int]:
    rgb = im.convert("RGB")
    w, h = rgb.size
    pts: list[tuple[int, int, int]] = []
    for x in range(0, min(8, w)):
        for y in range(0, min(8, h)):
            pts.append(rgb.getpixel((x, y)))
            pts.append(rgb.getpixel((w - 1 - x, y)))
            pts.append(rgb.getpixel((x, h - 1 - y)))
            pts.append(rgb.getpixel((w - 1 - x, h - 1 - y)))
    n = len(pts)
    return (
        sum(p[0] for p in pts) // n,
        sum(p[1] for p in pts) // n,
        sum(p[2] for p in pts) // n,
    )


def edge_alpha(im: Image.Image, threshold: int) -> Image.Image:
    """只把与边缘背景连通的纸色去掉，保留图标内部浅色填充。"""
    rgba = im.convert("RGBA")
    rgb = rgba.convert("RGB")
    w, h = rgba.size
    bg = corner_bg(rgb)
    seen = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        if x < 0 or y < 0 or x >= w or y >= h or seen[y][x]:
            return
        if distance(rgb.getpixel((x, y)), bg) <= threshold:
            seen[y][x] = True
            q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    px = rgba.load()
    while q:
        x, y = q.popleft()
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)
        push(x + 1, y)
        push(x - 1, y)
        push(x, y + 1)
        push(x, y - 1)

    return rgba


def alpha_bbox(im: Image.Image, pad: int = 4) -> tuple[int, int, int, int]:
    alpha = im.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        return (0, 0, im.width, im.height)
    x0, y0, x1, y1 = bbox
    return (
        max(0, x0 - pad),
        max(0, y0 - pad),
        min(im.width, x1 + pad),
        min(im.height, y1 + pad),
    )


def normalize(im: Image.Image, spec: IconSpec) -> Image.Image:
    clean = edge_alpha(im, spec.threshold)
    clean = clean.crop(alpha_bbox(clean, 5))
    clean.thumbnail((spec.max_side, spec.max_side), Image.Resampling.LANCZOS)
    out = Image.new("RGBA", spec.canvas, (255, 255, 255, 0))
    x = (spec.canvas[0] - clean.width) // 2
    y = (spec.canvas[1] - clean.height) // 2
    out.alpha_composite(clean, (x, y))
    return out


def save_icon(sheet: Image.Image, spec: IconSpec) -> str:
    crop = sheet.crop(spec.box)
    out = normalize(crop, spec)
    path = os.path.join(OUT_ROOT, spec.subdir, f"{spec.name}@3x.png")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    out.save(path, "PNG")
    return path


def make_preview(paths: Iterable[str]) -> None:
    icons = [(p, Image.open(p).convert("RGBA")) for p in paths]
    cell_w, cell_h = 132, 160
    cols = 8
    rows = (len(icons) + cols - 1) // cols
    preview = Image.new("RGBA", (cols * cell_w, rows * cell_h), (250, 246, 238, 255))
    draw = ImageDraw.Draw(preview)
    for i, (path, icon) in enumerate(icons):
        x = (i % cols) * cell_w
        y = (i // cols) * cell_h
        draw.rounded_rectangle((x + 8, y + 8, x + cell_w - 8, y + cell_h - 8), radius=16, fill=(255, 252, 247, 255), outline=(232, 223, 201, 255))
        thumb = icon.copy()
        thumb.thumbnail((92, 92), Image.Resampling.LANCZOS)
        preview.alpha_composite(thumb, (x + (cell_w - thumb.width) // 2, y + 18))
        label = os.path.basename(path).replace("@3x.png", "")
        draw.text((x + 12, y + 118), label[:16], fill=(92, 74, 58, 255))
    preview.convert("RGB").save(PREVIEW, "PNG")


def main() -> None:
    if not os.path.isfile(SRC):
        raise SystemExit(f"找不到源文件: {SRC}")
    sheet = Image.open(SRC).convert("RGB")
    if sheet.size != (1024, 1536):
        raise SystemExit(f"源图尺寸应为 1024x1536，当前为 {sheet.size}")
    paths = [save_icon(sheet, spec) for spec in SPECS]
    make_preview(paths)
    print(f"exported={len(paths)}")
    print(f"out_root={OUT_ROOT}")
    print(f"preview={PREVIEW}")


if __name__ == "__main__":
    main()
