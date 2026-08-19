/**
 * utils/icons.js
 * 纯 SVG 矢量图标库（零位图依赖，手账温润森系调色）
 * 采用 Data-URI (data:image/svg+xml;utf8,...)，原生支持微信小程序 <image src="..." />
 */

function toDataUri(svg) {
  // 对 SVG 进行紧凑化并转义特殊字符
  const clean = svg
    .replace(/\n+/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(clean);
}

// ==================== SVG 矢量模板定义 ====================

// --- 基础 Tab 图标 ---
const SVG_TAB_HOME = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M8 22L24 8L40 22V40C40 41.1 39.1 42 38 42H10C8.9 42 8 41.1 8 40V22Z" fill="#F3ECE0" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M19 42V26H29V42" fill="#8FAE85" stroke="#5C5245" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="24" cy="18" r="3" fill="#E8A87C"/>
</svg>`);

const SVG_TAB_CATEGORY = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <rect x="8" y="8" width="13" height="13" rx="3" fill="#E8A8AB" stroke="#5C5245" stroke-width="3.5"/>
  <rect x="27" y="8" width="13" height="13" rx="3" fill="#A0B8CC" stroke="#5C5245" stroke-width="3.5"/>
  <rect x="8" y="27" width="13" height="13" rx="3" fill="#E0C875" stroke="#5C5245" stroke-width="3.5"/>
  <rect x="27" y="27" width="13" height="13" rx="3" fill="#8FAE85" stroke="#5C5245" stroke-width="3.5"/>
</svg>`);

const SVG_TAB_ADD = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <circle cx="24" cy="24" r="21" fill="#8FAE85" stroke="#5C5245" stroke-width="3"/>
  <path d="M24 14V34M14 24H34" stroke="#FAF6EE" stroke-width="4.5" stroke-linecap="round"/>
</svg>`);

const SVG_TAB_EVENT = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M10 8C10 6.89543 10.8954 6 12 6H34C36.2091 6 38 7.79086 38 10V42H12C10.8954 42 10 41.1046 10 40V8Z" fill="#F7EEDD" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M16 6V42" stroke="#5C5245" stroke-width="2.5" stroke-dasharray="3 3"/>
  <path d="M26 6V18L31 14L36 18V6" fill="#E8A87C" stroke="#5C5245" stroke-width="2"/>
  <circle cx="26" cy="28" r="2.5" fill="#8FAE85"/>
  <line x1="22" y1="35" x2="33" y2="35" stroke="#B5A88E" stroke-width="2.5" stroke-linecap="round"/>
</svg>`);

const SVG_TAB_MINE = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <circle cx="24" cy="16" r="8" fill="#F3ECE0" stroke="#5C5245" stroke-width="3.5"/>
  <path d="M8 40C8 32.268 14.268 28 22 28H26C33.732 28 40 32.268 40 40" fill="#B89968" stroke="#5C5245" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="24" cy="16" r="3" fill="#E8A87C"/>
</svg>`);

// --- 8大分类图标 ---
const SVG_CAT_FOOD = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M10 22C10 32 16 38 24 38C32 38 38 32 38 22H10Z" fill="#E8A87C" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M16 14C16 14 17 11 20 11M24 14C24 14 25 10 28 10M32 14C32 14 33 11 36 11" stroke="#B89968" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M14 42H34" stroke="#5C5245" stroke-width="3.5" stroke-linecap="round"/>
</svg>`);

const SVG_CAT_SHOP = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M10 16H38L35 41H13L10 16Z" fill="#E8A8AB" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M18 18V12C18 8.68629 20.6863 6 24 6C27.3137 6 30 8.68629 30 12V18" stroke="#5C5245" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="24" cy="27" r="3" fill="#FAF6EE"/>
</svg>`);

const SVG_CAT_TRAFFIC = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <rect x="8" y="12" width="32" height="22" rx="6" fill="#A0B8CC" stroke="#5C5245" stroke-width="3.5"/>
  <rect x="12" y="16" width="24" height="10" rx="3" fill="#FAF6EE" stroke="#5C5245" stroke-width="2.5"/>
  <circle cx="15" cy="38" r="4" fill="#FAF6EE" stroke="#5C5245" stroke-width="3"/>
  <circle cx="33" cy="38" r="4" fill="#FAF6EE" stroke="#5C5245" stroke-width="3"/>
</svg>`);

