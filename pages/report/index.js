// pages/report/index.js

const storage = require('../../utils/storage.js');

Page({
  data: {
    yearRange: [['2025', '2026'], ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']],
    dateIndex: [1, 6],
    currentYear: 2026,
    currentMonth: 7,
    displayDate: '2026年7月',
    granularity: 'day', // 'day' - 按日统计, 'month' - 按月统计
    summaryData: {
      income: '0.00',
      expense: '0.00',
      balance: '0.00',
      trendData: {
        expense: [],
        income: []
      },
      trendLabels: [],
      granularity: 'day'
    },
    categoryStats: [],
    chartType: 'expense',
    canvasWidth: 320,
    canvasHeight: 200,
    isRefreshing: false
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync();
    const screenWidth = sysInfo.windowWidth;
    const canvasWidth = screenWidth - 48;
    const canvasHeight = 200;
    
    this.setData({
      canvasWidth: canvasWidth,
      canvasHeight: canvasHeight
    });
    
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const { currentYear, currentMonth, granularity } = this.data;
    const data = storage.getReportData(currentYear, currentMonth, granularity);
    
    this.setData({
      summaryData: data,
      categoryStats: data.categoryStats
    });
    
    // 确保 canvas 渲染完成后再绘制
    wx.nextTick(() => {
      this.drawChart();
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

  onGranularityChange(e) {
    const granularity = e.currentTarget.dataset.type;
    if (granularity === this.data.granularity) return;
    
    this.setData({ granularity });
    this.loadData();
  },

  drawChart() {
    const ctx = wx.createCanvasContext('trendChart');
    const data = this.data.summaryData;
    
    if (!data || !data.trendData) return;

    const trendKey = this.data.chartType === 'expense' ? 'expense' : 'income';
    const values = data.trendData[trendKey];
    const labels = data.trendLabels || [];
    const width = this.data.canvasWidth;
    const height = this.data.canvasHeight;
    
    if (width <= 0 || height <= 0) return;
    if (!values || values.length === 0) return;

    const padding = { top: 20, right: 15, bottom: 35, left: 45 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // 找到最大值，确保图表有意义
    const maxVal = Math.max(...values);
    const maxValue = maxVal > 0 ? Math.ceil(maxVal * 1.2) : 10;
    const stepX = values.length > 1 ? chartWidth / (values.length - 1) : 0;

    // 清除画布
    ctx.clearRect(0, 0, width, height);

    // 绘制背景网格
    ctx.setStrokeStyle('#F0F2F1');
    ctx.setLineWidth(0.5);
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // 绘制Y轴刻度
    ctx.setFillStyle('#86909C');
    ctx.setFontSize(10);
    ctx.setTextAlign('right');
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      const value = Math.round(maxValue - (maxValue / 4) * i);
      ctx.fillText(value.toString(), padding.left - 5, y + 3);
    }
    ctx.setTextAlign('left');

    // 绘制X轴标签
    ctx.setFillStyle('#86909C');
    ctx.setFontSize(10);
    
    // 根据数据长度决定显示策略
    const totalPoints = values.length;
    let labelStep = 1;
    if (totalPoints > 12) {
      // 数据点多时，每隔几个显示一个标签
      labelStep = Math.ceil(totalPoints / 10);
    }
    
    for (let i = 0; i < totalPoints; i++) {
      // 只显示部分标签以避免重叠
      if (i % labelStep !== 0 && i !== totalPoints - 1) continue;
      
      const x = padding.left + stepX * i;
      ctx.setTextAlign('center');
      ctx.fillText(labels[i] || `${i + 1}`, x, height - padding.bottom + 15);
    }
    ctx.setTextAlign('left');

    // 绘制坐标轴
    ctx.setStrokeStyle('#E5E6EB');
    ctx.setLineWidth(1);
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    // 绘制折线
    const lineColor = this.data.chartType === 'expense' ? '#FF9F43' : '#7EB8A0';
    const gradientColor = this.data.chartType === 'expense' ? '255, 159, 67' : '126, 184, 160';

    // 先绘制渐变填充区域
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
    gradient.addColorStop(0, `rgba(${gradientColor}, 0.25)`);
    gradient.addColorStop(1, `rgba(${gradientColor}, 0.02)`);
    
    ctx.beginPath();
    values.forEach((value, index) => {
      const x = padding.left + stepX * index;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    // 闭合路径到底部
    ctx.lineTo(padding.left + stepX * (values.length - 1), padding.top + chartHeight);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.closePath();
    ctx.setFillStyle(gradient);
    ctx.fill();

    // 再绘制折线
    ctx.beginPath();
    ctx.setStrokeStyle(lineColor);
    ctx.setLineWidth(2);
    ctx.setLineCap('round');
    ctx.setLineJoin('round');
    
    values.forEach((value, index) => {
      const x = padding.left + stepX * index;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // 绘制数据点
    values.forEach((value, index) => {
      const x = padding.left + stepX * index;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      
      // 外圈
      ctx.beginPath();
      ctx.setFillStyle(lineColor);
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // 内圈白色
      ctx.beginPath();
      ctx.setFillStyle('#FFFFFF');
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    });

    ctx.draw();
  },

  onPrevMonth() {
    let year = this.data.currentYear;
    let month = this.data.currentMonth - 1;
    
    if (month < 1) {
      month = 12;
      year--;
    }
    
    this.updateDate(year, month);
  },

  onNextMonth() {
    let year = this.data.currentYear;
    let month = this.data.currentMonth + 1;
    
    if (month > 12) {
      month = 1;
      year++;
    }
    
    this.updateDate(year, month);
  },

  onDateChange(e) {
    const index = e.detail.value;
    const year = this.data.yearRange[0][index[0]];
    const month = this.data.yearRange[1][index[1]];
    
    this.updateDate(parseInt(year), parseInt(month));
  },

  onColumnChange(e) {
    // 可以处理列变化
  },

  updateDate(year, month) {
    const { granularity } = this.data;
    let displayDate = `${year}年${month}月`;
    if (granularity === 'day') {
      displayDate = `${year}年${month}月`;
    } else {
      displayDate = `${year}年`;
    }
    
    this.setData({
      currentYear: year,
      currentMonth: month,
      displayDate: displayDate,
      dateIndex: [year === 2026 ? 1 : 0, month - 1]
    });
    this.loadData();
  },

  onChartTypeChange(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ chartType: type });
    wx.nextTick(() => {
      this.drawChart();
    });
  },

  onChartTouchStart(e) {
    this.handleChartTouch(e);
  },

  onChartTouchMove(e) {
    this.handleChartTouch(e);
  },

  handleChartTouch(e) {
    const touch = e.touches[0];
    const x = touch.x;
    const y = touch.y;
    
    const data = this.data.summaryData;
    if (!data || !data.trendData) return;
    
    const trendKey = this.data.chartType === 'expense' ? 'expense' : 'income';
    const values = data.trendData[trendKey];
    const labels = data.trendLabels || [];
    const paddingLeft = 45;
    const paddingRight = 15;
    const chartWidth = this.data.canvasWidth - paddingLeft - paddingRight;
    const stepX = values.length > 1 ? chartWidth / (values.length - 1) : 0;
    
    const index = Math.round((x - paddingLeft) / stepX);
    
    if (index >= 0 && index < values.length) {
      const value = values[index];
      const label = labels[index] || '';
      const { granularity, currentYear, currentMonth } = this.data;
      
      let title = '';
      if (granularity === 'day') {
        title = `${currentYear}年${currentMonth}月${index + 1}日: ¥${value.toFixed(2)}`;
      } else {
        title = `${label}: ¥${value.toFixed(2)}`;
      }
      
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 1500
      });
    }
  }
});
