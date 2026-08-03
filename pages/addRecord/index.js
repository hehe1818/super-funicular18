// pages/addRecord/index.js

const storage = require('../../utils/storage.js');

const expenseCategoryGroups = [
  {
    groupName: '日常消费',
    categories: [
      { id: '1', name: '餐饮', icon: '🍜' },
      { id: '2', name: '交通', icon: '🚌' },
      { id: '3', name: '购物', icon: '🛍️' },
      { id: '4', name: '居家', icon: '🏠' },
      { id: '5', name: '服饰', icon: '👕' },
      { id: '6', name: '美容', icon: '💄' },
      { id: '7', name: '医疗', icon: '💊' },
      { id: '8', name: '其他', icon: '📌' }
    ]
  },
  {
    groupName: '休闲娱乐',
    categories: [
      { id: '9', name: '游戏充值', icon: '🎮' },
      { id: '10', name: '聚会吃饭', icon: '🍽️' },
      { id: '11', name: '视频会员', icon: '📺' },
      { id: '12', name: '运动健身', icon: '🏀' },
      { id: '13', name: '电影', icon: '🎬' },
      { id: '14', name: '旅行', icon: '✈️' }
    ]
  },
  {
    groupName: '学习进修',
    categories: [
      { id: '15', name: '学习工具', icon: '🖊️' },
      { id: '16', name: '辅导书', icon: '📖' },
      { id: '17', name: '培训进修', icon: '🎓' },
      { id: '18', name: '数码装备', icon: '💻' },
      { id: '19', name: '书报杂志', icon: '📰' }
    ]
  },
  {
    groupName: '交流通讯',
    categories: [
      { id: '20', name: '手机话费', icon: '📱' },
      { id: '21', name: '座机费', icon: '☎️' },
      { id: '22', name: '网络费用', icon: '🌐' },
      { id: '23', name: '邮寄快递', icon: '📮' }
    ]
  },
  {
    groupName: '恋爱基金',
    categories: [
      { id: '24', name: '礼物', icon: '🎁' },
      { id: '25', name: '酒店', icon: '🏨' },
      { id: '26', name: '红包', icon: '🧧' },
      { id: '27', name: '一起旅游', icon: '🧳' },
      { id: '28', name: '一起吃饭', icon: '💕' }
    ]
  },
  {
    groupName: '其他消费',
    categories: [
      { id: '29', name: '宠物', icon: '🐶' },
      { id: '30', name: '母婴', icon: '🍼' },
      { id: '31', name: '公益', icon: '❤️' },
      { id: '32', name: '其他', icon: '📌' }
    ]
  }
];

// 扁平化的支出分类列表（用于查找）
const expenseCategories = expenseCategoryGroups.reduce((acc, g) => acc.concat(g.categories), []);

const incomeCategoryGroups = [
  {
    groupName: '收入来源',
    categories: [
      { id: '1', name: '生活费', icon: '💰' },
      { id: '2', name: '兼职', icon: '💼' },
      { id: '3', name: '红包', icon: '🧧' },
      { id: '4', name: '奖学金', icon: '🏆' },
      { id: '5', name: '礼金', icon: '🎁' },
      { id: '6', name: '退款', icon: '↩️' },
      { id: '7', name: '理财', icon: '📈' },
      { id: '8', name: '工资', icon: '💵' }
    ]
  },
  {
    groupName: '其他收入',
    categories: [
      { id: '9', name: '稿费', icon: '✍️' },
      { id: '10', name: '转账', icon: '💸' },
      { id: '11', name: '其他', icon: '📌' }
    ]
  }
];

const incomeCategories = incomeCategoryGroups.reduce((acc, g) => acc.concat(g.categories), []);

const transferCategories = [
  { id: '1', name: '转账', icon: '💸' },
  { id: '2', name: '还款', icon: '💳' },
  { id: '3', name: '充值', icon: '📱' },
  { id: '4', name: '其他', icon: '📌' }
];

const accounts = [
  { id: '1', name: '现金(CNY)', icon: '💵' },
  { id: '2', name: '微信钱包', icon: '💚' },
  { id: '3', name: '支付宝', icon: '💙' },
  { id: '4', name: '银行卡', icon: '💳' },
  { id: '5', name: '信用卡', icon: '💎' }
];

function getTodayDate() {
  const now = new Date();
  return `今天${now.getMonth() + 1}月${now.getDate()}日`;
}

function getFullDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getCurrentDateTime() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