const SVG_CAT_MED = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <rect x="8" y="14" width="32" height="26" rx="5" fill="#8FAE85" stroke="#5C5245" stroke-width="3.5"/>
  <path d="M18 14V10C18 8.89543 18.8954 8 20 8H28C29.1046 8 30 8.89543 30 10V14" stroke="#5C5245" stroke-width="3" stroke-linecap="round"/>
  <path d="M24 20V34M17 27H31" stroke="#FAF6EE" stroke-width="4.5" stroke-linecap="round"/>
</svg>`);

const SVG_CAT_FUN = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <rect x="6" y="14" width="36" height="24" rx="8" fill="#B5A0C8" stroke="#5C5245" stroke-width="3.5"/>
  <path d="M16 21V31M11 26H21" stroke="#FAF6EE" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="31" cy="23" r="2.5" fill="#FAF6EE"/>
  <circle cx="36" cy="28" r="2.5" fill="#FAF6EE"/>
</svg>`);

const SVG_CAT_BILL = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M10 8H38V42L33 38L28 42L24 38L19 42L15 38L10 42V8Z" fill="#E0C875" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M26 14L20 24H27L22 34" stroke="#5C5245" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

const SVG_CAT_REIM = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <rect x="8" y="10" width="32" height="28" rx="4" fill="#B89968" stroke="#5C5245" stroke-width="3.5"/>
  <circle cx="28" cy="24" r="7" fill="none" stroke="#E8A87C" stroke-width="2.5" stroke-dasharray="3 2"/>
  <text x="28" y="27" font-size="8" font-weight="bold" fill="#FAF6EE" text-anchor="middle" font-family="sans-serif">销</text>
  <line x1="14" y1="18" x2="20" y2="18" stroke="#FAF6EE" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="14" y1="24" x2="19" y2="24" stroke="#FAF6EE" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="14" y1="30" x2="25" y2="30" stroke="#FAF6EE" stroke-width="2.5" stroke-linecap="round"/>
</svg>`);

const SVG_CAT_OTHER = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M24 6L28 17L39 18L31 26L33 37L24 31L15 37L17 26L9 18L20 17L24 6Z" fill="#C0B5A4" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
</svg>`);

// --- 功能与操作图标 ---
const SVG_FUNC_CAMERA = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M7 16C7 13.7909 8.79086 12 11 12H16L18.5 8H29.5L32 12H37C39.2091 12 41 13.7909 41 16V36C41 38.2091 39.2091 40 37 40H11C8.79086 40 7 38.2091 7 36V16Z" fill="#E8A87C" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <circle cx="24" cy="26" r="7" fill="#FAF6EE" stroke="#5C5245" stroke-width="3"/>
  <circle cx="34" cy="18" r="2" fill="#FAF6EE"/>
</svg>`);

const SVG_FUNC_ALBUM = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <rect x="6" y="8" width="36" height="32" rx="4" fill="#A0B8CC" stroke="#5C5245" stroke-width="3.5"/>
  <circle cx="16" cy="18" r="3.5" fill="#E0C875"/>
  <path d="M8 36L20 22L30 33L35 27L40 34" stroke="#5C5245" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="#FAF6EE"/>
</svg>`);

const SVG_FUNC_SEARCH = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <circle cx="21" cy="21" r="12" fill="#FAF6EE" stroke="#5C5245" stroke-width="4"/>
  <line x1="30" y1="30" x2="42" y2="42" stroke="#5C5245" stroke-width="4.5" stroke-linecap="round"/>
