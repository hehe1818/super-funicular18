// index.ts
const app = getApp<IAppOption>()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

interface Item {
  id: number
  value: string
}

Component({
  data: {
    // 登录相关
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    isLoggedIn: false,
    
    // 数据输入相关
    inputValue: '',
    batchText: '',
    showBatchInput: false,
    items: [] as Item[],
    itemCount: 0,
    
    // 抽取相关
    drawCount: 1,
    drawCountOptions: [1, 2, 3, 5, 10],
    drawCountIndex: 0,
    showCustomCount: false,
    customCount: '',
    
    // 结果相关
    drawResult: [] as Item[],
    hasDrawn: false,
    isDrawing: false,
  },

  lifetimes: {
    attached() {
      this.updateLoginState()
    },
  },

  pageLifetimes: {
    show() {
      this.updateLoginState()
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({ selected: 0 })
      }
    },
  },

  methods: {
    /**
     * 更新登录状态
     */
    updateLoginState() {
      const { userInfo, isLoggedIn } = app.globalData
      this.setData({
        isLoggedIn,
        userInfo: userInfo || {
          avatarUrl: defaultAvatarUrl,
          nickName: '',
        },
      })
    },

    /**
     * 跳转到登录页面
     */
    goToLogin() {
      wx.navigateTo({
        url: '../login/login',
      })
    },

    // ============ 数据输入相关方法 ============

    /**
     * 单条输入框内容变化
     */
    onInputChange(e: any) {
      this.setData({
        inputValue: e.detail.value,
      })
    },

    /**
     * 批量输入框内容变化
     */
    onBatchInputChange(e: any) {
      this.setData({
        batchText: e.detail.value,
      })
    },

    /**
     * 添加单条数据
     */
    addSingleItem() {
      const { inputValue, items } = this.data
      const trimmed = inputValue.trim()
      
      if (!trimmed) {
        wx.showToast({ title: '请输入内容', icon: 'none' })
        return
      }
      
      const newItem: Item = {
        id: Date.now(),
        value: trimmed,
      }
      
      this.setData({
        items: [...items, newItem],
        itemCount: items.length + 1,
        inputValue: '',
      })
      
      this.checkDrawCountOptions()
    },

    /**
     * 批量添加数据
     */
    addBatchItems() {
      const { batchText, items } = this.data
      const lines = batchText.split('\n').map(l => l.trim()).filter(l => l)
      
      if (lines.length === 0) {
        wx.showToast({ title: '请输入内容', icon: 'none' })
        return
      }
      
      const newItems: Item[] = lines.map((line, index) => ({
        id: Date.now() + index,
        value: line,
      }))
      
      this.setData({
        items: [...items, ...newItems],
        itemCount: items.length + newItems.length,
        batchText: '',
        showBatchInput: false,
      })
      
      this.checkDrawCountOptions()
      
      wx.showToast({
        title: `已添加${lines.length}条`,
        icon: 'success',
      })
    },

    /**
     * 切换批量输入模式
     */
    toggleBatchInput() {
      this.setData({
        showBatchInput: !this.data.showBatchInput,
      })
    },

    /**
     * 删除单条数据
     */
    deleteItem(e: any) {
      const id = Number(e.currentTarget.dataset.id)
      const newItems = this.data.items.filter(item => item.id !== id)
      
      this.setData({
        items: newItems,
        itemCount: newItems.length,
        drawResult: [],
        hasDrawn: false,
      })
      
      this.checkDrawCountOptions()
    },

    /**
     * 清空所有数据
     */
    clearAllItems() {
      if (this.data.items.length === 0) return
      
      wx.showModal({
        title: '确认清空',
        content: '确定要清空所有数据吗？',
        success: (res) => {
          if (res.confirm) {
            this.setData({
              items: [],
              itemCount: 0,
              inputValue: '',
              batchText: '',
              drawResult: [],
              hasDrawn: false,
              drawCount: 1,
              drawCountIndex: 0,
              drawCountOptions: [1, 2, 3, 5, 10],
            })
          }
        },
      })
    },

    /**
     * 检查并更新抽取数量选项
     */
    checkDrawCountOptions() {
      const { items, drawCount } = this.data
      const maxCount = items.length
      
      if (maxCount === 0) {
        this.setData({
          drawCount: 1,
          drawCountIndex: 0,
          drawCountOptions: [1, 2, 3, 5, 10],
        })
        return
      }
      
      // 根据数据总数动态调整可选数量
      const baseOptions = [1, 2, 3, 5, 10]
      let options = baseOptions.filter(n => n <= maxCount)
      
      // 确保1在选项中
      if (!options.includes(1)) options = [1, ...options]
      
      // 当数据量较大时，添加一些常用数量
      if (maxCount >= 20 && !options.includes(20)) options.push(20)
      if (maxCount >= 50 && !options.includes(50)) options.push(50)
      
      // 添加最大值选项（如果不在预设中且不为1）
      if (maxCount > 1 && !options.includes(maxCount)) options.push(maxCount)
      
      // 排序确保选项按升序显示
      options.sort((a, b) => a - b)
      
      const newDrawCount = Math.min(drawCount, maxCount)
      const newIndex = options.indexOf(newDrawCount)
      
      this.setData({
        drawCountOptions: options,
        drawCount: newDrawCount,
        drawCountIndex: newIndex >= 0 ? newIndex : 0,
      })
    },

    // ============ 抽取相关方法 ============

    /**
     * 选择抽取数量
     */
    onDrawCountChange(e: any) {
      const index = Number(e.detail.value)
      const count = this.data.drawCountOptions[index]
      
      this.setData({
        drawCountIndex: index,
        drawCount: count,
      })
    },

    /**
     * 显示自定义数量输入
     */
    showCustomCountInput() {
      this.setData({
        showCustomCount: true,
        customCount: String(this.data.drawCount),
      })
    },

    /**
     * 隐藏自定义数量输入
     */
    hideCustomCountInput() {
      this.setData({
        showCustomCount: false,
      })
    },

    /**
     * 自定义数量输入
     */
    onCustomCountInput(e: any) {
      this.setData({
        customCount: e.detail.value,
      })
    },

    /**
     * 确认自定义数量
     */
    confirmCustomCount() {
      const { customCount, items } = this.data
      const count = Number(customCount)
      
      if (!count || count < 1) {
        wx.showToast({ title: '请输入有效数字', icon: 'none' })
        return
      }
      
      if (count > items.length) {
        wx.showToast({ title: `最多只能抽${items.length}个`, icon: 'none' })
        return
      }
      
      this.setData({
        drawCount: count,
        showCustomCount: false,
      })
    },

    /**
     * 执行随机抽取（Fisher-Yates洗牌算法）
     */
    doDraw() {
      const { items, drawCount } = this.data
      
      if (items.length === 0) {
        wx.showToast({ title: '请先添加数据', icon: 'none' })
        return
      }
      
      if (drawCount > items.length) {
        wx.showToast({ title: `最多只能抽${items.length}个`, icon: 'none' })
        return
      }
      
      if (this.data.isDrawing) return
      
      // 开始动画状态
      this.setData({ isDrawing: true })
      
      // 使用Fisher-Yates洗牌算法
      const shuffled = [...items]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = shuffled[i]
        shuffled[i] = shuffled[j]
        shuffled[j] = temp
      }
      
      // 延迟展示结果，产生动画效果
      setTimeout(() => {
        const result = shuffled.slice(0, drawCount)
        this.setData({
          drawResult: result,
          hasDrawn: true,
          isDrawing: false,
        })
        
        wx.showToast({
          title: '抽取完成',
          icon: 'success',
        })
      }, 500)
    },

    /**
     * 重新抽取（相同数量）
     */
    redraw() {
      this.doDraw()
    },

    /**
     * 重置结果
     */
    resetResult() {
      this.setData({
        drawResult: [],
        hasDrawn: false,
      })
    },
  },
})
