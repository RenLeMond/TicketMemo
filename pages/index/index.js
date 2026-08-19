// pages/index/index.js
const storage = require('../../utils/storage.js');
const format = require('../../utils/format.js');
const tabbar = require('../../utils/tabbar.js');
const icons = require('../../utils/icons.js');
const receiptDisplay = require('../../utils/receipt-display.js');

Page({
  data: {
    themeClass: '',
    keyword: '',
    greeting: '',
    categories: [],
    receipts: [],
    filtered: [],
    monthTotal: '0.00',
    monthCount: 0,
    today: '',
    icons: {
      mascot: icons.FUNC.mascot,
      search: icons.FUNC.search,
      basket: icons.FUNC.basket,
      camera: icons.FUNC.camera,
      album: icons.FUNC.album,
      empty: icons.FUNC.empty
    }
  },

  onLoad() {
    this.setData({
      today: format.formatDate(Date.now(), 'YYYY年MM月DD日')
    });
  },

  onShow() {
    tabbar.setSelected(this, tabbar.TabIndex.INDEX);
    this.setData({
      themeClass: storage.getThemeClass(),
      greeting: format.getGreetingText()
    });
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

    const allTags = storage.getTags();
    const decoratedReceipts = receiptDisplay.decorateReceipts(allReceipts, allCats, allTags);

    const decorateCat = (c) => Object.assign({}, c, {
      _iconIsImg: !!(c.icon && (c.icon.startsWith('data:image/svg+xml') || c.icon.startsWith('/')))
    });

    // 首页展示 7 个高频分类 + 1 个「更多」，刚好构成完美的 2行×4列 宫格
    const cats = allCats.slice(0, 7).map(decorateCat).concat([{
      id: 'more',
      name: '更多',
      icon: icons.FUNC.other,
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
    let res = list;
    if (kw && kw.trim()) {
      const k = kw.trim().toLowerCase();
      res = res.filter(r => {
        return (r.merchant || '').toLowerCase().includes(k) ||
               (r.items || '').toLowerCase().includes(k) ||
               (r.note || '').toLowerCase().includes(k) ||
               (r.categoryName || '').toLowerCase().includes(k);
      });
    }
    return res.slice(0, 15);
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
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    const mode = e.currentTarget.dataset.mode || 'camera';
    wx.navigateTo({ url: '/pages/add/add?mode=' + mode });
  },

  goCategory(e) {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    const id = e.currentTarget.dataset.id;
    if (id === 'more') {
      wx.switchTab({ url: '/pages/category/category' });
      return;
    }
    storage.set('jump_category_id', id);
    wx.switchTab({ url: '/pages/category/category' });
  },

  goCategoryTab() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    wx.switchTab({ url: '/pages/category/category' });
  }
});
