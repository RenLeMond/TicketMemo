// utils/storage.js - 本地存储统一封装

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

const icons = require('./icons.js');

function normalizeCategory(c) {
  if (!c) return c;
  if (icons.isAssetPath(c.icon)) return c;
  if (icons.CATEGORY_BY_ID[c.id]) {
    return Object.assign({}, c, { icon: icons.categoryIconUrl(c.id) });
  }
  return c;
}

// ===== 分类 =====

function getCategories() {
  const list = get('categories', []);
  return list.map(normalizeCategory);
}

function setCategories(list) {
  return set('categories', list);
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

// ===== 标签 =====

function getTags() {
  return get('tags', []);
}

// ===== 设置 =====

function getSettings() {
  const defaults = {
    passwordEnabled: false,
    password: '',
    autoBackup: false,
    compressImage: true,
    theme: 'light'
  };
  const stored = get('settings', null);
  if (!stored || typeof stored !== 'object') return defaults;
  return Object.assign({}, defaults, stored);
}

function setSettings(s) {
  return set('settings', s);
}

module.exports = {
  get, set, remove, clear,
  getReceipts, setReceipts, addReceipt, updateReceipt, deleteReceipt,
  getCategories, setCategories,
  getEvents, setEvents, addEvent,
  getTags,
  getSettings, setSettings
};
