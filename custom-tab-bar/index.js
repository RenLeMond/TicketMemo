const icons = require('../utils/icons.js');

function tabList() {
  return [
    { pagePath: '/pages/index/index', text: '首页', iconSrc: icons.TAB.home },
    { pagePath: '/pages/category/category', text: '分类', iconSrc: icons.TAB.category },
    { pagePath: '/pages/add/add', text: '', iconSrc: icons.TAB.add, isAction: true },
    { pagePath: '/pages/event/event', text: '事件', iconSrc: icons.TAB.event },
    { pagePath: '/pages/mine/mine', text: '我的', iconSrc: icons.TAB.mine }
  ];
}

Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  data: {
    selected: 0,
    safeBottom: 0,
    list: []
  },

  lifetimes: {
    attached() {
      let safeBottom = 0;
      try {
        if (wx.getWindowInfo) {
          const win = wx.getWindowInfo();
          safeBottom = win.screenHeight - (win.safeArea && win.safeArea.bottom
            ? win.safeArea.bottom
            : win.screenHeight);
        } else {
          const sys = wx.getSystemInfoSync();
          safeBottom =
            sys.screenHeight - (sys.safeArea ? sys.safeArea.bottom : sys.screenHeight);
        }
      } catch (e) {
        safeBottom = 0;
      }
      this.setData({
        safeBottom: Math.max(0, safeBottom),
        list: tabList()
      });
    }
  },

  methods: {
    switchTab(e) {
      const path = e.currentTarget.dataset.path;
      const index = Number(e.currentTarget.dataset.index);
      if (!path || Number.isNaN(index)) return;
      try {
        if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
      } catch (err) {}
      if (path === '/pages/add/add') {
        wx.navigateTo({ url: '/pages/add/add?mode=camera' });
        return;
      }
      wx.switchTab({ url: path });
      this.setData({ selected: index });
    }
  }
});
