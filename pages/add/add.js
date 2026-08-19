// pages/add/add.js
const storage = require('../../utils/storage.js');
const format = require('../../utils/format.js');
const ocr = require('../../utils/ocr.js');
const icons = require('../../utils/icons.js');

function withTagSelection(tags, selectedIds) {
  const set = new Set(selectedIds || []);
  return (tags || []).map(function (tag) {
    return Object.assign({}, tag, { _selected: set.has(tag.id) });
  });
}

function findCategory(categories, categoryId) {
  return (categories || []).find(c => c.id === categoryId) || {
    id: 'cat_other',
    color: 'gray',
    icon: icons.CATEGORY_BY_ID.cat_other
  };
}

function syncPlaceholderDisplay(page) {
  const { placeholder, placeholderColor, placeholderCustomized, categoryId, categories } = page.data;
  const cat = findCategory(categories, categoryId);
  const hasCustom = icons.isCustomPlaceholder({
    placeholder,
    placeholderCustomized,
    color: placeholderColor
  });

  page.setData({
    displayPlaceholder: hasCustom ? placeholder : (cat.icon || icons.categoryIconUrl(categoryId)),
    displayPlaceholderColor: hasCustom ? (placeholderColor || cat.color) : (cat.color || 'gray')
  });
}

Page({
  data: {
    themeClass: '',
    isEdit: false,
    editId: '',
    step: 'pick', // pick / scan / edit
    image: '',
    placeholder: '',
    placeholderColor: 'yellow',
    placeholderCustomized: false,
    displayPlaceholder: icons.CATEGORY_BY_ID.cat_food,
    displayPlaceholderColor: 'orange',
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
    showAddTagModal: false,
    newTagName: '',
    newTagColor: 'coffee',
    showImageDrawer: false,
    tagColorOptions: ['green','orange','coffee','pink','blue','yellow','purple','gray'],
    // 防重提示
    duplicateWarning: null,
    icons: {
      camera: icons.FUNC.camera,
      album: icons.FUNC.album,
      tag: icons.FUNC.tag,
      search: icons.FUNC.search,
      edit: icons.FUNC.edit,
      calendar: icons.FUNC.calendar,
      trash: icons.FUNC.trash
    }
  },

  onLoad(options) {
    const cats = storage.getCategories().map(c => Object.assign({}, c, {
      _iconIsImg: !!(c.icon && (c.icon.startsWith('data:image/svg+xml') || c.icon.startsWith('/')))
    }));
    const allTags = storage.getTags();
    const todayTs = Date.now();
    const todayText = format.formatDate(todayTs, 'YYYY-MM-DD');

    this.setData({
      themeClass: storage.getThemeClass(),
      categories: cats,
      tags: withTagSelection(allTags, []),
      categoryId: cats.length > 0 ? cats[0].id : 'cat_other',
      dateTs: todayTs,
      dateText: todayText
    }, () => syncPlaceholderDisplay(this));

    if (options.id) {
      const allReceipts = storage.getReceipts();
      const r = allReceipts.find(x => x.id === options.id);
      if (r) {
        const selectedTagIds = r.tags ? r.tags.slice() : [];
        this.setData({
          isEdit: true,
          editId: r.id,
          step: 'edit',
          image: r.image || '',
          placeholder: r.placeholder || '',
          placeholderColor: r.color || '',
          placeholderCustomized: icons.isCustomPlaceholder(r),
          merchant: r.merchant || '',
          amount: String(r.amount !== undefined ? r.amount : ''),
          dateTs: r.date || todayTs,
          dateText: format.formatDate(r.date || todayTs, 'YYYY-MM-DD'),
          items: r.items || '',
          note: r.note || '',
          categoryId: r.categoryId || (cats.length > 0 ? cats[0].id : 'cat_other'),
          selectedTagIds,
          tags: withTagSelection(allTags, selectedTagIds)
        }, () => syncPlaceholderDisplay(this));
        wx.setNavigationBarTitle({ title: '编辑小票' });
        return;
      }
    }

    if (options.mode === 'album') {
      wx.nextTick(() => this.onPickAlbum());
    } else if (options.mode === 'camera') {
      wx.nextTick(() => this.onPickCamera());
    }
  },

  onPickCamera() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
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
    });
  },

  onPickAlbum() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
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

  onChangeImage() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    this.setData({ showImageDrawer: true });
  },

  onCloseImageDrawer() {
    this.setData({ showImageDrawer: false });
  },

  onImageDrawerCamera() {
    this.setData({ showImageDrawer: false });
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'],
      camera: 'back',
      success: (r) => {
        if (r.tempFiles && r.tempFiles[0]) {
          this.setData({ image: r.tempFiles[0].tempFilePath });
        }
      }
    });
  },

  onImageDrawerAlbum() {
    this.setData({ showImageDrawer: false });
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success: (r) => {
        if (r.tempFiles && r.tempFiles[0]) {
          this.setData({ image: r.tempFiles[0].tempFilePath });
        }
      }
    });
  },

  onImageDrawerRemove() {
    this.setData({
      showImageDrawer: false,
      image: ''
    });
  },

  onSkip() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
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
      }, () => {
        this.checkDuplicate();
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
      wx.showToast({ title: 'OCR 识别完毕，请补充详情', icon: 'none' });
    });
  },

  checkDuplicate() {
    const { merchant, amount, dateTs, isEdit, editId } = this.data;
    if (!merchant || !amount) {
      this.setData({ duplicateWarning: null });
      return;
    }
    const dup = storage.findDuplicateReceipt(merchant, amount, dateTs, isEdit ? editId : null);
    if (dup) {
      this.setData({
        duplicateWarning: `提示：已有一张同日期（${format.formatDate(dup.date, 'MM-DD')}）同金额（¥${dup.amount}）的「${dup.merchant}」小票`
      });
    } else {
      this.setData({ duplicateWarning: null });
    }
  },

  onMerchantInput(e) {
    this.setData({ merchant: e.detail.value }, () => this.checkDuplicate());
  },
  onAmountInput(e) {
    this.setData({ amount: e.detail.value }, () => this.checkDuplicate());
  },
  onItemsInput(e)    { this.setData({ items:    e.detail.value }); },
  onNoteInput(e)     { this.setData({ note:     e.detail.value }); },

  onDateChange(e) {
    const v = e.detail.value;
    const parts = v.split('-').map(Number);
    const ts = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0).getTime();
    this.setData({ dateTs: ts, dateText: v }, () => this.checkDuplicate());
  },

  onPickCategory(e) {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    this.setData({ categoryId: e.currentTarget.dataset.id }, () => syncPlaceholderDisplay(this));
  },

  onPickPlaceholder(e) {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    const idx = e.currentTarget.dataset.idx;
    const opt = this.data.placeholderOptions[idx];
    this.setData({
      placeholder: opt.src,
      placeholderColor: opt.color,
      placeholderCustomized: true
    }, () => syncPlaceholderDisplay(this));
  },

  onToggleTag(e) {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    const id = e.currentTarget.dataset.id;
    const list = this.data.selectedTagIds.slice();
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1);
    else list.push(id);
    this.setData({
      selectedTagIds: list,
      tags: withTagSelection(this.data.tags, list)
    });
  },

  onOpenAddTag() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    this.setData({ showAddTagModal: true, newTagName: '', newTagColor: 'coffee' });
  },

  onCloseAddTag() {
    this.setData({ showAddTagModal: false });
  },

  onNewTagNameInput(e) {
    this.setData({ newTagName: e.detail.value });
  },

  onPickNewTagColor(e) {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    this.setData({ newTagColor: e.currentTarget.dataset.color });
  },

  onSaveNewTag() {
    const name = (this.data.newTagName || '').trim();
    if (!name) {
      wx.showToast({ title: '请输入标签名称', icon: 'none' });
      return;
    }
    const newTag = {
      id: format.uid('t'),
      name,
      color: this.data.newTagColor || 'coffee'
    };
    storage.addTag(newTag);
    const tags = storage.getTags();
    const selected = this.data.selectedTagIds.slice();
    if (selected.indexOf(newTag.id) < 0) selected.push(newTag.id);
    this.setData({
      tags: withTagSelection(tags, selected),
      selectedTagIds: selected,
      showAddTagModal: false,
      newTagName: ''
    });
    wx.showToast({ title: '标签已添加 🌿', icon: 'success' });
  },

  onSave() {
    const { isEdit, editId, merchant, amount, dateTs, items, note, categoryId, selectedTagIds, image, placeholder, placeholderColor, placeholderCustomized } = this.data;
    const customized = icons.isCustomPlaceholder({
      placeholder,
      placeholderCustomized,
      color: placeholderColor
    });
    const savePlaceholder = customized ? placeholder : '';
    const saveColor = customized ? placeholderColor : '';
    if (!merchant || !merchant.trim()) {
      wx.showToast({ title: '请填写商家名称', icon: 'none' });
      return;
    }
    const amt = Number(parseFloat(amount).toFixed(2));
    if (isNaN(amt) || amt <= 0) {
      wx.showToast({ title: '请填写有效金额', icon: 'none' });
      return;
    }

    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'medium' }); } catch (err) {}

    if (isEdit) {
      storage.updateReceipt(editId, {
        merchant: merchant.trim(),
        amount: amt,
        date: dateTs || Date.now(),
        categoryId: categoryId || 'cat_other',
        tags: selectedTagIds,
        items: items || '',
        note: note || '',
        image: image || '',
        placeholder: savePlaceholder,
        placeholderCustomized: customized,
        color: saveColor
      });
      wx.showToast({ title: '已保存修改 🌿', icon: 'success', duration: 700 });
    } else {
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
        placeholder: savePlaceholder,
        placeholderCustomized: customized,
        color: saveColor
      };
      storage.addReceipt(receipt);
      wx.showToast({ title: '小票已入账 🌿', icon: 'success', duration: 700 });
    }
    setTimeout(() => wx.navigateBack(), 750);
  },

  onCancel() {
    wx.navigateBack();
  },

  noop() {}
});
