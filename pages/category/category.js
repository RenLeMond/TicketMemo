// pages/category/category.js
const storage = require('../../utils/storage.js');
const format = require('../../utils/format.js');
const tabbar = require('../../utils/tabbar.js');
const icons = require('../../utils/icons.js');

function decorateCategories(list) {
  return list.map(c =>
    Object.assign({}, c, {
      _iconIsImg: !!(c.icon && (c.icon.startsWith('data:image/svg+xml') || c.icon.startsWith('/')))
    })
  );
}

Page({
  data: {
    themeClass: '',
    categories: [],
    categorySummaries: [],
    currentId: 'all',
    currentName: '全部',
    sortMode: 'date', // date / amount
    currentSummary: {
      id: 'all',
      name: '全部小票',
      count: 0,
      total: '0.00',
      pct: '100.0',
      color: 'coffee',
      icon: icons.CATEGORY_BY_ID.cat_other,
      _iconIsImg: true
    },
    list: [],
    showAddModal: false,
    editingCatId: null,
    newCatName: '',
    newCatIcon: icons.NEW_CATEGORY_ICON_PICKS[0],
    newCatColor: 'coffee',
    iconOptions: icons.NEW_CATEGORY_ICON_PICKS,
    allIcon: icons.CATEGORY_BY_ID.cat_other,
    emptyIcon: icons.FUNC.empty,
    showCatActionSheet: false,
    showDeleteConfirm: false,
    actionCat: null,
    funcIcons: {
      edit: icons.FUNC.edit,
      trash: icons.FUNC.trash
    }
  },

  onShow() {
    tabbar.setSelected(this, tabbar.TabIndex.CATEGORY);
    const cats = storage.getCategories();
    const jumpId = storage.get('jump_category_id');
    const themeClass = storage.getThemeClass();

    if (jumpId) {
      storage.remove('jump_category_id');
      this.setData({
        themeClass,
        categories: decorateCategories(cats),
        currentId: jumpId
      });
    } else {
      this.setData({
        themeClass,
        categories: decorateCategories(cats)
      });
    }
    this.loadList();
  },

  onPullDownRefresh() {
    this.loadList();
    wx.stopPullDownRefresh();
  },

  onToggleSort() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    const nextMode = this.data.sortMode === 'date' ? 'amount' : 'date';
    this.setData({ sortMode: nextMode }, () => {
      this.loadList();
    });
  },

  loadList() {
    const all = storage.getReceipts();
    const grandTotal = all.reduce((sum, r) => sum + format.safeAmount(r), 0);

    const catGroups = {};
    all.forEach(r => {
      if (!catGroups[r.categoryId]) catGroups[r.categoryId] = [];
      catGroups[r.categoryId].push(r);
    });

    const categorySummaries = this.data.categories.map(c => {
      const receipts = catGroups[c.id] || [];
      const total = receipts.reduce((sum, r) => sum + format.safeAmount(r), 0);
      const pct = grandTotal > 0 ? ((total / grandTotal) * 100).toFixed(1) : '0.0';
      return Object.assign({}, c, {
        count: receipts.length,
        total: total.toFixed(2),
        pct
      });
    });

    const id = this.data.currentId;
    let list = all.slice();
    let name = '全部小票';
    let currentCat = null;

    if (id !== 'all') {
      list = all.filter(r => r.categoryId === id);
      currentCat = this.data.categories.find(c => c.id === id);
      name = currentCat ? currentCat.name : '';
    }

    if (this.data.sortMode === 'amount') {
      list.sort((a, b) => format.safeAmount(b) - format.safeAmount(a));
    } else {
      list.sort((a, b) => b.date - a.date);
    }

    const currentTotal = list.reduce((sum, r) => sum + format.safeAmount(r), 0);
    const currentPct = grandTotal > 0 ? ((currentTotal / grandTotal) * 100).toFixed(1) : '100.0';

    const currentSummary = {
      id,
      name,
      count: list.length,
      total: currentTotal.toFixed(2),
      pct: currentPct,
      color: currentCat ? currentCat.color : 'coffee',
      icon: currentCat ? currentCat.icon : this.data.allIcon,
      _iconIsImg: currentCat ? currentCat._iconIsImg : true
    };

    // 按月分组展示
    const groups = format.groupByMonth(list);
    this.setData({ list: groups, currentName: name, categorySummaries, currentSummary });
  },

  onSwitchCat(e) {
    const id = e.currentTarget.dataset.id;
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    this.setData({ currentId: id });
    this.loadList();
  },

  onAddCategory() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    this.setData({
      showAddModal: true,
      editingCatId: null,
      newCatName: '',
      newCatIcon: icons.NEW_CATEGORY_ICON_PICKS[0],
      newCatColor: 'coffee'
    });
  },

  onCloseModal() {
    this.setData({ showAddModal: false, editingCatId: null });
  },

  onCatNameInput(e) {
    this.setData({ newCatName: e.detail.value });
  },

  onPickIcon(e) {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    const idx = Number(e.currentTarget.dataset.idx);
    const item = this.data.iconOptions[idx];
    if (item) this.setData({ newCatIcon: item });
  },

  onPickColor(e) {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    this.setData({ newCatColor: e.currentTarget.dataset.color });
  },

  onSaveCategory() {
    const { editingCatId, newCatName, newCatIcon, newCatColor } = this.data;
    const name = (newCatName || '').trim();
    if (!name) {
      wx.showToast({ title: '请输入名称', icon: 'none' });
      return;
    }

    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'medium' }); } catch (err) {}

    if (editingCatId) {
      storage.updateCategory(editingCatId, {
        name,
        icon: newCatIcon,
        color: newCatColor
      });
      const updated = storage.getCategories();
      this.setData({
        categories: decorateCategories(updated),
        showAddModal: false,
        editingCatId: null
      });
      this.loadList();
      wx.showToast({ title: '分类已更新 🌿', icon: 'success' });
    } else {
      const fresh = storage.getCategories();
      const cat = {
        id: format.uid('cat'),
        name,
        icon: newCatIcon,
        color: newCatColor,
        isDefault: false
      };
      const merged = fresh.concat([cat]);
      storage.setCategories(merged);
      this.setData({
        categories: decorateCategories(merged),
        showAddModal: false,
        editingCatId: null,
        currentId: cat.id
      });
      this.loadList();
      wx.showToast({ title: '已新建分类 🌿', icon: 'success' });
    }
  },

  onLongPressCat(e) {
    const id = e.currentTarget.dataset.id;
    const cat = this.data.categories.find(c => c.id === id);
    if (!cat) return;
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'medium' }); } catch (err) {}

    if (cat.isDefault) {
      wx.showToast({ title: '预设分类不可修改或删除', icon: 'none' });
      return;
    }

    this.setData({
      showCatActionSheet: true,
      actionCat: cat
    });
  },

  onCloseCatActionSheet() {
    this.setData({ showCatActionSheet: false });
  },

  onActionEditCat() {
    const cat = this.data.actionCat;
    if (!cat) return;
    this.setData({
      showCatActionSheet: false,
      showAddModal: true,
      editingCatId: cat.id,
      newCatName: cat.name,
      newCatIcon: cat.icon,
      newCatColor: cat.color || 'coffee'
    });
  },

  onActionDeleteCat() {
    this.setData({
      showCatActionSheet: false,
      showDeleteConfirm: true
    });
  },

  onCancelDeleteConfirm() {
    this.setData({ showDeleteConfirm: false });
  },

  onConfirmDeleteCat() {
    const cat = this.data.actionCat;
    if (!cat) return;
    const id = cat.id;
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'medium' }); } catch (err) {}

    const cats = storage.getCategories().filter(c => c.id !== id);
    const receipts = storage.getReceipts().map(rec =>
      rec.categoryId === id ? Object.assign({}, rec, { categoryId: 'cat_other' }) : rec
    );
    storage.setCategories(cats);
    storage.setReceipts(receipts);
    this.setData({
      categories: decorateCategories(cats),
      currentId: this.data.currentId === id ? 'all' : this.data.currentId,
      showDeleteConfirm: false,
      actionCat: null
    });
    this.loadList();
    wx.showToast({ title: '已删除分类', icon: 'none' });
  }
});
