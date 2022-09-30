// pages/videoInfo/videoInfo.ts
import {showToast, request ,navigateTo,navigateBack} from "../../utils/common";
const util = require('../../utils/util')
// let
let currentVideo 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collection:'',
    info:{},
    video_img:'',
    contentWords:'',
    noLength:false,
    comment:[],
    page:1,
    showBtc:false,
    uid:"",
    is_follow:false,
    share:false,
    share2:'',
    is_zan:false,
    is_collection:false,
    dynamic_id:0,
    dynamics_info:{
      title:'',
      zan:0,
      video_img:''
    },
    zan:0,
    star:0,
     isshow:false,
     currentVideo : 'http://zy-znmp.oss-cn-shanghai.aliyuncs.com/2021-12-22_1640167582_61c2f89e9cd3f.mp4'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
    let uid1 = wx.getStorageSync("info").id
    console.log(options,555)
    this.setData({
      id:options.id,
      uid1:uid1,
      dynamic_id:options.id,
      typedel:options.typedel,
      collection:options.collection,
      share2:options.share2 || ''
    })
    this.getVideoInfo(options.id)
    // console.log(util)
    // this.aaa()
  },
  // 查看全部
  seeAll(){
    this.setData({
      showWordAll:true
    })
  },
  hideAll(){
    this.setData({
      showWordAll:false
    })
  },
  contentInput(e:any){
    this.setData({
      contentWords:e.detail.value
    })
},
  // 获取评论列表
  async getCommentList(){
    let that = this
    let res:any = await request(false,util.commentList,'GET',{
      dynamics_id:that.data.dynamic_id,
      page:that.data.page,
      pageSize:8,
     })
     if(res.data.code == 0){
      this.setData({
        comment:res.data.data.data,
        noLength:res.data.data.data.length>=8?true:false
      })
     }
  },
