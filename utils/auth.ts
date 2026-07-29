// 用户信息接口
export interface UserInfo {
  openid: string
  nickName: string
  avatarUrl: string
  sessionKey: string
  unionid?: string
}

// 登录状态接口
export interface LoginState {
  userInfo: UserInfo | null
  isLoggedIn: boolean
}

// 存储键名
const STORAGE_KEYS = {
  USER_INFO: 'user_info',
  SESSION_KEY: 'session_key',
  OPENID: 'openid',
}

/**
 * 获取用户信息
 */
export const getUserInfo = (): UserInfo | null => {
  try {
    const data = wx.getStorageSync(STORAGE_KEYS.USER_INFO)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('获取用户信息失败', e)
    return null
  }
}

/**
 * 保存用户信息
 */
export const saveUserInfo = (userInfo: UserInfo): void => {
  try {
    wx.setStorageSync(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo))
  } catch (e) {
    console.error('保存用户信息失败', e)
  }
}

/**
 * 清除登录状态
 */
export const clearLoginState = (): void => {
  wx.removeStorageSync(STORAGE_KEYS.USER_INFO)
  wx.removeStorageSync(STORAGE_KEYS.SESSION_KEY)
  wx.removeStorageSync(STORAGE_KEYS.OPENID)
}

/**
 * 微信登录获取code
 */
export const wxLogin = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        if (res.code) {
          resolve(res.code)
        } else {
          reject(new Error('获取登录code失败: ' + res.errMsg))
        }
      },
      fail: (err) => {
        reject(new Error('微信登录失败: ' + err.errMsg))
      },
    })
  })
}

/**
 * 模拟登录（使用mock数据，实际项目中替换为后端接口）
 * @param code 微信登录code
 */
export const login = async (code: string): Promise<UserInfo> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const mockUserInfo: UserInfo = {
    openid: 'mock_openid_' + code.slice(-8),
    nickName: '微信用户',
    avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
    sessionKey: 'mock_session_key_' + code.slice(-8),
  }
  
  saveUserInfo(mockUserInfo)
  
  return mockUserInfo
}

/**
 * 完整登录流程
 */
export const doLogin = async (): Promise<UserInfo> => {
  try {
    const code = await wxLogin()
    const userInfo = await login(code)
    return userInfo
  } catch (error) {
    console.error('登录失败', error)
    throw error
  }
}
