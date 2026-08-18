// pages/mine/mine.js
const storage = require('../../utils/storage.js');
const format = require('../../utils/format.js');
const tabbar = require('../../utils/tabbar.js');
const icons = require('../../utils/icons.js');

Page({
  data: {
    themeClass: '',
    receiptCount: 0,
    eventCount: 0,
    trashCount: 0,
    totalExpense: '0.00',
    settings: {},
    showTrashModal: false,
    trashList: [],
    icons: {
      mine: icons.TAB.mine,
      encrypt: icons.FUNC.encrypt,
      stats: icons.FUNC.stats,
      backup: icons.FUNC.backup,
      export: icons.FUNC.export,
      trash: icons.FUNC.trash,
      settings: icons.FUNC.settings,
      pdf: icons.FUNC.pdf,
      favorite: icons.FUNC.favorite,
      mascot: icons.FUNC.mascot
    }
  },

  onShow() {
    tabbar.setSelected(this, tabbar.TabIndex.MINE);
    const receipts = storage.getReceipts();
    const total = receipts.reduce((s, r) => s + format.safeAmount(r), 0);

    this.setData({
      themeClass: storage.getThemeClass(),
      receiptCount: receipts.length,
      eventCount: storage.getEvents().length,
      trashCount: storage.getTrash().length,
      totalExpense: total.toFixed(2),
      settings: storage.getSettings()
    });

    if (this.data.showTrashModal) {
      this.refreshTrashModal();
    }
  },

  goExport() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    wx.navigateTo({ url: '/pages/export/export' });
  },

  goSettings() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  goStats() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    wx.navigateTo({ url: '/pages/stats/stats' });
  },

  formatTrashItems(trash) {
    return trash.map(t => Object.assign({}, t, {
      _amountText: format.formatMoney(t.amount),
      _dateText: format.formatDate(t.date, 'YYYY-MM-DD'),
      _deletedText: t.deletedAt ? format.relativeDate(t.deletedAt) : '',
      _thumb: icons.receiptThumbUrl(t)
    }));
  },

  refreshTrashModal() {
    const trash = storage.getTrash();
    this.setData({
      trashCount: trash.length,
      trashList: this.formatTrashItems(trash),
      showTrashModal: trash.length > 0
    });
    this.setData({
      receiptCount: storage.getReceipts().length
    });
  },

  goTrash() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    const trash = storage.getTrash();
    if (trash.length === 0) {
      wx.showToast({ title: '回收站是空的 🌿', icon: 'none' });
      return;
    }
    this.setData({
      showTrashModal: true,
      trashList: this.formatTrashItems(trash)
    });
  },

  onCloseTrash() {
    this.setData({ showTrashModal: false });
  },

  onRestoreItem(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    storage.restoreReceipt(id);
    this.refreshTrashModal();
    wx.showToast({ title: '已恢复小票 🌿', icon: 'success', duration: 700 });
  },

  onDeleteForever(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'medium' }); } catch (err) {}
    wx.showModal({
      title: '彻底永久删除',
      content: '确认彻底删除该小票？删除后将无法恢复。',
      confirmColor: '#B86F65',
      success: (r) => {
        if (!r.confirm) return;
        storage.permanentDeleteTrash(id);
        this.refreshTrashModal();
        wx.showToast({ title: '已彻底删除', icon: 'none' });
      }
    });
  },

  onRestoreAllTrash() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'medium' }); } catch (err) {}
    const count = storage.restoreAllTrash();
    this.setData({ showTrashModal: false });
    this.onShow();
    wx.showToast({ title: '已全部恢复 ' + count + ' 张小票 🌿', icon: 'success' });
  },

  onClearAllTrash() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'medium' }); } catch (err) {}
    wx.showModal({
      title: '清空回收站',
      content: '将永久删除回收站内的全部小票，不可恢复。确认清空？',
      confirmColor: '#B86F65',
      success: (r) => {
        if (!r.confirm) return;
        storage.clearTrash();
        this.setData({ showTrashModal: false });
        this.onShow();
        wx.showToast({ title: '回收站已清空', icon: 'none' });
      }
    });
  },

  onAbout() {
    wx.showModal({
      title: '关于 小票日记 (TicketMemo)',
      content: '一款专注于纯个人私密小票归档、事件手账与离线数据统计的轻量工具。\n\n• 零位图 SVG 极简架构\n• 100% 本地离线隐私安全\n• 纯纯的手账质感与陪伴\n\n版本：v1.2.0 (手账重构版)',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  onPrivacy() {
    wx.showModal({
      title: '纯本地隐私合规承诺',
      content: '1. 本小程序为个人纯私密离线工具，绝无用户社交与广场；\n2. 绝不收集手机号、微信号、身份证等任何个人信息；\n3. 小票数据仅保存在手机 Storage，无后台云端服务器；\n4. 仅申请拍照、相册导入必要权限。',
      showCancel: false,
      confirmText: '我了解'
    });
  }
});
