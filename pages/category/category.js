// pages/category/category.js
const storage = require('../../utils/storage.js');
const format = require('../../utils/format.js');
const tabbar = require('../../utils/tabbar.js');
const icons = require('../../utils/icons.js');

function decorateCategories(list) {
  return list.map(c =>
    Object.assign({}, c, { _iconIsImg: !!(c.icon && c.icon.charAt(0) === '/') })
  );
}

Page({
  data: {
    categories: [],
    categorySummaries: [],
    currentId: 'all',
    currentName: '全部',
    list: [],
    showAddModal: false,
    newCatName: '',
    newCatIcon: icons.NEW_CATEGORY_ICON_PICKS[0],
    newCatColor: 'coffee',
    iconOptions: icons.NEW_CATEGORY_ICON_PICKS,
    colorOptions: ['green','orange','coffee','pink','blue','yellow','purple','gray']
  },

  onShow() {
    tabbar.setSelected(this, tabbar.TabIndex.CATEGORY);
    const cats = storage.getCategories();
    const jumpId = storage.get('jump_category_id');
    if (jumpId) {
      storage.remove('jump_category_id');
      this.setData({
        categories: decorateCategories(cats),
        currentId: jumpId
      });
    } else {
      this.setData({ categories: decorateCategories(cats) });
    }
    this.loadList();
  },

  loadList() {
    const all = storage.getReceipts();
    const catGroups = {};
    all.forEach(r => {
      if (!catGroups[r.categoryId]) catGroups[r.categoryId] = [];
      catGroups[r.categoryId].push(r);
    });
    const categorySummaries = this.data.categories.map(c => {
      const receipts = catGroups[c.id] || [];
      const total = receipts.reduce((sum, r) => sum + format.safeAmount(r), 0);
      return Object.assign({}, c, {
        count: receipts.length,
        total: total.toFixed(2)
      });
    });
    const id = this.data.currentId;
    let list = all;
    let name = '全部';
    if (id !== 'all') {
      list = all.filter(r => r.categoryId === id);
      const cat = this.data.categories.find(c => c.id === id);
      name = cat ? cat.name : '';
    }
    // 按月分组展示
    const groups = format.groupByMonth(list);
    this.setData({ list: groups, currentName: name, categorySummaries });
  },

  onSwitchCat(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ currentId: id });
    this.loadList();
  },

  onOpenCategory(e) {
    this.onSwitchCat(e);
  },

  onAddCategory() {
    this.setData({ showAddModal: true, newCatName: '', newCatIcon: icons.NEW_CATEGORY_ICON_PICKS[0], newCatColor: 'coffee' });
  },

  onCloseModal() {
    this.setData({ showAddModal: false });
  },

  onCatNameInput(e) {
    this.setData({ newCatName: e.detail.value });
  },

  onPickIcon(e) {
    const idx = Number(e.currentTarget.dataset.idx);
    const item = this.data.iconOptions[idx];
    if (item) this.setData({ newCatIcon: item });
  },

  onPickColor(e) {
    this.setData({ newCatColor: e.currentTarget.dataset.color });
  },

  onSaveCategory() {
    const { newCatName, newCatIcon, newCatColor } = this.data;
    const name = (newCatName || '').trim();
    if (!name) {
      wx.showToast({ title: '请输入名称', icon: 'none' });
      return;
    }
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
      currentId: cat.id
    });
    this.loadList();
    wx.showToast({ title: '已添加', icon: 'success' });
  },

  onLongPressCat(e) {
    const id = e.currentTarget.dataset.id;
    const cat = this.data.categories.find(c => c.id === id);
    if (!cat) return;
    if (cat.isDefault) {
      wx.showToast({ title: '默认分类不可删除', icon: 'none' });
      return;
    }
    wx.showModal({
      title: '删除分类',
      content: '确定删除「' + cat.name + '」吗？该分类下小票将归入「其他」',
      success: (res) => {
        if (!res.confirm) return;
        const cats = storage.getCategories().filter(c => c.id !== id);
        const receipts = storage.getReceipts().map(r =>
          r.categoryId === id ? Object.assign({}, r, { categoryId: 'cat_other' }) : r
        );
        storage.setCategories(cats);
        storage.setReceipts(receipts);
        this.setData({
          categories: decorateCategories(cats),
          currentId: this.data.currentId === id ? 'all' : this.data.currentId
        });
        this.loadList();
      }
    });
  }
});
