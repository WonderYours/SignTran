// pages/homepage/homepage.js
import Toast from '@vant/weapp/toast/toast';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    currentNum:0,
        //轮播图的数组
        backgroundArr: ['red', 'green', 'blue'],
        //轮播图当前的下标
        current: 0,
        //是否自动播放轮播图
        autoplay: true,
  },
  monitorCurrent: function (e) {
    // console.log(e.detail.current)
    let current = e.detail.current;
    this.setData({
      current: current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  search:function(){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  music:function(){
    wx.navigateTo({
      url: '/pages/music/music',
    })
  },

  // 监听轮播
  onChange(e) {
    this.setData({
      currentNum: e.detail.current,
    })
  },

  playmp3: function (event) {

    var srcurl = "/images/hai.mp3"

    const innerAudioContext = wx.createInnerAudioContext()

    innerAudioContext.autoplay = true

    innerAudioContext.src = srcurl

    innerAudioContext.onPlay(() => {

      console.log('开始播放')

    })

  },
  onclickbutton: function() {  
    // 在这里执行你的网络请求  
    wx.request({  
      url: 'https://crowdofvoice.top:443/voice_share/6/', 
      header: {
        'Authorization': app.globalData.token1 ,
      },
      method: 'GET', // 或其他HTTP方法  
      success: (res) => {  
        // 处理成功的响应  
        console.log('请求成功:', res.data);  
      },  
      fail: (error) => {  
        // 处理请求失败的情况  
        console.error('请求失败:', error);  
      }  
    });  
    wx.navigateTo({
      url: '/pages/storedmusic1/storedmusic1',
    });
  } , 
  onShow: function () {
    //开启轮播图
    this.setData({
      autoplay: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //关闭轮播图
    this.setData({
      autoplay: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //关闭轮播图
    this.setData({
      autoplay: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    //wx.createInnerAudioContext().pause();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})