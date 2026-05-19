// app.js
const storage = require('./utils/storage.js');

App({
  globalData: {
    theme: 'light',
    primaryColor: '#8FAE85',
    accentColor: '#E8A87C',
    bgColor: '#FAF6EE',
    cardColor: '#FFFCF7'
  },

  onLaunch() {
    try {
      const inited = storage.get('app_inited');
      if (!inited) {
        const mockData = require('./mock/data.js');
        storage.set('receipts', mockData.receipts);
        storage.set('categories', mockData.categories);
        storage.set('events', mockData.events);
        storage.set('tags', mockData.tags);
        storage.set('trash', []);
        storage.set('settings', {
          passwordEnabled: false,
          password: '',
          autoBackup: false,
          compressImage: true,
          theme: 'light'
        });
        storage.set('app_inited', true);
      }
    } catch (e) {
      console.error('初始化数据失败', e);
    }
  },

  onError(err) {
    console.error('小程序异常', err);
  }
});