</svg>`);

const SVG_FUNC_EXPORT = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M12 24V38C12 39.1 12.9 40 14 40H34C35.1 40 36 39.1 36 38V24" stroke="#5C5245" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M24 8V28M24 8L16 16M24 8L32 16" stroke="#E8A87C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

const SVG_FUNC_BACKUP = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M12 36H36C39.3137 36 42 33.3137 42 30C42 26.9634 39.7345 24.4561 36.7937 24.062C35.9189 16.7115 29.6256 11 22 11C15.0116 11 9.17608 15.8239 7.76016 22.4285C4.54228 23.6375 2.25 26.7925 2.25 30.5C2.25 34.6421 5.60786 38 9.75 38H12" fill="#A0B8CC" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M24 22V32M24 22L20 26M24 22L28 26" stroke="#FAF6EE" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

const SVG_FUNC_RESTORE = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M8 24C8 15.1634 15.1634 8 24 8C31.5235 8 37.8384 13.1818 39.5447 20.25" stroke="#E8A87C" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M40 24C40 32.8366 32.8366 40 24 40C16.4765 40 10.1616 34.8182 8.45528 27.75" stroke="#8FAE85" stroke-width="3.5" stroke-linecap="round"/>
  <polyline points="34 20 40 20 40 14" stroke="#E8A87C" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="14 28 8 28 8 34" stroke="#8FAE85" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

const SVG_FUNC_ENCRYPT = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <rect x="10" y="20" width="28" height="22" rx="4" fill="#8FAE85" stroke="#5C5245" stroke-width="3.5"/>
  <path d="M16 20V14C16 9.58172 19.5817 6 24 6C28.4183 6 32 9.58172 32 14V20" stroke="#5C5245" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="24" cy="30" r="3" fill="#FAF6EE"/>
  <line x1="24" y1="33" x2="24" y2="37" stroke="#FAF6EE" stroke-width="2.5" stroke-linecap="round"/>
</svg>`);

const SVG_FUNC_SETTINGS = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <circle cx="24" cy="24" r="7" fill="#E8A87C" stroke="#5C5245" stroke-width="3.5"/>
  <path d="M24 6V11M24 37V42M6 24H11M37 24H42M11.3 11.3L14.8 14.8M33.2 33.2L36.7 36.7M11.3 36.7L14.8 33.2M33.2 14.8L36.7 11.3" stroke="#5C5245" stroke-width="3.5" stroke-linecap="round"/>
</svg>`);

const SVG_FUNC_TRASH = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M10 14H38M18 14V10C18 8.89543 18.8954 8 20 8H28C29.1046 8 30 8.89543 30 10V14" stroke="#5C5245" stroke-width="3" stroke-linecap="round"/>
  <path d="M13 14L16 40C16 41.1 16.9 42 18 42H30C31.1 42 32 41.1 32 40L35 14" fill="#E8A8AB" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <line x1="20" y1="20" x2="21" y2="34" stroke="#FAF6EE" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="28" y1="20" x2="27" y2="34" stroke="#FAF6EE" stroke-width="2.5" stroke-linecap="round"/>
</svg>`);

const SVG_FUNC_PDF = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M10 8C10 6.89543 10.8954 6 12 6H28L38 16V40C38 41.1046 37.1046 42 36 42H12C10.8954 42 10 41.1046 10 40V8Z" fill="#FAF6EE" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M28 6V16H38" fill="#E8A8AB" stroke="#5C5245" stroke-width="3" stroke-linejoin="round"/>
  <rect x="14" y="24" width="20" height="10" rx="2" fill="#E8A8AB"/>
  <text x="24" y="32" font-size="8" font-weight="bold" fill="#FAF6EE" text-anchor="middle" font-family="sans-serif">PDF</text>
</svg>`);

const SVG_FUNC_EXCEL = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M10 8C10 6.89543 10.8954 6 12 6H28L38 16V40C38 41.1046 37.1046 42 36 42H12C10.8954 42 10 41.1046 10 40V8Z" fill="#FAF6EE" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M28 6V16H38" fill="#8FAE85" stroke="#5C5245" stroke-width="3" stroke-linejoin="round"/>
  <rect x="14" y="24" width="20" height="10" rx="2" fill="#8FAE85"/>
  <text x="24" y="32" font-size="8" font-weight="bold" fill="#FAF6EE" text-anchor="middle" font-family="sans-serif">XLS</text>
</svg>`);

const SVG_FUNC_CALENDAR = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <rect x="8" y="12" width="32" height="30" rx="4" fill="#FAF6EE" stroke="#5C5245" stroke-width="3.5"/>
  <path d="M8 20H40" stroke="#5C5245" stroke-width="3"/>
  <line x1="16" y1="6" x2="16" y2="14" stroke="#E8A87C" stroke-width="4" stroke-linecap="round"/>
  <line x1="32" y1="6" x2="32" y2="14" stroke="#E8A87C" stroke-width="4" stroke-linecap="round"/>
  <circle cx="16" cy="27" r="2" fill="#8FAE85"/>
  <circle cx="24" cy="27" r="2" fill="#E8A8AB"/>
  <circle cx="32" cy="27" r="2" fill="#A0B8CC"/>
  <circle cx="16" cy="34" r="2" fill="#E0C875"/>
  <circle cx="24" cy="34" r="2" fill="#B89968"/>
