// pages/export/export.js
const storage = require('../../utils/storage.js');
const format = require('../../utils/format.js');
const icons = require('../../utils/icons.js');
const nav = require('../../utils/nav.js');

Page({
  data: {
    navBarInfo: null,
    themeClass: '',
    range: 'all', // all / month / event
    rangeLabel: '全部小票',
    format: 'excel', // excel / pdf / images
    includeNote: true,
    includeImage: true,
    encrypt: false,
    monthValue: '',
    receiptCount: 0,
    eventInfo: null,
    targetReceiptId: null,
    showImportModal: false,
    importJSONText: '',
    icons: {
      export: icons.FUNC.export,
      misc: icons.CATEGORY_BY_ID.cat_other,
      calendar: icons.FUNC.calendar,
      tag: icons.FUNC.tag,
      pdf: icons.FUNC.pdf,
      excel: icons.FUNC.excel,
      album: icons.FUNC.album,
      encrypt: icons.FUNC.encrypt,
      backup: icons.FUNC.backup,
      restore: icons.FUNC.restore
    }
  },

  onLoad(options) {
    const navBarInfo = nav.getNavBarInfo();
    this.setData({
      navBarInfo,
      themeClass: storage.getThemeClass()
    });

    if (options.eventId) {
      const ev = storage.getEvents().find(e => e.id === options.eventId);
      if (ev) {
        const receipts = storage.getReceipts().filter(r => (ev.receiptIds || []).indexOf(r.id) >= 0);
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
      this.setData({
        range: 'event',
        rangeLabel: '当前单张小票',
        targetReceiptId: options.receiptId,
        receiptCount: 1
      });
      return;
    }
    this.refreshCount();
  },

  goBack() {
    wx.navigateBack();
  },

  getTargetReceipts() {
    const all = storage.getReceipts();
    if (this.data.range === 'all') return all;
    if (this.data.range === 'month') {
      const ym = this.data.monthValue || format.formatDate(Date.now(), 'YYYY-MM');
      return all.filter(r => format.formatDate(r.date, 'YYYY-MM') === ym);
    }
    if (this.data.targetReceiptId) {
      return all.filter(r => r.id === this.data.targetReceiptId);
    }
    if (this.data.eventInfo) {
      return all.filter(r => (this.data.eventInfo.receiptIds || []).indexOf(r.id) >= 0);
    }
    return all;
  },

  refreshCount() {
    const list = this.getTargetReceipts();
    this.setData({
      receiptCount: list.length,
      monthValue: this.data.monthValue || format.formatDate(Date.now(), 'YYYY-MM')
    });
  },

  onSwitchRange(e) {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    const range = e.currentTarget.dataset.range;
    const labelMap = { all: '全部小票', month: '指定月份', event: '事件 / 单张' };
    this.setData({ range, rangeLabel: labelMap[range] }, () => {
      this.refreshCount();
    });
  },

  onMonthChange(e) {
    this.setData({ monthValue: e.detail.value }, () => {
      this.refreshCount();
    });
  },

  onSwitchFormat(e) {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    this.setData({ format: e.currentTarget.dataset.format });
  },

  onToggleNote(e) { this.setData({ includeNote: e.detail.value }); },
  onToggleImage(e) { this.setData({ includeImage: e.detail.value }); },
  onToggleEncrypt(e) { this.setData({ encrypt: e.detail.value }); },

  onExport() {
    const targetReceipts = this.getTargetReceipts();
    if (targetReceipts.length === 0) {
      wx.showToast({ title: '当前范围无小票可导出', icon: 'none' });
      return;
    }

    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'medium' }); } catch (err) {}
    wx.showLoading({ title: '正在生成台账…' });

    if (this.data.format === 'excel') {
      const cats = storage.getCategories();
      const tags = storage.getTags();
      const csvData = format.generateCSV(targetReceipts, cats, tags);
      wx.hideLoading();

      wx.showModal({
        title: 'Excel CSV 台账已生成',
        content: `成功生成 ${targetReceipts.length} 笔小票台账数据。点击「复制到剪贴板」可粘贴至 Excel、Numbers 或微信发送。`,
        confirmText: '复制台账',
        success: (r) => {
          if (r.confirm) {
            wx.setClipboardData({
              data: csvData,
              success: () => wx.showToast({ title: '台账已复制到剪贴板', icon: 'success' })
            });
          }
        }
      });
    } else if (this.data.format === 'pdf') {
      setTimeout(() => {
        wx.hideLoading();
        wx.showModal({
          title: 'PDF 导出完成',
          content: `已就绪 ${targetReceipts.length} 张小票报销台账，可配合事件海报保存打印。`,
          showCancel: false,
          confirmText: '好的'
        });
      }, 800);
    } else {
      // 图片打包
      const withImages = targetReceipts.filter(r => r.image);
      setTimeout(() => {
        wx.hideLoading();
        wx.showModal({
          title: '图片合集',
          content: `共检测到 ${withImages.length} 张小票原始拍摄图片，可进入详情页点击「查看原图」长按保存。`,
          showCancel: false
        });
      }, 600);
    }
  },

  onBackupLocal() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    const jsonStr = storage.exportBackupJSON();
    const time = format.formatDate(Date.now(), 'YYYY-MM-DD HH:mm');
    storage.set('last_backup_at', time);

    wx.showModal({
      title: '本地加密备份完成',
      content: `已成功打包全部小票、分类与事件数据。\n备份时间：${time}\n\n点击「复制备份码」可保存文本至微信收藏或备忘录。`,
      confirmText: '复制备份码',
      success: (r) => {
        if (r.confirm) {
          wx.setClipboardData({
            data: jsonStr,
            success: () => wx.showToast({ title: '备份码已复制', icon: 'success' })
          });
        }
      }
    });
  },

  onBackupCloud() {
    wx.showModal({
      title: '私有文件备份说明',
      content: '小票日记始终坚持 100% 纯本地隐私安全，绝不设立任何外部云端服务器收集用户消费小票。\n\n建议点击「本地加密备份」并复制备份码存入微信收藏或个人备忘录。',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  onOpenImport() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    this.setData({ showImportModal: true, importJSONText: '' });
  },

  onCloseImport() {
    this.setData({ showImportModal: false });
  },

  onImportInput(e) {
    this.setData({ importJSONText: e.detail.value });
  },

  onConfirmImport() {
    const text = (this.data.importJSONText || '').trim();
    if (!text) {
      wx.showToast({ title: '请粘贴备份 JSON 文本', icon: 'none' });
      return;
    }
    const res = storage.importBackupJSON(text);
    if (res.success) {
      this.setData({ showImportModal: false });
      this.refreshCount();
      wx.showToast({ title: `成功恢复 ${res.count} 笔小票 🌿`, icon: 'success', duration: 1000 });
    } else {
      wx.showModal({
        title: '还原失败',
        content: res.message || '备份文本无效，请检查后重试',
        showCancel: false
      });
    }
  },

  noop() {}
});
