// pages/mine/mine.js
const storage = require('../../utils/storage.js');
const tabbar = require('../../utils/tabbar.js');

Page({
  data: {
    receiptCount: 0,
    eventCount: 0,
    trashCount: 0,
    settings: {}
  },

  onShow() {
    tabbar.setSelected(this, tabbar.TabIndex.MINE);
    this.setData({
      receiptCount: storage.getReceipts().length,
      eventCount: storage.getEvents().length,
      trashCount: storage.get('trash', []).length,
      settings: storage.getSettings()
    });
  },

  goExport() {
    wx.navigateTo({ url: '/pages/export/export' });
  },

  goSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  goStats() {
    wx.navigateTo({ url: '/pages/stats/stats' });
  },

  goTrash() {
    const trash = storage.get('trash', []);
    if (trash.length === 0) {
      wx.showToast({ title: '回收站是空的', icon: 'none' });
      return;
    }
    wx.showModal({
      title: '回收站（30 天内可恢复）',
      content: '当前有 ' + trash.length + ' 条已删除的小票\n点击"确定"恢复全部',
      showCancel: true,
      confirmText: '恢复全部',
      success: (r) => {
        if (!r.confirm) return;
        const currentTrash = storage.get('trash', []);
        if (currentTrash.length === 0) {
          wx.showToast({ title: '回收站是空的', icon: 'none' });
          return;
        }
        const receipts = storage.getReceipts();
        currentTrash.forEach(t => {
          receipts.push(Object.assign({}, t));
          delete receipts[receipts.length - 1].deletedAt;
        });
        storage.setReceipts(receipts);
        storage.set('trash', []);
        this.onShow();
        wx.showToast({ title: '已全部恢复', icon: 'success' });
      }
    });
  },

  onClearAll() {
    wx.showModal({
      title: '一键清空所有数据',
      content: '将永久删除全部小票、事件、分类与设置，且不可恢复。确认操作？',
      confirmColor: '#C97B47',
      success: (r) => {
        if (!r.confirm) return;
        storage.clear();
        storage.set('app_inited', false);
        const app = getApp();
        if (app && typeof app.onLaunch === 'function') app.onLaunch();
        setTimeout(() => this.onShow(), 600);
        wx.showToast({ title: '已清空并重置', icon: 'success' });
      }
    });
  },

  onAbout() {
    wx.showModal({
      title: '关于 小票日记',
      content: '一款手账风格的纯本地小票管理工具。\n\n所有数据仅存储在你的手机本地，无社交、无广告、无数据上传。\n\nv1.0.0',
      showCancel: false
    });
  },

  onPrivacy() {
    wx.showModal({
      title: '隐私协议',
      content: '本小程序为纯个人工具，不收集、不存储、不共享你的小票信息及个人数据。所有功能均在本地设备执行，无数据外传。',
      showCancel: false
    });
  }
});
