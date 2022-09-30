// pages/fanList/fanList.ts
import { request,navigateTo } from "../../utils/common";
const {fansList,follow} = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:3,
    page:1,
    noLength:false,
    visitorLists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 获取粉丝列表
    this.visitorList()
  },
  showInfo(e: any) {
    let { id } = e.currentTarget.dataset;
    navigateTo(`/pages/shareHome/shareHome?id=${id}`)
    // console.log(id)
  },
  async visitorList() {
    let that = this
    const result: any = await request(false, fansList, "GET", {
      pageSize: 10,
      page: that.data.page
    })
    console.log(result,"result")
    let data=result.data.data.data;
    let visitorLists=that.data.visitorLists.concat(data);
    this.setData({
      visitorLists,
      worktype:visitorLists.length<10?false:true,
      noLength:data.length>=10?true:false
    })
  },
  guanzhu(e: any) {
    let { index, id } = e.currentTarget.dataset;
    let that = this;
    let visitorLists: any = this.data.visitorLists;
    if(!visitorLists[index].is_follow){
      that.follow(id, index)
    }else{
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
  async follow(id: number, index: number) {
    let visitorLists: any = this.data.visitorLists;
    visitorLists[index].is_follow = !visitorLists[index].is_follow
    const result: any = await request(false, follow, "GET", {
      uuid: id,
      type: visitorLists[index].is_follow ? 1 : 2
    })

    result.data.code == 0 ?
      this.setData({
        visitorLists,
      }) : wx.showToast({
        title: result.data.message,
        icon: "none"
      })
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
    this.setData({
      page:++this.data.page
    },()=>{
      this.visitorList()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})