Page({
  data: {
    recordType: 'expense',
    amount: '0.00',
    expression: '',
    showExpression: false,
    selectedCategory: '',
    selectedCategoryData: null,
    note: '',
    todayDate: getTodayDate(),
    selectedDate: getFullDate(),
    currentCategories: expenseCategories,
    currentCategoryGroups: expenseCategoryGroups,
    accounts: accounts,
    selectedAccount: '现金(CNY)',
    showCategoryModal: false,
    showAccountModal: false,
    showNoteInput: false,
    noteFocus: false,
    // 计算器内部状态
    _currentInput: '0',
    _previousValue: null,
    _operator: null,
    _waitingForOperand: false
  },

  onLoad() {
    this.setData({
      todayDate: getTodayDate(),
      selectedDate: getFullDate()
    });
  },

  onShow() {
    this.setData({
      todayDate: getTodayDate()
    });
  },

  // 类型切换
  onTypeChange(e) {
    const type = e.currentTarget.dataset.type;
    let categories = expenseCategories;
    let categoryGroups = expenseCategoryGroups;
    if (type === 'income') {
      categories = incomeCategories;
      categoryGroups = incomeCategoryGroups;
    } else if (type === 'transfer') {
      categories = transferCategories;
      categoryGroups = [{ groupName: '转账类型', categories: transferCategories }];
    }
    this.setData({
      recordType: type,
      currentCategories: categories,
      currentCategoryGroups: categoryGroups,
      selectedCategory: '',
      selectedCategoryData: null
    });
  },

  // 计算两个数的结果
  calculate(a, b, operator) {
    a = parseFloat(a);
    b = parseFloat(b);
    let result = 0;
    switch (operator) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = b !== 0 ? a / b : 0; break;
    }
    // 保留两位小数
    return Math.round(result * 100) / 100;
  },

  // 运算符显示符号
  getOperatorSymbol(op) {
    switch (op) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
      default: return op;
    }
  },

  // 键盘按键
  onKeyTap(e) {
    const key = e.currentTarget.dataset.key;
    let { _currentInput, _previousValue, _operator, _waitingForOperand, expression, showExpression } = this.data;

    if (key === 'backspace') {
      // 退格
      if (_waitingForOperand) {
        // 如果正在等待操作数，删除运算符
        _operator = null;
        _waitingForOperand = false;
        _previousValue = null;
        expression = '';
        showExpression = false;
        _currentInput = '0';
      } else {
        // 删除最后一个字符
        if (_currentInput.length > 1) {
          _currentInput = _currentInput.slice(0, -1);
        } else {
          _currentInput = '0';
        }
      }
    } else if (key === '+') {
      // 加法
      if (_operator && !_waitingForOperand) {
        // 如果已经有运算符且不是等待状态，先计算
        const result = this.calculate(_previousValue, _currentInput, _operator);
        _previousValue = result.toString();
        _currentInput = result.toString();
      } else {
        _previousValue = _currentInput;
      }
      _operator = '+';
      _waitingForOperand = true;
      expression = `${_previousValue} ${this.getOperatorSymbol('+')}`;
      showExpression = true;
    } else if (key === '-') {
      // 减法
      if (_operator && !_waitingForOperand) {
        const result = this.calculate(_previousValue, _currentInput, _operator);
        _previousValue = result.toString();
        _currentInput = result.toString();
      } else {
        _previousValue = _currentInput;
      }
      _operator = '-';
      _waitingForOperand = true;
      expression = `${_previousValue} ${this.getOperatorSymbol('-')}`;
      showExpression = true;
    } else if (key === '*') {
      // 乘法
      if (_operator && !_waitingForOperand) {
        const result = this.calculate(_previousValue, _currentInput, _operator);
        _previousValue = result.toString();
        _currentInput = result.toString();
      } else {
        _previousValue = _currentInput;
      }
      _operator = '*';
      _waitingForOperand = true;
      expression = `${_previousValue} ${this.getOperatorSymbol('*')}`;
      showExpression = true;
    } else if (key === '/') {
      // 除法
      if (_operator && !_waitingForOperand) {
        const result = this.calculate(_previousValue, _currentInput, _operator);
        _previousValue = result.toString();
        _currentInput = result.toString();
      } else {
        _previousValue = _currentInput;
      }
      _operator = '/';
      _waitingForOperand = true;
      expression = `${_previousValue} ${this.getOperatorSymbol('/')}`;
      showExpression = true;
    } else if (key === '.') {
      // 小数点
      if (_waitingForOperand) {
        _currentInput = '0';
        _waitingForOperand = false;
      }
      if (!_currentInput.includes('.')) {
        _currentInput = _currentInput + '.';
      }
    } else {
      // 数字
      if (_waitingForOperand) {
        _currentInput = '0';
        _waitingForOperand = false;
        expression = '';
        showExpression = false;
      }
      // 限制小数点后两位
      if (_currentInput.includes('.')) {
        const decimalPart = _currentInput.split('.')[1] || '';
        if (decimalPart.length >= 2) {
          return;
        }
      }
      // 防止整数部分过长
      if (_currentInput === '0') {
        _currentInput = key;
      } else {
        _currentInput = _currentInput + key;
      }
    }

    // 更新显示的金额
    let displayAmount = _currentInput;
    // 去掉末尾的0和多余的小数点
    if (displayAmount.includes('.')) {
      displayAmount = parseFloat(displayAmount).toFixed(2);
    } else {
      displayAmount = displayAmount + '.00';
    }

    this.setData({
      _currentInput,
      _previousValue,
      _operator,
      _waitingForOperand,
      expression,
      showExpression,
      amount: displayAmount
    });
  },

  // 点击分类
  onCategorySelect() {
    this.setData({ showCategoryModal: true });
  },

  onCloseCategoryModal() {
    this.setData({ showCategoryModal: false });
  },

  onCategoryItemSelect(e) {
    const id = e.currentTarget.dataset.id;
    const category = this.data.currentCategories.find(c => c.id === id);
    this.setData({
      selectedCategory: id,
      selectedCategoryData: category,
      showCategoryModal: false
    });
  },

  // 点击账户
  onAccountSelect() {
    this.setData({ showAccountModal: true });
  },

  onCloseAccountModal() {
    this.setData({ showAccountModal: false });
  },

  onAccountItemSelect(e) {
    const name = e.currentTarget.dataset.name;
    this.setData({
      selectedAccount: name,
      showAccountModal: false
    });
  },

  // 日期选择
  onDateChange(e) {
    const date = e.detail.value;
    const d = new Date(date);
    this.setData({
      selectedDate: date,
      todayDate: `${d.getMonth() + 1}月${d.getDate()}日`
    });
  },

  // 备注输入
  onNoteFocus() {
    this.setData({
      showNoteInput: true,
      noteFocus: true
    });
  },

  onNoteBlur() {
    this.setData({
      showNoteInput: false,
      noteFocus: false
    });
  },

  onNoteInput(e) {
    this.setData({ note: e.detail.value });
  },

  // 标签点击
  onTagTap(e) {
    const tag = e.currentTarget.dataset.tag;
    const currentNote = this.data.note;
    const newNote = currentNote ? `${currentNote} #${tag}` : `#${tag}`;
    this.setData({ note: newNote });
  },

  // 拍照
  onPhotoClick() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        wx.showToast({ title: '拍照成功', icon: 'success' });
      },
      fail: () => {
        wx.showToast({ title: '已取消', icon: 'none' });
      }
    });
  },

  // 提交
  onSubmit() {
    let { _currentInput, _previousValue, _operator, _waitingForOperand, amount, selectedCategoryData, recordType, note } = this.data;

    // 计算最终结果
    let finalAmount = parseFloat(amount);
    if (_operator && _previousValue !== null && !_waitingForOperand) {
      // 完成最后的计算
      const result = this.calculate(_previousValue, _currentInput, _operator);
      finalAmount = result;
    } else if (_operator && _previousValue !== null && _waitingForOperand) {
      // 如果正在等待操作数，使用之前的值作为结果
      finalAmount = parseFloat(_previousValue);
    }

    if (finalAmount === 0) {
      wx.showToast({ title: '请输入金额', icon: 'none' });
      return;
    }
    if (!selectedCategoryData) {
      wx.showToast({ title: '请选择分类', icon: 'none' });
      return;
    }

    const transaction = {
      type: recordType,
      amount: finalAmount.toFixed(2),
      category: selectedCategoryData.name,
      categoryIcon: selectedCategoryData.icon,
      note: note || '',
      date: getCurrentDateTime()
    };

    storage.addTransaction(transaction);

    wx.showToast({ title: '记账成功', icon: 'success' });

    // 重置表单和计算器
    this.setData({
      amount: '0.00',
      expression: '',
      showExpression: false,
      selectedCategory: '',
      selectedCategoryData: null,
      note: '',
      showNoteInput: false,
      _currentInput: '0',
      _previousValue: null,
      _operator: null,
      _waitingForOperand: false
    });

    setTimeout(() => {
      wx.switchTab({ url: '/pages/home/index' });
    }, 1500);
  }
});
