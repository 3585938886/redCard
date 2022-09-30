import { navigateTo,request,redirectTo } from "../../utils/common";
const util = require('../../utils/util')
// pages/top/top.ts
const app_chiled=getApp();
const common2=require("../../utils/common")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bg_color: {
      type: String,
      observer: function (val) {
        this.setData({
          bg_color: val
        })
      }
    },
    isBack:{
      type:Boolean,
      default:false,
      observer:function(val){
        this.setData({
          isBack:val
        })
      }
    },
    fixed:{
      type:Number,
      default:false,
      observer: function (val) {
        this.setData({
          fixed: val
        })
      }
    },
    type:{
      type:Number,
      observer: function (val) {
        this.setData({
          type: val
        })
      }
    },
    info:{
      type:Object,
      observer:function(val){
        this.setData({
          info:val,
          is_follow:val.is_follow
        })
      }
    },
    find:{
      type:String,
      observer:function(val){
        this.setData({
             find:val
        })
      }
    },
    share2:{
      type:String,
      observer:function(val){
        this.setData({
          share2:val
        })
      }
    },
  },
  lifetimes:{
    attached(){
      let uid1 = wx.getStorageSync("info").id
       this.setData({
          isme:this.page(),
          uid1
       })
    },
  },
  options:{
     addGlobalClass:true
  },
  /**
   * 组件的初始数据
   */
  data: {
    find:'',
    is_follow:false,
    customBar: app_chiled.globalData.customBar,
    statusBarHeight: app_chiled.globalData.statusBarHeight,
    isme:false
  },
  /**
   * 组件的方法列表
   */
  methods: {
     // 关注与取消关注
  async setCare(e:any){
    let {
      uid
    } = e.currentTarget.dataset
    let that = this
    let res:any = await  await request(false,util.follow,'GET',{ 
      uuid:uid,
      type:that.data.is_follow?2:1
     })
     if(res.data.code == 0){
      this.setData({
        is_follow:!that.data.is_follow
      })
     }
  },
    back(){
      common2.navigateBack()
    },
    find(e:any){
      let {type} =e.currentTarget.dataset;
      if(this.data.isme && type=="me") return ;
      if(this.data.find!='index'&&type=="send"){
        wx.reLaunch({
          url:`/pages/find/find?newOnce=true`
        })
      }else if(type=="me"){
        common2.navigateTo(`/pages/me/me`)
      }
      // type=="send"?wx.reLaunch({
      //   url:`/pages/find/find?newOnce=true`
      // }):common2.navigateTo(`/pages/me/me`)
    },
    page(){
      let pages = getCurrentPages(); // 页面对象
      // let prevpage = pages[pages.length - 2]; // 上一个页面对象
      let currentPage = pages[pages.length - 1]; //当前页面对象
      // let path = prevpage.route; // 上页路由
      let currentPath = currentPage.route; //当前路由
      return "pages/me/me" == currentPath
    },
    home(e:any){
      let {id} =e.currentTarget.dataset;
      redirectTo(`/pages/shareHome/shareHome?id=${id}`)
    }
  }
})
