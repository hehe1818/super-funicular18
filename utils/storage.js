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
// granularity: 'month' - 按月统计（一年12个月），'day' - 按日统计（当月每一天）
function getReportData(year, month, granularity = 'month') {
  const transactions = getTransactions();
  
  if (granularity === 'day') {
    // 按日统计：获取当月每一天的数据
    const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
    const monthTransactions = transactions.filter(t => t.date.startsWith(monthPrefix));
    
    // 获取当月的天数
    const daysInMonth = new Date(year, month, 0).getDate();
    
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap = {};
    const trendData = {
      expense: new Array(daysInMonth).fill(0),
      income: new Array(daysInMonth).fill(0)
    };
    const dayLabels = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      dayLabels.push(`${i}日`);
    }
    
    monthTransactions.forEach(t => {
      const amount = parseFloat(t.amount);
      const day = parseInt(t.date.split(' ')[0].split('-')[2]);
      
      if (t.type === 'income') {
        totalIncome += amount;
        trendData.income[day - 1] += amount;
      } else if (t.type === 'expense' || t.type === 'transfer') {
        totalExpense += amount;
        trendData.expense[day - 1] += amount;
      }
      
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
      trendLabels: dayLabels,
      trendDays: Array.from({length: daysInMonth}, (_, i) => i + 1),
      categoryStats,
      granularity: 'day'
    };
  } else {
    // 按月统计：获取一年12个月的数据
    const yearPrefix = `${year}`;
    const yearTransactions = transactions.filter(t => t.date.startsWith(yearPrefix));
    
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap = {};
    const trendData = {
      expense: new Array(12).fill(0),
      income: new Array(12).fill(0)
    };
    const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    
    yearTransactions.forEach(t => {
      const amount = parseFloat(t.amount);
      const transMonth = parseInt(t.date.split(' ')[0].split('-')[1]) - 1;
      
      if (t.type === 'income') {
        totalIncome += amount;
        trendData.income[transMonth] += amount;
      } else if (t.type === 'expense' || t.type === 'transfer') {
        totalExpense += amount;
        trendData.expense[transMonth] += amount;
      }
      
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
      trendLabels: monthLabels,
      trendMonths: Array.from({length: 12}, (_, i) => i + 1),
      categoryStats,
      granularity: 'month'
    };
  }
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

// 获取分页交易记录
function getTransactionsPaged(page = 1, pageSize = 20, filters = {}) {
  let transactions = getTransactions();
  
  // 应用筛选条件
  if (filters.type && filters.type !== 'all') {
    if (filters.type === 'expense') {
      transactions = transactions.filter(t => t.type === 'expense' || t.type === 'transfer');
    } else if (filters.type === 'income') {
      transactions = transactions.filter(t => t.type === 'income');
    }
  }
  
  if (filters.startDate) {
    transactions = transactions.filter(t => t.date >= filters.startDate);
  }
  
  if (filters.endDate) {
    transactions = transactions.filter(t => t.date <= filters.endDate + ' 23:59');
  }
  
  // 按日期排序（最新的在前）
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const total = transactions.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = transactions.slice(startIndex, endIndex);
  
  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasMore: page < totalPages
    }
  };
}

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ============ 预算管理功能 ============

// 默认分类预算配置
const DEFAULT_CATEGORY_BUDGETS = {
  '餐饮': { icon: '🍜', budget: 800, color: '#FF9F43' },
  '购物': { icon: '🛍️', budget: 500, color: '#EE5A24' },
  '交通': { icon: '🚌', budget: 200, color: '#0652DD' },
  '娱乐': { icon: '🎬', budget: 300, color: '#8E44AD' },
  '学习': { icon: '📚', budget: 400, color: '#00B894' },
  '医疗': { icon: '💊', budget: 150, color: '#EA2027' },
  '居家': { icon: '🏠', budget: 300, color: '#1289A7' },
  '服饰': { icon: '👕', budget: 400, color: '#D980FA' },
  '其他': { icon: '📌', budget: 200, color: '#95A5A6' }
};

