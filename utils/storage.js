// utils/storage.js - 本地存储统一封装与数据持久化

function get(key, defaultValue = null) {
  try {
    const v = wx.getStorageSync(key);
    if (v === undefined || v === null) return defaultValue;
    if (v === '' && defaultValue !== null && typeof defaultValue !== 'string') return defaultValue;
    return v;
  } catch (e) {
    return defaultValue;
  }
}

function set(key, value) {
  try {
    wx.setStorageSync(key, value);
    return true;
  } catch (e) {
    return false;
  }
}

function remove(key) {
  try {
    wx.removeStorageSync(key);
    return true;
  } catch (e) {
    return false;
  }
}

function clear() {
  try {
    wx.clearStorageSync();
    return true;
  } catch (e) {
    return false;
  }
}

// ===== 业务封装：小票 =====

function getReceipts() {
  const v = get('receipts', []);
  return Array.isArray(v) ? v : [];
}

function setReceipts(list) {
  return set('receipts', list);
}

function addReceipt(receipt) {
  const list = getReceipts();
  list.unshift(receipt);
  setReceipts(list);
  return receipt;
}

function updateReceipt(id, patch) {
  const list = getReceipts();
  const idx = list.findIndex(r => r.id === id);
  if (idx >= 0) {
    list[idx] = Object.assign({}, list[idx], patch);
    setReceipts(list);
    return list[idx];
  }
  return null;
}

function deleteReceipt(id) {
  const list = getReceipts();
  const idx = list.findIndex(r => r.id === id);
  if (idx >= 0) {
    const trash = get('trash', []);
    trash.unshift(Object.assign({}, list[idx], { deletedAt: Date.now() }));
    set('trash', trash);
    list.splice(idx, 1);
    setReceipts(list);
    return true;
  }
  return false;
}

/**
 * 智能防重检测：同日期 + 同商家 + 同金额
 */
function findDuplicateReceipt(merchant, amount, dateTs, excludeId = null) {
  if (!merchant || !amount) return null;
  const list = getReceipts();
  const format = require('./format.js');
  const targetDay = format.formatDate(dateTs, 'YYYY-MM-DD');
  const targetAmt = Number(parseFloat(amount).toFixed(2));
  const targetM = merchant.trim().toLowerCase();

  return list.find(r => {
    if (excludeId && r.id === excludeId) return false;
    const rDay = format.formatDate(r.date, 'YYYY-MM-DD');
    const rAmt = Number(parseFloat(r.amount).toFixed(2));
    const rM = (r.merchant || '').trim().toLowerCase();
    return rDay === targetDay && Math.abs(rAmt - targetAmt) < 0.001 && rM === targetM;
  });
}

const icons = require('./icons.js');

function normalizeCategory(c) {
  if (!c) return c;
  if (c.icon && c.icon.startsWith('data:image/svg+xml')) return c;
  if (icons.CATEGORY_BY_ID[c.id]) {
    return Object.assign({}, c, { icon: icons.categoryIconUrl(c.id) });
  }
  return Object.assign({}, c, { icon: icons.CATEGORY_BY_ID.cat_other });
}

// ===== 分类 =====

function getCategories() {
  const list = get('categories', []);
  return list.map(normalizeCategory);
}

function setCategories(list) {
  return set('categories', list);
}

function updateCategory(id, patch) {
  const list = get('categories', []);
  const idx = list.findIndex(c => c.id === id);
  if (idx >= 0) {
    list[idx] = Object.assign({}, list[idx], patch);
    setCategories(list);
    return list[idx];
  }
  return null;
}

// ===== 事件 =====

function getEvents() {
  return get('events', []);
}

function setEvents(list) {
  return set('events', list);
}

function addEvent(ev) {
  const list = getEvents();
  list.unshift(ev);
  setEvents(list);
  return ev;
}

function updateEvent(id, patch) {
  const list = getEvents();
  const idx = list.findIndex(e => e.id === id);
  if (idx >= 0) {
    list[idx] = Object.assign({}, list[idx], patch);
    setEvents(list);
    return list[idx];
  }
  return null;
}

// ===== 标签 =====

