// pages/honor/honor.ts
import { navigateBack, request, showToast,prePage } from "../../utils/common";
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    honorData: "",
    honorFrom: "",
    honorList: [],
  },
  //获取荣誉列表
  async getHonorlist() {
    let res: any = await request(false, util.honorList, 'GET', {})
    if (res.data.code === 0) {
      this.setData({
        honorList: res.data.data.data
      })
    }
  },
  // 点击删除
  async delHonor(e: any) {
    console.log(e.currentTarget.dataset.id, '1111111')
    let res: any = await request(false, util.delHonor, 'GET', {
      id: e.currentTarget.dataset.id,
    })
    console.log(res)
    if (res.data.code === 0) {
      showToast(res.data.message)
      this.getHonorlist()
    }else{
      showToast(res.data.message)
    }
  },
  //点击添加
  addHonor() {
    this.showModal();
  },
  //点击取消
  cancel() {
    this.setData({
      showModalStatus: false
    })
  },

  //获取荣誉文本
  gethonorData(e: any) {
    this.setData({
      honorData: e.detail.value
    })
  },
  //获取单位文本
  gethonorFrom(e: any) {
    this.setData({
      honorFrom: e.detail.value
    })
  },
  //点击保存
  async conserve() {
    console.log(this.data.honorData, this.data.honorFrom, '11111')
    let res: any = await request(false, util.addHonor, 'POST', {
      name: this.data.honorData,
      company: this.data.honorFrom
    })
    console.log(res, 'res')
    if (res.data.code === 0) {
      let pre=prePage();
      this.data.honorList.length && pre.setData({
        
      })
      showToast(res.data.message)
      this.setData({
        showModalStatus: false
      })
      this.getHonorlist()
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
    this.getHonorlist()
  },

})