// pages/search/index.js

const storage = require('../../utils/storage.js');

Page({
  data: {
    keyword: '',
    searchResults: [],
    searchHistory: [],
    hasSearched: false,
    isEmpty: false,
    filterType: 'all', // all, expense, income
  },

  onLoad() {
    this.loadSearchHistory();
  },

  // 加载搜索历史
  loadSearchHistory() {
    try {
      const history = wx.getStorageSync('searchHistory') || [];
      this.setData({ searchHistory: history });
    } catch (e) {
      console.error('加载搜索历史失败', e);
    }
  },

  // 保存搜索历史
  saveSearchHistory(keyword) {
    if (!keyword.trim()) return;
    let history = this.data.searchHistory.filter(item => item !== keyword);
    history.unshift(keyword);
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    this.setData({ searchHistory: history });
    try {
      wx.setStorageSync('searchHistory', history);
    } catch (e) {
      console.error('保存搜索历史失败', e);
    }
  },

  // 清除搜索历史
  clearSearchHistory() {
    wx.showModal({
      title: '提示',
      content: '确定要清除搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ searchHistory: [] });
          wx.removeStorageSync('searchHistory');
          wx.showToast({ title: '已清除', icon: 'success' });
        }
      }
    });
  },

  // 输入框变化
  onInputChange(e) {
    this.setData({ keyword: e.detail.value });
  },

  // 清除输入
  onClearInput() {
    this.setData({ 
      keyword: '', 
      searchResults: [], 
      hasSearched: false,
      isEmpty: false 
    });
  },

  // 点击历史关键词
  onHistoryTap(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword });
    this.doSearch();
  },

  // 筛选类型
  onFilterChange(e) {
    const filterType = e.currentTarget.dataset.type;
    this.setData({ filterType });
    if (this.data.hasSearched && this.data.keyword) {
      this.doSearch();
    }
  },

  // 执行搜索
  doSearch() {
    const { keyword, filterType } = this.data;
    
    if (!keyword.trim()) {
      wx.showToast({ title: '请输入搜索关键词', icon: 'none' });
      return;
    }

    const transactions = storage.getTransactions();
    let results = transactions.filter(t => {
      // 根据关键词搜索
      const note = (t.note || '').toLowerCase();
      const category = (t.category || '').toLowerCase();
      const searchKey = keyword.toLowerCase();
      
      if (note.includes(searchKey) || category.includes(searchKey)) {
        // 如果有筛选类型，还需要匹配类型
        if (filterType === 'all') {
          return true;
        } else if (filterType === 'expense') {
          return t.type === 'expense' || t.type === 'transfer';
        } else if (filterType === 'income') {
          return t.type === 'income';
        }
      }
      return false;
    });

    // 格式化显示数据
    results = results.map(t => ({
      ...t,
      displayAmount: parseFloat(t.amount).toFixed(2),
      displayDate: this.formatDate(t.date)
    }));

    // 按日期排序，最新的在前
    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    this.setData({
      searchResults: results,
      hasSearched: true,
      isEmpty: results.length === 0
    });

    // 保存搜索历史
    this.saveSearchHistory(keyword);
  },

  // 格式化日期
  formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (diff < oneDay && date.getDate() === now.getDate()) {
      // 今天
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `今天 ${hours}:${minutes}`;
    } else if (diff < oneDay * 2) {
      return '昨天';
    } else if (diff < oneDay * 7) {
      return `${Math.floor(diff / oneDay)}天前`;
    } else {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}-${day}`;
    }
  },

  // 按回车搜索
  onSearchConfirm() {
    this.doSearch();
  },

  // 点击结果项
  onResultTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '账单详情',
      icon: 'none',
      duration: 1500
    });
  },

  // 高亮关键词
  highlightKeyword(text, keyword) {
    if (!keyword) return text;
    const textLower = text.toLowerCase();
    const keywordLower = keyword.toLowerCase();
    const index = textLower.indexOf(keywordLower);
    if (index === -1) return [{ text, isHighlight: false }];
    
    const parts = [];
    if (index > 0) {
      parts.push({ text: text.slice(0, index), isHighlight: false });
    }
    parts.push({ text: text.slice(index, index + keyword.length), isHighlight: true });
    if (index + keyword.length < text.length) {
      parts.push({ text: text.slice(index + keyword.length), isHighlight: false });
    }
    return parts;
  },

  // 格式化金额
  formatAmount(amount) {
    const num = parseFloat(amount);
    return num.toFixed(2);
  }
});
