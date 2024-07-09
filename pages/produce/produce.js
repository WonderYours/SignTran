
const app = getApp()
Page({
  data: {
    mush:[
      { dataUrl:app.globalData.musicurl, title: '众声#172387', coverImgUrl: 'http://img3.kuwo.cn/star/albumcover/300/27/41/2794992887.jpg', name:'' }
    ],
    number:'0',
    interval:'',
    widthx:'0',
    duration:'',
    playback:'',
    play:false,
    bgmusic:'',
  },
  onShow(){
    let that = this
      that.data.bgmusic.pause();

  },
  onLoad() {
    let that = this

    that.setData({
      bgmusic: wx.getBackgroundAudioManager()
    })
    that.data.bgmusic.src=app.globalData.musicurl
    that.data.bgmusic.title='haha'
    that.data.bgmusic.play();

    setTimeout(function () {  
      
      if (getCurrentPages().length != 0) {
        getCurrentPages()[getCurrentPages().length - 1].scheduled()
      }
    },300)
  },
  music:function(e){
    let that = this
    if(!that.data.play){
      that.data.bgmusic.play();
      if (getCurrentPages().length != 0) {
        getCurrentPages()[getCurrentPages().length - 1].scheduled()
      }
    }else{
      that.data.bgmusic.pause();
      clearInterval(that.data.interval)
    }
    that.setData({
      play: !that.data.play,
    })
  },

  scheduled: function (e) {
    let that = this
    that.data.interval = setInterval(function () {
      let a = '00'
      let b = '00'

      wx.getBackgroundAudioPlayerState({
        success(res) {
          if (res.status == '2' && that.data.widthx == '100.00') {
            if (that.data.number < (that.data.mush.length - 1)) {
              that.data.number++
            } else {
              that.data.number = 0
            }
            that.setData({
              number: that.data.number,
              play: true,
              widthx: '0',
              duration: '',
            })
            if (getCurrentPages().length != 0) {
              getCurrentPages()[getCurrentPages().length - 1].onLoad()
              getCurrentPages()[getCurrentPages().length - 1].onShow()
            }
          }
          that.data.widthx = (res.currentPosition / (res.duration / 100)).toFixed(2)
          if (res.currentPosition > 59) {
            a = parseInt(res.currentPosition / 60) ? parseInt(res.currentPosition / 60) : '00'
            b = res.currentPosition - (a * 60) ? res.currentPosition - (a * 60) : '00'
          } else {
            a = '00'
            b = res.currentPosition ? res.currentPosition : '00'
          }
          a == undefined ? '00' : a
          if (JSON.stringify(a).length < 2) {
            a = '0' + JSON.stringify(a)
          }
          b == undefined ? '00' : b
          if (JSON.stringify(b).length < 2) {
            b = '0' + JSON.stringify(b)
          }
          that.data.play = res.status == 1 ? true : false
          if (that.data.duration == '' || that.data.duration == '00:00') {
            let c = parseInt(res.duration / 60) ? parseInt(res.duration / 60) : '00'
            let d = res.duration - (c * 60) ? res.duration - (c * 60) : '00'
            if (JSON.stringify(c).length < 2) {
              c = '0' + JSON.stringify(c)
            }
            if (JSON.stringify(d).length < 2) {
              d = '0' + JSON.stringify(d)
            }
            that.setData({
              duration: c + ':' + d,
            })
          }
          that.setData({
            widthx: that.data.widthx,
            playback: a + ':' + b,
            play: that.data.play,
          })
        }
      })
    }, 300)
  },
  share:function(){
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/music/music',
      })
    }, 200)
  },
  reproduce:function(){
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/pro/pro',
      })
    }, 200)
  },
  produce:function(){
    console.log(app.globalData.musicurl)
  }
})
