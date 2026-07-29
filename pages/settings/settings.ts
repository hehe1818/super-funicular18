// settings.ts
const app = getApp<IAppOption>()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({
  data: {
    userInfo: null as UserInfo | null,
    isLoggedIn: false,
    loginTime: '',
    version: '1.0.0',
  },

  lifetimes: {
    attached() {
      this.loadUserInfo()
    },
  },

  pageLifetimes: {
    show() {
      this.loadUserInfo()
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({ selected: 1 })
      }
    },
  },

  methods: {
    /**
     * 加载用户信息
     */
    loadUserInfo() {
      const { userInfo, isLoggedIn } = app.globalData
      this.setData({
        isLoggedIn: !!isLoggedIn,
        userInfo: userInfo || null,
        loginTime: isLoggedIn ? this.formatLoginTime() : '',
      })
    },

    /**
     * 格式化登录时间
     */
    formatLoginTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hour = String(now.getHours()).padStart(2, '0')
      const minute = String(now.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
    },

    /**
     * 跳转到登录页
     */
    goToLogin() {
      wx.navigateTo({
        url: '../login/login',
      })
    },

    /**
     * 查看用户详情
     */
    viewUserDetail() {
      if (!this.data.isLoggedIn) {
        this.goToLogin()
        return
      }
      wx.navigateTo({
        url: '../login/login',
      })
    },

    /**
     * 退出登录
     */
    onLogout() {
      if (!this.data.isLoggedIn) return

      wx.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        confirmColor: '#ff6b6b',
        success: (res) => {
          if (res.confirm) {
            app.logout()
            this.loadUserInfo()
            wx.showToast({
              title: '已退出登录',
              icon: 'success',
              duration: 1500,
            })
          }
        },
      })
    },

    /**
     * 清除缓存
     */
    clearCache() {
      wx.showModal({
        title: '清除缓存',
        content: '确定要清除本地缓存吗？这不会影响您的账户数据。',
        success: (res) => {
          if (res.confirm) {
            wx.removeStorageSync('logs')
            wx.showToast({
              title: '缓存已清除',
              icon: 'success',
            })
          }
        },
      })
    },

    /**
     * 关于我们
     */
    showAbout() {
      wx.showModal({
        title: '关于我们',
        content: `随机抽取工具 v${this.data.version}\n\n一款简单实用的随机抽取小工具，支持批量输入数据、自定义抽取数量，让抽签更公平、更有趣！`,
        showCancel: false,
        confirmText: '知道了',
      })
    },

    /**
     * 意见反馈
     */
    showFeedback() {
      wx.showToast({
        title: '功能开发中',
        icon: 'none',
      })
    },

    /**
     * 复制OpenID
     */
    copyOpenId() {
      const { userInfo, isLoggedIn } = this.data
      if (!isLoggedIn || !userInfo || !userInfo.openid) {
        wx.showToast({
          title: '暂无OpenID',
          icon: 'none',
        })
        return
      }
      wx.setClipboardData({
        data: userInfo.openid,
        success: () => {
          wx.showToast({
            title: '已复制OpenID',
            icon: 'success',
          })
        },
      })
    },
  },
})
