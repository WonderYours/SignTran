
import Toast from '@vant/weapp/toast/toast';

 const app = getApp();
Page({
 
  data: {
    show: false,
    fieldValue: '',
    cascaderValue: '',
    url:""
  },
  onClick() {
    this.setData({
      show: true,
    });
    const app=getApp();
    console.log(app.globalData.token);
    wx.request({ 
      url: 'https://crowdofvoice.top:443/personalvoice/', // 后端提供数据的 URL  
      header: {
        'Authorization': "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Im9nZXMiLCJleHAiOjE3MTAwODIyNDgsImVtYWlsIjoiIn0.aZ251E4uD8VR4gG0M7obTHwIMGSSLjXny8swmZymwxQ" ,
      },
      success: res => {  
        // 数据获取成功处理逻辑  
      console.log(res.data);
      console.log(res);
       app.globalData.urls = res.data.data.items.map(items => items.url); 
      console.log(app.globalData.urls);
        
        
         // 在控制台打印获取的数据  
      },  
      fail:err =>  {  
        // 数据获取失败处理逻辑  
        console.log(err); // 在控制台打印错误信息  
      }  
   });
  
  },
//    setTimeout(() => {
//    wx.navigateTo({
//      url: '/pages/produce/produce',
//    })
//  }, 2000)

  onClose() {
    this.setData({
      show: false,
    });
  },

  //onFinish(e) {
    // { selectedOptions, value } = e.detail;
   // const fieldValue = selectedOptions
      //  .map((option) => option.text || option.name)
      //  .join('/');
   // this.setData({
    //  fieldValue,
     // cascaderValue: value,
   // })
   // console.log(this.data.cascaderValue)
 // },
 onButtonClick1: function(event) {  
  // 处理按钮点击事件，实现跳转功能  
  wx.request({ 
    url: 'https://crowdofvoice.top:443/personalvoice/', // 后端提供数据的 URL  
    header: {
      'Authorization': "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Im9nZXMiLCJleHAiOjE3MTAwODIyNDgsImVtYWlsIjoiIn0.aZ251E4uD8VR4gG0M7obTHwIMGSSLjXny8swmZymwxQ" ,
    },
    success: res => {  
      // 数据获取成功处理逻辑  
    console.log(res.data);
    console.log(res);
     app.globalData.urls = res.data.data.items.map(items => items.url); 
    console.log(app.globalData.urls);
      
      
       // 在控制台打印获取的数据  
    },  
    fail:err =>  {  
      // 数据获取失败处理逻辑  
      console.log(err); // 在控制台打印错误信息  
    }  
 });
  const urlIndex = 0; // 获取按钮索引  
  console.log(app.globalData.urls);
  const url1 =app.globalData.urls[0];
  const innerAudioContext = wx.createInnerAudioContext();  
    
  // 设置音频文件的URL  
  innerAudioContext.src = url1;  
    
  // 开始播放音频  
  innerAudioContext.play();
}  ,
onButtonClick2: function(event) {  
  wx.request({ 
    url: 'https://crowdofvoice.top:443/personalvoice/', // 后端提供数据的 URL  
    header: {
      'Authorization': "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Im9nZXMiLCJleHAiOjE3MTAwODIyNDgsImVtYWlsIjoiIn0.aZ251E4uD8VR4gG0M7obTHwIMGSSLjXny8swmZymwxQ" ,
    },
    success: res => {  
      // 数据获取成功处理逻辑  
    console.log(res.data);
    console.log(res);
     app.globalData.urls = res.data.data.items.map(items => items.url); 
    console.log(app.globalData.urls);
      
      
       // 在控制台打印获取的数据  
    },  
    fail:err =>  {  
      // 数据获取失败处理逻辑  
      console.log(err); // 在控制台打印错误信息  
    }  
 });
  // 处理按钮点击事件，实现跳转功能  
  const urlIndex = 1; // 获取按钮索引  
  // 创建一个音频上下文对象  
  const url2 =app.globalData.urls[urlIndex];
const innerAudioContext = wx.createInnerAudioContext();  
  
// 设置音频文件的URL  
innerAudioContext.src = url2;  
  
// 开始播放音频  
innerAudioContext.play();
}  ,
onButtonClick3: function(event) {  
  // 处理按钮点击事件，实现跳转功能  
  const urlIndex = 2; // 获取按钮索引  
   // 获取对应的URL  
  const url3 =app.globalData.urls[urlIndex];
  // 创建一个音频上下文对象  
const innerAudioContext = wx.createInnerAudioContext();   
  
// 设置音频文件的URL  
innerAudioContext.src = url3;  
  
// 开始播放音频  
innerAudioContext.play();

    // 要打开的外部 URL  
  
}  ,
onButtonClick3: function(event) {  
  // 处理按钮点击事件，实现跳转功能  
  wx.request({ 
    url: 'https://crowdofvoice.top:443/personalvoice/', // 后端提供数据的 URL  
    header: {
      'Authorization': "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Im9nZXMiLCJleHAiOjE3MTAwODIyNDgsImVtYWlsIjoiIn0.aZ251E4uD8VR4gG0M7obTHwIMGSSLjXny8swmZymwxQ" ,
    },
    success: res => {  
      // 数据获取成功处理逻辑  
    console.log(res.data);
    console.log(res);
     app.globalData.urls = res.data.data.items.map(items => items.url); 
    console.log(app.globalData.urls);
      
      
       // 在控制台打印获取的数据  
    },  
    fail:err =>  {  
      // 数据获取失败处理逻辑  
      console.log(err); // 在控制台打印错误信息  
    }  
 });
  const urlIndex = -1; // 获取按钮索引  
   // 获取对应的URL  
  const url4 =app.globalData.urls[urlIndex];
  // 创建一个音频上下文对象  
const innerAudioContext = wx.createInnerAudioContext();   
  
// 设置音频文件的URL  
innerAudioContext.src = url4;  
  
// 开始播放音频  
innerAudioContext.play();

    // 要打开的外部 URL  
  
}  ,
});