// pages/export/export.js
const storage = require('../../utils/storage.js');
const format = require('../../utils/format.js');
const icons = require('../../utils/icons.js');

Page({
  data: {
    range: 'all',          // all / month / event
    rangeLabel: '全部小票',
    format: 'pdf',         // pdf / excel / images
    includeNote: true,
    includeImage: true,
    encrypt: false,
    monthValue: '',
    receiptCount: 0,
    eventInfo: null
  },

  onLoad(options) {
    if (options.eventId) {
      const ev = storage.getEvents().find(e => e.id === options.eventId);
      if (ev) {
        const receipts = storage.getReceipts().filter(r => ev.receiptIds.indexOf(r.id) >= 0);
        this.setData({
          range: 'event',
          rangeLabel: '事件「' + ev.name + '」',
          eventInfo: Object.assign({}, ev, {
            coverSrc: icons.normalizeEventCover(ev.cover)
          }),
          receiptCount: receipts.length
        });
        return;
      }
    }
    if (options.receiptId) {
      this.setData({ range: 'event', rangeLabel: '当前小票', receiptCount: 1 });
      return;
    }
    this.refreshCount();
  },

  refreshCount() {
    const all = storage.getReceipts();
    if (this.data.range === 'all') {
      this.setData({ receiptCount: all.length });
    } else if (this.data.range === 'month') {
      const ym = this.data.monthValue || format.formatDate(Date.now(), 'YYYY-MM');
      const list = all.filter(r => format.formatDate(r.date, 'YYYY-MM') === ym);
      this.setData({ receiptCount: list.length, monthValue: ym });
    } else {
      this.setData({ receiptCount: 0 });
    }
  },

  onSwitchRange(e) {
    const range = e.currentTarget.dataset.range;
    const labelMap = { all: '全部小票', month: '指定月份', event: '事件 / 单张' };
    this.setData({ range, rangeLabel: labelMap[range] });
    this.refreshCount();
  },

  onMonthChange(e) {
    this.setData({ monthValue: e.detail.value });
    this.refreshCount();
  },

  onSwitchFormat(e) {
    this.setData({ format: e.currentTarget.dataset.format });
  },

  onToggleNote(e) { this.setData({ includeNote: e.detail.value }); },
  onToggleImage(e) { this.setData({ includeImage: e.detail.value }); },
  onToggleEncrypt(e) { this.setData({ encrypt: e.detail.value }); },

  onExport() {
    const labelMap = { pdf: 'PDF 文档', excel: 'Excel 台账', images: '图片合集' };
    wx.showLoading({ title: '本地生成中…' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '导出完成',
        content: '已生成 ' + (labelMap[this.data.format] || '文件') + '\n\n（demo 模式：已模拟导出，真实环境需对接文件保存接口）',
        showCancel: false,
        confirmText: '好的'
      });
    }, 1200);
  },

  onBackupLocal() {
    wx.showLoading({ title: '本地加密中…' });
    setTimeout(() => {
      wx.hideLoading();
      const time = format.formatDate(Date.now(), 'YYYY-MM-DD HH:mm');
      storage.set('last_backup_at', time);
      wx.showToast({ title: '已备份到本地', icon: 'success' });
    }, 1000);
  },

  onBackupCloud() {
    wx.showModal({
      title: '保存到个人云盘',
      content: '将通过微信文件助手 / 个人网盘保存\n\n（demo 提示：真实环境可对接 wx.saveFileToDisk）',
      showCancel: false
    });
  },

  onImport() {
    wx.showModal({
      title: '从本地导入',
      content: '选择此前备份的文件即可恢复\n\n（demo 提示：真实环境可对接 wx.chooseMessageFile）',
      showCancel: false
    });
  }
});
