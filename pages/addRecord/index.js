// pages/addRecord/index.js

const storage = require('../../utils/storage.js');

const expenseCategories = [
  { id: '1', name: '餐饮', icon: '🍜' },
  { id: '2', name: '交通', icon: '🚌' },
  { id: '3', name: '购物', icon: '🛍️' },
  { id: '4', name: '娱乐', icon: '🎬' },
  { id: '5', name: '学习', icon: '📚' },
  { id: '6', name: '医疗', icon: '💊' },
  { id: '7', name: '运动', icon: '🏀' },
  { id: '8', name: '其他', icon: '📌' }
];

const incomeCategories = [
  { id: '1', name: '生活费', icon: '💰' },
  { id: '2', name: '兼职', icon: '💼' },
  { id: '3', name: '红包', icon: '🧧' },
  { id: '4', name: '奖学金', icon: '🏆' },
  { id: '5', name: '礼金', icon: '🎁' },
  { id: '6', name: '退款', icon: '↩️' },
  { id: '7', name: '理财', icon: '📈' },
  { id: '8', name: '其他', icon: '📌' }
];

function getTodayDate() {
  const now = new Date();
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
}

function getCurrentDateTime() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

Page({
  data: {
    recordType: 'expense',
    amount: '',
    selectedCategory: '',
    selectedCategoryData: null,
    note: '',
    todayDate: getTodayDate(),
    currentCategories: expenseCategories
  },

  onTypeChange(e) {
    const type = e.currentTarget.dataset.type;
    const categories = type === 'expense' ? expenseCategories : incomeCategories;
    this.setData({
      recordType: type,
      currentCategories: categories,
      selectedCategory: '',
      selectedCategoryData: null
    });
  },

  onAmountInput(e) {
    this.setData({ amount: e.detail.value });
  },

  onCategorySelect(e) {
    const id = e.currentTarget.dataset.id;
    const category = this.data.currentCategories.find(c => c.id === id);
    this.setData({ 
      selectedCategory: id,
      selectedCategoryData: category
    });
  },

  onNoteInput(e) {
    this.setData({ note: e.detail.value });
  },

  onSubmit() {
    const { amount, selectedCategoryData, recordType, note } = this.data;
    
    if (!amount) {
      wx.showToast({ title: '请输入金额', icon: 'none' });
      return;
    }
    if (!selectedCategoryData) {
      wx.showToast({ title: '请选择分类', icon: 'none' });
      return;
    }

    const transaction = {
      type: recordType,
      amount: parseFloat(amount).toFixed(2),
      category: selectedCategoryData.name,
      categoryIcon: selectedCategoryData.icon,
      note: note || '',
      date: getCurrentDateTime()
    };

    storage.addTransaction(transaction);

    wx.showToast({ title: '记账成功', icon: 'success' });
    
    // 重置表单
    this.setData({
      amount: '',
      selectedCategory: '',
      selectedCategoryData: null,
      note: ''
    });

    setTimeout(() => {
      wx.switchTab({ url: '/pages/home/index' });
    }, 1500);
  }
});