</svg>`);

const SVG_FUNC_TAG = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M8 22V10C8 8.89543 8.89543 8 10 8H22L40 26L26 40L8 22Z" fill="#E0C875" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <circle cx="16" cy="16" r="3.5" fill="#FAF6EE" stroke="#5C5245" stroke-width="2"/>
</svg>`);

const SVG_FUNC_FAVORITE = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M24 40L21.4 37.6C12.2 29.3 6 23.7 6 16.8C6 11.2 10.4 6.8 16 6.8C19.2 6.8 22.2 8.3 24 10.6C25.8 8.3 28.8 6.8 32 6.8C37.6 6.8 42 11.2 42 16.8C42 23.7 35.8 29.3 26.6 37.6L24 40Z" fill="#E8A8AB" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
</svg>`);

const SVG_FUNC_REMIND = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M24 6C17.3726 6 12 11.3726 12 18V28L8 34H40L36 28V18C36 11.3726 30.6274 6 24 6Z" fill="#E0C875" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M20 38C20 40.2 21.8 42 24 42C26.2 42 28 40.2 28 38" stroke="#5C5245" stroke-width="3" stroke-linecap="round"/>
</svg>`);

const SVG_FUNC_FILTER = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <polygon points="6 10 42 10 28 26 28 38 20 42 20 26" fill="#A0B8CC" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
</svg>`);

const SVG_FUNC_EDIT = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M34 6L42 14L16 40H8V32L34 6Z" fill="#8FAE85" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <line x1="28" y1="12" x2="36" y2="20" stroke="#5C5245" stroke-width="3"/>
</svg>`);

const SVG_FUNC_SHARE = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <circle cx="36" cy="12" r="5" fill="#E8A87C" stroke="#5C5245" stroke-width="3"/>
  <circle cx="12" cy="24" r="5" fill="#8FAE85" stroke="#5C5245" stroke-width="3"/>
  <circle cx="36" cy="36" r="5" fill="#A0B8CC" stroke="#5C5245" stroke-width="3"/>
  <line x1="16.5" y1="21.5" x2="31.5" y2="14.5" stroke="#5C5245" stroke-width="3"/>
  <line x1="16.5" y1="26.5" x2="31.5" y2="33.5" stroke="#5C5245" stroke-width="3"/>
</svg>`);

const SVG_FUNC_STATS = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <rect x="8" y="26" width="6" height="14" rx="2" fill="#8FAE85" stroke="#5C5245" stroke-width="2.5"/>
  <rect x="18" y="16" width="6" height="24" rx="2" fill="#E8A87C" stroke="#5C5245" stroke-width="2.5"/>
  <rect x="28" y="10" width="6" height="30" rx="2" fill="#E8A8AB" stroke="#5C5245" stroke-width="2.5"/>
  <rect x="38" y="20" width="6" height="20" rx="2" fill="#A0B8CC" stroke="#5C5245" stroke-width="2.5"/>
  <line x1="4" y1="42" x2="44" y2="42" stroke="#5C5245" stroke-width="3" stroke-linecap="round"/>
</svg>`);

const SVG_FUNC_OTHER = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <circle cx="12" cy="24" r="3.5" fill="#B89968" stroke="#5C5245" stroke-width="2"/>
  <circle cx="24" cy="24" r="3.5" fill="#B89968" stroke="#5C5245" stroke-width="2"/>
  <circle cx="36" cy="24" r="3.5" fill="#B89968" stroke="#5C5245" stroke-width="2"/>
</svg>`);

// --- 手账故事插画与事件封面 ---
const SVG_EVENT_TRAVEL = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" rx="16" fill="#DDE8F0"/>
  <circle cx="78" cy="24" r="10" fill="#E8A87C"/>
  <path d="M15 80L40 45L65 80H15Z" fill="#A0B8CC" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M48 80L68 55L88 80H48Z" fill="#8FAE85" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <rect x="38" y="65" width="24" height="18" rx="3" fill="#E0C875" stroke="#5C5245" stroke-width="2.5"/>
  <path d="M46 65V60C46 58.9 46.9 58 48 58H52C53.1 58 54 58.9 54 60V65" stroke="#5C5245" stroke-width="2.5"/>
</svg>`);

