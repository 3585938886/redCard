// pages/visitorList/visitorList.ts
 import { request,navigateTo } from "../../utils/common";
 const {visitorList} = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      type:1,
      page:1,
      noLength:false,
      visitorLists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
      // 获取访客列表
      this.visitorList()
  },
  showInfo(e: any) {
    let { id } = e.currentTarget.dataset;
    navigateTo(`/pages/shareHome/shareHome?id=${id}`)
    // console.log(id)
  },
  async visitorList() {
    let that = this
    const result: any = await request(false, visitorList, "GET", {
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
// export {}