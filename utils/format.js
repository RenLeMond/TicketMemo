// utils/format.js - 通用格式化工具

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

function uid(prefix = 'r') {
  return prefix + '_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
}

function safeAmount(r) {
  const v = parseFloat(r.amount);
  return Number.isFinite(v) ? v : 0;
}

function groupByMonth(receipts) {
  if (!Array.isArray(receipts)) return [];
  const map = {};
  receipts.forEach(r => {
    const k = formatDate(r.date, 'YYYY-MM');
    if (!map[k]) map[k] = { month: k, list: [], total: 0 };
    map[k].list.push(r);
    map[k].total += safeAmount(r);
  });
  return Object.values(map).sort((a, b) => b.month.localeCompare(a.month));
}

module.exports = {
  formatDate,
  formatMoney,
  relativeDate,
  uid,
  groupByMonth,
  safeAmount
};
