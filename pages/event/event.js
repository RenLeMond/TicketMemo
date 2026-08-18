// pages/event/event.js
const storage = require('../../utils/storage.js');
const format = require('../../utils/format.js');
const tabbar = require('../../utils/tabbar.js');
const icons = require('../../utils/icons.js');

Page({
  data: {
    themeClass: '',
    events: [],
    eventList: [],
    selectedId: null,
    // 画册翻页弹窗
    showFlipModal: false,
    activeFlipEvent: null,
    flipReceipts: [],
    currentFlipIndex: 0,
    // 海报弹窗
    showPosterModal: false,
    posterImg: '',
    // 手账抽屉与确认弹窗
    showActionDrawer: false,
    showDeleteConfirm: false,
    actionEvent: null,
    icons: {
      event: icons.TAB.event,
      add: icons.FUNC.add,
      empty: icons.FUNC.empty,
      book: icons.FUNC.book,
      share: icons.FUNC.share,
      export: icons.FUNC.export,
      edit: icons.FUNC.edit,
      delete: icons.FUNC.delete
    }
  },

  onShow() {
    tabbar.setSelected(this, tabbar.TabIndex.EVENT);
    this.setData({
      themeClass: storage.getThemeClass()
    });
    this.loadEvents();
  },

  loadEvents() {
    const rawEvents = storage.getEvents();
    const allReceipts = storage.getReceipts();

    const eventList = rawEvents.map(ev => {
      const recIds = ev.receiptIds || [];
      const receipts = allReceipts.filter(r => recIds.indexOf(r.id) >= 0);
      const total = receipts.reduce((sum, r) => sum + format.safeAmount(r), 0);
      const startText = format.formatDate(ev.startDate, 'YYYY.MM.DD');
      const endText = format.formatDate(ev.endDate, 'YYYY.MM.DD');
      const dateRangeText = startText === endText ? startText : (startText + ' ~ ' + endText);

      return Object.assign({}, ev, {
        coverSrc: icons.normalizeEventCover(ev.cover),
        count: receipts.length,
        totalAmount: total.toFixed(2),
        total: total.toFixed(2),
        startText,
        endText,
        dateRangeText,
        receipts
      });
    });

    this.setData({
      events: rawEvents,
      eventList
    });
  },

  goCreate() {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    wx.navigateTo({ url: '/pages/event-create/event-create' });
  },

  onOpenActionSheet(e) {
    const id = e.currentTarget.dataset.id;
    const cur = this.data.eventList.find(x => x.id === id);
    if (!cur) return;
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}

    this.setData({
      showActionDrawer: true,
      actionEvent: cur
    });
  },

  onCloseActionDrawer() {
    this.setData({ showActionDrawer: false });
  },

  onDrawerFlip() {
    const cur = this.data.actionEvent;
    this.setData({ showActionDrawer: false });
    if (cur) this.openFlipModalForEvent(cur);
  },

  onDrawerPoster() {
    const cur = this.data.actionEvent;
    this.setData({ showActionDrawer: false });
    if (cur) this.generatePosterForEvent(cur);
  },

  onDrawerEdit() {
    const cur = this.data.actionEvent;
    this.setData({ showActionDrawer: false });
    if (cur) wx.navigateTo({ url: '/pages/event-create/event-create?id=' + cur.id });
  },

  onDrawerExport() {
    const cur = this.data.actionEvent;
    this.setData({ showActionDrawer: false });
    if (cur) wx.navigateTo({ url: '/pages/export/export?eventId=' + cur.id });
  },

  onDrawerDelete() {
    this.setData({
      showActionDrawer: false,
      showDeleteConfirm: true
    });
  },

  onCancelDeleteConfirm() {
    this.setData({ showDeleteConfirm: false });
  },

  onConfirmDeleteEvent() {
    const cur = this.data.actionEvent;
    if (!cur) return;
    const id = cur.id;
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'medium' }); } catch (err) {}
    const events = storage.getEvents().filter(x => x.id !== id);
    storage.setEvents(events);
    this.setData({
      selectedId: null,
      showDeleteConfirm: false,
      actionEvent: null
    });
    this.loadEvents();
    wx.showToast({ title: '已删除事件', icon: 'none' });
  },

  onOpenFlipModal(e) {
    const id = e.currentTarget.dataset.id;
    const cur = this.data.eventList.find(x => x.id === id);
    if (cur) this.openFlipModalForEvent(cur);
  },

  openFlipModalForEvent(cur) {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'medium' }); } catch (err) {}
    const receipts = (cur.receipts || []).map(r => Object.assign({}, r, {
      _thumb: icons.receiptThumbUrl(r),
      _dateText: format.formatDate(r.date, 'YYYY-MM-DD')
    }));

    if (receipts.length === 0) {
      wx.showToast({ title: '该事件下暂无小票', icon: 'none' });
      return;
    }

    this.setData({
      activeFlipEvent: cur,
      flipReceipts: receipts,
      currentFlipIndex: 0,
      showFlipModal: true
    });
  },

  onCloseFlipModal() {
    this.setData({ showFlipModal: false });
  },

  onFlipSwiperChange(e) {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    this.setData({ currentFlipIndex: e.detail.current });
  },

  onGeneratePoster(e) {
    const id = (e && e.currentTarget && e.currentTarget.dataset.id) || this.data.selectedId;
    const cur = this.data.eventList.find(x => x.id === id) || this.data.eventList[0];
    if (cur) this.generatePosterForEvent(cur);
  },

  generatePosterForEvent(cur) {
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'medium' }); } catch (err) {}
    wx.showLoading({ title: '正在绘制手账海报…' });

    const query = this.createSelectorQuery();
    query.select('#posterCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) {
          wx.hideLoading();
          wx.showToast({ title: '画布初始化失败', icon: 'none' });
          return;
        }
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = (wx.getWindowInfo && wx.getWindowInfo().pixelRatio) || wx.getSystemInfoSync().pixelRatio || 2;
        const w = 360;
        const receipts = cur.receipts || [];
        const displayReceipts = receipts.slice(0, 7);
        const h = Math.min(700, 390 + displayReceipts.length * 42);

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);

        const isDark = storage.getSettings().theme === 'dark';
        const pageBg = isDark ? '#1C1A18' : '#FAF6EE';
        const cardBg = isDark ? '#262320' : '#FFFCF7';
        const trayBg = isDark ? 'rgba(61, 56, 51, 0.55)' : 'rgba(232, 223, 201, 0.45)';
        const borderCol = isDark ? '#3D3833' : '#E8DFC9';
        const textPri = isDark ? '#E8DFD3' : '#524233';
        const textSec = isDark ? '#C7BCAE' : '#846F53';
        const textMut = isDark ? '#948A7B' : '#A39683';
        const accentCol = isDark ? '#F0B894' : '#C4723B';

        // 1. 底纸
        ctx.fillStyle = pageBg;
        ctx.fillRect(0, 0, w, h);

        // 2. Double-Bezel 外托盘
        ctx.fillStyle = trayBg;
        ctx.strokeStyle = borderCol;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(10, 12, w - 20, h - 24, 22);
        ctx.fill();
        ctx.stroke();

        // 3. Double-Bezel 内芯手账卡片
        ctx.fillStyle = cardBg;
        ctx.beginPath();
        ctx.roundRect(16, 18, w - 32, h - 36, 16);
        ctx.fill();

        // 4. 顶部和纸胶带装饰
        ctx.fillStyle = 'rgba(232, 168, 124, 0.88)';
        ctx.beginPath();
        ctx.roundRect(w / 2 - 52, 10, 104, 20, 4);
        ctx.fill();

        // 5. Header Slogan
        ctx.fillStyle = textSec;
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🌿 TICKET MEMO · 票忆手账事件存根', w / 2, 50);

        // 6. 事件标题 & 日期范围
        ctx.fillStyle = textPri;
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(cur.name, w / 2, 84);

        ctx.fillStyle = textMut;
        ctx.font = '12px monospace';
        ctx.fillText(cur.startText + ' - ' + cur.endText, w / 2, 106);

        if (cur.note) {
          ctx.fillStyle = textSec;
          ctx.font = 'italic 12px sans-serif';
          ctx.fillText(`“${cur.note.substring(0, 24)}”`, w / 2, 128);
        }

        // 7. 统计小结框
        const statBoxY = cur.note ? 144 : 126;
        ctx.fillStyle = pageBg;
        ctx.beginPath();
        ctx.roundRect(28, statBoxY, w - 56, 54, 12);
        ctx.fill();

        ctx.fillStyle = textSec;
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('共收录 ' + cur.count + ' 笔小票记录', 42, statBoxY + 31);

        ctx.fillStyle = accentCol;
        ctx.font = 'bold 18px "DIN Alternate", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('¥' + cur.total, w - 42, statBoxY + 33);

        // 8. 小票清单
        let startY = statBoxY + 80;
        ctx.textAlign = 'left';
        displayReceipts.forEach((r, idx) => {
          ctx.fillStyle = textPri;
          ctx.font = '13px sans-serif';
          const merchant = r.merchant.length > 10 ? r.merchant.substring(0, 10) + '...' : r.merchant;
          ctx.fillText((idx + 1) + '. ' + merchant, 36, startY);

          ctx.fillStyle = textMut;
          ctx.font = '11px monospace';
          ctx.fillText(format.formatDate(r.date, 'MM.DD'), 175, startY);

          ctx.fillStyle = accentCol;
          ctx.font = 'bold 13px "DIN Alternate", sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(format.formatMoney(r.amount), w - 36, startY);
          ctx.textAlign = 'left';

          startY += 36;
        });

        if (receipts.length > 7) {
          ctx.fillStyle = textMut;
          ctx.font = '11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('... 等余下 ' + (receipts.length - 7) + ' 张小票', w / 2, startY + 6);
          startY += 24;
        }

        // 9. 复古手账印章水印 (Stamp)
        ctx.save();
        ctx.translate(w - 74, h - 74);
        ctx.rotate(-0.15);
        ctx.strokeStyle = accentCol;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = accentCol;
        ctx.font = 'bold 7px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('TICKET MEMO', 0, -6);
        ctx.fillText('VERIFIED', 0, 4);
        ctx.fillText('ARCHIVE', 0, 14);
        ctx.restore();

        // 10. 底部寄语
        ctx.fillStyle = textMut;
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('每一张小票，都是生活的温柔记录 · No.' + cur.id, w / 2 - 20, h - 34);

        wx.canvasToTempFilePath({
          canvas,
          success: (cRes) => {
            wx.hideLoading();
            this.setData({
              posterImg: cRes.tempFilePath,
              showPosterModal: true
            });
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({ title: '海报生成失败', icon: 'none' });
          }
        });
      });
  },

  onClosePoster() {
    this.setData({ showPosterModal: false });
  },

  onSavePoster() {
    if (!this.data.posterImg) return;
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterImg,
      success: () => {
        wx.showToast({ title: '已保存至相册 🌿', icon: 'success' });
        this.setData({ showPosterModal: false });
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.indexOf('auth') >= 0) {
          wx.showModal({
            title: '需要相册权限',
            content: '请在设置中允许访问相册以保存海报',
            success: (r) => {
              if (r.confirm) wx.openSetting();
            }
          });
        } else {
          wx.showToast({ title: '保存失败', icon: 'none' });
        }
      }
    });
  }
});
