// components/ticket-card/index.js
const format = require('../../utils/format.js');
const storage = require('../../utils/storage.js');
const receiptDisplay = require('../../utils/receipt-display.js');
const icons = require('../../utils/icons.js');

Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    receipt: { type: Object, value: {} },
    showDate: { type: Boolean, value: true },
    variant: { type: String, value: '' },
    isLast: { type: Boolean, value: false }
  },
  data: {
    viewReceipt: {},
    thumbSrc: icons.CATEGORY_BY_ID.cat_other,
    _dateText: '',
    _amountText: ''
  },
  observers: {
    receipt(r) {
      if (!r || !r.id) {
        this.setData({
          viewReceipt: {},
          thumbSrc: icons.CATEGORY_BY_ID.cat_other,
          _dateText: '',
          _amountText: ''
        });
        return;
      }
      const decorated = receiptDisplay.decorateReceipt(
        r,
        storage.getCategories(),
        storage.getTags()
      );
      this.setData({
        viewReceipt: decorated,
        thumbSrc: decorated.thumbSrc,
        _dateText: format.relativeDate(r.date),
        _amountText: format.formatMoney(r.amount)
      });
    }
  },
  methods: {
    onTap() {
      const id = this.data.receipt.id;
      if (!id) return;
      wx.navigateTo({ url: '/pages/detail/detail?id=' + id });
    }
  }
});
