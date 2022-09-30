// pages/music/music.ts
let app = getApp();
let innerAudioContext = wx.createInnerAudioContext();
// 创建动画
const animation = wx.createAnimation({
  duration: 1000,
  timingFunction: "linear"
})
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bgm_music:{
       type:String,
       observer:function(val){
         this.setData({
           bgm_music:val
         })
       }
    }
  },
  options: {
    addGlobalClass: true
  },
  lifetimes: {
    ready() {
      // 执行旋转或者点击图片旋转(如果你想要点击就在图片上添加点击事件我默认是添加的)
      this.audioContext(this.data.bgm_music)
      this.refreshList()
    },
    // detached(){
    //   this.onPause()
    //   innerAudioContext.offPlay(()=>{
    //      console.log("取消播放监听")
    //   })
    //   innerAudioContext.offPause(()=>{
    //     console.log("取消暂停监听")
    //   })
    //   clearInterval(this.data.setIntervals) //播放动画清除
    // },
  },
  pageLifetimes:{
    hide: function() {
      this.onPause()
      innerAudioContext.offPlay(()=>{
         console.log("取消播放监听")
      })
      innerAudioContext.offPause(()=>{
        console.log("取消暂停监听")
      })
      clearInterval(this.data.setIntervals) //播放动画清除
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    customBar: app.globalData.customBar,
    rotateIndex: 1,
    setIntervals: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    refreshList() {
      let that = this;
      let setIntervals = setInterval(() => {
        this.data.rotateIndex = this.data.rotateIndex + 1;
        animation.rotate(180 * (this.data.rotateIndex - 1)).step()
        that.setData({
          animationData: animation.export(),
          rotateIndex: that.data.rotateIndex,
          setIntervals
        })
      }, 1000)
    },
    // 是否停止旋转
    stopRefresh() {
      if (this.data.setIntervals > 0) {
        clearInterval(this.data.setIntervals)
        this.onPause()
        this.setData({
          setIntervals: 0
        })
      } else {
        this.onPlay()
        this.refreshList()
      }
    },
    audioContext(bgm_music: string) {
      innerAudioContext.loop = true
      innerAudioContext.src = bgm_music
      this.onPlay()
    },
    onPlay(){
      innerAudioContext.play()
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    },
    onPause() {
      innerAudioContext.pause()
      innerAudioContext.onPause(() => {
        console.log('播放暂停')
      })
    },
  }
})
