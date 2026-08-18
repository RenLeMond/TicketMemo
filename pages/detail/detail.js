// pages/detail/detail.js
const storage = require('../../utils/storage.js');
const format = require('../../utils/format.js');
const icons = require('../../utils/icons.js');

Page({
  data: {
    themeClass: '',
    receipt: null,
    category: null,
    tags: [],
    dateText: '',
    amountText: '',
    thumbSrc: '',
    barcodeSrc: icons.FUNC.barcode,
    icons: {
      share: icons.FUNC.share,
      edit: icons.FUNC.edit,
      export: icons.FUNC.export,
      delete: icons.FUNC.delete
    }
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
    this.setData({
      themeClass: storage.getThemeClass()
    });
    if (this.id) this.loadDetail();
  },

  goBack() {
    wx.navigateBack();
  },

  loadDetail() {
    const list = storage.getReceipts();
    const r = list.find(x => x.id === this.id);
    if (!r) {
      wx.showToast({ title: '小票不存在或已删除', icon: 'none', duration: 800 });
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
      dateText: format.formatDate(r.date, 'YYYY年MM月DD日 HH:mm'),
      amountText: format.formatMoney(r.amount),
      thumbSrc: icons.receiptThumbUrl(r)
    });
  },

  onCopy() {
    const r = this.data.receipt;
    if (!r) return;
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (e) {}
    const text = `【小票记录】\n商家：${r.merchant}\n金额：${format.formatMoney(r.amount)}\n日期：${format.formatDate(r.date, 'YYYY-MM-DD HH:mm')}\n商品：${r.items || '无'}\n备注：${r.note || '无'}`;
    wx.setClipboardData({
      data: text,
      success: () => wx.showToast({ title: '已复制小票详情 🌿', icon: 'success' })
    });
  },

  onPreviewImage() {
    const img = this.data.receipt && this.data.receipt.image;
    if (!img) return;
    wx.previewImage({ urls: [img], current: img });
  },

  onEdit() {
    if (!this.id) return;
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (e) {}
    wx.navigateTo({ url: '/pages/add/add?id=' + this.id });
  },

  onExport() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (e) {}
    wx.navigateTo({ url: '/pages/export/export?receiptId=' + this.id });
  },

  onDelete() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (e) {}
    wx.showModal({
      title: '删除小票',
      content: '小票将移入回收站，30 天内可在「我的 - 回收站」随时恢复。',
      confirmColor: '#B86F65',
      success: (r) => {
        if (!r.confirm) return;
        storage.deleteReceipt(this.id);
        wx.showToast({ title: '已移入回收站', icon: 'success', duration: 800 });
        setTimeout(() => wx.navigateBack(), 850);
      }
    });
  }
});
