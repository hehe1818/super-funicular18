// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: '/pages/index/index',
        text: '首页',
        icon: '🏠',
      },
      {
        pagePath: '/pages/settings/settings',
        text: '设置',
        icon: '⚙️',
      },
    ],
  },

  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index
      const url = this.data.list[index].pagePath
      
      wx.switchTab({
        url,
      })
      
      this.setData({
        selected: index,
      })
    },
  },
})