const SVG_EVENT_BIRTHDAY = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" rx="16" fill="#FAF1D6"/>
  <path d="M22 60H78V85C78 87.2 76.2 89 74 89H26C23.8 89 22 87.2 22 85V60Z" fill="#E8A8AB" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M30 42H70V60H30V42Z" fill="#FAF6EE" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <rect x="47" y="24" width="6" height="18" fill="#8FAE85" stroke="#5C5245" stroke-width="2"/>
  <path d="M50 14C50 14 46 18 46 21C46 23.2 47.8 25 50 25C52.2 25 54 23.2 54 21C54 18 50 14 50 14Z" fill="#E8A87C"/>
  <circle cx="36" cy="51" r="2.5" fill="#E8A87C"/>
  <circle cx="50" cy="51" r="2.5" fill="#8FAE85"/>
  <circle cx="64" cy="51" r="2.5" fill="#A0B8CC"/>
</svg>`);

const SVG_EVENT_SHOPPING = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" rx="16" fill="#FCE8EB"/>
  <path d="M26 38H74L68 84H32L26 38Z" fill="#E8A8AB" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M38 42V28C38 21.4 43.4 16 50 16C56.6 16 62 21.4 62 28V42" stroke="#5C5245" stroke-width="4" stroke-linecap="round"/>
  <path d="M42 60L50 52L58 60L50 68L42 60Z" fill="#FAF6EE" stroke="#5C5245" stroke-width="2.5"/>
</svg>`);

const SVG_EVENT_DINING = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" rx="16" fill="#FCE9DC"/>
  <circle cx="50" cy="52" r="30" fill="#FAF6EE" stroke="#5C5245" stroke-width="3.5"/>
  <circle cx="50" cy="52" r="20" fill="#E8A87C" stroke="#5C5245" stroke-width="2"/>
  <path d="M14 26V78M10 26H18M14 38H18" stroke="#5C5245" stroke-width="3" stroke-linecap="round"/>
  <path d="M86 26V78M86 42C82 42 82 32 82 26" stroke="#5C5245" stroke-width="3" stroke-linecap="round"/>
</svg>`);

const SVG_EVENT_WEDDING = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" rx="16" fill="#F4E8F7"/>
  <path d="M40 68L36.5 64.8C24 53.5 16 46 16 36.5C16 28.8 22 23 29.5 23C33.8 23 37.8 25 40 28.2C42.2 25 46.2 23 50.5 23C58 23 64 28.8 64 36.5C64 46 56 53.5 43.5 64.8L40 68Z" fill="#E8A8AB" stroke="#5C5245" stroke-width="3"/>
  <circle cx="64" cy="62" r="16" fill="none" stroke="#E0C875" stroke-width="4"/>
  <polygon points="64 42 68 47 64 52 60 47" fill="#8FAE85" stroke="#5C5245" stroke-width="2"/>
</svg>`);

const SVG_EVENT_REIMBURSE = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" rx="16" fill="#E5EFE2"/>
  <rect x="22" y="20" width="56" height="64" rx="6" fill="#FAF6EE" stroke="#5C5245" stroke-width="3.5"/>
  <line x1="32" y1="34" x2="68" y2="34" stroke="#8FAE85" stroke-width="3" stroke-linecap="round"/>
  <line x1="32" y1="44" x2="68" y2="44" stroke="#B5A88E" stroke-width="3" stroke-linecap="round"/>
  <line x1="32" y1="54" x2="52" y2="54" stroke="#B5A88E" stroke-width="3" stroke-linecap="round"/>
  <circle cx="58" cy="64" r="12" fill="none" stroke="#E8A87C" stroke-width="3" stroke-dasharray="4 2"/>
  <text x="58" y="69" font-size="12" font-weight="bold" fill="#E8A87C" text-anchor="middle" font-family="sans-serif">¥</text>
</svg>`);

const SVG_EVENT_OTHER = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" rx="16" fill="#ECE7DE"/>
  <rect x="24" y="16" width="52" height="68" rx="4" fill="#B89968" stroke="#5C5245" stroke-width="3.5"/>
  <line x1="34" y1="16" x2="34" y2="84" stroke="#FAF6EE" stroke-width="2" stroke-dasharray="3 3"/>
  <circle cx="60" cy="50" r="10" fill="#E0C875" stroke="#5C5245" stroke-width="2"/>
  <polygon points="60 44 62 48 66 49 63 52 64 56 60 54 56 56 57 52 54 49 58 48" fill="#FAF6EE"/>
</svg>`);

