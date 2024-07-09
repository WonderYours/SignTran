let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
let screenWidth = wx.getSystemInfoSync().screenWidth
let screenHeight = wx.getSystemInfoSync().screenHeight
let contentHeight = ((windowHeight / screenWidth) * 750 - 184 - 166) + "rpx";
const recorderManager = wx.getRecorderManager()
const backgroundAudioManager = wx.getBackgroundAudioManager()
import Toast from '@vant/weapp/toast/toast';
const createInnerAudioContext = wx.createInnerAudioContext();
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startClick: false,
    contentHeight: contentHeight,
    voiceState: false,
    tempFilePath: '',
    recordingTimeqwe: 0, //录音计时
    setInter: "", //录音名称
    isplay: true, //播放状态  true--播放中  false--暂停播放
    uploadState: false,
    showhandle1: true,
    showhandle2: false,
    showWaveView: false,
    currentLeft: 10,
    currentTime: '00',
    voicesrc: '',
    banned:false
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.initRecord();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  initRecord: function () {
    recorderManager.onStart(() => {
      console.log('开始录音')
    })
    recorderManager.onPause(() => {
      console.log('暂停录音')
    })
    recorderManager.onStop((res) => {
      clearInterval(this.data.setInter);
      this.setData({
        voiceState: true,
        currentLeft: 10
      })
      console.log('结束录音', res)
      const {
        tempFilePath
      } = res
      this.data.tempFilePath = tempFilePath
    })
    recorderManager.onFrameRecorded((res) => {
      const {
        frameBuffer
      } = res
      console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    })
  },
  recordingTimer: function () {
    var that = this;
    //将计时器赋值给setInter
    this.data.setInter = setInterval(
      function () {
        let time = that.data.recordingTimeqwe + 1;
        if (time > 10) {
  //      wx.showToast({
  //        title: '录音时长最多10s',
  //        duration: 1500,
  //        mask: true
  //      })
  //      clearInterval(that.data.setInter);

          return;
        }
        // console.log(time);
        let currentTime = time < 10 ? '0' + time : time;
        that.setData({
          recordingTimeqwe: time,
          currentTime: currentTime,
          currentLeft: that.data.currentLeft + 65
        })
      }, 1000);
  },
  startRecord: function () {

    this.setData({
      startClick: true,
      currentTime: '00',
      currentLeft: 10,
      recordingTimeqwe:0,
      banned:true,
    })
    console.log(1)
    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50,
  
    }
    // 开始倒计时
    this.recordingTimer()
    // 开始录音
    recorderManager.start(options)
  },
  shutRecord: function () {
      recorderManager.stop()
      clearInterval(this.data.setInter);
      this.setData({
        showhandle1: false,
        showhandle2: true,
        startClick: false,
        banned:false
      })
  }, //,currentTime:'00'
  listenRecord: function (e) {
    if(this.data.banned){
      Toast.fail('waiting');
    }else{
    // 试听
    var that=this
    setTimeout(() => {
      let isplay = e.currentTarget.dataset.isplay;
      backgroundAudioManager.title = '试听欢迎语'
      createInnerAudioContext.src = that.data.voicesrc
      if (wx.setInnerAudioOption) {
        wx.setInnerAudioOption({
          obeyMuteSwitch: false,
          autoplay: true
        })
      }else {
        createInnerAudioContext.obeyMuteSwitch = false;
        createInnerAudioContext.autoplay = true;
      }
      this.setData({
        showWaveView: true,
        currentLeft: 10,
        currentTime: '00'
      })
      createInnerAudioContext.onPlay(() => {
        console.log("音乐播放开始")
      })
      createInnerAudioContext.onEnded(() => {
        console.log("音乐播放结束")
        clearInterval(this.data.setInter1)
        this.setData({
          currentLeft: 10,
          showWaveView: false,
          currentTime: '00'
        })
      })
      setTimeout(() => {
        createInnerAudioContext.play();
    }, 10);
      //createInnerAudioContext.play()
      this.data.setInter1 = setInterval(() => {
        let time = parseInt(this.data.currentTime) + 1
        let currentTime = time < 10 ? '0' + time : time;
        // console.log(currentTime)
        this.setData({
          currentLeft: this.data.currentLeft + 65,
          currentTime: currentTime
        })
      }, 1000);
    }, 5000)

    wx.uploadFile({
      url: 'https://www.chuanyuefengxinzi.xyz:8080/voice/', //仅为示例，非真实的接口地址
      filePath: this.data.tempFilePath,
      name: 'file',
      header: {
        "Content-type": "multiply/form-data",
        'Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJ1c2VybmFtZSI6Im90b05hNWJ4THZiQzhsQ3dVa3J6V2c1TndncmMiLCJleHAiOjE2ODUxODc2MjMsImVtYWlsIjoiIn0.DhXBXu2CHtvvCxy8fO0Ywnqk6eYoImyecGI7-10u40c'
      },
      formData: {
        'name': 'haha',
        'text': app.globalData.text
      },
      success(res) {
        console.log('上传成功')
        console.log(JSON.parse(res.data).data);

        that.setData({
          voicesrc: JSON.parse(res.data).data
        })
    Toast.loading({
      message: '生成中...',
      forbidClick: true,
    });
      },
      fail(res) {
        console.log('上传失败')
        that.setData({
          uploadState: false
        })
      }
    })

  }
    // 自定义加载图标
  },
  reRecord: function () {
    if(this.data.banned){
      Toast.fail('waiting');
    }else{
    clearInterval(this.data.setInter1)
    this.setData({
      showhandle1: true,
      showhandle2: false,
      voiceState: false,
      tempFilePath: '',
      showWaveView: false,
      startClick: false,
      currentLeft: 10,
      recordingTimeqwe: 0,
      currentTime: '00'
    })}
  },
  uploadVoice: function () {
      let that = this
      this.setData({
        uploadState: true
      })
      console.log('3');
      wx.uploadFile({
        url: 'https://www.chuanyuefengxinzi.xyz:8080/voice/', //仅为示例，非真实的接口地址
        filePath: this.data.tempFilePath,
        name: 'file',
        header: {
          "Content-type": "multiply/form-data"
        },
        formData: {
          'name': 's',
          'text': ' 你在一朵花的旁边等待了太久，在你看来，如此长久的等待，应该要有一场盛大的绽放与之相配。'
        },
        success(res) {
          console.log('上传成功')
        },
        fail(res) {
          console.log('上传失败')
          that.setData({
            uploadState: false
          })
        }
      })
      console.log(res) // 输出内容：res
  

  },
  up: function () {
    let that = this
    wx.uploadFile({
      url: 'https://crowdofvoice.top:443/voice/', //仅为示例，非真实的接口地址
      filePath: that.data.tempFilePath,
      name: 'file',
      formData: {
        'name': 'haha',
        'text':' 你在一朵花的旁边等待了太久，在你看来，如此长久的等待，应该要有一场盛大的绽放与之相配。' 
      },
      success (res){
        const data = res.data
        
      }
    })
  },
})