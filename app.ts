import { getUserInfo, doLogin, clearLoginState, type UserInfo } from './utils/auth'

App<IAppOption>({
  globalData: {
    userInfo: null,
    isLoggedIn: false,
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 初始化登录状态
    this.initLoginState()
  },

  /**
   * 初始化登录状态
   */
  initLoginState() {
    const userInfo = getUserInfo()
    if (userInfo) {
      this.globalData.userInfo = userInfo
      this.globalData.isLoggedIn = true
      console.log('已自动登录:', userInfo.openid)
    } else {
      // 如果没有登录状态，尝试静默登录
      this.silentLogin()
    }
  },

  /**
   * 静默登录（无用户交互）
   */
  async silentLogin() {
    try {
      const userInfo = await doLogin()
      this.globalData.userInfo = userInfo
      this.globalData.isLoggedIn = true
      console.log('静默登录成功:', userInfo.openid)
    } catch (error) {
      console.error('静默登录失败:', error)
    }
  },

  /**
   * 手动登录（用户触发）
   */
  async login(): Promise<UserInfo> {
    try {
      const userInfo = await doLogin()
      this.globalData.userInfo = userInfo
      this.globalData.isLoggedIn = true
      return userInfo
    } catch (error) {
      throw error
    }
  },

  /**
   * 退出登录
   */
  logout() {
    clearLoginState()
    this.globalData.userInfo = null
    this.globalData.isLoggedIn = false
    console.log('已退出登录')
  },

  /**
   * 获取当前登录状态
   */
  getLoginState() {
    return {
      userInfo: this.globalData.userInfo,
      isLoggedIn: this.globalData.isLoggedIn,
    }
  },
})
