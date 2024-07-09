const app = getApp()
Page({
	data: {
		ctx: null,
		isRecording: false,
		video_url: null,
		time: 0,
		min_time:5,	//录制视频最小时长
		timer: null,
		devicePosition: "back", //摄像头朝向
		isStart:false, //记录用户点击开始录制的状态
		isStop:false //记录用户点击结束录制的状态
	},
	onLoad(options) {
		const ctx = wx.createCameraContext()
		this.setData({
			ctx
		})
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
		if(this.data.isStart){
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
			fail:(err)=>{
				console.log(err)
				this.data.isStart = false
			}
		})
	},
	//结束录制
	stopRecord() {
		//stopRecord方法不可连续调用，否则无法停止录制
		//这里定义一个状态isStop来记录用户点击结束录制行为，待stopRecord接口请求成功后还原状态
		if(this.data.isStop){
			return
		}
		if(this.data.time<this.data.min_time){
			wx.showToast({
				title:"视频时长小于"+this.data.min_time+"秒",
				icon:"none"
			})
			return
		}
		wx.showLoading({
			title:"请稍候"
		})
		this.data.isStop = true
		this.data.ctx.stopRecord({
			//compressed: false,  //是否压缩录完的视频
			success: (res) => {
				console.log(res)
				clearInterval(this.data.timer)
				this.setData({
					video_url: res.tempVideoPath,
					isRecording: false
        })
        app.globalData.videourl=res.tempVideoPath
				this.data.isStop = false
				wx.hideLoading()
			},
			fail(err){
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
		let timer = setInterval(function() {
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
	}
})