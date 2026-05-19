/**
 * 静态图标路径（assets/icons 切图）
 * 本地路径需以 / 开头，相对小程序根目录。
 */

const CATEGORY_BY_ID = {
  cat_food: '/assets/icons/category/dining@3x.png',
  cat_shop: '/assets/icons/category/shopping@3x.png',
  cat_traffic: '/assets/icons/category/travel@3x.png',
  cat_med: '/assets/icons/category/medical@3x.png',
  cat_fun: '/assets/icons/category/fun@3x.png',
  cat_bill: '/assets/icons/category/utility@3x.png',
  cat_reim: '/assets/icons/category/reimburse@3x.png',
  cat_other: '/assets/icons/category/misc@3x.png'
};

const TAB = {
  home: '/images/tabbar/tab_home.png',
  category: '/images/tabbar/tab_category.png',
  add: '/images/tabbar/tab_add.png',
  event: '/images/tabbar/tab_event.png',
  stats: '/assets/icons/func/stats@3x.png',
  mine: '/images/tabbar/tab_mine.png'
};

const FUNC = {
  camera: '/assets/icons/func/camera@3x.png',
  album: '/assets/icons/func/album@3x.png',
  export: '/assets/icons/func/export@3x.png',
  backup: '/assets/icons/func/backup@3x.png',
  restore: '/assets/icons/func/restore@3x.png',
  encrypt: '/assets/icons/func/encrypt@3x.png',
  settings: '/assets/icons/func/settings@3x.png',
  trash: '/assets/icons/func/trash@3x.png',
  pdf: '/assets/icons/func/pdf@3x.png',
  stats: '/assets/icons/func/stats@3x.png',
  excel: '/assets/icons/func/excel@3x.png',
  images: '/assets/icons/func/album@3x.png',
  calendar: '/assets/icons/func/calendar@3x.png',
  tag: '/assets/icons/func/tag@3x.png',
  all: '/assets/icons/category/misc@3x.png',
  cloud: '/assets/icons/func/backup@3x.png',
  import: '/assets/icons/func/restore@3x.png',
  document: '/assets/icons/func/pdf@3x.png',
  about: '/assets/icons/func/memorial@3x.png',
  clear: '/assets/icons/func/important@3x.png'
};

/** @param {string} [icon] @param {string} [categoryId] */
function categoryIconUrl(categoryId) {
  if (categoryId && CATEGORY_BY_ID[categoryId]) return CATEGORY_BY_ID[categoryId];
  return CATEGORY_BY_ID.cat_other;
}

function isAssetPath(s) {
  return typeof s === 'string' && s.length > 0 && s.charAt(0) === '/';
}

/** 列表缩略：优先占位图为 PNG，否则按分类 */
function receiptThumbUrl(receipt) {
  if (!receipt) return CATEGORY_BY_ID.cat_other;
  if (isAssetPath(receipt.placeholder)) return receipt.placeholder;
  return categoryIconUrl(receipt.categoryId);
}

const EVENT_COVER_BY_LEGACY_SRC = {
  '/assets/icons/scene/basket_groceries@3x.png': '/images/事件/event_other.png',
  '/assets/icons/scene/basket_shopping@3x.png': '/images/事件/event_shopping.png',
  '/assets/icons/category/dining@3x.png': '/images/事件/event_dining.png',
  '/assets/icons/scene/basket_travel@3x.png': '/images/事件/event_travel.png',
  '/assets/icons/scene/basket_medical@3x.png': '/images/事件/event_other.png',
  '/assets/icons/scene/basket_bill@3x.png': '/images/事件/event_reimburse.png',
  '/assets/icons/tab/home@3x.png': '/images/事件/event_other.png',
  '/assets/icons/tab/mine@3x.png': '/images/事件/event_birthday.png',
  '/assets/icons/category/fun@3x.png': '/images/事件/event_wedding.png',
  '/assets/icons/category/shopping@3x.png': '/images/事件/event_shopping.png'
};

/** 事件封面：兼容旧封面路径，其它（旧 emoji）落到默认事件图 */
function normalizeEventCover(cover) {
  if (EVENT_COVER_BY_LEGACY_SRC[cover]) return EVENT_COVER_BY_LEGACY_SRC[cover];
  if (isAssetPath(cover)) return cover;
  return '/images/事件/event_other.png';
}

const NEW_CATEGORY_ICON_PICKS = [
  '/assets/icons/category/dining@3x.png',
  '/assets/icons/category/shopping@3x.png',
  '/assets/icons/category/travel@3x.png',
  '/assets/icons/category/medical@3x.png',
  '/assets/icons/category/fun@3x.png',
  '/assets/icons/category/utility@3x.png',
  '/assets/icons/category/reimburse@3x.png',
  '/assets/icons/category/misc@3x.png',
  '/assets/icons/scene/basket_groceries@3x.png',
  '/assets/icons/scene/basket_shopping@3x.png',
  '/assets/icons/scene/basket_travel@3x.png',
  '/assets/icons/func/tag@3x.png',
  '/assets/icons/func/camera@3x.png',
  '/assets/icons/func/calendar@3x.png',
  '/assets/icons/func/favorite@3x.png',
  '/assets/icons/func/remind@3x.png',
  '/assets/icons/func/search@3x.png',
  '/assets/icons/func/filter@3x.png',
  '/assets/icons/func/edit@3x.png',
  '/assets/icons/func/share@3x.png',
  '/assets/icons/func/other@3x.png',
  '/assets/icons/func/excel@3x.png'
];

const PLACEHOLDER_PICKS = [
  { src: '/assets/icons/category/dining@3x.png', color: 'orange' },
  { src: '/assets/icons/category/shopping@3x.png', color: 'pink' },
  { src: '/assets/icons/category/travel@3x.png', color: 'blue' },
  { src: '/assets/icons/category/medical@3x.png', color: 'green' },
  { src: '/assets/icons/func/camera@3x.png', color: 'orange' },
  { src: '/assets/icons/category/reimburse@3x.png', color: 'coffee' },
  { src: '/assets/icons/func/calendar@3x.png', color: 'blue' },
  { src: '/assets/icons/func/tag@3x.png', color: 'orange' }
];

const COVER_PICKS = [
  { src: '/images/事件/event_other.png', color: 'coffee' },
  { src: '/images/事件/event_wedding.png', color: 'pink' },
  { src: '/images/事件/event_reimburse.png', color: 'green' },
  { src: '/images/事件/event_travel.png', color: 'blue' },
  { src: '/images/事件/event_birthday.png', color: 'yellow' },
  { src: '/images/事件/event_dining.png', color: 'orange' },
  { src: '/images/事件/event_shopping.png', color: 'pink' }
];

module.exports = {
  CATEGORY_BY_ID,
  TAB,
  FUNC,
  categoryIconUrl,
  isAssetPath,
  receiptThumbUrl,
  normalizeEventCover,
  NEW_CATEGORY_ICON_PICKS,
  PLACEHOLDER_PICKS,
  COVER_PICKS
};
