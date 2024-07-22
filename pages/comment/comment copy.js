const app = getApp()
const backgroundAudioManager = wx.getBackgroundAudioManager();
import Toast from '@vant/weapp/toast/toast';
Page({
  data: {
    video: null,
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
    isIconVisible: true,
    isvideoVisible: false,
    ctx: null,
    isRecording: false,
    video_url: null,
    time: 0,
    min_time: 2, //录制视频最小时长
    timer: null,
    devicePosition: "back", //摄像头朝向
    isStart: false, //记录用户点击开始录制的状态
    isStop: false, //记录用户点击结束录制的状态
    // opacity: 0.5,
    toView: "bottom",
    cameraSize: 0
  },
  onShow() {
    if (wx.getStorageSync('auth_video')) {
      this.setData({
        video: wx.getStorageSync('auth_video')
      });
      console.log(wx.getStorageSync('auth_video'));
      wx.removeStorageSync('auth_video');
    }
  },

  onLoad(options) {
    const ctx = wx.createCameraContext()
    this.data.ctx = ctx
  },
  onUnload() {
    clearInterval(this.data.timer)
  },
  //切换前置/后置摄像头
  changePosition() {
    this.setData({
      devicePosition: this.data.devicePosition == 'back' ? 'front' : 'back'
    })
  },
  checkSetting() {
    //这里定义一个状态isStart来记录用户点击开始录制行为，待startRecord接口请求成功后还原状态
    if (this.data.isStart) {
      return
    }
    this.data.isStart = true

    /**
     * 调用wx.createCameraContext().startRecord()方法需要获取用户麦克风权限，否则无法调用且无法录制视频
     * 所以每次进入页面时先进行检验用户是否授权麦克风权限
     */
    wx.getSetting({
      success: (res) => {
        console.log(res)
        let authSetting = res.authSetting
        /**
         * 原理同检测摄像头权限
         */
        if (authSetting.hasOwnProperty('scope.record') && !authSetting['scope.record']) {
          wx.showModal({
            content: '检测到您当前未开启麦克风权限，将无法录制视频',
            confirmText: '去开启',
            success: (res) => {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.openSetting({
                  success(res) {
                    console.log(res.authSetting)
                  }
                });
              } else if (res.cancel) {
                console.log('用户点击取消')
                // this.back()
              }
            }
          })
        } else {
          this.startRecord()
        }
      }
    })
  },
  //用户进入页面授权时点击不允许授权时触发该方法，且不允许授权后每次进入页面都会直接触发
  getError() {
    console.log("用户未授权使用摄像头")
    this.back()
  },
  //点击开始录制/结束录制
  record() {
    // setTimeout(() => {
    //   this.setData({
    //     opacity: 0, // 设置透明度为0，使图片消失,
    //   });
    // }, 2000);
    if (this.data.isRecording) {
      console.log("结束录制视频")
      this.stopRecord()
    } else {
      console.log("开始录制视频")
      this.checkSetting()
    }
  },
  //开始录制
  startRecord() {
    // 先放大再开始录制，因为安卓在开始录制后调整大小，将会默认停止录制，进而导致stopRecord报错，stopRecord同理。逆天weapp设计:(
    this.setData({
      cameraSize: 5
    })
    // 判断是否已经拍过了
    if (this.data.video_url) {
      this.setData({
        video_url: null
      })
    }
    this.data.ctx.startRecord({
      timeoutCallback: (res) => {
        /**
         * 微信官方限制
         * 使用该方法录制视频最多录制30s，30s后自动停止录制
         * 停止录制计时
         */
        console.log("30秒时间结束，自动停止录制")
        console.log(res)
        clearInterval(this.data.timer)
        this.setData({
          video_url: res.tempVideoPath,
          isRecording: false
        })
      },
      success: (res) => {
        console.log(res)
        this.timing()
        this.setData({
          isRecording: true
        })
        this.data.isStart = false
      },
      fail: (err) => {
        console.log(err)
        this.data.isStart = false
      }
    })
  },
  //结束录制
  stopRecord() {
    //stopRecord方法不可连续调用，否则无法停止录制
    //这里定义一个状态isStop来记录用户点击结束录制行为，待stopRecord接口请求成功后还原状态
    if (this.data.isStop) {
      return
    }
    if (this.data.time < this.data.min_time) {
      wx.showToast({
        title: "视频时长小于" + this.data.min_time + "秒",
        icon: "none"
      })
      return
    }
    wx.showLoading({
      title: "请稍候"
    })
    this.data.isStop = true
    // 原理同上
    this.setData({
      cameraSize: 0
    })
    this.data.ctx.stopRecord({
      compressed: true, //是否压缩录完的视频
      success: (res) => {
        console.log(res)
        clearInterval(this.data.timer)
        this.setData({
          video_url: res.tempVideoPath,
          isRecording: false
        })
        app.globalData.videourl = res.tempVideoPath
        this.data.isStop = false
        wx.hideLoading()
      },
      fail(err) {
        console.log(err)
        this.data.isStop = false
        wx.hideLoading()
      }
    })
  },
  //计时
  timing() {
    let time = 0
    //每次计时前先将页面上的时间重置为0
    this.setData({
      time
    })
    let self = this
    let timer = setInterval(function () {
      time++
      console.log(time)
      self.setData({
        time
      })
    }, 1000)
    this.setData({
      timer
    })
  },
  //重新录制
  recordAgain() {
    this.setData({
      video_url: null
    })
  },
  //返回上一页
  back() {
    wx.navigateBack()
  },
  //确认选择
  sureVideo() {
    /**
     * 将录完的视频地址保存本地，返回上一页时在onShow里面判断本地是否存在录制视频的地址
     */
    wx.saveVideoToPhotosAlbum({
      filePath: app.globalData.videourl, // 例如：'temp:///xxx.mp4'  
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

    wx.setStorageSync('auth_video', this.data.video_url)
    wx.navigateBack()
  },

  find: function () {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePath;
        app.globalData.videourl = res.tempFilePath;
        console.log(res);
        app.globalData.filename = res.fileName;
      },
      fail: (err) => {
        console.error('选择视频失败：', err);
      }
    });
  },

  trans: function () {
    var filePath = app.globalData.videourl;
    // wx.showToast({
    //   title: '请先录制视频',
    //   icon: "error",
    //   duration: 1500
    // })
    // 纯粹测试使用
    console.log(this.data.video_url)
    if (this.data.video_url != undefined) {
      console.log("yes")
      this.data.textList.push({
        key: this.data.textList.length,
        type: "video",
        content: this.data.video_url
      })
      // 此段代码最后调用，切记切记
      this.setData({
        video_url: null
      })
      app.globalData.videourl = undefined
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
  // produce: function () {
  //   console.log(app.globalData.cascaderValue)
  //   var that = this
  //   wx.showLoading({
  //     title: '加载中',
  //   });
  //   // 隐藏
  //   wx.hideLoading();
  //   wx.request({
  //     url: 'https://crowdofvoice.top:443/voice/', //仅为示例，非真实的接口地址
  //     header: {
  //       "Content-type": "application/json",
  //       'Authorization': app.globalData.token1
  //     },
  //     data: {
  //       'usersound_id': "16",
  //       'text': app.globalData.finaltext,
  //       'name': '丁真',
  //     },
  //     method: 'POST',
  //     success(res) {
  //       console.log('上传成功')
  //       console.log(res);
  //       //console.log(JSON.parse(res.data).data);
  //       console.log(res.data);
  //       console.log(res.data.data);
  //       app.globalData.musicurl = res.data.data
  //       that.setData({
  //         voicesrc: res.data.data
  //       })
  //       console.log(app.globalData.musicurl)
  //     },
  //     fail(res) {}
  //   })
  //   setTimeout(() => {
  //     backgroundAudioManager.title = '歌曲标题';
  //     backgroundAudioManager.src = this.data.voicesrc;
  //   }, 3000)
  // },
});