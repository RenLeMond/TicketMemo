// components/ticket-card/index.js
const format = require('../../utils/format.js');
const icons = require('../../utils/icons.js');

Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    receipt: { type: Object, value: {} },
    showDate: { type: Boolean, value: true },
    variant: { type: String, value: '' }
  },
  data: {
    thumbSrc: icons.CATEGORY_BY_ID.cat_other,
    _dateText: '',
    _amountText: ''
  },
  observers: {
    receipt(r) {
      if (!r) return;
      this.setData({
        thumbSrc: icons.receiptThumbUrl(r),
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