// --- 吉祥物 & 装饰场景 ---
const SVG_MASCOT = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none">
  <rect x="18" y="12" width="44" height="56" rx="6" fill="#FAF6EE" stroke="#5C5245" stroke-width="3.5"/>
  <path d="M18 64L24 68L30 64L36 68L42 64L48 68L54 64L62 68V18C62 14.7 59.3 12 56 12H24C20.7 12 18 14.7 18 18V64Z" fill="#FAF6EE" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <circle cx="31" cy="34" r="3" fill="#5C5245"/>
  <circle cx="49" cy="34" r="3" fill="#5C5245"/>
  <ellipse cx="26" cy="39" rx="3.5" ry="2" fill="#E8A8AB"/>
  <ellipse cx="54" cy="39" rx="3.5" ry="2" fill="#E8A8AB"/>
  <path d="M37 40C38.5 42 41.5 42 43 40" stroke="#5C5245" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M40 50L37 47C35 45 35 43 37 42C39 41 40 43 40 43C40 43 41 41 43 42C45 43 45 45 43 47L40 50Z" fill="#8FAE85"/>
</svg>`);

const SVG_SCENE_BASKET = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none">
  <path d="M14 36H66L60 70H20L14 36Z" fill="#F7EEDD" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M26 36V22C26 14.3 32.3 8 40 8C47.7 8 54 14.3 54 22V36" stroke="#5C5245" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="20" y1="46" x2="60" y2="46" stroke="#B89968" stroke-width="2.5"/>
  <line x1="24" y1="58" x2="56" y2="58" stroke="#B89968" stroke-width="2.5"/>
  <line x1="30" y1="36" x2="35" y2="70" stroke="#B89968" stroke-width="2.5"/>
  <line x1="50" y1="36" x2="45" y2="70" stroke="#B89968" stroke-width="2.5"/>
</svg>`);

const SVG_EMPTY_STATE = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none">
  <circle cx="40" cy="40" r="32" fill="#F5EFE3" stroke="#5C5245" stroke-width="3"/>
  <path d="M28 48C32 44 48 44 52 48" stroke="#B5A88E" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="30" cy="34" r="3" fill="#5C5245"/>
  <circle cx="50" cy="34" r="3" fill="#5C5245"/>
  <line x1="36" y1="20" x2="44" y2="20" stroke="#E8A87C" stroke-width="3" stroke-linecap="round"/>
</svg>`);


// ==================== 统一字典与映射 ====================

const CATEGORY_BY_ID = {
  cat_food: SVG_CAT_FOOD,
  cat_shop: SVG_CAT_SHOP,
  cat_traffic: SVG_CAT_TRAFFIC,
  cat_med: SVG_CAT_MED,
  cat_fun: SVG_CAT_FUN,
  cat_bill: SVG_CAT_BILL,
  cat_reim: SVG_CAT_REIM,
  cat_other: SVG_CAT_OTHER
};

const TAB = {
  home: SVG_TAB_HOME,
  category: SVG_TAB_CATEGORY,
  add: SVG_TAB_ADD,
  event: SVG_TAB_EVENT,
  mine: SVG_TAB_MINE
};

const SVG_FUNC_BOOK = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M8 10C8 7.79 9.79 6 12 6H38C39.1 6 40 6.9 40 8V38C40 39.1 39.1 40 38 40H12C9.79 40 8 38.21 8 36V10Z" fill="#F7EEDD" stroke="#5C5245" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M14 6V40" stroke="#5C5245" stroke-width="2.5" stroke-dasharray="3 3"/>
  <line x1="20" y1="16" x2="34" y2="16" stroke="#8FAE85" stroke-width="3" stroke-linecap="round"/>
  <line x1="20" y1="24" x2="34" y2="24" stroke="#B5A88E" stroke-width="3" stroke-linecap="round"/>
  <line x1="20" y1="32" x2="28" y2="32" stroke="#E8A87C" stroke-width="3" stroke-linecap="round"/>
</svg>`);

