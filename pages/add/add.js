// pages/add/add.js
const storage = require('../../utils/storage.js');
const format = require('../../utils/format.js');
const ocr = require('../../utils/ocr.js');
const icons = require('../../utils/icons.js');

Page({
  data: {
    step: 'pick',          // pick / scan / edit
    image: '',
    placeholder: icons.FUNC.tag,
    placeholderColor: 'coffee',
    merchant: '',
    amount: '',
    dateText: '',
    dateTs: 0,
    items: '',
    note: '',
    categories: [],
    categoryId: '',
    tags: [],
    selectedTagIds: [],
    placeholderOptions: icons.PLACEHOLDER_PICKS,
  },

  onLoad(options) {
    const cats = storage.getCategories().map(c => Object.assign({}, c, {
      _iconIsImg: !!(c.icon && c.icon.charAt(0) === '/')
    }));
    this.setData({
      categories: cats,
      tags: storage.getTags(),
      categoryId: cats.length > 0 ? cats[0].id : 'cat_other'
    });
    if (options.mode === 'album') {
      wx.nextTick(() => this.onPickAlbum());
    } else if (options.mode === 'camera') {
      wx.nextTick(() => this.onPickCamera());
    }
  },

  onPickCamera() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'],
      camera: 'back',
      success: (res) => {
        if (res.tempFiles && res.tempFiles[0]) {
          this.afterPick(res.tempFiles[0].tempFilePath);
        }
      }
      // 用户取消时保持在 pick 步骤
    });
  },

  onPickAlbum() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success: (res) => {
        if (res.tempFiles && res.tempFiles[0]) {
          this.afterPick(res.tempFiles[0].tempFilePath);
        }
      }
    });
  },

  onSkip() {
    this.setData({
      image: '',
      step: 'edit',
      merchant: '',
      amount: '',
      dateTs: Date.now(),
      dateText: format.formatDate(Date.now(), 'YYYY-MM-DD'),
      items: '',
      note: ''
    });
  },

  afterPick(image) {
    this.setData({ image, step: 'scan' });
    ocr.recognize().then(result => {
      this.setData({
        merchant: result.merchant,
        amount: String(result.amount.toFixed(2)),
        dateTs: result.date,
        dateText: format.formatDate(result.date, 'YYYY-MM-DD'),
        items: result.items,
        step: 'edit'
      });
    }).catch(() => {
      this.setData({
        step: 'edit',
        merchant: '',
        amount: '',
        dateTs: Date.now(),
        dateText: format.formatDate(Date.now(), 'YYYY-MM-DD'),
        items: '',
        note: ''
      });
      wx.showToast({ title: 'OCR 识别失败，请手动录入', icon: 'none' });
    });
  },

  onMerchantInput(e) { this.setData({ merchant: e.detail.value }); },
  onAmountInput(e)   { this.setData({ amount:   e.detail.value }); },
  onItemsInput(e)    { this.setData({ items:    e.detail.value }); },
  onNoteInput(e)     { this.setData({ note:     e.detail.value }); },

  onDateChange(e) {
    const v = e.detail.value;
    const parts = v.split('-').map(Number);
    const ts = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0).getTime();
    this.setData({ dateTs: ts, dateText: v });
  },

  onPickCategory(e) {
    this.setData({ categoryId: e.currentTarget.dataset.id });
  },

  onPickPlaceholder(e) {
    const idx = e.currentTarget.dataset.idx;
    const opt = this.data.placeholderOptions[idx];
    this.setData({ placeholder: opt.src, placeholderColor: opt.color });
  },

  onToggleTag(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.selectedTagIds.slice();
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1); else list.push(id);
    this.setData({ selectedTagIds: list });
  },

  onSave() {
    const { merchant, amount, dateTs, dateText, items, note, categoryId, selectedTagIds, image, placeholder, placeholderColor } = this.data;
    if (!merchant || !merchant.trim()) {
      wx.showToast({ title: '请填写商家名称', icon: 'none' });
      return;
    }
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      wx.showToast({ title: '请填写有效金额', icon: 'none' });
      return;
    }
    const receipt = {
      id: format.uid('r'),
      merchant: merchant.trim(),
      amount: amt,
      date: dateTs || Date.now(),
      categoryId: categoryId || 'cat_other',
      tags: selectedTagIds,
      items: items || '',
      note: note || '',
      image: image || '',
      placeholder,
      color: placeholderColor
    };
    storage.addReceipt(receipt);
    wx.showToast({ title: '已保存 🌿', icon: 'success', duration: 600 });
    setTimeout(() => wx.navigateBack(), 800);
  },

  onCancel() {
    wx.navigateBack();
  }
});