async contentConfirm(){
  let that = this
  if(that.data.contentWords.trim()==''){
      showToast('评论内容不能为空！')
  }
  let res:any = await request(false,util.addComment,'POST',{
    dynamics_id:that.data.dynamic_id,
    content:that.data.contentWords
  })
  if(res.data.code == 0){
    showToast('评论成功')
    // let time = this.getTimes()
      this.addContent(that.data.contentWords,res.data.data)
    that.setData({
      contentWords:''
    })
  }else{
    showToast(res.data.message)
  }
},
// add0(m:any){return m<10?'0'+m:m },
// getTimes() {
//   let time = new Date();
//   let y = time.getFullYear();
//   let m = time.getMonth() + 1;
//   let d = time.getDate()
//   return y+'-'+this.add0(m)+'-'+this.add0(d)
// },
// 数据软添加
addContent(words: any,data:any) {
  let info = wx.getStorageSync("info")
  let obj:any = {
    get_user_info: {
      head: info.head,
      name: info.name,
      id: info
    },
    content: words,
    created_at:'刚刚',
    support:0,
    tread:0,
    id:data.id,
    reply_count:0
  }  
  let comment:any = this.data.comment
      comment.unshift(obj);
  this.setData({
    comment,
  })
},
  dynamic() {
    this.setData({
      showBtc: true
    })
    // navigateTo(`/pages/release/release`)
  },
  closeBottom(){
    this.setData({
      showBtc: false
    })
  },
    // 点赞和取消点赞
 async setZan(){   
  let that =this
  let zan = that.data.zan
  if(that.data.is_zan){
      // 已经点赞过了此时为取消点赞
      let res:any = await request(false,util.support,'GET',{ 
        dynamic_id: that.data.dynamic_id ,
        type:2
       })
      if(res.data.code == 0){      
        this.setData({
          is_zan:!that.data.is_zan,
          zan:zan-1
        })
      }
  }else{
    let res:any = await request(false,util.support,'GET',{ 
      dynamic_id: that.data.dynamic_id ,
      type:1
     })
    if(res.data.code == 0){
      this.setData({
        is_zan:!that.data.is_zan,
        zan:zan+1
      })
    }
  }

},
// 收藏与取消收藏
async setStar(){
  let that =this
  let star = that.data.star
  if(that.data.is_collection){
      // 已经点赞过了此时为取消点赞
      let res:any = await request(false,util.collection,'GET',{ 
        dynamic_id: that.data.dynamic_id ,
        type:2
       })
      if(res.data.code == 0){      
        this.setData({
          is_collection:!that.data.is_collection,
          star:star-1
        },()=>{
          if(that.data.collection=="collection"){
            that.changeCollection()
          }
        })
      }
  }else{
    let res:any = await request(false,util.collection,'GET',{ 
      dynamic_id: that.data.dynamic_id ,
      type:1
     })
    if(res.data.code == 0){
      this.setData({
        is_collection:!that.data.is_collection,
        star:star+1
      },()=>{
        if(that.data.collection=="collection"){
          that.changeCollection()
        }
      })
    }
  }
},
// 收藏与取消收藏操作收藏列表
changeCollection(){
  let pages = getCurrentPages()
  let prevPage = pages[pages.length - 2]
  let work = prevPage.data.collectionLists
  if(!this.data.is_collection){
    let arr = work.filter((item:any) => {
      if(item.dynamic_id != this.data.dynamic_id){
          return item
      }
    })
    prevPage.setData({
      collectionLists:arr
    })
  }else{  
      let addItem: any = {
        get_author_info:{}
      }
      let info:any = this.data.info
      addItem.get_author_info.head = info.head
      addItem.get_author_info.name = info.name
      addItem.title = this.data.dynamics_info.title
      addItem.dynamic_id = this.data.dynamic_id
      addItem.zan = this.data.dynamics_info.zan
        addItem.type = 2
        addItem.video_img = this.data.dynamics_info.video_img
      prevPage.data.collectionLists.unshift(addItem)
     prevPage.setData({
      collectionLists:prevPage.data.collectionLists
      })
  }

},
  async getVideoInfo(id:string){
        let dynamics_info:any = await request(false,util.get_dynamics_info,'GET',{
          id:id
        })
         if(dynamics_info.data.code == 0){
          this.setData({
            dynamics_info:dynamics_info.data.data,
            is_zan:dynamics_info.data.data.is_zan,
            is_collection:dynamics_info.data.data.is_collection,
            zan:dynamics_info.data.data.zan,
            star:dynamics_info.data.data.star,
            is_follow:dynamics_info.data.data.get_author_info.is_follow,
            uid:dynamics_info.data.data.get_author_info.id,
            video_img:dynamics_info.data.data.video_img,
            info:{
              head:dynamics_info.data.data.get_author_info.head,
              user:dynamics_info.data.data.get_author_info.name,
              id:dynamics_info.data.data.get_author_info.id
            }
          })
          let res: any = await request(false, util.commentsCount, 'GET', { dynamics_id: id })
          if (res.data.code == 0) {
            this.setData({
              countNum: res.data.data
            })
          }
          this.getCommentList() // 获取评论列表
      } else if(dynamics_info.data.code == -2){
          showToast(dynamics_info.data.message)
          let timer = setTimeout(()=>{
            clearTimeout(timer)
           navigateTo(`/pages/shareHome/shareHome?id=${dynamics_info.data.data}`)
          },1000)
         }else{
          showToast(dynamics_info.data.message)
         }
  },
  // 关注与取消关注
  async setCare(){
    let that = this
    let res:any = await  await request(false,util.follow,'GET',{ 
      uuid:that.data.uid,
      type:that.data.is_follow?2:1
     })
     if(res.data.code == 0){
      this.setData({
        is_follow:!that.data.is_follow
      })
     }
  },
    //暂定播放
    play() {
       currentVideo = wx.createVideoContext('video') //如果当前视频实例不存在就创建
      if(this.data.isshow){
        this.data.isshow=false;
          currentVideo.play()
      }else{
        this.data.isshow=true;
          currentVideo.pause()
      }
      this.setData({
        isshow:this.data.isshow
      })
  },
  home(e:any){
    let {id} =e.currentTarget.dataset;
    navigateTo(`/pages/shareHome/shareHome?id=${id}`)
  },
   //  删除信息
   delItem(){
    let that = this
   wx.showModal({
     title: '确定要删除当前作品吗？',
     content: '',
     async  success(res) {
       if (res.confirm) {
         console.log('用户点击确定')
         let data:any = await request(false,util.dynamics_del,'GET',{id:that.data.dynamic_id})
         if(data.data.code == 0){
           that.delNextItem()
         }
         showToast(data.data.message)
       } else if (res.cancel) {
         console.log('用户点击取消')
       }
     }
   })
 },

 // 软删除作品
  delNextItem(){
   let pages = getCurrentPages()
   let prevPage = pages[pages.length - 2]
   let work = prevPage.data.work
   let arr = work.filter((item:any) => {
     if(item.id != this.data.dynamic_id){
         return item
     }
   })
   prevPage.setData({
     work:arr
   })
   navigateBack()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(!this.data.noLength) return;
    let that = this
    this.setData({
      page:++this.data.page
    },async ()=>{
      let res:any = await request(false,util.commentList,'GET',{
        dynamics_id:that.data.dynamic_id,
        page:that.data.page,
        pageSize:8,
       })
      let comment=this.data.comment.concat(res.data.data.data);
      this.setData({
        comment,
        noLength:res.data.data.data.length>=8?true:false
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    let that =this
    return {
      title: that.data.dynamics_info.title,
      imageUrl:that.data.video_img,
      path: '/pages/videoInfo/videoInfo?share2=share&id=' + that.data.dynamic_id
    }
  },
  onShareTimeline(){
    let that =this
    return {
      title: that.data.dynamics_info.title,
      query:'share2=share&id=' + that.data.dynamic_id,
      path: '/pages/videoInfo/videoInfo?share2=share&id=' + that.data.dynamic_id
    }
  }
})