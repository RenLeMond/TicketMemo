/**
 * 小票展示层装饰：统一分类色、标签色、缩略图与列表卡片
 */
const icons = require('./icons.js');

function findCategory(receipt, categories) {
  const catList = categories || [];
  return catList.find(c => c.id === receipt.categoryId) || {
    id: 'cat_other',
    name: '其他',
    color: 'gray',
    icon: icons.CATEGORY_BY_ID.cat_other
  };
}

function decorateReceipt(receipt, categories, tags) {
  if (!receipt) return receipt;
  const tagList = tags || [];
  const cat = findCategory(receipt, categories);
  const tagItems = (receipt.tags || [])
    .map(tid => tagList.find(t => t.id === tid))
    .filter(Boolean);
  const thumb = icons.resolveReceiptThumb(receipt, cat);

  return Object.assign({}, receipt, {
    categoryName: cat.name,
    categoryColor: cat.color || 'gray',
    categoryIcon: (cat.icon && icons.isAssetPath(cat.icon))
      ? cat.icon
      : icons.categoryIconUrl(receipt.categoryId),
    tagItems,
    thumbSrc: thumb.thumbSrc,
    thumbColor: thumb.thumbColor
  });
}

function decorateReceipts(receipts, categories, tags) {
  return (receipts || []).map(r => decorateReceipt(r, categories, tags));
}

module.exports = {
  decorateReceipt,
  decorateReceipts
};
