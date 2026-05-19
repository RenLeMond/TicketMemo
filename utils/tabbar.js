/**
 * 自定义 tabBar 选中态同步（需 app.json tabBar.custom = true）
 * @param {WechatMiniprogram.Page.TrivialInstance} page 当前 Page this
 * @param {number} index 与 custom-tab-bar/index.js tabList() 顺序一致，0 起
 */
function setSelected(page, index) {
  if (typeof page.getTabBar === 'function') {
    try {
      const bar = page.getTabBar();
      if (bar) {
        bar.setData({ selected: index });
      }
    } catch (e) {
      // tabBar component may not be attached yet on cold start
    }
  }
}

/** 与 custom-tab-bar tabList() 顺序一致：index(0) category(1) add(2) event(3) mine(4) */
const TabIndex = {
  INDEX: 0,
  CATEGORY: 1,
  EVENT: 3,
  MINE: 4
};

module.exports = {
  setSelected,
  TabIndex
};
