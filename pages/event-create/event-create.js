// pages/event-create/event-create.js
const storage = require('../../utils/storage.js');
const format = require('../../utils/format.js');
const icons = require('../../utils/icons.js');
const receiptDisplay = require('../../utils/receipt-display.js');

function withReceiptSelection(receipts, selectedIds) {
  const set = new Set(selectedIds || []);
  return (receipts || []).map(function (r) {
    return Object.assign({}, r, { _selected: set.has(r.id) });
  });
}

Page({
  data: {
    themeClass: '',
    isEdit: false,
    eventId: '',
    name: '',
    note: '',
    startDate: '',
    endDate: '',
    cover: icons.COVER_PICKS[0].src,
    coverColor: icons.COVER_PICKS[0].color,
    coverOptions: icons.COVER_PICKS,
    receipts: [],
    selectedIds: [],
    emptyIcon: icons.FUNC.empty
  },

  onLoad(options) {
    const today = format.formatDate(Date.now(), 'YYYY-MM-DD');
    const cats = storage.getCategories();
    const tags = storage.getTags();
    const decorated = receiptDisplay.decorateReceipts(storage.getReceipts(), cats, tags).map(function (r) {
      return Object.assign({}, r, { _amountText: format.formatMoney(r.amount) });
    });
    const patch = {
      themeClass: storage.getThemeClass(),
      startDate: today,
      endDate: today,
      receipts: withReceiptSelection(decorated, [])
    };

    if (options.id) {
      const ev = storage.getEvents().find(e => e.id === options.id);
      if (ev) {
        const selectedIds = (ev.receiptIds || []).slice();
        Object.assign(patch, {
          isEdit: true,
          eventId: ev.id,
          name: ev.name,
          note: ev.note,
          startDate: format.formatDate(ev.startDate, 'YYYY-MM-DD'),
          endDate: format.formatDate(ev.endDate, 'YYYY-MM-DD'),
          cover: icons.normalizeEventCover(ev.cover),
          coverColor: ev.coverColor || 'green',
          selectedIds,
          receipts: withReceiptSelection(decorated, selectedIds)
        });
        wx.setNavigationBarTitle({ title: '编辑事件' });
      }
    }

    this.setData(patch);
  },

  onNameInput(e) { this.setData({ name: e.detail.value }); },
  onNoteInput(e) { this.setData({ note: e.detail.value }); },
  onStartDateChange(e) { this.setData({ startDate: e.detail.value }); },
  onEndDateChange(e) { this.setData({ endDate: e.detail.value }); },

  onPickCover(e) {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    const idx = e.currentTarget.dataset.idx;
    const opt = this.data.coverOptions[idx];
    this.setData({ cover: opt.src, coverColor: opt.color });
  },

  onToggleReceipt(e) {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    const id = e.currentTarget.dataset.id;
    const list = this.data.selectedIds.slice();
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1); else list.push(id);
    this.setData({
      selectedIds: list,
      receipts: withReceiptSelection(this.data.receipts, list)
    });
  },

  onSave() {
    const { name, note, startDate, endDate, cover, coverColor, selectedIds, isEdit, eventId } = this.data;
    if (!name || !name.trim()) {
      wx.showToast({ title: '请填写事件名称', icon: 'none' });
      return;
    }
    if (selectedIds.length === 0) {
      wx.showToast({ title: '请至少选择一张小票', icon: 'none' });
      return;
    }
    const startParts = startDate.split('-').map(Number);
    const endParts = endDate.split('-').map(Number);
    if (startParts.length !== 3 || endParts.length !== 3 || startParts.some(isNaN) || endParts.some(isNaN)) {
      wx.showToast({ title: '请选择有效日期', icon: 'none' });
      return;
    }
    const startTs = new Date(startParts[0], startParts[1] - 1, startParts[2]).getTime();
    const endTs = new Date(endParts[0], endParts[1] - 1, endParts[2], 23, 59, 59).getTime();
    if (endTs < startTs) {
      wx.showToast({ title: '结束时间不能早于开始时间', icon: 'none' });
      return;
    }

    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'medium' }); } catch (err) {}

    if (isEdit) {
      const events = storage.getEvents();
      const idx = events.findIndex(e => e.id === eventId);
      if (idx >= 0) {
        events[idx] = Object.assign({}, events[idx], {
          name: name.trim(),
          note: note || '',
          startDate: startTs,
          endDate: endTs,
          cover,
          coverColor,
          receiptIds: selectedIds
        });
        storage.setEvents(events);
      }
      wx.showToast({ title: '事件已更新 🌿', icon: 'success', duration: 800 });
    } else {
      storage.addEvent({
        id: format.uid('ev'),
        name: name.trim(),
        cover,
        coverColor,
        note: note || '',
        startDate: startTs,
        endDate: endTs,
        receiptIds: selectedIds,
        createdAt: Date.now()
      });
      wx.showToast({ title: '事件已创建 🌿', icon: 'success', duration: 800 });
    }
    setTimeout(() => wx.navigateBack(), 800);
  },

  onCancel() {
    wx.navigateBack();
  }
});
