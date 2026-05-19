// pages/event-create/event-create.js
const storage = require('../../utils/storage.js');
const format = require('../../utils/format.js');
const icons = require('../../utils/icons.js');

Page({
  data: {
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
    selectedIds: []
  },

  onLoad(options) {
    const today = format.formatDate(Date.now(), 'YYYY-MM-DD');
    this.setData({
      startDate: today,
      endDate: today,
      receipts: storage.getReceipts().map(r =>
        Object.assign({}, r, { _thumb: icons.receiptThumbUrl(r) })
      )
    });

    if (options.id) {
      const ev = storage.getEvents().find(e => e.id === options.id);
      if (ev) {
        this.setData({
          isEdit: true,
          eventId: ev.id,
          name: ev.name,
          note: ev.note,
          startDate: format.formatDate(ev.startDate, 'YYYY-MM-DD'),
          endDate: format.formatDate(ev.endDate, 'YYYY-MM-DD'),
          cover: icons.normalizeEventCover(ev.cover),
          coverColor: ev.coverColor || 'green',
          selectedIds: ev.receiptIds.slice()
        });
        wx.setNavigationBarTitle({ title: '编辑事件' });
      }
    }
  },

  onNameInput(e) { this.setData({ name: e.detail.value }); },
  onNoteInput(e) { this.setData({ note: e.detail.value }); },
  onStartDateChange(e) { this.setData({ startDate: e.detail.value }); },
  onEndDateChange(e) { this.setData({ endDate: e.detail.value }); },

  onPickCover(e) {
    const idx = e.currentTarget.dataset.idx;
    const opt = this.data.coverOptions[idx];
    this.setData({ cover: opt.src, coverColor: opt.color });
  },

  onToggleReceipt(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.selectedIds.slice();
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1); else list.push(id);
    this.setData({ selectedIds: list });
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
      wx.showToast({ title: '已更新', icon: 'success', duration: 800 });
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
      wx.showToast({ title: '事件已创建', icon: 'success', duration: 800 });
    }
    setTimeout(() => wx.navigateBack(), 1000);
  },

  onCancel() {
    wx.navigateBack();
  }
});
