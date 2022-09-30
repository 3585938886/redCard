// pages/shareHome/shareHome.ts
import { navigateTo, request,reLaunch } from "../../utils/common"
const { getuserinfo, get_dynamics_list, follow } = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navs: [
      // {
      //   name: "简介"
      // },
      {
        name: "笔记",
        nums:'0'
      }
    ],
    isguanzhu: false,
    currentNav: 1,
    share: false,
    isShowPopup: false,
    info: '',
    id: '',
    noLength:false,
    page:1,
    dynamics_list:[],
    dynamics_type:false,
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options: any) {
    let userId = wx.getStorageSync("info").id
    console.log(options)
    let id = options.id ? options.id : wx.getStorageSync("info").id
    const result: any = await request(false, getuserinfo, "GET", {
      card_id: id
    })
    // wx.setStorageSync("lastSaveUser",id)//最后访问者留存id，以备下次打开使用
    let dynamics_list = await this.get_dynamics_list(options.id);
    let data=dynamics_list.data.data.data;
    let navs = this.data.navs
    navs[0].nums = result.data.data.dynamics || '0'
    this.setData({
      info: result.data.data,
      share: options.share ? options.share : false,
      id,
      navs,
      userId,
      dynamics_type:data.length?false:true,
      dynamics_list:data,
      noLength:data.length>=10?true:false,
      loading:false,
    })
  },
  toCard() {
    reLaunch(`/pages/myCard/myCard?id=${this.data.info.id}`)
  },
  onShow(){
    this.setData({
      currentNav:1
    })
  },
  guanzhu() {
    this.setData({
      isguanzhu: !this.data.isguanzhu
    })
  },

  async get_dynamics_list(id: Number | String) {
    const result: any = await request(false, get_dynamics_list, "GET", {
      card_id: id ? id : wx.getStorageSync("info").id,
      pageSize: 10,
      page:  this.data.page
    })
    return result
  },
  nav(e: any) {
    let { index,id } = e.currentTarget.dataset;
    this.setData({
      currentNav: index
    })
    if (index == 0) {
      navigateTo(`/pages/index/index?id=${id}`)
      this.get_dynamics_list(this.data.id)
    }
  },
  closePopup() {
    this.setData({
      isShowPopup: !this.data.isShowPopup
    })
  },
  async follow() {
    let info: any = this.data.info;
    const result: any = await request(false, follow, "GET", {
      uuid: this.data.id ? this.data.id : wx.getStorageSync("info").id,
      type: info.is_follow? 2 : 1
    })
    result.data.code == 0 ?
      this.setData({
        'info.is_follow': info.is_follow?false:true
      }) : wx.showToast({
        title: result.data.message,
        icon: "none"
      })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    let info:any=this.data.info;
    return {
      title: `${info.name}的主页`,
      path: `/pages/shareHome/shareHome?share=true&id=${this.data.id}`
    }
  },
  scrolltolower(){
    if(!this.data.noLength && this.data.currentNav ==1) return;
    this.setData({
      page:++this.data.page
    },async ()=>{
      let dynamics = await this.get_dynamics_list(this.data.id);
      let dynamics_list=this.data.dynamics_list.concat(dynamics.data.data.data);
      this.setData({
        dynamics_list,
        noLength:dynamics.data.data.data.length>=10?true:false
      })
    })
  }
})