// pages/Voice package/Voice package.js
import Toast from '@vant/weapp/toast/toast';
const recorderManager = wx.getRecorderManager()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '1',
    radio1: '1',
    show1: false,
    up:false,
    button: true,
    tempFilePath:'',
    voicesrc:'',
    showDate: false,
    record: false,
    is_clock: false,
    text123:'',
  },
  bindTextAreaBlur: function(e) {
    console.log(e.detail.value)
  },
  
onOpen() {
  this.setData({ showDate: true });
},

onClose() {
  this.setData({ showDate: false });
},
  /**
   * 生命周期函数--监听页面加载
   */
  music(){
    wx.navigateTo({
      url: '/pages/mymusic/mymusic',
    })
  },
  pro(){
    wx.request({ 
      url: 'https://www.crowdofvoice.top:6008/usersound/', // 后端提供数据的 URL  
      method:'GET',
      header: {
        'Authorization': app.globalData.token1,
      },
      success: res => {  
        // 数据获取成功处理逻辑  
      console.log(res.data);
      console.log(res);
      // console.log(res.data.data.items[0].id);
      // console.log(res.data.data.items.map(item => ({ id: item.id, name: item.name })));
      const abb=res.data.data.items.map(item => ({name: item.name }));
      app.globalData.aaa=abb[0].name
      console.log(app.globalData.aaa);
         // 在控制台打印获取的数据  
      },  
      fail:err =>  {  
        // 数据获取失败处理逻辑  
        console.log(err); // 在控制台打印错误信息  
      }  
   });
    wx.navigateTo({
      url: '/pages/pro/pro',
    })
  },
  pro2(){
    wx.navigateTo({
      url: '/pages/comment/comment',
    })
  },
  
  show1() {
    this.setData({
      show1: true
    });
  },
  
  onClose1() {
    this.setData({
      show1: false
    });
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  onChange1(event) {
    this.setData({
      radio1: event.detail,
    });
  },

  onLoad: function (options) {
    var that = this;
   /**  //获取全局唯一的录音管理器 RecorderManager实例
    that.recorderManager = wx.getRecorderManager()
    that.recorderManager.onStop((res) => {
      that.setData({
        tempFilePath: res.tempFilePath // 文件临时路径
      })
      console.log('获取到文件：' + that.data.tempFilePath)
    })
    this.recorderManager.onError((res) => {
      console.log('录音失败了！')
      //console.log(res)
    })*/
        //对停止录音进行监控
        recorderManager.onStop((res) => {
          //此时先判断是否需要发送录音
          if (that.data.is_clock == true) {
            //对录音时长进行判断，少于2s的不进行发送，并做出提示
            if (res.duration < 2000) {
              wx.showToast({
                title: '录音时间太短，请长按录音',
                icon: 'none',
                duration: 1000
              })
            } else {
             // const tempFilePaths = res
              app.globalData.tempFilePaths=res.tempFilePath,
              console.log(app.globalData.tempFilePaths);
              const url = app.globalData.tempFilePaths ;
              const modifiedUrl = url.replace('.durationTime', '');
              app.globalData.url666=modifiedUrl.slice(0, -9) +modifiedUrl.slice(-4);
              console.log(app.globalData.url666);
              wx.showLoading({
                title: '录音完成',
                icon: 'success',
                duration: 2000
              })
              
               
              wx.uploadFile({
                url: 'https://www.crowdofvoice.top:6008/usersound/', //仅为示例，非真实的接口地址
                method:'POST',
                filePath: app.globalData.tempFilePaths,
                name: 'sound',
                header:{
                  "Content-type":"multiply/form-data",
                  'Authorization':app.globalData.token1
                },
                formData: {
                  'name':  'abb',
                  'sound': app.globalData.tempFilePaths,
                  'description': 'zyjzyjzyj',
                },
                success (res){
                  console.log('上传成功');
                  console.log(res);
                 // console.log(JSON.parse(res.data).data);
                  Toast.success('上传成功');
                 // that.setData({
                 //   voicesrc: JSON.parse(res.data).data
                 // })
                  
                },
                fail (res){
                  console.log('上传失败')
                  that.setData({uploadState:false})
      
                  Toast.fail('上传失败');
                }
              })

             
            }
          } else {
            wx.showToast({
              title: '录音已取消',
              icon: 'none',
              duration: 2000
            })
          }
        })
        //监控录音异常情况
        recorderManager.onError((res) => {
          if (res['errMsg'] != 'operateRecorder:fail recorder not start') {
            wx.showModal({
              title: '你拒绝使用录音功能，语音识别功能将无法正常使用',
              content: '是否重新授权使用你的录音功能',
              success: function (data) {
                if (data.cancel) {
                  wx.showToast({
                    title: '拒绝授权',
                    icon: 'none',
                    duration: 1000
                  })
                } else if (data.confirm) {
                  wx.openSetting({
                    success: function (dataAu) {
                      if (dataAu.authSetting["scope.record"] != true) {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'none',
                          duration: 1000
                        })
                      } else {
                        wx.showToast({
                          title: '授权成功，请长按录音',
                          icon: 'none',
                          duration: 1000
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        })
    
  },
  jumppage:function(){
    wx.navigateTo({
      url: '/pages/trans/trans',
    })
  },
 

  wenben:function(e){
    app.globalData.text=e.detail.value
    console.log(app.globalData.text);
  },

  tap1: function () {
    var that = this
    wx.chooseMessageFile({

      count: 1,

      type: 'file',

      success(res) {
        that.setData({
          up:true,
        });
        console.log(res.tempFiles[0].path);
        const tempFilePaths = res.tempFiles
        wx.uploadFile({
          url:'https://www.crowdofvoice.top:6008/usersound/', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0].path,
          name: 'sound',
          header:{
            "Content-type":"multiply/form-data",
            'Authorization':app.globalData.token1
          },
          formData: {
            'name': 'haha',
            'sound':tempFilePaths[0].path,
            'description': 'zyjzyjzyj',
          },
          success (res){
            console.log('上传成功')
            console.log(res);
            console.log(JSON.parse(res.data).data);
            Toast.success('上传成功');
            that.setData({
              voicesrc: JSON.parse(res.data).data
            })
            
          },
          fail (res){
            console.log('上传失败')
            that.setData({uploadState:false})

            Toast.fail('上传失败');
          }
        })

      
      }
    });
  },
  tap3: function () {
    var that = this

      const createInnerAudioContext = wx.createInnerAudioContext();

      if (wx.setInnerAudioOption) {
        wx.setInnerAudioOption({
          obeyMuteSwitch: false,
          autoplay: true
        })
      }else {
        createInnerAudioContext.obeyMuteSwitch = false;
        createInnerAudioContext.autoplay = true;
      }
      createInnerAudioContext.src = that.data.voicesrc
      createInnerAudioContext.onPlay(() => {
        console.log("音乐播放开始")

      })
      createInnerAudioContext.onEnded(() => {
        console.log("音乐播放结束")
      })
      setTimeout(() => {
        createInnerAudioContext.play();
    }, 10);

  },
  startRecord1(){
    wx.showToast({
      title: '请长按录音',
      icon: 'none',
      duration: 1000
    })
  },
  //语音识别 开始录音
  handleRecordStart1(e) {
    this.setData({
      is_clock: true, //长按时应设置为true，为可发送状态
      startPoint: e.touches[0], //记录触摸点的坐标信息
      record: true,
    })
    //录音参数
    const options = {
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: 'mp3'
    }
    //开启录音
    recorderManager.start(options);
    wx.showToast({
      title: '正在录音，往下滑动取消发送',
      icon: 'none',
      duration: 10000
    })
  },
  //停止录音
  handleRecordStop1() {
    wx.hideToast(); //结束录音、隐藏Toast提示框
    this.setData({
      record:false
    })
    recorderManager.stop() ;//结束录音
    recorderManager.onStop((res) => {
      var that=this
      //此时先判断是否需要发送录音
      if (that.data.is_clock == true) {
        //对录音时长进行判断，少于2s的不进行发送，并做出提示
        if (res.duration < 2000) {
          wx.showToast({
            title: '录音时间太短，请长按录音',
            icon: 'none',
            duration: 1000
          })
        } else {
         // const tempFilePaths = res
          app.globalData.tempFilePaths1=res.tempFilePath,
          console.log(app.globalData.tempFilePaths1);
          const url = app.globalData.tempFilePaths1 ;
          const modifiedUrl = url.replace('.durationTime', '');
          app.globalData.url666=modifiedUrl.slice(0, -9) +modifiedUrl.slice(-4);
          console.log(app.globalData.url666);
          wx.showLoading({
            title: '录音完成',
            icon: 'success',
            duration: 2000
          })
          
           
          wx.uploadFile({
            url: 'https://www.crowdofvoice.top:6008/whisper/', //仅为示例，非真实的接口地址
            method:'POST',
            filePath: app.globalData.tempFilePaths1,
            name: 'sound',
            header:{
              "Content-type":"multiply/form-data",
              'Authorization':app.globalData.token1
            },
            formData: {
              'name':  'abb',
              'sound': app.globalData.tempFilePaths1,
              'description': 'ydcydc',
            },
            success (res){
              console.log('上传成功');
              console.log(res.data);
              const data1=res.data;
              console.log(data1[5]);
             console.log(JSON.parse(res.data)[0].data.result.text);
             app.globalData.transhand=JSON.parse(res.data)[0].data.result.text;
             console.log(app.globalData.transhand)
             that.setData({
               text123:app.globalData.transhand
             })
              Toast.success('上传成功');
             // that.setData({
             //   voicesrc: JSON.parse(res.data).data
             // })
              
            },
            fail (res){
              console.log('上传失败')
              that.setData({uploadState:false})
  
              Toast.fail('上传失败');
            }
          })

         
        }
      } else {
        wx.showToast({
          title: '录音已取消',
          icon: 'none',
          duration: 2000
        })
      }
    })
    //监控录音异常情况
    recorderManager.onError((res) => {
      if (res['errMsg'] != 'operateRecorder:fail recorder not start') {
        wx.showModal({
          title: '你拒绝使用录音功能，语音识别功能将无法正常使用',
          content: '是否重新授权使用你的录音功能',
          success: function (data) {
            if (data.cancel) {
              wx.showToast({
                title: '拒绝授权',
                icon: 'none',
                duration: 1000
              })
            } else if (data.confirm) {
              wx.openSetting({
                success: function (dataAu) {
                  if (dataAu.authSetting["scope.record"] != true) {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'none',
                      duration: 1000
                    })
                  } else {
                    wx.showToast({
                      title: '授权成功，请长按录音',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
},
//滑动取消发送
handleTouchMove1: function(e) {
  //计算距离，当滑动的垂直距离大于25时，则取消发送语音
  if (Math.abs(e.touches[e.touches.length - 1].clientY - this.data.startPoint.clientY) > 35) {
    wx.showToast({
      title: "松开手指,取消发送",
      icon: "none",
      duration: 10000
    });
    this.setData({
      is_clock: false //设置为不发送语音
    })
  } else {
    wx.showToast({
      title: '正在录音，往下滑动取消发送',
      icon: 'none',
      duration: 10000
    })
    this.setData({
      is_clock: true
    })
  }
},
startRecord(){
  wx.showToast({
    title: '请长按录音',
    icon: 'none',
    duration: 1000
  })
},
//语音识别 开始录音
handleRecordStart(e) {
  this.setData({
    is_clock: true, //长按时应设置为true，为可发送状态
    startPoint: e.touches[0], //记录触摸点的坐标信息
    record: true,
  })
  //录音参数
  const options = {
    sampleRate: 16000,
    numberOfChannels: 1,
    encodeBitRate: 48000,
    format: 'mp3'
  }
  //开启录音
  recorderManager.start(options);
  wx.showToast({
    title: '正在录音，往下滑动取消发送',
    icon: 'none',
    duration: 10000
  })
},
//停止录音
handleRecordStop() {
  wx.hideToast(); //结束录音、隐藏Toast提示框
  this.setData({
    record:false
  })
  recorderManager.stop() ;//结束录音
  recorderManager.onStop((res) => {
    var that=this
    //此时先判断是否需要发送录音
    if (that.data.is_clock == true) {
      //对录音时长进行判断，少于2s的不进行发送，并做出提示
      if (res.duration < 2000) {
        wx.showToast({
          title: '录音时间太短，请长按录音',
          icon: 'none',
          duration: 1000
        })
      } else {
       // const tempFilePaths = res
        app.globalData.tempFilePaths=res.tempFilePath,
        console.log(app.globalData.tempFilePaths);
        const url = app.globalData.tempFilePaths ;
        const modifiedUrl = url.replace('.durationTime', '');
        app.globalData.url666=modifiedUrl.slice(0, -9) +modifiedUrl.slice(-4);
        console.log(app.globalData.url666);
        wx.showLoading({
          title: '录音完成',
          icon: 'success',
          duration: 2000
        })
        
         
        wx.uploadFile({
          url: 'https://www.crowdofvoice.top:6008/usersound/', //仅为示例，非真实的接口地址
          method:'POST',
          filePath: app.globalData.tempFilePaths,
          name: 'sound',
          header:{
            "Content-type":"multiply/form-data",
            'Authorization':app.globalData.token1
          },
          formData: {
            'name':  'abb',
            'sound': app.globalData.tempFilePaths,
            'description': 'zyjzyjzyj',
          },
          success (res){
            console.log('上传成功');
            console.log(res);
           // console.log(JSON.parse(res.data).data);
            Toast.success('上传成功');
           // that.setData({
           //   voicesrc: JSON.parse(res.data).data
           // })
            
          },
          fail (res){
            console.log('上传失败')
            that.setData({uploadState:false})

            Toast.fail('上传失败');
          }
        })

       
      }
    } else {
      wx.showToast({
        title: '录音已取消',
        icon: 'none',
        duration: 2000
      })
    }
  })
  //监控录音异常情况
  recorderManager.onError((res) => {
    if (res['errMsg'] != 'operateRecorder:fail recorder not start') {
      wx.showModal({
        title: '你拒绝使用录音功能，语音识别功能将无法正常使用',
        content: '是否重新授权使用你的录音功能',
        success: function (data) {
          if (data.cancel) {
            wx.showToast({
              title: '拒绝授权',
              icon: 'none',
              duration: 1000
            })
          } else if (data.confirm) {
            wx.openSetting({
              success: function (dataAu) {
                if (dataAu.authSetting["scope.record"] != true) {
                  wx.showToast({
                    title: '授权失败',
                    icon: 'none',
                    duration: 1000
                  })
                } else {
                  wx.showToast({
                    title: '授权成功，请长按录音',
                    icon: 'none',
                    duration: 1000
                  })
                }
              }
            })
          }
        }
      })
    }
  })
},
//滑动取消发送
handleTouchMove: function(e) {
//计算距离，当滑动的垂直距离大于25时，则取消发送语音
if (Math.abs(e.touches[e.touches.length - 1].clientY - this.data.startPoint.clientY) > 35) {
  wx.showToast({
    title: "松开手指,取消发送",
    icon: "none",
    duration: 10000
  });
  this.setData({
    is_clock: false //设置为不发送语音
  })
} else {
  wx.showToast({
    title: '正在录音，往下滑动取消发送',
    icon: 'none',
    duration: 10000
  })
  this.setData({
    is_clock: true
  })
}
},
})