// 获取预算配置
function getBudgetConfig() {
  try {
    const data = wx.getStorageSync('budgetConfig');
    if (data) {
      return data;
    }
  } catch (e) {
    console.error('获取预算配置失败', e);
  }
  // 返回默认配置（总预算为所有分类预算之和）
  const totalBudget = Object.values(DEFAULT_CATEGORY_BUDGETS).reduce((sum, c) => sum + c.budget, 0);
  return {
    totalBudget: totalBudget,
    categories: { ...DEFAULT_CATEGORY_BUDGETS }
  };
}

// 保存预算配置
function saveBudgetConfig(config) {
  try {
    wx.setStorageSync('budgetConfig', config);
    return true;
  } catch (e) {
    console.error('保存预算配置失败', e);
    return false;
  }
}

// 更新总预算
function updateTotalBudget(totalBudget) {
  const config = getBudgetConfig();
  config.totalBudget = totalBudget;
  return saveBudgetConfig(config);
}

// 更新分类预算
function updateCategoryBudget(category, budget) {
  const config = getBudgetConfig();
  if (config.categories[category]) {
    config.categories[category].budget = budget;
  } else {
    // 如果分类不存在，添加新分类
    config.categories[category] = {
      icon: '📌',
      budget: budget,
      color: '#95A5A6'
    };
  }
  return saveBudgetConfig(config);
}

// 获取本月预算使用情况
function getBudgetUsage() {
  const config = getBudgetConfig();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
  
  // 获取本月所有支出记录
  const transactions = getTransactions();
  const monthExpenses = transactions.filter(t => {
    if (t.type === 'income') return false;
    return t.date >= monthStart;
  });
  
  // 计算每个分类的支出
  const categoryUsage = {};
  let totalUsed = 0;
  
  monthExpenses.forEach(t => {
    const category = t.category || '其他';
    if (!categoryUsage[category]) {
      categoryUsage[category] = 0;
    }
    categoryUsage[category] += parseFloat(t.amount);
    totalUsed += parseFloat(t.amount);
  });
  
  // 构建分类预算使用详情
  const categoryDetails = Object.keys(config.categories).map(category => {
    const info = config.categories[category];
    const used = categoryUsage[category] || 0;
    const budget = info.budget;
    const percentage = budget > 0 ? (used / budget) * 100 : 0;
    const remaining = budget - used;
    const status = percentage >= 100 ? 'over' : percentage >= 80 ? 'warning' : 'normal';
    
    return {
      category,
      icon: info.icon,
      color: info.color,
      budget: budget,
      used: used,
      remaining: remaining,
      percentage: percentage,
      status: status
    };
  });
  
  // 添加未配置但有支出的分类
  Object.keys(categoryUsage).forEach(category => {
    if (!config.categories[category]) {
      const used = categoryUsage[category];
      const budget = 0;
      const percentage = 0;
      categoryDetails.push({
        category: category,
        icon: '📌',
        color: '#95A5A6',
        budget: budget,
        used: used,
        remaining: -used,
        percentage: percentage,
        status: 'none',
        unconfigured: true
      });
    }
  });
  
  // 计算总预算使用率
  const totalBudget = config.totalBudget;
  const totalPercentage = totalBudget > 0 ? (totalUsed / totalBudget) * 100 : 0;
  
  return {
    year: year,
    month: month,
    totalBudget: totalBudget,
    totalUsed: totalUsed,
    totalRemaining: totalBudget - totalUsed,
    totalPercentage: totalPercentage,
    categoryDetails: categoryDetails.sort((a, b) => b.percentage - a.percentage)
  };
}

module.exports = {
  getAllData,
  getTransactions,
  getTransactionsPaged,
  addTransaction,
  getSummary,
  getReportData,
  formatDate,
  formatDisplayDate,
  generateId,
  getBudgetConfig,
  saveBudgetConfig,
  updateTotalBudget,
  updateCategoryBudget,
  getBudgetUsage
};
