// mock/data.js - 初始 mock 数据（纯 SVG 图标版）
const icons = require('../utils/icons.js');

const now = Date.now();
const day = 24 * 3600 * 1000;

const categories = [
  { id: 'cat_food',    name: '餐饮', icon: icons.CATEGORY_BY_ID.cat_food,    color: 'orange', isDefault: true },
  { id: 'cat_shop',    name: '购物', icon: icons.CATEGORY_BY_ID.cat_shop,    color: 'pink',   isDefault: true },
  { id: 'cat_traffic', name: '出行', icon: icons.CATEGORY_BY_ID.cat_traffic, color: 'blue',   isDefault: true },
  { id: 'cat_med',     name: '医疗', icon: icons.CATEGORY_BY_ID.cat_med,     color: 'green',  isDefault: true },
  { id: 'cat_fun',     name: '娱乐', icon: icons.CATEGORY_BY_ID.cat_fun,     color: 'purple', isDefault: true },
  { id: 'cat_bill',    name: '缴费', icon: icons.CATEGORY_BY_ID.cat_bill,    color: 'yellow', isDefault: true },
  { id: 'cat_reim',    name: '报销', icon: icons.CATEGORY_BY_ID.cat_reim,    color: 'coffee', isDefault: true },
  { id: 'cat_other',   name: '其他', icon: icons.CATEGORY_BY_ID.cat_other,   color: 'gray',   isDefault: true }
];

const tags = [
  { id: 'tag_reim',  name: '报销',   color: 'orange' },
  { id: 'tag_imp',   name: '重要',   color: 'pink' },
  { id: 'tag_mem',   name: '纪念',   color: 'green' },
  { id: 'tag_trav',  name: '旅行',   color: 'blue' },
  { id: 'tag_work',  name: '工作',   color: 'coffee' },
  { id: 'tag_life',  name: '生活',   color: 'pink' },
  { id: 'tag_other', name: '其他',   color: 'gray' }
];

const receipts = [
  {
    id: 'r_1',
    merchant: 'Starbucks 星巴克',
    amount: 38.00,
    date: now - 0 * day,
    categoryId: 'cat_food',
    tags: ['tag_life'],
    items: '燕麦拿铁 *1',
    note: '周一加班的小奖励 ☕',
    image: '',
    placeholder: '',
    color: 'orange'
  },
  {
    id: 'r_2',
    merchant: '盒马鲜生',
    amount: 126.50,
    date: now - 1 * day,
    categoryId: 'cat_shop',
    tags: ['tag_life'],
    items: '蔬菜、酸奶、面包',
    note: '周末囤货',
    image: '',
    placeholder: '',
    color: 'pink'
  },
  {
    id: 'r_3',
    merchant: '滴滴出行',
    amount: 28.40,
    date: now - 2 * day,
    categoryId: 'cat_traffic',
    tags: ['tag_work'],
    items: '快车 4.2km',
    note: '',
    image: '',
    placeholder: '',
    color: 'blue'
  },
  {
    id: 'r_4',
    merchant: '西贝莜面村',
    amount: 168.00,
    date: now - 3 * day,
    categoryId: 'cat_food',
    tags: ['tag_life'],
    items: '莜面套餐 *2',
    note: '和小猫一起吃饭 🐱',
    image: '',
    placeholder: '',
    color: 'orange'
  },
  {
    id: 'r_5',
    merchant: '名创优品',
    amount: 49.90,
    date: now - 4 * day,
    categoryId: 'cat_shop',
    tags: ['tag_life'],
    items: '收纳盒、便签纸',
    note: '',
    image: '',
    placeholder: '',
    color: 'pink'
  },
  {
    id: 'r_6',
    merchant: '上海博物馆',
    amount: 60.00,
    date: now - 6 * day,
    categoryId: 'cat_fun',
    tags: ['tag_mem', 'tag_trav'],
    items: '门票 *2',
    note: '雨天的浪漫',
    image: '',
    placeholder: '',
    color: 'purple'
  },
  {
    id: 'r_7',
    merchant: 'Manner Coffee',
    amount: 22.00,
    date: now - 7 * day,
    categoryId: 'cat_food',
    tags: ['tag_life'],
    items: '冰美式 *1',
    note: '',
    image: '',
    placeholder: '',
    color: 'orange'
  },
  {
    id: 'r_8',
    merchant: '高铁票 G7212',
    amount: 553.00,
    date: now - 12 * day,
    categoryId: 'cat_traffic',
    tags: ['tag_trav'],
    items: '上海虹桥 → 杭州东',
    note: '杭州两日游',
    image: '',
    placeholder: '',
    color: 'blue'
  },
  {
    id: 'r_9',
    merchant: '杭州西湖民宿',
    amount: 880.00,
    date: now - 11 * day,
    categoryId: 'cat_other',
    tags: ['tag_trav', 'tag_mem'],
    items: '湖景大床房 *1晚',
    note: '看到了西湖的雾',
    image: '',
    placeholder: '',
    color: 'gray'
  },
  {
    id: 'r_10',
    merchant: '某医院门诊',
    amount: 245.30,
    date: now - 18 * day,
    categoryId: 'cat_med',
    tags: ['tag_imp', 'tag_reim'],
    items: '门诊挂号、检查费',
    note: '记得报销',
    image: '',
    placeholder: '',
    color: 'green'
  },
  {
    id: 'r_11',
    merchant: '良品铺子',
    amount: 89.90,
    date: now - 20 * day,
    categoryId: 'cat_food',
    tags: ['tag_life'],
    items: '坚果礼盒 *1',
    note: '',
    image: '',
    placeholder: '',
    color: 'orange'
  },
  {
    id: 'r_12',
    merchant: '电费缴费',
    amount: 156.00,
    date: now - 25 * day,
    categoryId: 'cat_bill',
    tags: [],
    items: '本月电费',
    note: '',
    image: '',
    placeholder: '',
    color: 'yellow'
  }
];

const events = [
  {
    id: 'ev_1',
    name: '杭州两日游',
    cover: 'travel',
    coverColor: 'blue',
    startDate: now - 13 * day,
    endDate: now - 11 * day,
    receiptIds: ['r_8', 'r_9'],
    note: '微微细雨的西湖，岚山般的清晨。',
    createdAt: now - 11 * day
  },
  {
    id: 'ev_2',
    name: '生日小聚',
    cover: 'birthday',
    coverColor: 'yellow',
    startDate: now - 4 * day,
    endDate: now - 4 * day,
    receiptIds: ['r_4', 'r_5'],
    note: '愿这一年继续被温柔以待。',
    createdAt: now - 4 * day
  },
  {
    id: 'ev_3',
    name: '本月日常',
    cover: 'shopping',
    coverColor: 'pink',
    startDate: now - 30 * day,
    endDate: now,
    receiptIds: ['r_1', 'r_2', 'r_7', 'r_11'],
    note: '一杯咖啡和一些零食的小日子。',
    createdAt: now
  }
];

module.exports = {
  categories,
  tags,
  receipts,
  events
};
