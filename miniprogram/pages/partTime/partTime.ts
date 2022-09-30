// pages/honor/honor.ts
import { navigateTo, navigateBack, request, chooseMedia, showToast, previewImage, getFormDataParams } from "../../utils/common";
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    company: "",
    job: "",
    partTimeList: [],
  },
  //获取荣誉列表
  async partTimeList() {
    let res: any = await request(false, util.partTimeList, 'GET', {})
    if (res.data.code === 0) {
      this.setData({
        partTimeList: res.data.data.data
      })
    }
  },
  // 点击删除
  async delPartTime(e: any) {
    console.log(e.currentTarget.dataset.id, '1111111')
    let res: any = await request(false, util.delPartTime, 'GET', {
      id: e.currentTarget.dataset.id,
    })
    console.log(res)
    if (res.data.code === 0) {
      showToast(res.data.message)
      this.partTimeList()
    } else {
      showToast(res.data.message)
    }
  },
  //点击添加职位
  addHonor() {
    this.showModal();
  },
  //点击取消
  cancel() {
    this.setData({
      showModalStatus: false
    })
    console.log("取消")
  },

  //获取单位文本
  getCompany(e: any) {
    this.setData({
      company: e.detail.value
    })
  },
  //获取职位文本
  getJob(e: any) {
    this.setData({
      job: e.detail.value
    })
  },
  //点击保存
  async conserve() {
    console.log(this.data.job, this.data.company, '11111')
    let res: any = await request(false, util.addPartTime, 'POST', {
      job: this.data.job,
      company: this.data.company
    })
    console.log(res, 'res')
    if (res.data.code === 0) {
      showToast(res.data.message)
      this.setData({
        showModalStatus: false
      })
      this.partTimeList()
    } else {
      showToast(res.data.message)
    }
  },

  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.partTimeList()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})