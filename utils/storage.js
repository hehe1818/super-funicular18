// utils/storage.js

// 初始化默认数据
function initDefaultData() {
  const defaultData = {
    transactions: [
      // 7月数据
      { id: '1', type: 'expense', amount: '25.50', category: '餐饮', categoryIcon: '🍜', note: '午餐 - 食堂', date: '2026-07-30 12:30' },
      { id: '2', type: 'expense', amount: '15.00', category: '交通', categoryIcon: '🚌', note: '公交卡充值', date: '2026-07-30 08:15' },
      { id: '3', type: 'income', amount: '200.00', category: '兼职', categoryIcon: '💼', note: '周末兼职报酬', date: '2026-07-29 18:00' },
      { id: '4', type: 'expense', amount: '68.00', category: '购物', categoryIcon: '🛍️', note: '日用品采购', date: '2026-07-29 15:20' },
      { id: '5', type: 'expense', amount: '18.00', category: '餐饮', categoryIcon: '☕', note: '下午茶 - 咖啡', date: '2026-07-29 15:00' },
      { id: '6', type: 'expense', amount: '45.00', category: '学习', categoryIcon: '📚', note: '购买教材', date: '2026-07-28 10:30' },
      { id: '7', type: 'expense', amount: '32.00', category: '娱乐', categoryIcon: '🎬', note: '电影票', date: '2026-07-27 20:00' },
      { id: '8', type: 'expense', amount: '58.00', category: '餐饮', categoryIcon: '🍜', note: '聚餐', date: '2026-07-25 19:00' },
      { id: '9', type: 'expense', amount: '128.00', category: '购物', categoryIcon: '🛍️', note: '衣服', date: '2026-07-22 14:30' },
      { id: '10', type: 'income', amount: '1500.00', category: '生活费', categoryIcon: '💰', note: '本月生活费', date: '2026-07-20 10:00' },
      { id: '11', type: 'expense', amount: '35.00', category: '学习', categoryIcon: '📚', note: '网课', date: '2026-07-18 22:00' },
      { id: '12', type: 'expense', amount: '22.00', category: '交通', categoryIcon: '🚌', note: '打车', date: '2026-07-15 21:30' },
      { id: '13', type: 'expense', amount: '48.00', category: '娱乐', categoryIcon: '🎬', note: '游戏充值', date: '2026-07-12 16:00' },
      { id: '14', type: 'expense', amount: '78.00', category: '餐饮', categoryIcon: '🍜', note: '和朋友吃饭', date: '2026-07-08 18:30' },
      { id: '15', type: 'expense', amount: '30.00', category: '学习', categoryIcon: '📚', note: '买书', date: '2026-07-05 11:00' },
      // 6月数据
      { id: '16', type: 'expense', amount: '42.00', category: '餐饮', categoryIcon: '🍜', note: '食堂三餐', date: '2026-06-28 12:00' },
      { id: '17', type: 'expense', amount: '36.00', category: '购物', categoryIcon: '🛍️', note: '日用品', date: '2026-06-25 15:00' },
      { id: '18', type: 'income', amount: '1500.00', category: '生活费', categoryIcon: '💰', note: '本月生活费', date: '2026-06-20 10:00' },
      { id: '19', type: 'expense', amount: '55.00', category: '娱乐', categoryIcon: '🎬', note: 'KTV', date: '2026-06-18 20:00' },
      { id: '20', type: 'expense', amount: '28.00', category: '交通', categoryIcon: '🚌', note: '地铁月卡', date: '2026-06-15 09:00' },
      { id: '21', type: 'expense', amount: '68.00', category: '学习', categoryIcon: '📚', note: '参考书', date: '2026-06-12 14:00' },
      { id: '22', type: 'expense', amount: '95.00', category: '购物', categoryIcon: '🛍️', note: '运动鞋', date: '2026-06-08 16:00' },
      { id: '23', type: 'expense', amount: '30.80', category: '餐饮', categoryIcon: '🍜', note: '早餐', date: '2026-06-05 08:00' },
      { id: '24', type: 'income', amount: '200.00', category: '兼职', categoryIcon: '💼', note: '兼职报酬', date: '2026-06-02 18:00' },
      // 5月数据
      { id: '25', type: 'expense', amount: '48.00', category: '餐饮', categoryIcon: '🍜', note: '聚餐', date: '2026-05-28 19:00' },
      { id: '26', type: 'expense', amount: '35.00', category: '娱乐', categoryIcon: '🎬', note: '电影', date: '2026-05-25 20:00' },
      { id: '27', type: 'expense', amount: '65.00', category: '购物', categoryIcon: '🛍️', note: '电子产品', date: '2026-05-22 15:00' },
      { id: '28', type: 'income', amount: '1500.00', category: '生活费', categoryIcon: '💰', note: '本月生活费', date: '2026-05-20 10:00' },
      { id: '29', type: 'expense', amount: '42.00', category: '学习', categoryIcon: '📚', note: '课程', date: '2026-05-18 10:00' },
      { id: '30', type: 'expense', amount: '28.00', category: '交通', categoryIcon: '🚌', note: '出行', date: '2026-05-15 08:00' }
    ]
  };
  
  wx.setStorageSync('ledgerData', defaultData);
  return defaultData;
}

