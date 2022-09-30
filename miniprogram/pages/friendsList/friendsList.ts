// pages/friendsList/friendsList.ts
import { navigateTo, navigateBack, request, chooseMedia, showToast, previewImage, getFormDataParams } from "../../utils/common";
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    thisid: '',
    allList:-1,
  },
  // 点击已关注
  async focus(e: any) {
    let res: any = await request(false, util.follow, 'GET', {
      uuid:e.currentTarget.dataset.id,
      type:'2'
    })
      if (res.data.code === 0) {
        this.getList()
        showToast("已取消关注")
      }else{
        showToast(res.data.message)
      }
  },
  // 点击关注
  async nofocus(e: any) {
    let res: any = await request(false, util.follow, 'GET', {
      uuid:e.currentTarget.dataset.id,
      type:'1'
    })
      if (res.data.code === 0) {
        this.getList()
        showToast("已成功关注")
      }else{
        showToast(res.data.message)
      }
  },

  //获取好友列表
  async getList() {
    if (this.data.thisid === '1') {
      let res: any = await request(false, util.villagersList, 'GET', {})
      if (res.data.code === 0) {
        this.setData({
          allList: res.data.data.data
        })
      }
      console.log(this.data.allList, 'allListallList')
    } else if (this.data.thisid === '2') {
      // console.log(2)
    } else if (this.data.thisid === '3') {
      let res: any = await request(false, util.alumnusList, 'GET', {})
      if (res.data.code === 0) {
        this.setData({
          allList: res.data.data.data
        })
      }
      console.log(this.data.allList, 'allListallList')
    }
    // if (1) {
    //   let res: any = await request(false, util.alumnusList, 'GET', {})
    //   if (res.data.code === 0) {
    //     this.setData({
    //       classmateList: res.data.data
    //     })
    //   }
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      title: options.title,
      thisid: options.thisid
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    })
    this.getList()
  },

    //点击名片去往他人主页
    toOther(e: any){
      navigateTo(`/pages/shareHome/shareHome?id=${e.currentTarget.dataset.id}`)
    },
})