// login.ts
const app = getApp<IAppOption>()

Component({
  data: {
    loading: false,
    userInfo: null as UserInfo | null,
    isLoggedIn: false,
  },

  lifetimes: {
    attached() {
      this.checkLoginState()
    },
  },

  methods: {
    /**
     * 检查登录状态
     */
    checkLoginState() {
      const { userInfo, isLoggedIn } = app.globalData
      this.setData({
        userInfo: userInfo || null,
        isLoggedIn: !!isLoggedIn,
      })
    },

    /**
     * 微信登录
     */
    async onLogin() {
      if (this.data.loading) return

      this.setData({ loading: true })

      try {
        const userInfo = await app.login()
        
        if (!userInfo) {
          throw new Error('登录返回信息为空')
        }
        
        this.setData({
          userInfo,
          isLoggedIn: true,
          loading: false,
        })

        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500,
        })

        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }, 1500)
      } catch (error) {
        console.error('登录失败:', error)
        this.setData({ loading: false })
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none',
          duration: 2000,
        })
      }
    },

    /**
     * 获取用户信息（可选，用于获取头像昵称）
     */
    getUserProfile() {
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: (res) => {
          console.log('获取用户信息:', res.userInfo)
          // 可以在这里将用户信息发送给后端保存
        },
        fail: (err) => {
          console.error('获取用户信息失败:', err)
          wx.showToast({
            title: '获取信息失败',
            icon: 'none',
          })
        },
      })
    },

    /**
     * 退出登录
     */
    onLogout() {
      wx.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            app.logout()
            this.setData({
              userInfo: null,
              isLoggedIn: false,
            })
            wx.showToast({
              title: '已退出登录',
              icon: 'success',
            })
          }
        },
      })
    },

    /**
     * 返回上一页
     */
    goBack() {
      wx.navigateBack({
        delta: 1,
      })
    },
  },
})