const SVG_ORNAMENT_BARCODE = toDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40" fill="none">
  <rect x="10" y="4" width="4" height="32" fill="#5C5245"/>
  <rect x="18" y="4" width="2" height="32" fill="#5C5245"/>
  <rect x="24" y="4" width="6" height="32" fill="#5C5245"/>
  <rect x="34" y="4" width="3" height="32" fill="#5C5245"/>
  <rect x="42" y="4" width="2" height="32" fill="#5C5245"/>
  <rect x="48" y="4" width="5" height="32" fill="#5C5245"/>
  <rect x="58" y="4" width="2" height="32" fill="#5C5245"/>
  <rect x="64" y="4" width="6" height="32" fill="#5C5245"/>
  <rect x="74" y="4" width="4" height="32" fill="#5C5245"/>
  <rect x="82" y="4" width="2" height="32" fill="#5C5245"/>
  <rect x="88" y="4" width="5" height="32" fill="#5C5245"/>
  <rect x="98" y="4" width="3" height="32" fill="#5C5245"/>
  <rect x="106" y="4" width="6" height="32" fill="#5C5245"/>
  <rect x="116" y="4" width="2" height="32" fill="#5C5245"/>
  <rect x="122" y="4" width="4" height="32" fill="#5C5245"/>
  <rect x="130" y="4" width="6" height="32" fill="#5C5245"/>
  <rect x="140" y="4" width="2" height="32" fill="#5C5245"/>
  <rect x="146" y="4" width="4" height="32" fill="#5C5245"/>
