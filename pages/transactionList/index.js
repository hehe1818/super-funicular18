// pages/transactionList/index.js

const storage = require('../../utils/storage.js');

Page({
  data: {
    // 筛选状态
    activeFilter: 'all',
    currentRange: 'all', // all, today, week, month, custom
    showDateModal: false,
    filterStartDate: '',
    filterEndDate: '',
    tempStartDate: '',
    tempEndDate: '',
    rangeDisplayText: '',
    
    // 分页状态
    currentPage: 1,
    pageSize: 20,
    hasMore: true,
    isLoading: false,
    totalItems: 0,
    
    // 数据
    groupedData: [],
    summaryIncome: '0.00',
    summaryExpense: '0.00',
    summaryBalance: '0.00',
    
    // 存储所有加载的原始数据（用于去重）
    _allItems: [],
    _itemIds: new Set()
  },

  onLoad() {
    this.initLoad();
  },

  onShow() {
    // 如果从记账页面返回，刷新数据
    this.initLoad();
  },

  // 初始化加载
  initLoad() {
    this.setData({
      currentPage: 1,
      hasMore: true,
      isLoading: false,
      groupedData: [],
      _allItems: [],
      _itemIds: new Set()
    });
    this.loadData(true);
  },

  // 加载数据
  loadData(reset = false) {
    if (this.data.isLoading) return;
    
    this.setData({ isLoading: true });
    
    const { currentPage, pageSize, activeFilter, filterStartDate, filterEndDate, _itemIds } = this.data;
    
    const filters = {
      type: activeFilter,
      startDate: filterStartDate || undefined,
      endDate: filterEndDate || undefined
    };
    
    // 使用 setTimeout 模拟异步加载，避免阻塞主线程
    setTimeout(() => {
      try {
        const result = storage.getTransactionsPaged(currentPage, pageSize, filters);
        
        // 处理新数据，添加显示字段
        const newItems = result.data
          .filter(item => !_itemIds.has(item.id))
          .map(item => ({
            ...item,
            displayTime: this.formatTime(item.date)
          }));
        
        // 更新已加载的ID集合
        newItems.forEach(item => _itemIds.add(item.id));
        
        // 合并数据
        const allItems = reset ? newItems : [...this.data._allItems, ...newItems];
        
        // 分组处理（按日期分组）
        const groupedData = this.groupByDate(allItems);
        
        // 计算汇总
        const summary = this.calculateSummary(allItems);
        
        this.setData({
          groupedData,
          _allItems: allItems,
          totalItems: result.pagination.total,
          hasMore: result.pagination.hasMore && newItems.length > 0,
          currentPage: currentPage + 1,
          isLoading: false,
          summaryIncome: summary.income,
          summaryExpense: summary.expense,
          summaryBalance: summary.balance
        });
        
      } catch (error) {
        console.error('加载数据失败:', error);
        this.setData({ isLoading: false });
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    }, 100); // 100ms 延迟，给UI留出渲染时间
  },

  // 滚动加载更多
  onLoadMore() {
    if (!this.data.hasMore || this.data.isLoading) return;
    this.loadData(false);
  },

  // 按日期分组
  groupByDate(items) {
    const groups = {};
    const now = new Date();
    const today = this.formatDate(now);
    const yesterday = this.formatDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
    
    items.forEach(item => {
      const itemDate = item.date.split(' ')[0];
      if (!groups[itemDate]) {
        groups[itemDate] = {
          date: itemDate,
          dateLabel: this.getDateLabel(itemDate, today, yesterday),
          items: [],
          income: 0,
          expense: 0
        };
      }
      groups[itemDate].items.push(item);
      
      const amount = parseFloat(item.amount);
      if (item.type === 'income') {
        groups[itemDate].income += amount;
      } else {
        groups[itemDate].expense += amount;
      }
    });
    
    // 转换为数组并排序
    return Object.values(groups)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(group => ({
        ...group,
        income: group.income.toFixed(2),
        expense: group.expense.toFixed(2)
      }));
  },

  // 获取日期标签
  getDateLabel(dateStr, today, yesterday) {
    if (dateStr === today) return '今天';
    if (dateStr === yesterday) return '昨天';
    
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now - date) / (24 * 60 * 60 * 1000);
    
    if (diff < 7) return `${Math.floor(diff)}天前`;
    if (diff < 30) return `${Math.floor(diff / 7)}周前`;
    
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  },

  // 计算汇总
  calculateSummary(items) {
    let income = 0;
    let expense = 0;
    
    items.forEach(item => {
      const amount = parseFloat(item.amount);
      if (item.type === 'income') {
        income += amount;
      } else {
        expense += amount;
      }
    });
    
    return {
      income: income.toFixed(2),
      expense: expense.toFixed(2),
      balance: (income - expense).toFixed(2)
    };
  },

  // 格式化时间
  formatTime(dateStr) {
    const date = new Date(dateStr);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  // 格式化日期
  formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  // 筛选类型切换
  onFilterChange(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ activeFilter: filter });
    this.initLoad();
  },

  // 快捷范围选择
  onQuickRange(e) {
    const range = e.currentTarget.dataset.range;
    const now = new Date();
    let startDate = '';
    let endDate = '';
    let displayText = '';
    
    switch (range) {
      case 'today':
        startDate = this.formatDate(now);
        endDate = this.formatDate(now);
        displayText = '今日';
        break;
      case 'week':
        const weekStart = new Date(now);
        const day = weekStart.getDay() || 7;
        weekStart.setDate(now.getDate() - day + 1);
        startDate = this.formatDate(weekStart);
        endDate = this.formatDate(now);
        displayText = `本周 (${startDate} 至 ${endDate})`;
        break;
      case 'month':
        startDate = this.formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
        endDate = this.formatDate(now);
        displayText = `本月 (${startDate} 至 ${endDate})`;
        break;
      case 'all':
      default:
        startDate = '';
        endDate = '';
        displayText = '';
        break;
    }
    
    this.setData({
      currentRange: range,
      filterStartDate: startDate,
      filterEndDate: endDate,
      rangeDisplayText: displayText
    });
    this.initLoad();
  },

  // 清除日期筛选
  onClearDateFilter() {
    this.setData({
      currentRange: 'all',
      filterStartDate: '',
      filterEndDate: '',
      rangeDisplayText: ''
    });
    this.initLoad();
  },

  // 打开日期筛选
  onOpenFilter() {
    const now = new Date();
    const today = this.formatDate(now);
    const weekStartDate = new Date(now);
    const day = weekStartDate.getDay() || 7;
    weekStartDate.setDate(now.getDate() - day + 1);
    const weekStart = this.formatDate(weekStartDate);
    const monthStart = this.formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
    
    this.setData({
      showDateModal: true,
      tempStartDate: this.data.filterStartDate,
      tempEndDate: this.data.filterEndDate,
      today,
      weekStart,
      monthStart
    });
  },

  // 关闭日期筛选
  onCloseDateModal() {
    this.setData({ showDateModal: false });
  },

  // 开始日期变化
  onStartDateChange(e) {
    const value = e.detail.value;
    this.setData({ tempStartDate: value });
    // 实时预览：如果开始日期已有，检查是否可以立即应用
    if (this.data.tempEndDate) {
      this.applyCustomFilter();
    }
  },

  // 结束日期变化
  onEndDateChange(e) {
    const value = e.detail.value;
    this.setData({ tempEndDate: value });
    // 实时预览：如果结束日期已有，检查是否可以立即应用
    if (this.data.tempStartDate) {
      this.applyCustomFilter();
    }
  },

  // 应用自定义日期筛选
  applyCustomFilter() {
    const { tempStartDate, tempEndDate } = this.data;
    if (!tempStartDate || !tempEndDate) return;
    
    // 确保开始日期不大于结束日期
    if (tempStartDate > tempEndDate) {
      wx.showToast({
        title: '开始日期不能晚于结束日期',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    
    this.setData({
      filterStartDate: tempStartDate,
      filterEndDate: tempEndDate,
      currentRange: 'custom',
      rangeDisplayText: `${tempStartDate} 至 ${tempEndDate}`,
      showDateModal: false
    });
    
    wx.showToast({
      title: '筛选已应用',
      icon: 'success',
      duration: 1000
    });
    
    this.initLoad();
  },

  // 快捷日期选择（弹窗内 - 直接应用筛选）
  onQuickDate(e) {
    const range = e.currentTarget.dataset.range;
    const now = new Date();
    let startDate = '';
    let endDate = '';
    let displayText = '';
    
    switch (range) {
      case 'today':
        startDate = this.formatDate(now);
        endDate = this.formatDate(now);
        displayText = '今日';
        break;
      case 'week':
        const weekStart = new Date(now);
        const day = weekStart.getDay() || 7;
        weekStart.setDate(now.getDate() - day + 1);
        startDate = this.formatDate(weekStart);
        endDate = this.formatDate(now);
        displayText = `本周 (${startDate} 至 ${endDate})`;
        break;
      case 'month':
        startDate = this.formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
        endDate = this.formatDate(now);
        displayText = `本月 (${startDate} 至 ${endDate})`;
        break;
      default:
        break;
    }
    
    // 直接应用筛选并关闭弹窗
    this.setData({
      filterStartDate: startDate,
      filterEndDate: endDate,
      currentRange: range,
      rangeDisplayText: displayText,
      showDateModal: false
    });
    
    wx.showToast({
      title: `已切换到${range === 'today' ? '今日' : range === 'week' ? '本周' : '本月'}`,
      icon: 'success',
      duration: 1000
    });
    
    this.initLoad();
  },

  // 重置筛选
  onResetFilter() {
    this.setData({
      tempStartDate: '',
      tempEndDate: ''
    });
  },

  // 应用筛选
  onApplyFilter() {
    const { tempStartDate, tempEndDate } = this.data;
    let displayText = '';
    let range = 'custom';
    
    // 判断是否是预设的快捷范围
    const now = new Date();
    const today = this.formatDate(now);
    const weekStart = new Date(now);
    const day = weekStart.getDay() || 7;
    weekStart.setDate(now.getDate() - day + 1);
    const weekStartStr = this.formatDate(weekStart);
    const monthStart = this.formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
    
    if (tempStartDate === today && tempEndDate === today) {
      range = 'today';
      displayText = '今日';
    } else if (tempStartDate === weekStartStr && tempEndDate === today) {
      range = 'week';
      displayText = `本周 (${weekStartStr} 至 ${today})`;
    } else if (tempStartDate === monthStart && tempEndDate === today) {
      range = 'month';
      displayText = `本月 (${monthStart} 至 ${today})`;
    } else if (!tempStartDate && !tempEndDate) {
      range = 'all';
      displayText = '';
    } else if (tempStartDate && tempEndDate) {
      displayText = `${tempStartDate} 至 ${tempEndDate}`;
    } else if (tempStartDate) {
      displayText = `${tempStartDate} 起`;
    } else if (tempEndDate) {
      displayText = `至 ${tempEndDate}`;
    }
    
    this.setData({
      filterStartDate: tempStartDate,
      filterEndDate: tempEndDate,
      currentRange: range,
      rangeDisplayText: displayText,
      showDateModal: false
    });
    
    wx.showToast({
      title: '筛选已应用',
      icon: 'success',
      duration: 1000
    });
    
    this.initLoad();
  },

  // 点击记录项
  onItemTap(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data._allItems.find(i => i.id === id);
    if (item) {
      wx.showModal({
        title: item.category,
        content: `金额: ¥${item.amount}\n备注: ${item.note || '无'}\n时间: ${item.date}`,
        showCancel: false,
        confirmText: '知道了'
      });
    }
  },

  // 跳转到记账页
  onAddRecord() {
    wx.switchTab({
      url: '/pages/addRecord/index'
    });
  }
});