function getTags() {
  return get('tags', []);
}

function setTags(list) {
  return set('tags', list);
}

function addTag(tag) {
  const list = getTags();
  list.push(tag);
  setTags(list);
  return tag;
}

// ===== 设置 =====

function getSettings() {
  const defaults = {
    passwordEnabled: false,
    password: '',
    autoBackup: false,
    compressImage: true,
    theme: 'light' // light | green | dark
  };
  const stored = get('settings', null);
  if (!stored || typeof stored !== 'object') return defaults;
  return Object.assign({}, defaults, stored);
}

function setSettings(s) {
  return set('settings', s);
}

function getThemeClass() {
  const s = getSettings();
  if (s.theme === 'green') return 'theme-green';
  if (s.theme === 'dark') return 'theme-dark';
  return '';
}

// ===== 回收站 =====

function getTrash() {
  const v = get('trash', []);
  return Array.isArray(v) ? v : [];
}

function setTrash(list) {
  return set('trash', list);
}

function restoreReceipt(id) {
  const trash = getTrash();
  const idx = trash.findIndex(r => r.id === id);
  if (idx >= 0) {
    const item = Object.assign({}, trash[idx]);
    delete item.deletedAt;
    trash.splice(idx, 1);
    setTrash(trash);
    const receipts = getReceipts();
    receipts.unshift(item);
    setReceipts(receipts);
    return true;
  }
  return false;
}

function restoreAllTrash() {
  const trash = getTrash();
  if (trash.length === 0) return 0;
  const receipts = getReceipts();
  trash.forEach(t => {
    const item = Object.assign({}, t);
    delete item.deletedAt;
    receipts.unshift(item);
  });
  setReceipts(receipts);
  setTrash([]);
  return trash.length;
}

function permanentDeleteTrash(id) {
  const trash = getTrash();
  const idx = trash.findIndex(r => r.id === id);
  if (idx >= 0) {
    trash.splice(idx, 1);
    setTrash(trash);
    return true;
  }
  return false;
}

function clearTrash() {
  return setTrash([]);
}

// ===== 真实备份与恢复 (JSON) =====

function exportBackupJSON() {
  const payload = {
    version: '1.2.0',
    exportedAt: Date.now(),
    receipts: getReceipts(),
    categories: getCategories().map(c => ({ id: c.id, name: c.name, color: c.color, isDefault: c.isDefault })),
    events: getEvents(),
    tags: getTags(),
    settings: getSettings()
  };
  return JSON.stringify(payload, null, 2);
}

function importBackupJSON(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    if (!data || !Array.isArray(data.receipts)) {
      return { success: false, message: '备份数据格式不正确' };
    }
    if (data.receipts) set('receipts', data.receipts);
    if (Array.isArray(data.events)) set('events', data.events);
    if (Array.isArray(data.tags)) set('tags', data.tags);
    if (data.settings && typeof data.settings === 'object') {
      const cur = getSettings();
      set('settings', Object.assign({}, cur, data.settings));
    }
    return { success: true, count: data.receipts.length };
  } catch (err) {
    return { success: false, message: 'JSON 解析失败，请检查文本是否完整' };
  }
}

// ===== 一键重置与初始化 =====

function resetAllData() {
  clear();
  const mockData = require('../mock/data.js');
  set('receipts', mockData.receipts);
  set('categories', mockData.categories);
  set('events', mockData.events);
  set('tags', mockData.tags);
  set('trash', []);
  set('settings', {
    passwordEnabled: false,
    password: '',
    autoBackup: false,
    compressImage: true,
    theme: 'light'
  });
  set('app_inited', true);
}

module.exports = {
  get, set, remove, clear,
  getReceipts, setReceipts, addReceipt, updateReceipt, deleteReceipt, findDuplicateReceipt,
  getCategories, setCategories, updateCategory,
  getEvents, setEvents, addEvent, updateEvent,
  getTags, setTags, addTag,
  getSettings, setSettings, getThemeClass,
  getTrash, setTrash, restoreReceipt, restoreAllTrash, permanentDeleteTrash, clearTrash,
  exportBackupJSON, importBackupJSON,
  resetAllData
};
