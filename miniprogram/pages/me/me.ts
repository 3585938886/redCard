// pages/me/me.ts
import { navigateTo, reLaunch, request, showToast } from "../../utils/common"
const { getConf, getuserinfo, get_dynamics_list, followList, follow, collectionList } = require("../../utils/util");
let app1 = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBtc: false,
    isShowPopup: true,
    customBar: app1.globalData.customBar,
    statusBarHeight: app1.globalData.statusBarHeight,
    currentNav: 0,
    navs: [
      {
        name: "笔记",
        nums: '0'
      },
      {
        name: "收藏"
      },
      {
        name: "关注"
      },
    ],
    work: [],
    visitorLists: [],
    collectionLists: [],
    type: 2,
    info: "",
    pages: [
      {
        noLength: false,
        page: 1,
        show: false
      }, {
        noLength: false,
        page: 1,
        show: false
      },
      {
        noLength: false,
        page: 1,
        show: false
      }, {
        noLength: false,
        page: 1,
        show: false
      }
    ],
    loading: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    const result: any = await request(false, getuserinfo, "GET", {
      card_id: ''
    })
    const res: any = await request(false, getConf, "GET", {})
    let navs = this.data.navs
    navs[0].nums = result.data.data.dynamics || '0'
    this.setData({
      info: result.data.data,
      dynamics: res.data.data.dynamics,
      navs
    })
    wx.setStorageSync("info", result.data.data);
    this.dynamics_list()
  },
  showInfo(e: any) {
    let { id } = e.currentTarget.dataset;
    navigateTo(`/pages/shareHome/shareHome?id=${id}`)
    // console.log(id)
  },
  attestation() {
    navigateTo(`/pages/editMaterials/editMaterials`)
  },
  // 点击标签事件 去往好友列表
  tofriendsList(e: any) {
    let {title,thisid}=e.currentTarget.dataset;
    navigateTo(`/pages/friendsList/friendsList?title=${title}&thisid=${thisid}`)
  },
  //获取子组件  work 传参
  onMyEvent: function (e: any) {
    // let list = e.detail
    if (e.detail == 1) {
      this.dynamics_list()
    }
  },
  async dynamics_list() {
    let pages = this.data.pages;
    const result: any = await request(false, get_dynamics_list, "GET", {
      card_id: wx.getStorageSync("info").id || '',
      keyword: "",
      pageSize: 10,
      page: pages[0].page
    })
    this.data.work = []
    let data = result.data.data.data;
    let work = this.data.work.concat(data);//分页数据拼接
    pages[0].noLength = data.length >= 10 ? true : false; //是否分页加载
    pages[0].show = work.length ? false : true //是否有数据
    this.setData({
      work,
      pages,
      loading: false
    })
  },
  find() {
    navigateTo(`/pages/find/find`)
  },
  toCard() {
    reLaunch(`/pages/myCard/myCard?id=${this.data.info.id}`)
  },
  async collection() {
    let pages = this.data.pages;
    const result: any = await request(false, collectionList, "GET", {
      page: pages[1].page,
      pageSize: 10,
    })
    let data = result.data.data.data;
    let collectionLists = this.data.collectionLists.concat(data);//分页数据拼接
    pages[1].noLength = data.length >= 10 ? true : false; //是否分页加载
    pages[1].show = collectionLists.length ? false : true //是否有数据
    this.setData({
      collectionLists,
      pages,
    })
  },
  nav(e: any) {
    let { index } = e.currentTarget.dataset;
    this.navList(index)
    this.data.currentNav == index ? '' :
      this.setData({
        currentNav: index
      })
  },
  navList(index: number) {
    switch (index) {

      case 0:
        this.data.work.length ? '' : this.dynamics_list()
        break;
      case 1:
        this.data.collectionLists.length ? '' : this.collection()
        break;
      case 2:
        this.data.visitorLists.length ? '' : this.followList()
        break;
    }
  },
  caozuo(e: any) {
    let { type } = e.currentTarget.dataset;
    type == 1 ? navigateTo(`/pages/editMaterials/editMaterials`) : ''
  },
  async followList() {
    let pages = this.data.pages;
    const result: any = await request(false, followList, "GET", {
      page: pages[2].page,
      pageSize: 10,
    })
    let data = result.data.data.data;
    let visitorLists = this.data.visitorLists.concat(data);//分页数据拼接
    pages[2].noLength = data.length >= 10 ? true : false; //是否分页加载
    pages[2].show = visitorLists.length ? false : true //是否有数据
    this.setData({
      visitorLists: visitorLists,
      pages,
    })
  },
  async follow(id: number, index: number) {
    let visitorLists: any = this.data.visitorLists;
    visitorLists[index].show = !visitorLists[index].show
    const result: any = await request(false, follow, "GET", {
      uuid: id,
      type: visitorLists[index].show ? 2 : 1
    })

    result.data.code == 0 ?
      this.setData({
        visitorLists,
      }) : wx.showToast({
        title: result.data.message,
        icon: "none"
      })
  },
  dynamic() {
    this.setData({
      showBtc: true
    })
    // navigateTo(`/pages/release/release`)
  },
  goDynamic(e: any) {
    let {
      type
    } = e.currentTarget.dataset
    this.setData({
      showBtc: false
    })
    // console.log(e)
    navigateTo(`/pages/release/release?type=` + type)
  },
  clearBtc() {
    this.setData({
      showBtc: false
    })
  },
  guanzhu(e: any) {
    let { index, id } = e.currentTarget.dataset;
    let that = this;
    let visitorLists: any = this.data.visitorLists;
    if (visitorLists[index].show) {
      that.follow(id, index)
    } else {
      wx.showModal({
        title: '确认取消关注',
        content: '',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.follow(id, index)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  async onShow() {
    // // this.dynamics_list()
    // const result: any = await request(false, getuserinfo, "GET", {
    //   card_id: ''
    // })
    // this.setData({
    //   info: result.data.data
    // })
  },
  scrolltolower() {
    let pages = this.data.pages, currentNav = this.data.currentNav;
    if (!pages[currentNav].noLength) return;
    ++pages[currentNav].page
    this.setData({
      pages
    }, () => {
      // this.navList(currentNav)
      switch (currentNav) {
        case 0:
          this.dynamics_list()
          break;
        case 1:
          this.collection()
          break;
        case 2:
          this.followList()
          break;
      }
    })
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage() {
    let info: any = this.data.info;
    return {
      title: "我的分享主页",
      path: `/pages/shareHome/shareHome?share=true&id=${info.id}`
    }
  }
})