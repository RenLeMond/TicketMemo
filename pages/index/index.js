// pages/index/index.js
const storage = require('../../utils/storage.js');
const format = require('../../utils/format.js');
const tabbar = require('../../utils/tabbar.js');

Page({
  data: {
    statusBarHeight: 0,
    navHeight: 88,
    keyword: '',
    categories: [],
    receipts: [],
    filtered: [],
    monthTotal: '0.00',
    monthCount: 0,
    today: ''
  },

  onLoad() {
    let statusBarHeight = 0;
    let navHeight = 88;
    try {
      const win = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      const menu = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
      statusBarHeight = win.statusBarHeight || 0;
      if (menu) navHeight = (menu.top - statusBarHeight) * 2 + menu.height;
    } catch (e) {
      statusBarHeight = 0;
      navHeight = 88;
    }
    this.setData({
      today: format.formatDate(Date.now(), 'YYYY年MM月DD日'),
      statusBarHeight,
      navHeight
    });
  },

  onShow() {
    tabbar.setSelected(this, tabbar.TabIndex.INDEX);
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData() {
    const allCats = storage.getCategories();
    const allReceipts = storage.getReceipts();

    // 计算本月统计
    const now = new Date();
    const ym = format.formatDate(now.getTime(), 'YYYY-MM');
    let monthTotal = 0;
    let monthCount = 0;
    allReceipts.forEach(r => {
      if (format.formatDate(r.date, 'YYYY-MM') === ym) {
        monthTotal += format.safeAmount(r);
        monthCount += 1;
      }
    });

    const categoryNameMap = {};
    allCats.forEach(c => { categoryNameMap[c.id] = c.name; });
    const decoratedReceipts = allReceipts.map(r =>
      Object.assign({}, r, { categoryName: categoryNameMap[r.categoryId] || '其他' })
    );

    const decorateCat = (c) => Object.assign({}, c, { _iconIsImg: !!(c.icon && c.icon.charAt(0) === '/') });

    // 首页按设计稿展示 4 个常用分类 + 更多
    const cats = allCats.slice(0, 4).map(decorateCat).concat([{
      id: 'more',
      name: '更多',
      icon: '/assets/icons/func/other@3x.png',
      color: 'coffee',
      _iconIsImg: true
    }]);

    this.setData({
      categories: cats,
      receipts: decoratedReceipts,
      filtered: this.applyFilter(decoratedReceipts, this.data.keyword),
      monthTotal: monthTotal.toFixed(2),
      monthCount
    });
  },

  applyFilter(list, kw) {
    if (!kw) return list.slice(0, 12);
    const k = kw.trim().toLowerCase();
    return list.filter(r => {
      return (r.merchant || '').toLowerCase().includes(k) ||
             (r.items || '').toLowerCase().includes(k) ||
             (r.note || '').toLowerCase().includes(k);
    });
  },

  onInput(e) {
    const v = e.detail.value;
    this.setData({
      keyword: v,
      filtered: this.applyFilter(this.data.receipts, v)
    });
  },

  onClearKeyword() {
    this.setData({
      keyword: '',
      filtered: this.applyFilter(this.data.receipts, '')
    });
  },

  goAdd(e) {
    const mode = e.currentTarget.dataset.mode || 'camera';
    wx.navigateTo({ url: '/pages/add/add?mode=' + mode });
  },

  goCategory(e) {
    const id = e.currentTarget.dataset.id;
    if (id === 'more') {
      wx.switchTab({ url: '/pages/category/category' });
      return;
    }
    // 先暂存高亮分类，再切换 Tab，对方页面 onShow 会读取
    storage.set('jump_category_id', id);
    wx.switchTab({ url: '/pages/category/category' });
  },

  goAllCategories() {
    wx.switchTab({ url: '/pages/category/category' });
  },

  goAllReceipts() {
    wx.switchTab({ url: '/pages/category/category' });
  },

  goStats() {
    wx.navigateTo({ url: '/pages/stats/stats' });
  }
});
