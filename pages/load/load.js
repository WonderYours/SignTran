

const app = getApp()

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'


Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    theme: wx.getSystemInfoSync().theme,
    nickname:''
  },
  onLoad() {
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
      })
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
    
    console.log(app.globalData.avatarUrl=avatarUrl);
  },
  getInputName:function(e){
    // 获取到input的值
    this.setData({
      nickname:e.detail.value    
    })
    // 获取到光标的位置
  },
  backto(){
    app.globalData.avatarUrl=this.data.avatarUrl
    app.globalData.nickname=this.data.nickname
    wx.switchTab({
      url: '/pages/personal/personal',
    })
  }
})
