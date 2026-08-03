// pages/home/index.js

const storage = require('../../utils/storage.js');

Page({
  data: {
    activeTimeRange: 'month',
    timeRangeOptions: [
      { key: 'today', label: '今天' },
      { key: 'week', label: '本周' },
      { key: 'month', label: '本月' },
      { key: 'year', label: '本年' }
    ],
    balance: '0.00',
    totalIncome: '0.00',
    totalExpense: '0.00',
    transactions: [],
    isRefreshing: false
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const summary = storage.getSummary(this.data.activeTimeRange);
    const displayTransactions = summary.transactions.slice(0, 5).map(t => ({
      ...t,
      date: storage.formatDisplayDate(t.date)
    }));
    
    this.setData({
      balance: summary.balance,
      totalIncome: summary.totalIncome,
      totalExpense: summary.totalExpense,
      transactions: displayTransactions
    });
  },

  onRefresh() {
    if (this.data.isRefreshing) return;
    
    this.setData({ isRefreshing: true });
    
    setTimeout(() => {
      this.loadData();
      this.setData({ isRefreshing: false });
      wx.showToast({ title: '刷新成功', icon: 'success', duration: 1000 });
    }, 600);
  },

  onTimeRangeChange(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ activeTimeRange: key });
    this.loadData();
  },

  onSearchTap() {
    wx.navigateTo({
      url: '/pages/search/index'
    });
  },

  onServiceTap() {
    wx.navigateTo({
      url: '/pages/service/index'
    });
  },

  onQuickAction(e) {
    const type = e.currentTarget.dataset.type;
    switch (type) {
      case 'report':
        wx.switchTab({ url: '/pages/report/index' });
        break;
      case 'asset':
        wx.switchTab({ url: '/pages/asset/index' });
        break;
      default:
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
    }
  }
});
