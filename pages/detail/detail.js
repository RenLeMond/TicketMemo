// pages/detail/detail.js
const storage = require('../../utils/storage.js');
const format = require('../../utils/format.js');
const icons = require('../../utils/icons.js');

Page({
  data: {
    receipt: null,
    category: null,
    tags: [],
    dateText: '',
    amountText: '',
    thumbSrc: ''
  },

  onLoad(options) {
    const id = options.id;
    if (!id) {
      wx.navigateBack();
      return;
    }
    this.id = id;
  },

  onShow() {
    if (this.id) this.loadDetail();
  },

  loadDetail() {
    const list = storage.getReceipts();
    const r = list.find(x => x.id === this.id);
    if (!r) {
      wx.showToast({ title: '小票不存在', icon: 'none', duration: 800 });
      setTimeout(() => wx.navigateBack(), 1000);
      return;
    }
    const cats = storage.getCategories();
    const tagsAll = storage.getTags();
    const cat0 = cats.find(c => c.id === r.categoryId) || { name: '其他', icon: icons.CATEGORY_BY_ID.cat_other, color: 'gray' };
    const cat = icons.isAssetPath(cat0.icon)
      ? cat0
      : Object.assign({}, cat0, { icon: icons.categoryIconUrl(r.categoryId) });
    const tags = (r.tags || []).map(tid => tagsAll.find(t => t.id === tid)).filter(Boolean);
    this.setData({
      receipt: r,
      category: cat,
      tags,
      dateText: format.formatDate(r.date, 'YYYY-MM-DD HH:mm'),
      amountText: format.formatMoney(r.amount),
      thumbSrc: icons.receiptThumbUrl(r)
    });
  },

  onCopy() {
    const r = this.data.receipt;
    if (!r) return;
    const text = r.merchant + '\n' + format.formatMoney(r.amount) + '\n' + format.formatDate(r.date, 'YYYY-MM-DD HH:mm') + '\n' + (r.items || '') + '\n' + (r.note || '');
    wx.setClipboardData({ data: text, success: () => wx.showToast({ title: '已复制', icon: 'success' }) });
  },

  onPreviewImage() {
    const img = this.data.receipt && this.data.receipt.image;
    if (!img) return;
    wx.previewImage({ urls: [img], current: img });
  },

  onEdit() {
    wx.showToast({ title: '编辑功能即将上线', icon: 'none' });
  },

  onExport() {
    wx.navigateTo({ url: '/pages/export/export?receiptId=' + this.id });
  },

  onDelete() {
    wx.showModal({
      title: '删除小票',
      content: '将移入回收站，30 天内可恢复',
      success: (r) => {
        if (!r.confirm) return;
        storage.deleteReceipt(this.id);
        wx.showToast({ title: '已移入回收站', icon: 'success', duration: 800 });
        setTimeout(() => wx.navigateBack(), 1000);
      }
    });
  }
});
