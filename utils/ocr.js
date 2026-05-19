// utils/ocr.js - OCR 识别（mock 占位）
// 真实集成时可调用本地 ML/微信文字识别接口，此处仅返回模拟结果

const SAMPLE_MERCHANTS = [
  'Starbucks 星巴克', '西贝莜面村', '盒马鲜生', '名创优品',
  'M&M\'s Cafe', '海底捞火锅', '良品铺子', 'Manner Coffee',
  '麦当劳', '7-Eleven', '屈臣氏', '全家便利店'
];

const SAMPLE_ITEMS = [
  '燕麦拿铁 *1', '抹茶蛋糕 *1', '三明治套餐 *1',
  '蔬菜沙拉 *1', '冰美式 *2', '糕点礼盒 *1',
  '便当 *1', '酸奶 *2', '面包 *3'
];

function recognize() {
  return new Promise(resolve => {
    setTimeout(() => {
      const merchant = SAMPLE_MERCHANTS[Math.floor(Math.random() * SAMPLE_MERCHANTS.length)];
      const amount = (Math.random() * 200 + 8).toFixed(2);
      const items = [];
      const itemCount = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < itemCount; i++) {
        items.push(SAMPLE_ITEMS[Math.floor(Math.random() * SAMPLE_ITEMS.length)]);
      }
      resolve({
        merchant,
        amount: Number(amount),
        date: Date.now(),
        items: items.join('，'),
        rawText: merchant + '\n' + items.join('\n') + '\n合计 ¥' + amount
      });
    }, 1500);
  });
}

module.exports = { recognize };
