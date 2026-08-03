// pages/settings/index.js

Page({
  data: {
    notificationEnabled: true,
    biometricEnabled: false
  },

  onToggleNotification() {
    this.setData({
      notificationEnabled: !this.data.notificationEnabled
    });
  },

  onToggleBiometric() {
    this.setData({
      biometricEnabled: !this.data.biometricEnabled
    });
  },

  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({ title: '已退出登录', icon: 'success' });
        }
      }
    });
  }
});
