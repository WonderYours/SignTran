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
    toView: "bottom",
    isRecording: false,
    videoUrl: null,
    startRecordTime: null,
    passedTime: 0,
    cameraCtx: null,
    minTime: 2,
    cameraFlash: false
  },

  // 控制camera
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
    if (this.data.isRecording) {
      wx.showToast({
        title: '请先停止录像',
        icon: "error"
      })
      return
    }

    if (this.data.showCamera) {
      this.setData({
        showCamera: false
      })
    } else {
      new Promise().then(this.errorHandler)
      return;
    }
  },

  changeCameraPosition() {
    this.setData({
      devicePosition: this.data.devicePosition == "front" ? "back" : "front"
    })
  },

  changeCameraFlash() {
    this.setData({
      cameraFlash: this.data.cameraFlash ? false : true
    })
  },

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
  stopRecordHandler(ctx) {
    // 存储视频
    if (this.data.passedTime < this.data.minTime) {
      wx.showToast({
        title: '视频不足2秒',
        icon: 'error'
      })
      this.setData({
        isRecording: false,
        startRecordTime: null,
        passedTime: 0,
        videoUrl: null
      })
      return;
    }

    // 复位设置
    this.setData({
      isRecording: false,
      startRecordTime: null,
      showCamera: false,
      passedTime: 0,
      videoUrl: ctx.tempVideoPath
    })

    wx.showToast({
      title: "录制完成",
      icon: 'success'
    })
  },

  // 计时器
  tick() {
    if (this.data.startRecordTime != 0) {
      this.setData({
        passedTime: Math.floor((new Date().getTime() - this.data.startRecordTime) / 1000)
      })
    }
    if (this.data.passedTime <= 30) {
      setTimeout(() => {
        this.tick()
      }, 500)
    }
  },

  startRecord() {
    // 创建相机上下文
    const camera = wx.createCameraContext()
    this.data.cameraCtx = camera
    camera.startRecord({
      timeoutCallback: this.stopRecordHandler,
      success: (res) => {
        this.setData({
          isRecording: true,
          startRecordTime: new Date().getTime(),
          videoUrl: null
        })
        this.tick()
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },

  stopRecord() {
    const camera = this.data.cameraCtx
    wx.showLoading({
      "title": "正在停止录像"
    })
    setTimeout(() => {
      wx.hideLoading();
    }, 10000)
    camera.stopRecord({
      compressed: true,
      success: (res) => {
        this.stopRecordHandler(res);
        wx.hideLoading()
      },
      fail: this.errorHandler
    })
  },

  find() {
    wx.chooseMedia({
      count: 1,
      mediaType: ["video"],
      sourceType: ['album'],
      sizeType: ["compressed"],
      success: (res) => {
        wx.showToast({
          title: '成功',
          icon: "success"
        })
        this.setData({
          videoUrl: res?.tempFiles[0]?.tempFilePath
        })
      },
      fail: (err) => {
        wx.showToast({
          title: '选取视频失败',
          icon: "error"
        })
      }
    });
  },

  trans() {
    // 纯粹测试使用
    if (this.data.videoUrl != undefined) {
      console.log("yes")
      this.data.textList.push({
        key: this.data.textList.length,
        type: "video",
        content: this.data.videoUrl
      })
      // 此段代码最后调用，切记切记
      this.setData({
        videoUrl: null
      })
    } else {
      this.data.textList.push({
        key: this.data.textList.length,
        type: "string",
        content: "测试"
      })
    }
    this.setData({
      // text: app.globalData.finaltext,
      textList: this.data.textList,
      isIconVisible: false,
      isvideoVisible: true,
      // 此处更改意在通知scrollView进行scroll-into-view刷新，从而实现滑动到最底层
      toView: "bottom"
    });
    return;
    var fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    var convertedFileName = fileName.split('.')[0] + '.mp4';

    console.log(convertedFileName);

    wx.showLoading({
      title: "请稍候"
    })
    setTimeout(function () {
      wx.hideLoading();
    }, 6000);
    return;

    wx.uploadFile({
      url: 'https://www.crowdofvoice.top:6006/translate/',
      filePath: app.globalData.videourl,
      name: 'video',
      formData: {
        'video': app.globalData.filename,
      },
      success: (uploadFileRes) => {
        console.log(uploadFileRes.data);
        app.globalData.transfile = uploadFileRes.data;
        var str = app.globalData.transfile;

        var regex = /'([\u4e00-\u9fa5]+)'/g;
        var extractedChars = str.match(regex).map(function (item) {
          return item.replace(/'/g, '');
        });

        var extractedString = extractedChars.join('，');
        app.globalData.finaltext = extractedString;
        console.log(extractedChars);
        console.log(app.globalData.finaltext);

        wx.request({
          url: 'https://www.crowdofvoice.top:7861/v1/chat/completions',
          method: 'POST',
          data: {
            "model": "chatglm3-6b",
            "messages": [{
                "role": "system",
                "content": "将下面一些词语连接成一句连续的话。尽量不要加入其它词语。尽量简单，表达清晰。"
              },
              {
                "role": "user",
                "content": app.globalData.finaltext,
              }

            ],
            "stream": false,
            "max_tokens": 20,
            "temperature": 0.8,
            "top_p": 0.8
          },
          success: (res) => {
            console.log('请求成功', res.data.choices[0].message.content);
            app.globalData.finaltext = res.data.choices[0].message.content;
            this.setData({
              // text: app.globalData.finaltext,
              textList: this.data.textList.append({
                content: "帮助你我们很开心。"
              }),
              isIconVisible: false,
              isvideoVisible: true,
            });
          },
          fail: (error) => {
            console.error('请求失败', error);
          }
        });
      },
      fail: (uploadFileError) => {
        console.error(uploadFileError);
      }
    });
  },

})