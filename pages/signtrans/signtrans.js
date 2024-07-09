// pages/circle/list.js
const app = getApp()
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mytext:"",
    datalist:["111","222"]
},
startRecord() {
  this.ctx.startRecord({
    success: () => {
      console.log('startRecord')
    }
  })
},
stopRecord() {
  this.ctx.stopRecord({
    success: (res) => {
      this.setData({
        src: res.tempThumbPath,
        videoSrc: res.tempVideoPath,
        
      })
      app.globalData.videoSrc=res.tempVideoPath;
      app.globalData.src=res.tempVideoPath;
      console.log(app.globalData.videoSrc)
      console.log(res.tempThumbPath)
    }
  })
},
trans:function(){
  
  wx.chooseVideo({  
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
    success: function (res) {  
      // res.tempFilePath可以作为img标签的src属性显示图片  
      const tempFilePath =app.globalData.videoSrc; // 视频文件的临时路径  
        
      // 调用上传接口  
      wx.uploadFile({  
        url: 'https://www.crowdofvoice.top:6006/translate/', // 仅为示例，非真实的接口地址  
        filePath: tempFilePath,  
        name: 'file', // 文件对应的 key，开发者在服务端可以通过这个 key 获取文件二进制内容  
        formData: {  
          'user': 'someone' // 其他需要上传的数据，如用户信息等  
        },  
        success: function (uploadFileRes) {  
          // 上传成功后的处理逻辑  
          console.log(uploadFileRes.data); // 打印上传成功后的返回数据  
        },  
        fail: function (uploadFileError) {  
          // 上传失败的处理逻辑  
          console.error(uploadFileError);  
        }  
      });  
    }  
  });
},
save:function(){
  wx.saveVideoToPhotosAlbum({  
    filePath: app.globalData.videoSrc, // 例如：'temp:///xxx.mp4'  
    success(res) {  
      wx.showToast({  
        title: '视频已保存到相册',  
        icon: 'success',  
        duration: 2000  
      });  
    },  
    fail(err) {  
      if (err.errMsg === "saveVideoToPhotosAlbum:fail:auth denied" || err.errMsg === "saveVideoToPhotosAlbum:fail auth denied") {  
        // 用户拒绝授权，可以引导用户打开权限设置  
        wx.showModal({  
          title: '请打开相册权限',  
          content: '需要获取您的相册权限才能保存视频',  
          showCancel: false,  
          confirmText: '去设置',  
          success(res) {  
            if (res.confirm) {  
              wx.openSetting({  
                withSubscriptions: true,  
              });  
            }  
          }  
        });  
      } else {  
        // 其他错误情况  
        wx.showToast({  
          title: '视频保存失败',  
          icon: 'none',  
          duration: 2000  
        });  
      }  
    }  
  });
},
onLoad: function (options) {
  this.ctx = wx.createCameraContext()
},

})
