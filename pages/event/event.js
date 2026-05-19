// pages/event/event.js
const storage = require('../../utils/storage.js');
const format = require('../../utils/format.js');
const tabbar = require('../../utils/tabbar.js');
const icons = require('../../utils/icons.js');

Page({
  data: {
    events: [],
    selectedId: null,
    selectedReceipts: [],
    selectedTotal: '0.00'
  },

  onShow() {
    tabbar.setSelected(this, tabbar.TabIndex.EVENT);
    this.loadEvents();
  },

  loadEvents() {
    const events = storage.getEvents();
    const allReceipts = storage.getReceipts();
    const receiptMap = {};
    allReceipts.forEach(r => { receiptMap[r.id] = r; });
    const enriched = events.map(ev => {
      const list = (ev.receiptIds || []).map(id => receiptMap[id]).filter(Boolean);
      const total = list.reduce((s, r) => s + format.safeAmount(r), 0);
      return Object.assign({}, ev, {
        receipts: list,
        total: total.toFixed(2),
        count: list.length,
        startText: format.formatDate(ev.startDate, 'MM.DD'),
        endText: format.formatDate(ev.endDate, 'MM.DD'),
        coverSrc: icons.normalizeEventCover(ev.cover)
      });
    });
    let selectedId = this.data.selectedId;
    if (!selectedId && enriched.length) selectedId = enriched[0].id;

    const cur = enriched.find(e => e.id === selectedId);
    this.setData({
      events: enriched,
      selectedId,
      selectedReceipts: cur ? cur.receipts : [],
      selectedTotal: cur ? cur.total : '0.00'
    });
  },

  onSelectEvent(e) {
    const id = e.currentTarget.dataset.id;
    const ev = this.data.events.find(x => x.id === id);
    this.setData({
      selectedId: id,
      selectedReceipts: ev ? ev.receipts : [],
      selectedTotal: ev ? ev.total : '0.00'
    });
  },

  goCreate() {
    wx.navigateTo({ url: '/pages/event-create/event-create' });
  },

  onPlayAnimation() {
    wx.showToast({ title: '动画功能即将上线', icon: 'none' });
  },

  onLongPressEvent(e) {
    const id = e.currentTarget.dataset.id;
    const ev = this.data.events.find(x => x.id === id);
    if (!ev) return;
    wx.showActionSheet({
      itemList: ['编辑事件', '导出事件 PDF', '删除事件'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.navigateTo({ url: '/pages/event-create/event-create?id=' + id });
        } else if (res.tapIndex === 1) {
          wx.navigateTo({ url: '/pages/export/export?eventId=' + id });
        } else if (res.tapIndex === 2) {
          wx.showModal({
            title: '删除事件',
            content: '事件下小票不会被删除，仅取消事件归类',
            success: (r) => {
              if (!r.confirm) return;
              const events = storage.getEvents().filter(x => x.id !== id);
              storage.setEvents(events);
              this.setData({ selectedId: null });
              this.loadEvents();
            }
          });
        }
      }
    });
  }
});
