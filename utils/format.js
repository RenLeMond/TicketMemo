// utils/format.js - 通用格式化工具与 CSV 导出

function pad2(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return '00';
  return num < 10 ? '0' + num : '' + num;
}

function formatDate(ts, fmt = 'YYYY-MM-DD') {
  if (ts === null || ts === undefined || ts === '' || (typeof ts === 'number' && !Number.isFinite(ts))) return '';
  const d = new Date(ts);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const mm = pad2(d.getMinutes());
  return fmt
    .replace('YYYY', y)
    .replace('MM', m)
    .replace('DD', day)
    .replace('HH', hh)
    .replace('mm', mm);
}

function formatMoney(n, withSymbol = true) {
  const num = Number(n);
  if (n === null || n === undefined || !Number.isFinite(num)) return withSymbol ? '¥0.00' : '0.00';
  return (withSymbol ? '¥' : '') + num.toFixed(2);
}

function relativeDate(ts) {
  if (ts === null || ts === undefined || ts === '') return '';
  const now = new Date();
  const d = new Date(ts);
  if (isNaN(d.getTime())) return '';
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.floor((nowStart - dStart) / (24 * 3600 * 1000));
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays === 2) return '前天';
  if (diffDays < 7) return diffDays + '天前';
  return formatDate(ts, 'MM-DD');
}

function getGreetingText() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) return '清晨好，记得吃一顿温暖的早餐 🥐';
  if (hour >= 9 && hour < 12) return '上午好，阳光正好，元气满满 ✨';
  if (hour >= 12 && hour < 14) return '午后好，一杯咖啡让心情慢下来 ☕';
  if (hour >= 14 && hour < 18) return '下午好，把小确幸轻轻收进手账 🌿';
  if (hour >= 18 && hour < 22) return '傍晚好，记录今天温柔的生活痕迹 🌙';
  return '夜深了，愿每一份小票都是温暖回忆 💤';
}

function uid(prefix = 'r') {
  return prefix + '_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
}

function safeAmount(r) {
  if (!r) return 0;
  const v = parseFloat(r.amount);
  return Number.isFinite(v) ? v : 0;
}

function groupByMonth(receipts) {
  if (!Array.isArray(receipts)) return [];
  const map = {};
  receipts.forEach(r => {
    const k = formatDate(r.date, 'YYYY-MM');
    if (!map[k]) {
      map[k] = {
        month: k,
        list: [],
        receipts: [],
        count: 0,
        total: 0
      };
    }
    map[k].list.push(r);
    map[k].receipts.push(r);
    map[k].count += 1;
    map[k].total += safeAmount(r);
  });
  return Object.values(map).sort((a, b) => b.month.localeCompare(a.month));
}

/**
 * 生成真实 CSV 格式台账内容
 */
function generateCSV(receipts, categories = [], tags = []) {
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c.name; });
  const tagMap = {};
  tags.forEach(t => { tagMap[t.id] = t.name; });

  const headers = ['编号', '消费日期', '商家名称', '金额(元)', '分类', '商品摘要', '标签', '备注'];
  const rows = (receipts || []).map((r, i) => {
    const rTags = (r.tags || []).map(tid => tagMap[tid] || tid).join(';');
    const cleanItems = (r.items || '').replace(/[\r\n",]/g, ' ');
    const cleanNote = (r.note || '').replace(/[\r\n",]/g, ' ');
    const cleanMerchant = (r.merchant || '').replace(/[\r\n",]/g, ' ');
    return [
      r.id || ('No.' + (i + 1)),
      formatDate(r.date, 'YYYY-MM-DD HH:mm'),
      `"${cleanMerchant}"`,
      safeAmount(r).toFixed(2),
      catMap[r.categoryId] || '其他',
      `"${cleanItems}"`,
      `"${rTags}"`,
      `"${cleanNote}"`
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

module.exports = {
  formatDate,
  formatMoney,
  relativeDate,
  getGreetingText,
  uid,
  groupByMonth,
  safeAmount,
  generateCSV
};
