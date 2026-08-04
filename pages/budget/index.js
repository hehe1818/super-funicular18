// pages/budget/index.js

const storage = require('../../utils/storage.js');

Page({
  data: {
    // 预算数据
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    totalBudget: '0.00',
    totalUsed: '0.00',
    totalRemaining: '0.00',
    totalPercentage: '0.0',
    totalProgressWidth: '0.0',
    totalProgressBg: 'linear-gradient(90deg, #7EB8A0, #A5D4BE)',
    showProgressWarning: false,
    showAlertOver: false,
    showAlertWarning: false,
    isTotalOverBudget: false,
    categoryDetails: [],
    
    // 总预算弹窗
    showTotalModal: false,
    tempTotalBudget: '',
    
    // 分类预算弹窗
    showCategoryModal: false,
    editCategory: '',
    editCategoryIcon: '',
    editCategoryColor: '',
    editCategoryUsed: '0.00',
    tempCategoryBudget: ''
  },

  onLoad() {
    this.loadBudgetData();
  },

  onShow() {
    this.loadBudgetData();
  },

  // 加载预算数据
  loadBudgetData() {
    const usage = storage.getBudgetUsage();
    
    // 计算总进度条显示值
    const totalPercentageNum = usage.totalPercentage;
    const totalProgressWidth = totalPercentageNum > 100 ? 100 : totalPercentageNum;
    let totalProgressBg = 'linear-gradient(90deg, #7EB8A0, #A5D4BE)';
    if (totalPercentageNum >= 100) {
      totalProgressBg = '#EA2027';
    } else if (totalPercentageNum >= 80) {
      totalProgressBg = '#F39C12';
    }
    
    // 格式化数据
    const categoryDetails = usage.categoryDetails.map(item => {
      const remaining = item.budget - item.used;
      let statusText = '正常';
      if (item.status === 'over') {
        statusText = '已超支';
      } else if (item.status === 'warning') {
        statusText = '即将超支';
      }
      let progressBg = item.color;
      if (item.status === 'over') {
        progressBg = '#EA2027';
      } else if (item.status === 'warning') {
        progressBg = '#F39C12';
      }
      let percentageClass = '';
      if (item.status === 'over') {
        percentageClass = 'percentageOver';
      } else if (item.status === 'warning') {
        percentageClass = 'percentageWarning';
      }
      let remainingClass = '';
      if (item.status === 'over') {
        remainingClass = 'remainingOver';
      }
      let cardClass = '';
      if (item.status === 'over') {
        cardClass = 'categoryOver';
      } else if (item.status === 'warning') {
        cardClass = 'categoryWarning';
      }
      return {
        ...item,
        percentage: item.percentage.toFixed(1),
        budget: item.budget.toFixed(2),
        used: item.used.toFixed(2),
        remaining: remaining.toFixed(2),
        remainingAmount: remaining >= 0 ? remaining.toFixed(2) : '0.00',
        overspentAmount: remaining < 0 ? Math.abs(remaining).toFixed(2) : '0.00',
        hasBudget: item.budget > 0,
        displayPercentage: item.percentage > 100 ? 100 : item.percentage,
        statusText: statusText,
        progressBg: progressBg,
        percentageClass: percentageClass,
        remainingClass: remainingClass,
        cardClass: cardClass
      };
    });
    
    this.setData({
      year: usage.year,
      month: usage.month,
      totalBudget: usage.totalBudget.toFixed(2),
      totalUsed: usage.totalUsed.toFixed(2),
      totalRemaining: usage.totalRemaining.toFixed(2),
      totalPercentage: usage.totalPercentage.toFixed(1),
      totalProgressWidth: totalProgressWidth.toFixed(1),
      totalProgressBg: totalProgressBg,
      showProgressWarning: totalPercentageNum >= 80,
      showAlertOver: totalPercentageNum >= 100,
      showAlertWarning: totalPercentageNum >= 80 && totalPercentageNum < 100,
      isTotalOverBudget: usage.totalRemaining < 0,
      categoryDetails
    });
    
    // 绘制环形图
    wx.nextTick(() => {
      this.drawRingChart(usage.totalPercentage);
    });
  },

  // 绘制环形进度图
  drawRingChart(percentage) {
    const ctx = wx.createCanvasContext('totalRing');
    const centerX = 80;
    const centerY = 80;
    const radius = 65;
    const lineWidth = 12;
    
    // 清除画布
    ctx.clearRect(0, 0, 160, 160);
    
    // 绘制背景圆环
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.setStrokeStyle('rgba(255, 255, 255, 0.3)');
    ctx.setLineWidth(lineWidth);
    ctx.setLineCap('round');
    ctx.stroke();
    
    // 绘制进度圆环
    if (percentage > 0) {
      const startAngle = -Math.PI / 2;
      let endAngle = startAngle + (percentage / 100) * Math.PI * 2;
      
      // 根据百分比选择颜色
      let color = '#FFFFFF';
      if (percentage >= 100) {
        color = '#EA2027';
      } else if (percentage >= 80) {
        color = '#F39C12';
      }
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.setStrokeStyle(color);
      ctx.setLineWidth(lineWidth);
      ctx.setLineCap('round');
      ctx.stroke();
    }
    
    ctx.draw();
  },

  // 编辑总预算
  onEditTotalBudget() {
    this.setData({
      showTotalModal: true,
      tempTotalBudget: this.data.totalBudget
    });
  },

  // 关闭总预算弹窗
  onCloseTotalModal() {
    this.setData({ showTotalModal: false });
  },

  // 总预算输入
  onTotalBudgetInput(e) {
    this.setData({ tempTotalBudget: e.detail.value });
  },

  // 快速选择总预算金额
  onQuickTotalBudget(e) {
    const amount = e.currentTarget.dataset.amount;
    this.setData({ tempTotalBudget: amount });
  },

  // 保存总预算
  onSaveTotalBudget() {
    const amount = parseFloat(this.data.tempTotalBudget);
    if (!amount || amount <= 0) {
      wx.showToast({
        title: '请输入有效金额',
        icon: 'none'
      });
      return;
    }
    
    storage.updateTotalBudget(amount);
    
    this.setData({ showTotalModal: false });
    
    wx.showToast({
      title: '预算已更新',
      icon: 'success'
    });
    
    this.loadBudgetData();
  },

  // 编辑分类预算
  onEditCategoryBudget(e) {
    const category = e.currentTarget.dataset.category;
    const item = this.data.categoryDetails.find(c => c.category === category);
    
    if (!item) return;
    
    this.setData({
      showCategoryModal: true,
      editCategory: category,
      editCategoryIcon: item.icon,
      editCategoryColor: item.color,
      editCategoryUsed: item.used,
      tempCategoryBudget: item.budget
    });
  },

  // 关闭分类预算弹窗
  onCloseCategoryModal() {
    this.setData({ showCategoryModal: false });
  },

  // 分类预算输入
  onCategoryBudgetInput(e) {
    this.setData({ tempCategoryBudget: e.detail.value });
  },

  // 快速选择分类预算金额
  onQuickCategoryBudget(e) {
    const amount = e.currentTarget.dataset.amount;
    this.setData({ tempCategoryBudget: amount });
  },

  // 保存分类预算
  onSaveCategoryBudget() {
    const amount = parseFloat(this.data.tempCategoryBudget);
    const category = this.data.editCategory;
    
    if (!amount || amount < 0) {
      wx.showToast({
        title: '请输入有效金额',
        icon: 'none'
      });
      return;
    }
    
    storage.updateCategoryBudget(category, amount);
    
    this.setData({ showCategoryModal: false });
    
    wx.showToast({
      title: `${category}预算已更新`,
      icon: 'success'
    });
    
    this.loadBudgetData();
  },

  // 新增分类
  onAddCategory() {
    wx.showModal({
      title: '新增分类预算',
      editable: true,
      placeholderText: '输入分类名称',
      success: (res) => {
        if (res.confirm && res.content) {
          const categoryName = res.content.trim();
          if (!categoryName) return;
          
          // 检查分类是否已存在
          const config = storage.getBudgetConfig();
          if (config.categories[categoryName]) {
            wx.showToast({
              title: '分类已存在',
              icon: 'none'
            });
            return;
          }
          
          // 添加新分类，默认预算为0
          storage.updateCategoryBudget(categoryName, 0);
          
          wx.showToast({
            title: '分类已添加',
            icon: 'success'
          });
          
          this.loadBudgetData();
          
          // 自动打开编辑
          setTimeout(() => {
            const newItem = this.data.categoryDetails.find(c => c.category === categoryName);
            if (newItem) {
              this.setData({
                showCategoryModal: true,
                editCategory: categoryName,
                editCategoryIcon: newItem.icon,
                editCategoryColor: newItem.color,
                editCategoryUsed: newItem.used,
                tempCategoryBudget: newItem.budget
              });
            }
          }, 500);
        }
      }
    });
  }
});
