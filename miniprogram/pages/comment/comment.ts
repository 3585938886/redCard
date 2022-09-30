// pages/comment.ts
import {  request ,showToast} from "../../utils/common";
const util = require('../../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    comments:{
      type:Array,
      observer:function(val){
        this.setData({
          comment:val
        })
      }
    },
    uid:{
      type:Number,
      observer:function(val){
        this.setData({
          uid:val
        })
      }
    },
    dynamicsid:{
      type:String,
      observer:function(val){
        this.setData({
          dynamics_id:val
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    comment:[
      {
        is_support:false,
        support:0
      }
    ],
    moreShow:false,
    moreComment:[],
    replyName:'',
    dynamics_id:'',
    comments_id:'',
    comments_reply_id:'',
    comments_reply_user_id:'',
    content:'',
    id:0,
    showMore:true,
    page2:1
  }, 
  options: {
    styleIsolation:"apply-shared",
    // addGlobalClass: true,
  },
  lifetimes: {
    ready() {
  
    },

    detached(){

    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    wordsInput(e:any){
        this.setData({
          content:e.detail.value
        })
    },
 async   contentReply(){
  let that = this
  if (that.data.content.trim() == '') {
    showToast('评论内容不能为空！')
  }
  let res:any = await request(false, util.replyComment, 'POST', {
    dynamics_id:that.data.dynamics_id,
    comments_id:that.data.comments_id,
    comments_reply_id:that.data.comments_reply_id,
    comments_reply_user_id:that.data.comments_reply_user_id,
    content:that.data.content,
  })
  if (res.data.code == 0) {
    showToast('评论成功')
    // let child = this.selectComponent('#comment')
    //     child.openComments()
    // let time = this.getTimes()
     this.addContent(that.data.content,res.data.data)
  } else {
    showToast(res.data.message)
  }
    },
 // 数据软添加
 addContent(words: any,data:any) {
  let info = wx.getStorageSync("info")
  let obj:any = {
    get_user_info: {
      head: info.head,
      name: info.name,
      id: info
    },
    get_comments_reply_user_info:{
      name:this.data.replyName
    },
    content: words,
    created_at:'刚刚',
    support:0,
    tread:0,
    comments_id:data.comments_id,
    comments_reply_id:data.comments_reply_id,
    comments_reply_user_id:data.comments_reply_user_id,
    user_id:data.user_id,
    id:data.id
  }
  let moreComment = this.data.moreComment.concat(obj);
  this.setData({
    moreComment,
    replyName:'',
    content:''
  })
},
   async openComments(e:any){
     let that = this
      // 发送请求回复评论列表
      let {
        id
      } = e.currentTarget.dataset
      let res:any = await request(false,util.commentReplyList,'GET',{
        comments_id:id,
        page:that.data.page2,
        pageSize:8,
      })
      this.setData({
         moreShow:true,
         showMore:false,
         moreComment:res.data.data.data,
         zkid:id
      })
   },
   async openComments2(e:any){
    let that = this
    // 发送请求回复评论列表
    let {
      id
    } = e.currentTarget.dataset
    let page2 = that.data.page2 + 1
    let res:any = await request(false,util.commentReplyList,'GET',{
      comments_id:id,
      page:page2,
      pageSize:8,
    })
    if(!res.data.data.data.length){
      this.setData({
        closeMoreBtn:true
      })
      return
    }
    let moreComment = this .data.moreComment.concat(res.data.data.data)
    this.setData({
      page2,
       showMore:false,
       moreComment,
       zkid:id
    })
   },
   closeComments(){
     this.setData({
       showMore:true,
       moreShow:false,
       page:1,
       page2:1,
       closeMoreBtn:false
    })
   },
   reply(e:any){
     let {
      deplyform
     } = e.currentTarget.dataset
      this.setData({
        replyName:deplyform.get_user_info.name,
        comments_id:deplyform.comments_id||deplyform.id,
        comments_reply_id:deplyform.comments_id?deplyform.id:'',
        comments_reply_user_id:deplyform.comments_id?deplyform.user_id:'',
      })
   },
   closeReply(){
     this.setData({
      replyName:'',
      dynamics_id:'',
      comments_id:'',
      comments_reply_id:'',
      comments_reply_user_id:'',
      content:'',
     })
   },
  //  主评论点赞
  async  setZan(e:any){
    let that = this
    // let zan = that.data.zan
    let {
      index,
      type
    } = e.currentTarget.dataset
    let item:any  = that.data.comment[index]
    // 点赞还是踩
    if(type==1){
      // 点赞还是取消点赞
      if (!item.is_support) {
        // 已经点赞过了此时为取消点赞
        let res:any = await request(false, util.supportComment, 'GET', {
          comments_id: item.id,
          type: 1,
          author_id:that.data.uid
        })
        if (res.data.code == 0) {
          item.is_support = true
          ++item.support
        }
      } else {
        let res:any  = await request(false, util.supportComment, 'GET', {
          comments_id: item.id,
          type: 2,
          author_id:that.data.uid
        })
        if (res.data.code == 0) {
          item.is_support = false
          --item.support
        }
      }
    }else{
      if (!item.is_tread) {
        // 已经点赞过了此时为取消踩
        let res:any = await request(false, util.treadComment, 'GET', {
          comments_id: item.id,
          type: 1,
          author_id:that.data.uid
        })
        if (res.data.code == 0) {
          item.is_tread = true
          ++item.tread
        }
      } else {
        let res:any  = await request(false, util.treadComment, 'GET', {
          comments_id: item.id,
          type: 2,
          author_id:that.data.uid
        })
        if (res.data.code == 0) {
          item.is_tread = false
          --item.tread
        }
      }
    }
    this.setData({
      comment:that.data.comment
    })
   },
     //  回复评论点赞、取消点赞
  async  setZan2(e:any){
    let that = this
    // let zan = that.data.zan
    let {
      index,
      type
    } = e.currentTarget.dataset
    let item:any  = that.data.moreComment[index]
    // 点赞还是踩
    if(type==1){
      // 点赞还是取消点赞
      if (!item.is_support) {
        // 已经点赞过了此时为取消点赞
        let res:any = await request(false, util.commentReplySupport, 'GET', {
          comments_reply_id: item.id||'',
          type: 1,
          dynamics_id:that.data.dynamics_id
        })
        if (res.data.code == 0) {
          item.is_support = true
          ++item.support
        }
      } else {
        let res:any  = await request(false, util.commentReplySupport, 'GET', {
          comments_reply_id: item.id||'',
          type: 2,
          dynamics_id:that.data.dynamics_id
        })
        if (res.data.code == 0) {
          item.is_support = false
          --item.support
        }
      }
    }else{
      if (!item.is_tread) {
        // 已经点赞过了此时为取消踩
        let res:any = await request(false, util.commentReplyTread, 'GET', {
          comments_reply_id: item.comments_reply_id||'',
          type: 1,
          dynamics_id:item.id||''
        })
        if (res.data.code == 0) {
          item.is_tread = true
          ++item.tread
        }
      } else {
        let res:any  = await request(false, util.commentReplyTread, 'GET', {
          comments_reply_id: item.comments_reply_id||'',
          type: 2,
          dynamics_id:that.data.dynamics_id
        })
        if (res.data.code == 0) {
          item.is_tread = false
          --item.tread
        }
      }
    }
    this.setData({
      moreComment:that.data.moreComment
    })
   },
  }
})
