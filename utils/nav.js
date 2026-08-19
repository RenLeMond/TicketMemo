/**
 * utils/nav.js
 * 微信小程序全机型（iOS / Android / 异形屏 / 胶囊）高精度顶部导航栏计算工具
 */

let cachedNavInfo = null;

function getNavBarInfo() {
  if (cachedNavInfo) {
    return cachedNavInfo;
  }

  let statusBarHeight = 44;
  let windowWidth = 375;

  try {
    if (wx.getWindowInfo) {
      const win = wx.getWindowInfo();
      statusBarHeight = win.statusBarHeight || 44;
      windowWidth = win.windowWidth || 375;
    } else if (wx.getSystemInfoSync) {
      const sys = wx.getSystemInfoSync();
      statusBarHeight = sys.statusBarHeight || 44;
      windowWidth = sys.windowWidth || 375;
    }
  } catch (e) {
    statusBarHeight = 44;
    windowWidth = 375;
  }

  let capsuleTop = statusBarHeight + 6;
  let capsuleHeight = 32;
  let capsuleWidth = 87;
  let capsuleRight = 10;

  try {
    if (wx.getMenuButtonBoundingClientRect) {
      const rect = wx.getMenuButtonBoundingClientRect();
      if (rect && rect.top > 0 && rect.height > 0) {
        capsuleTop = rect.top;
        capsuleHeight = rect.height;
        capsuleWidth = rect.width || 87;
        capsuleRight = Math.max(10, windowWidth - (rect.right || (windowWidth - 10)));
      }
    }
  } catch (e) {}

  // 胶囊上下垂直居中间距
  const verticalGap = Math.max(4, capsuleTop - statusBarHeight);
  // 导航内容栏高度（不含状态栏）
  const navContentHeight = Math.max(40, verticalGap * 2 + capsuleHeight);
  // 导航总高度（状态栏 + 内容栏）
  const totalNavHeight = statusBarHeight + navContentHeight;
  // 右侧避让胶囊按钮的宽度
  const rightAvoidWidth = capsuleWidth + capsuleRight + 12;

  cachedNavInfo = {
    statusBarHeight,
    capsuleTop,
    capsuleHeight,
    navContentHeight,
    totalNavHeight,
    rightAvoidWidth,
    navStyle: `padding-top: ${statusBarHeight}px; height: ${totalNavHeight}px; padding-right: ${rightAvoidWidth}px;`,
    spacerStyle: `height: ${totalNavHeight + 8}px;`
  };

  return cachedNavInfo;
}

module.exports = {
  getNavBarInfo
};

