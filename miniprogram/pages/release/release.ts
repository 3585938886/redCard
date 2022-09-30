// pages/release/release.ts
import { navigateBack, previewImage, request, chooseMedia, showToast, getFormDataParams } from "../../utils/common";
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendFlag: true,
    typeId: '',
    id: '',
    changeType: 'image',
    latitude: 0,
    longitude: 0,
    type: 2,
    imgs: [],
    imgUrl: '',
    videoUrl: '',
    address: '',
    title: '',
    word: '',
    act_imgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options: any) {
    // 获取当前定位坐标
    // this.getFirstLocation()
    const typeList: any = await request(false, util.getCatetoryList, "GET", {})
    const res: any = await request(false, util.getConf, "GET", {})
    this.setData({
      changeType: options.type,
      typeList: typeList.data.data,
      dynamics: res.data.data.dynamics
    })
  },
  tabChange(e: any) {
    let { typeid } = e.currentTarget.dataset;
    this.setData({
      typeId: typeid
    })
  },

  // 上传图片
  file_img() {
    let that = this;
    chooseMedia(1, (res: any) => {
      // res.tempFiles.map((val:any) => {
      console.log(res.tempFiles, "tempFiles")
      let path = res.tempFiles[0].tempFilePath
      getFormDataParams(path, (data: any, path22: any) => {
        if (data.statusCode === 200) {
          console.log('上传成功');
          that.setData({
            imgUrl: path22
          })
        }
      }, (err:any) => { 
         
      })
      // })
    }, () => { 
      showToast("上传失败")
    })
  },
  //上传视频或图片
  file_video() {
    let that = this;
    if (that.data.changeType == 'image') {
      wx.chooseMedia({
        count: 9 - that.data.imgs.length,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success: res => {
          wx.showLoading({
            title: '上传中...',
          })
          res.tempFiles.map((val) => {
            getFormDataParams(val.tempFilePath, (data: any, path22: any) => {
              // let value = JSON.parse(data.data);
              if (data.statusCode === 200) {
                console.log('上传成功');
                let str: string[] = that.data.act_imgs
                str.push(path22);
                that.setData({
                  imgs: that.data.act_imgs,
                  type: 1
                }, () => {
                  wx.hideLoading()
                })
              }
            }, () => { })
          })
        }
      })
    } else {
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        compressed: false,
        success: res => {
          // console.log(res.size)
          if (res.size > 50000000) {
            showToast('视频不能超过50M')
            return
          }
          wx.showLoading({
            title: '上传中...',
          })
          getFormDataParams(res.tempFilePath, (data: any, path22: any) => {
            console.log('上传成功');
            if (data.statusCode === 200) {
              console.log('上传成功');
              that.setData({
                videoUrl: path22
              }, () => {
                wx.hideLoading()

              })
            }


          }, () => { })
        },
        fail(err) {
          console.log(err)
        }
      })

    }

  },
  // 发布动态
  set_dynamics_info() {
    // let that = this
    // if(that.data.sendFlag){
    //   that.setData({
    //     sendFlag:false
    //   },()=>{
    //       that.sendinfo()
    //   })
    // }
    if (this.data.imgs.length == 0 && !this.data.videoUrl) {
      showToast('图片或视频不能为空')
      return
    } else if (this.data.videoUrl && !this.data.imgUrl) {
      showToast('封面不能为空')
      return
    }
    if (this.data.sendFlag) {
      this.setData({
        sendFlag: false
      })
      this.sendinfo()
    }
  },
  async sendinfo() {
    let that = this
    if (this.data.imgs.length == 0 && !this.data.videoUrl) {
      showToast('图片或视频不能为空')
      return
    } else if (this.data.videoUrl && !this.data.imgUrl) {
      showToast('封面不能为空')
      return
    }
    let res: any = await request(false, util.set_dynamics_info, 'POST', {
      title: that.data.title,
      content: that.data.word,
      imgs: that.data.imgs,
      video: that.data.videoUrl,
      video_img: that.data.imgUrl,
      type: that.data.type,
      is_show: 1,
      address: that.data.address,
      longitude: that.data.longitude || '',
      latitude: that.data.latitude || '',
      category_id: that.data.typeId
    })
    console.log(res)
    if (res.data.code == 0) {
      that.setData({
        id: res.data.data,
        sendFlag:true
      })
      showToast(res.data.message)
      // 发布后更新数据
      that.getprePage()
    } else {
      that.setData({
        sendFlag:true
      })
      showToast(res.data.message)
    }
  },
  // 发布后更新数据
  getprePage() {
    // 获取上一页节点并追加
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let changeType = this.data.changeType
    console.log(pages, prevPage,)
    let addItem: any = {
      get_author_info: {}
    }
    let info = wx.getStorageSync("info")
    addItem.get_author_info.head = info.head
    addItem.get_author_info.name = info.name
    addItem.title = this.data.title
    addItem.id = this.data.id
    addItem.zan = 0
    if (changeType == 'image') {
      addItem.type = 1
      addItem.video_img = this.data.imgs[0]
    } else if (changeType == 'video') {
      addItem.type = 2
      addItem.video_img = this.data.imgUrl
    }
    prevPage.data.work.unshift(addItem)
    prevPage.setData({
      work: prevPage.data.work,
      sendFlag: true
    }, () => {
      navigateBack()

    })
  },
  // 预览图片
  previewImage() {
    previewImage(this.data.imgUrl, [this.data.imgUrl])
  },
  previewImage2(e: any) {
    let {
      index
    } = e.currentTarget.dataset
    previewImage(this.data.imgs[index], this.data.imgs)
  },
  // 删除图片
  delClose(e: any) {
    let that = this
    let {
      index
    } = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: '您确定要删除当前图片吗？',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          let arr = that.data.imgs.filter((item: any, index2: any) => {
            if (index != index2) {
              return item
            }
          })
          that.setData({
            imgs: arr,
            act_imgs: arr
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })


  },
  // 预览视频
  previewMedia() {
    let that = this
    wx.previewMedia({
      sources: [{
        url: that.data.videoUrl,
        type: "video"
      }],
      // current: index,
      showmenu: true,
      success() {
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // setTitle
  setTitle(e: any) {
    this.setData({
      title: e.detail.value
    })
  },
  setWord(e: any) {
    this.setData({
      word: e.detail.value
    })
  },
  // 获取位置
  aa() {
    let that = this
    wx.chooseLocation({
      // latitude,
      // longitude,
      success: res => {
        console.log(res)
        that.setData({
          address: res.address,
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})