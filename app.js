// app.js
const storage = require('./utils/storage.js');

App({
  globalData: {
    theme: 'light',
    isUnlocked: false
  },

  onLaunch() {
    try {
      const inited = storage.get('app_inited');
      if (!inited) {
        storage.resetAllData();
      }
      const settings = storage.getSettings();
      if (settings && settings.theme) {
        this.globalData.theme = settings.theme;
      }
      if (!settings || !settings.passwordEnabled) {
        this.globalData.isUnlocked = true;
      }
    } catch (e) {
      console.error('初始化数据失败', e);
    }
  },

  onError(err) {
    console.error('小程序异常', err);
  }
});