// 获取所有数据
function getAllData() {
  try {
    const data = wx.getStorageSync('ledgerData');
    if (!data) {
      return initDefaultData();
    }
    return data;
  } catch (e) {
    return initDefaultData();
  }
}

// 获取所有交易记录
function getTransactions() {
  const data = getAllData();
  return data.transactions || [];
}

// 添加一笔交易
function addTransaction(transaction) {
  const data = getAllData();
  const newTransaction = {
    id: Date.now().toString(),
    ...transaction
  };
  data.transactions.unshift(newTransaction);
  wx.setStorageSync('ledgerData', data);
  return newTransaction;
}

// 获取汇总数据
function getSummary(timeRange) {
  const transactions = getTransactions();
  const now = new Date();
  let filteredTransactions = transactions;
  
  if (timeRange === 'today') {
    const today = formatDate(now);
    filteredTransactions = transactions.filter(t => t.date.startsWith(today));
  } else if (timeRange === 'week') {
    const weekStart = getWeekStart(now);
    filteredTransactions = transactions.filter(t => new Date(t.date) >= weekStart);
  } else if (timeRange === 'month') {
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    filteredTransactions = transactions.filter(t => t.date.startsWith(monthPrefix));
  } else if (timeRange === 'year') {
    const yearPrefix = `${now.getFullYear()}`;
    filteredTransactions = transactions.filter(t => t.date.startsWith(yearPrefix));
  }
  
  let totalIncome = 0;
  let totalExpense = 0;
  
  filteredTransactions.forEach(t => {
    const amount = parseFloat(t.amount);
    if (t.type === 'income') {
      totalIncome += amount;
    } else if (t.type === 'expense' || t.type === 'transfer') {
      totalExpense += amount;
    }
  });
  
  return {
    totalIncome: totalIncome.toFixed(2),
    totalExpense: totalExpense.toFixed(2),
    balance: (totalIncome - totalExpense).toFixed(2),
    transactions: filteredTransactions
  };
}

// 获取指定年月的报表数据
function getReportData(year, month) {
  const transactions = getTransactions();
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
  const monthTransactions = transactions.filter(t => t.date.startsWith(monthPrefix));
  
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryMap = {};
  const trendData = {
    expense: new Array(12).fill(0),
    income: new Array(12).fill(0)
  };
  
  monthTransactions.forEach(t => {
    const amount = parseFloat(t.amount);
    const day = parseInt(t.date.split(' ')[0].split('-')[2]);
    // 将每天的数据分配到对应的索引位置（12个点对应整个月的分布）
    const monthIndex = Math.min(Math.floor((day - 1) / 3), 11);
    
    if (t.type === 'income') {
      totalIncome += amount;
      trendData.income[monthIndex] += amount;
    } else if (t.type === 'expense' || t.type === 'transfer') {
      totalExpense += amount;
      trendData.expense[monthIndex] += amount;
    }
    
    // 分类统计
    if (t.type === 'expense' || t.type === 'transfer') {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = {
          category: t.category,
          icon: t.categoryIcon,
          amount: 0
        };
      }
      categoryMap[t.category].amount += amount;
    }
  });
  
  // 计算分类百分比
  const categoryStats = Object.values(categoryMap).map(item => ({
    ...item,
    amount: item.amount.toFixed(2),
    percentage: totalExpense > 0 ? Math.round((item.amount / totalExpense) * 100) : 0
  })).sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
  
  return {
    income: totalIncome.toFixed(2),
    expense: totalExpense.toFixed(2),
    balance: (totalIncome - totalExpense).toFixed(2),
    trendData: {
      expense: trendData.expense.map(v => parseFloat(v.toFixed(2))),
      income: trendData.income.map(v => parseFloat(v.toFixed(2)))
    },
    categoryStats
  };
}

// 格式化日期
function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// 获取本周开始日期
function getWeekStart(date) {
  const day = date.getDay() || 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - day + 1);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// 格式化日期显示
function formatDisplayDate(dateStr) {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}-${day} ${hours}:${minutes}`;
}

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = {
  getAllData,
  getTransactions,
  addTransaction,
  getSummary,
  getReportData,
  formatDate,
  formatDisplayDate,
  generateId
};