</svg>`);

const FUNC = {
  camera: SVG_FUNC_CAMERA,
  album: SVG_FUNC_ALBUM,
  search: SVG_FUNC_SEARCH,
  export: SVG_FUNC_EXPORT,
  backup: SVG_FUNC_BACKUP,
  restore: SVG_FUNC_RESTORE,
  encrypt: SVG_FUNC_ENCRYPT,
  settings: SVG_FUNC_SETTINGS,
  trash: SVG_FUNC_TRASH,
  delete: SVG_FUNC_TRASH,
  pdf: SVG_FUNC_PDF,
  stats: SVG_FUNC_STATS,
  excel: SVG_FUNC_EXCEL,
  calendar: SVG_FUNC_CALENDAR,
  tag: SVG_FUNC_TAG,
  favorite: SVG_FUNC_FAVORITE,
  remind: SVG_FUNC_REMIND,
  filter: SVG_FUNC_FILTER,
  edit: SVG_FUNC_EDIT,
  share: SVG_FUNC_SHARE,
  other: SVG_FUNC_OTHER,
  book: SVG_FUNC_BOOK,
  barcode: SVG_ORNAMENT_BARCODE,
  mascot: SVG_MASCOT,
  basket: SVG_SCENE_BASKET,
  empty: SVG_EMPTY_STATE
};

const EVENT_COVERS = {
  travel: SVG_EVENT_TRAVEL,
  birthday: SVG_EVENT_BIRTHDAY,
  shopping: SVG_EVENT_SHOPPING,
  dining: SVG_EVENT_DINING,
  wedding: SVG_EVENT_WEDDING,
  reimburse: SVG_EVENT_REIMBURSE,
  other: SVG_EVENT_OTHER
};

/**
 * 根据分类 ID 获取对应 SVG 图标
 */
function categoryIconUrl(categoryId) {
  if (categoryId && CATEGORY_BY_ID[categoryId]) return CATEGORY_BY_ID[categoryId];
  return CATEGORY_BY_ID.cat_other;
}

/**
 * 校验是否为有效图标（SVG Data-URI 或合法前缀）
 */
function isAssetPath(s) {
  return typeof s === 'string' && (s.startsWith('data:image/svg+xml') || s.startsWith('/') || s.startsWith('http'));
}

/**
 * 是否为用户主动选择的占位图标。
 * 旧数据未写 placeholderCustomized，录入页默认把标签图写入 placeholder，
 * 故仅把「非默认标签图」的有效占位图视为自定义。
 */
function isCustomPlaceholder(receipt) {
  if (!receipt || !receipt.placeholder || !isAssetPath(receipt.placeholder)) return false;
  if (receipt.placeholderCustomized) return true;
  return receipt.placeholder !== FUNC.tag;
}

/**
 * 解析小票缩略图与圆圈色（列表 / 详情共用）
 * - 有照片 → 照片
 * - 用户主动选的占位图标 → 占位图 + 占位色
 * - 否则 → 分类图标 + 分类色
 */
function resolveReceiptThumb(receipt, category) {
  if (!receipt) {
    return { thumbSrc: CATEGORY_BY_ID.cat_other, thumbColor: 'gray' };
  }

  const cat = category || {};
  const categoryColor = cat.color || 'gray';
  const categoryIcon = (cat.icon && isAssetPath(cat.icon))
    ? cat.icon
    : categoryIconUrl(receipt.categoryId);

  if (receipt.image && isAssetPath(receipt.image)) {
    return { thumbSrc: receipt.image, thumbColor: categoryColor };
  }

  if (isCustomPlaceholder(receipt)) {
    return {
      thumbSrc: receipt.placeholder,
      thumbColor: receipt.color || categoryColor
    };
  }

  return { thumbSrc: categoryIcon, thumbColor: categoryColor };
}

/**
 * 小票列表缩略图 URL
 */
function receiptThumbUrl(receipt, category) {
  return resolveReceiptThumb(receipt, category).thumbSrc;
}

/**
 * 事件封面解析与容错
 */
function normalizeEventCover(cover) {
  if (!cover) return EVENT_COVERS.other;
  if (EVENT_COVERS[cover]) return EVENT_COVERS[cover];
  if (typeof cover === 'string') {
    if (cover.includes('travel') || cover.includes('旅行')) return EVENT_COVERS.travel;
    if (cover.includes('birthday') || cover.includes('生日')) return EVENT_COVERS.birthday;
    if (cover.includes('shopping') || cover.includes('购物')) return EVENT_COVERS.shopping;
    if (cover.includes('dining') || cover.includes('聚餐') || cover.includes('food')) return EVENT_COVERS.dining;
    if (cover.includes('wedding') || cover.includes('婚礼')) return EVENT_COVERS.wedding;
    if (cover.includes('reimburse') || cover.includes('报销')) return EVENT_COVERS.reimburse;
    if (cover.startsWith('data:image/svg+xml')) return cover;
  }
  return EVENT_COVERS.other;
}

/**
 * 新建分类可选图标集
 */
const NEW_CATEGORY_ICON_PICKS = [
  SVG_CAT_FOOD,
  SVG_CAT_SHOP,
  SVG_CAT_TRAFFIC,
  SVG_CAT_MED,
  SVG_CAT_FUN,
  SVG_CAT_BILL,
  SVG_CAT_REIM,
  SVG_CAT_OTHER,
  SVG_FUNC_TAG,
  SVG_FUNC_CAMERA,
  SVG_FUNC_CALENDAR,
  SVG_FUNC_FAVORITE,
  SVG_FUNC_REMIND,
  SVG_FUNC_SEARCH,
  SVG_FUNC_FILTER,
  SVG_FUNC_EDIT,
  SVG_FUNC_SHARE,
  SVG_FUNC_OTHER,
  SVG_FUNC_EXCEL
];

/**
 * 小票无图时的占位图标选项
 */
const PLACEHOLDER_PICKS = [
  { src: SVG_CAT_FOOD, color: 'orange' },
  { src: SVG_CAT_SHOP, color: 'pink' },
  { src: SVG_CAT_TRAFFIC, color: 'blue' },
  { src: SVG_CAT_MED, color: 'green' },
  { src: SVG_FUNC_CAMERA, color: 'orange' },
  { src: SVG_CAT_REIM, color: 'coffee' },
  { src: SVG_FUNC_CALENDAR, color: 'blue' },
  { src: SVG_FUNC_TAG, color: 'yellow' }
];

/**
 * 事件封面选项
 */
const COVER_PICKS = [
  { src: SVG_EVENT_TRAVEL, color: 'blue', key: 'travel' },
  { src: SVG_EVENT_BIRTHDAY, color: 'yellow', key: 'birthday' },
  { src: SVG_EVENT_SHOPPING, color: 'pink', key: 'shopping' },
  { src: SVG_EVENT_DINING, color: 'orange', key: 'dining' },
  { src: SVG_EVENT_WEDDING, color: 'purple', key: 'wedding' },
  { src: SVG_EVENT_REIMBURSE, color: 'green', key: 'reimburse' },
  { src: SVG_EVENT_OTHER, color: 'coffee', key: 'other' }
];

module.exports = {
  CATEGORY_BY_ID,
  TAB,
  FUNC,
  EVENT_COVERS,
  categoryIconUrl,
  isAssetPath,
  isCustomPlaceholder,
  resolveReceiptThumb,
  receiptThumbUrl,
  normalizeEventCover,
  NEW_CATEGORY_ICON_PICKS,
  PLACEHOLDER_PICKS,
  COVER_PICKS
};
