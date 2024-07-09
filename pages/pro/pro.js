const app = getApp()
const backgroundAudioManager = wx.getBackgroundAudioManager();
import Toast from '@vant/weapp/toast/toast';

const options=[
  {
    text:app.globalData.aaa,
    value:"0000"
  }
]

Page({
  data: {
    show: false,
    options,
    fieldValue: '',
    cascaderValue: '',
  },

  onClick() {
    this.setData({
      show: true,
    });
    
    wx.request({ 
      url: 'https://www.crowdofvoice.top:6008/usersound/', // 后端提供数据的 URL  
      header: {
        'Authorization':app.globalData.token1,
      },
      success: res => {  
        // 数据获取成功处理逻辑  
      // console.log(res.data);
      // console.log(res);
      // console.log(res.data.data.items[0].id);
      // console.log(res.data.data.items.map(item => ({ id: item.id, name: item.name })));
      app.globalData.text1=res.data.data.items.map(item => ({name: item.name }));
      // console.log(app.globalData.text1[0].name);
      console.log(app.globalData.aaa);
         // 在控制台打印获取的数据  
      },  
      fail:err =>  {  
        // 数据获取失败处理逻辑  
        console.log(err); // 在控制台打印错误信息  
      }  
   });

  },

  
  produce(){
    console.log(app.globalData.cascaderValue)
        var that=this
        Toast.loading({
          message: '合成中...',
          forbidClick: true,
        });
        wx.request({
                url: 'https://crowdofvoice.top:443/voice/', //仅为示例，非真实的接口地址
                header: {
                  "Content-type": "application/json",
                  'Authorization':app.globalData.token1
                },
                data: {
                  'usersound_id': app.globalData.cascaderValue,
                  'text': app.globalData.text,
                  'name': '丁真',
                },
                method: 'POST',
                success(res) {
                  console.log('上传成功')
                  console.log(res);
                  //console.log(JSON.parse(res.data).data);
                  console.log(res.data);
                  console.log(res.data.data);
                  app.globalData.musicurl=res.data.data
                  that.setData({
                    voicesrc: res.data.data
                  })
      console.log(app.globalData.musicurl)
                },
                fail(res) {
                }
              })
          setTimeout(() => {
    wx.navigateTo({
       url: '/pages/produce/produce',
      })
    }, 2000)
       setTimeout(() => {
    backgroundAudioManager.title = '歌曲标题';
    backgroundAudioManager.src = this.data.voicesrc;
      }, 3000)
      },
    onClose() {
      this.setData({
        show: false,
      });
    },
  
    onFinish(e) {
      const { selectedOptions, value } = e.detail;
      const fieldValue = selectedOptions
          .map((option) => option.text || option.name)
          .join('/');
      this.setData({
        fieldValue,
        cascaderValue: value,
      })
      console.log(this.data.cascaderValue)
      app.globalData.cascaderValue=this.data.cascaderValue;
      console.log(app.globalData.cascaderValue)
    },

  wenben:function(e){
    app.globalData.text=e.detail.value;
    console.log(app.globalData.text);
  },
});