const app = getApp()
Page({
  data: {
    mush:[
      { dataUrl: 'http://wwa.chuanyuefengxinzi.xyz/shared_wav/oges/1707966696.mp3', title: '来听听我的声音', coverImgUrl: 'https://s1.ax1x.com/2023/06/07/pCFz1Ig.jpg', name:'这是使用众声发布的声音主题 ' ,time:"2024-02-15T11:11:36.308709+08:00"}
    ],
    number:'0',
    interval:'',
    widthx:'0',
    duration:'',
    playback:'',
    play:false,
    bgmusic:'',
    message:'0',
    user:'',
    like:'',
    time:'',
    message1:'',
    message1:'',
    time1:'',
    time2:'',
    like1:'',
    like2:'',
    user1:'',
    user2:'',
    show:false,
    datalist:[],
    mytext:'',
    wenben1:'',//文本类容
    bottomHeight:0 //定义comment容器与page容器下边界之间的距离

  },
   // console.log(evt.detail)
   bindtap:function(e){
    app.globalData.content=e.detail.value;
    console.log(app.globalData.text);
  },
  

bindadd(){
  console.log(this.data.mytext)
  console.log(app.globalData.content)
//输入框文本
  this.setData({
      datalist:[...this.data.datalist,this.data.mytext],
      //...this.data.datalist是之前的数据，和输入框的数据连接
      mytext:"",
      wenben1:app.globalData.content
  })
},
binddelete(evt){
  this.data.datalist.splice(evt.target.dataset.id,1)
  this.setData({
     datalist:this.data.datalist
  })
},
bindfocus(e){
  console.log(e, '键盘弹起')
  console.log(e)
  this.setData({
    bottomHeight:e.detail.height //将键盘的高度设置为comment容器与page容器下边界之间的距离。
  })
 
  },
  // 输入内容
  
  // 失去焦点 
  bindblur(e){
    console.log(e, '收起键盘')
    this.setData({
      bottomHeight:0
    })
  },
  onShow:function(e){
    let that = this

      that.data.bgmusic.pause();

  },
  onLoad: function (options) {
    let that = this
    wx.playBackgroundAudio({
      dataUrl: that.data.mush[that.data.number].dataUrl,
      title: that.data.mush[that.data.number].title,
      coverImgUrl: that.data.mush[that.data.number].coverImgUrl,
    })
    that.setData({
      bgmusic: wx.getBackgroundAudioManager()
    })
    that.data.bgmusic.play();
    setTimeout(function () {  
      if (getCurrentPages().length != 0) {
        getCurrentPages()[getCurrentPages().length - 1].scheduled()
      }
    },300)



    wx.request({  
      url: 'https://crowdofvoice.top:443/comment/', // 后端接口地址  
      method: 'GET', // 请求方法  
      header: {
        'Authorization': app.globalData.token1,
      },
      success(res) {  
        // 处理数据并更新页面数据  
        that.setData({  
          message: res.data[0].content,
          time:res.data[0].created,
          user:res.data[0].author.username,
          like:res.data[0].likes,
          dataUrl:res.data[0].url,
          
          // 假设后端返回的 JSON 对象中有一个 'message' 属性  
        });  
        console.log(message);
      },  
      fail(err) {  
        console.error('请求失败:', err);  
      }  
    });  


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
  song:function(e){
    let that = this
    let song = e.currentTarget.dataset.song
    if(song == 'next'){
      if (that.data.number < (that.data.mush.length-1)){
        that.data.number++
      }else{
        that.data.number = 0
      }
    } else if (song == 'last'){
      if (0 < that.data.number) {
        that.data.number--
      } else {
        that.data.number = (that.data.mush.length - 1)
      }
    }else{
      wx.showToast({
        title: '系统异常~',
        icon: 'none',
        duration: 3000
      })
    }
    that.setData({
      number: that.data.number,
      play: true,
      widthx: '0',
      duration:'',
    })
    if (getCurrentPages().length != 0) {
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
    }
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
  addComment:function(){
    this.setData({
      show: true,
    });
  },
  onClose() {
    this.setData({
      show: false,
    });
  },
})
