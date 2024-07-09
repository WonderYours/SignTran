
const app = getApp();
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    active: 0,
    name:'请点击头像登录',
    touxiang:app.globalData.avatarUrl
  },


  onClose(event) {
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          instance.close();
        });
        break;
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

  },
load(){
  wx.navigateTo({
    url: '/pages/load/load',
  })
},
  onLoad: async function () {
    // 从存储提取用户信息
    const userInfo = wx.getStorageSync('userInfo') || {};
 
    // 判断是否已存在信息
    // 设置数据并更新
    if (JSON.stringify(userInfo) !== '{}') {
      this.setData({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
      });
      this.isLogined = true;
    }
     wx.getUserProfile({
       success: function (res) {
         // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
         // 根据自己的需求有其他操作再补充
         // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
         wx.login({
           success: res => {
             // 获取到用户的 code 之后：res.code
             console.log("用户的code:" + res.code);
             wx.request({
               url: 'https://www.chuanyuefengxinzi.xyz:8080/wx/',
               method: 'POST',
               header: {
                 'content-type': 'application/json'
               },
               data: {
                 "code": res.code
               },
               success: function (res) {
                 console.log(res.data);
                 if (res.data.msg == 200) {
                   wx.setStorageSync('token', res.data.token)
                   console.log(wx.getStorageSync('token'));
                   wx.getStorage({
                     key: 'token',
                     success(res) {
 
                       var a = res.data
                       console.log('我是缓存数据', a)
                     }
                   })
 
 
                 } else {
                   that.setData({
                     isHide: true
                   });
                 }
               },
               fail: function (error) {
                 wx.showToast({
                   title: error.message || '上传失败'
                 })
                 console.log(error)
               }
             })
 
           }
         });
       }
     });
   },
   onShow(){
     this.setData({
      touxiang:app.globalData.avatarUrl,
      name:app.globalData.nickname
     })
   }
  
})
