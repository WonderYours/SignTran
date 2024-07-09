// pages/welcome/welcome.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  jumppage:function(){
    wx.switchTab({
      url: '/pages/homepage/homepage',
    })
    wx.request({
                url: 'https://www.crowdofvoice.top:6008/login/', //仅为示例，非真实的接口地址
                data: {
                  'username': 'zyj',
                  'password': '114514',
                },
                method: 'POST',
                success(res) {
                  //console.log(JSON.parse(res.data).data);
                  app.globalData.token1=res.data.token
                  console.log(app.globalData.token1)
                },
                fail(res) {
                }
              })
  },
  onLoad(options) {

  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})