import { navigateTo, request, showToast } from "../../utils/common";

// pages/work/work.ts
let utils2 = require("../../utils/common")
const util = require('../../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    typedel: {
      type: String,
      observer: function (val) {
        this.setData({
          typedel: val
        })
      }
    },
    collection: {
      type: String,
      observer: function (val) {
        this.setData({
          collection: val
        })
      }
    },
    data: {
      type: Array,
      observer: function (val) {
        this.setData({
          works: val
        })
      }
    },
  },
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的初始数据
   */
  data: {
    typedel: '',
    collection: '',
    ID: "",
    start: "",
    end: "",
    chooseList: [{
      id: "1",
      text: "删 除",
      icon: "../../images/fy3.png",
    }, {
      id: "2",
      text: "置 顶",
      icon: "../../images/fy4.png",
    }, {
      id: "3",
      text: "取消置顶",
      icon: "../../images/fy5.png",
    }, {
      id: "4",
      text: "分 享",
      icon: "../../images/fy6.png",
    },],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 删除
    async delete() {
      let res: any = await request(false, util.dynamics_del, 'GET', {
        id: this.data.ID,
      })
      if (res.data.code === 0) {
        showToast(res.data.message)
        this.setData({
          showModalStatus: false
        })
        this.triggerEvent('myevent', '1')
      } else {
        showToast(res.data.message)
        this.triggerEvent('myevent', '2')
      }
    },
    // 置顶
    async toTop() {
      let res: any = await request(false, util.dynamics_topping, 'GET', {
        id: this.data.ID,
        is_top: "2"
      })
      if (res.data.code === 0) {
        showToast(res.data.message)
        this.setData({
          showModalStatus: false
        })
        this.triggerEvent('myevent', '1')
      }
      else {
        showToast(res.data.message)
        this.triggerEvent('myevent', '2')
      }
    },
    // 取消置顶
    async noTOP() {
      let res: any = await request(false, util.dynamics_topping, 'GET', {
        id: this.data.ID,
        is_top: "1"
      })
      if (res.data.code === 0) {
        showToast(res.data.message)
        this.setData({
          showModalStatus: false
        })
        this.triggerEvent('myevent', '1')
      }
      else {
        showToast(res.data.message)
        this.triggerEvent('myevent', '2')
      }
    },
    // 分享
    share() {
      console.log("分享")
    },
    // 关闭底部弹框
    closePw() {
      this.setData({
        showModalStatus: false
      })
    },
    // 触屏开始时间
    touchstart(e: any) {
      this.setData({
        start: e.timeStamp
      })
    },
    // 触屏结束时间
    touchend(e: any) {
      this.setData({
        end: e.timeStamp
      })
    },
    // 长按事件
    longtaps(e: any) {
      let { from,uid } = e.currentTarget.dataset;
      if (from == "dynamics") {
        this.setData({
          ID: e.currentTarget.dataset.id
        })
        // console.log(e.currentTarget.dataset.id,'88888')
        if (uid == wx.getStorageSync('info').id) {
          this.showModal();
          wx.vibrateShort();
        }
      }

    },
    // 点击作品事件
    work(e: any) {
      let times = this.data.end - this.data.start
      if (times < 350) {
        let { type, id } = e.currentTarget.dataset;
        type == 1 ? utils2.navigateTo(`/pages/workDetails/workDetails?id=${id}&typedel=${this.data.typedel}&collection=${this.data.collection}`) : navigateTo(`/pages/videoInfo/videoInfo?id=${id}&typedel=${this.data.typedel}&collection=${this.data.collection}`)
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
  }
})
