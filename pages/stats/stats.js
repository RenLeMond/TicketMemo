// pages/stats/stats.js
const storage = require('../../utils/storage.js');
const format = require('../../utils/format.js');
const icons = require('../../utils/icons.js');

const COLOR_HEX = {
  green:  '#A8C5A0',
  orange: '#E8A87C',
  coffee: '#B89968',
  pink:   '#E8A8AB',
  blue:   '#A0B8CC',
  yellow: '#E0C875',
  purple: '#B5A0C8',
  gray:   '#C0B5A4'
};

Page({
  data: {
    range: 'month',         // week / month / year
    rangeText: '本月',
    monthTotal: '0.00',
    monthCount: 0,
    avgDay: '0.00',
    pieList: [],            // 分类占比
    trendList: [],          // 趋势点数组（柱状）
    maxTrend: 1,
    topCats: []             // top 分类
  },

  onShow() {
    this.compute();
  },

  switchRange(e) {
    const r = e.currentTarget.dataset.range;
    const map = { week: '本周', month: '本月', year: '本年' };
    this.setData({ range: r, rangeText: map[r] });
    this.compute();
  },

  compute() {
    const all = storage.getReceipts();
    const cats = storage.getCategories();
    const now = new Date();
    let startTs;
    let bucketCount;
    let bucketUnit;

    if (this.data.range === 'week') {
      const day = now.getDay() === 0 ? 7 : now.getDay();
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (day - 1));
      startTs = weekStart.getTime();
      bucketCount = 7;
      bucketUnit = 'day';
    } else if (this.data.range === 'year') {
      startTs = new Date(now.getFullYear(), 0, 1).getTime();
      bucketCount = 12;
      bucketUnit = 'month';
    } else {
      startTs = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      bucketCount = lastDay;
      bucketUnit = 'day';
    }

    const inRange = all.filter(r => r.date >= startTs);
    const total = inRange.reduce((s, r) => s + format.safeAmount(r), 0);

    // 分类占比
    const catSum = {};
    inRange.forEach(r => {
      catSum[r.categoryId] = (catSum[r.categoryId] || 0) + format.safeAmount(r);
    });
    const pieList = Object.keys(catSum).map(cid => {
      const c = cats.find(x => x.id === cid) || { name: '其他', icon: icons.CATEGORY_BY_ID.cat_other, color: 'gray' };
      const icon = icons.isAssetPath(c.icon) ? c.icon : icons.categoryIconUrl(cid);
      const pct = total > 0 ? (catSum[cid] / total * 100) : 0;
      return {
        id: cid,
        name: c.name,
        icon,
        color: c.color,
        hex: COLOR_HEX[c.color] || COLOR_HEX.gray,
        amount: catSum[cid].toFixed(2),
        pct: pct.toFixed(1),
        pctNum: pct
      };
    }).sort((a, b) => b.pctNum - a.pctNum);

    // 趋势
    const buckets = new Array(bucketCount).fill(0);
    inRange.forEach(r => {
      const d = new Date(r.date);
      let idx;
      if (bucketUnit === 'day') {
        if (this.data.range === 'week') {
          const dayOfWeek = d.getDay() === 0 ? 7 : d.getDay();
          idx = dayOfWeek - 1;
        } else {
          idx = d.getDate() - 1;
        }
      } else {
        idx = d.getMonth();
      }
      if (idx >= 0 && idx < bucketCount) buckets[idx] += format.safeAmount(r);
    });
    const maxTrend = Math.max.apply(null, buckets.concat([1]));
    const trendList = buckets.map((v, i) => ({
      idx: i,
      value: v.toFixed(2),
      h: maxTrend > 0 ? Math.max(4, Math.round(v / maxTrend * 100)) : 4,
      label: this.bucketLabel(i, bucketUnit)
    }));

    // 平均日消费
    const dayCount = bucketUnit === 'day' ? Math.max(1, bucketCount) : 365 / 12 * bucketCount;
    const avg = (total / dayCount).toFixed(2);

    this.setData({
      monthTotal: total.toFixed(2),
      monthCount: inRange.length,
      avgDay: avg,
      pieList,
      trendList,
      maxTrend,
      topCats: pieList.slice(0, 4)
    });

    // 绘制饼图
    this.drawPie(pieList);
  },

  bucketLabel(i, unit) {
    if (unit === 'month') return (i + 1) + '月';
    if (this.data.range === 'week') {
      return ['一', '二', '三', '四', '五', '六', '日'][i];
    }
    return (i + 1);
  },

  drawPie(pieList) {
    const query = this.createSelectorQuery();
    query.select('#pieCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) return;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = (wx.getWindowInfo && wx.getWindowInfo().pixelRatio) || wx.getSystemInfoSync().pixelRatio;
        const w = res[0].width;
        const h = res[0].height;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);

        const cx = w / 2, cy = h / 2;
        const outerR = Math.min(w, h) / 2 - 8;
        const innerR = outerR - 28;

        if (!pieList || pieList.length === 0 || pieList.every(p => p.pctNum === 0)) {
          ctx.beginPath();
          ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
          ctx.fillStyle = '#EFE6D1';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFCF7';
          ctx.fill();
          return;
        }

        let start = -Math.PI / 2;
        pieList.forEach(p => {
          const angle = (p.pctNum / 100) * Math.PI * 2;
          const end = start + angle;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, outerR, start, end);
          ctx.closePath();
          ctx.fillStyle = p.hex;
          ctx.fill();
          start = end;
        });

        // 内圆挖空
        ctx.beginPath();
        ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFCF7';
        ctx.fill();
      });
  }
});
