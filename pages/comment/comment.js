const app = getApp()

Page({
  data: {
    showCamera: false,
    /**
     * [
     *  {
     *    key: 0,
     *    type: string || video
     *    content: "hi"
     *  }
     * ]
     */
    textList: [],
    devicePosition: "front", //摄像头朝向
    // opacity: 0.5,
    toView: "bottom",
    isRecording: false,
    video_url: null
  },
  onShow() {},

  onLoad() {},

  onUnload() {},

  errorHandler() {
    wx.showToast({
      title: '出错了，将自动重启小程序',
      icon: "error"
    })
    setTimeout(() => {
      wx.restartMiniProgram({
        path: "/pages/comment/comment"
      })
    }, 2000)
  },

  // 处理超时与手动结束后的逻辑
  stopHandler(ctx) {
    console.log(ctx)
    wx.showToast({
      title: "录制完成"
    })

    this.setData({
      isRecording: false,
      showCamera: false
    })
  },

  startCamera() {
    if (!this.data.showCamera) {
      this.setData({
        showCamera: true
      })
    } else {
      new Promise().then(this.errorHandler)
      return;
    }
  },

  closeCamera() {
    if (this.data.showCamera) {
      this.setData({
        showCamera: false
      })
    } else {
      new Promise().then(this.errorHandler)
      return;
    }
  },


  startRecord() {
    // 创建相机上下文
    const camera = wx.createCameraContext()
    
    camera.startRecord({
      timeoutCallback: this.stopHandler,
      success: (res) => {
        this.setData({
          isRecording: true
        })
      },
      fail: (res) => {
        console.log(res)
      }
    })

  },

  setCameraPosition() {
    this.setData({
      devicePosition: this.data.devicePosition == 'back' ? 'front' : 'back'
    })
  },

})