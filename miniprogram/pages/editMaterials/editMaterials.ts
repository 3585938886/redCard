// pages/editMaterials/editMaterials.ts
import { navigateTo, navigateBack, request, chooseMedia, showToast, previewImage, getFormDataParams } from "../../utils/common";
const util = require('../../utils/util');
let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPhonex:app.globalData.isPhonex,
    city: '',
    province: '',
    bgm: '',
    region: [],
    imgUrl: "",
    userName: '',
    sex: 1,
    introduction: "",
    business: "",
    // birthday:"",
    phone: "",
    wechat: "",        // 微信
    company_name: "",  // 企业
    job: "",           // 职业
    attestation: "",   // 企业认证
    bgm_music: "",    // 背景音乐
    university: "",   // 大学
    high_school: "",  // 高中
    part_time: "",    // 兼任
    industry: "",     // 行业
    honor: "",        // 荣誉
    keywords: "",     // 企业关键词
    loading: true

  },
  // 点击兼任去往兼任页面
  toParttime() {
    navigateTo('/pages/partTime/partTime')
  },
  // 点击荣誉去往荣誉页面
  toHonor() {
    navigateTo('/pages/honor/honor')
  },
  // 编辑生日
  startDay(e: any) {
    this.setData({
      birthday: e.detail.value
    })
  },
  // 修改性别
  setSex1() {
    this.setData({
      sex: 1     // 默认1为男性
    })
  },
  setSex2() {
    this.setData({
      sex: 2
    })
  },
  upmusic() {
    let that = this;
    // wx.chooseMessageFile({
    //   count: 1,
    //   type: 'file',
    //   success(res) {
    //     getFormDataParams(res.tempFiles[0].path, (data: any, path22: any) => {
    //       if (data.statusCode === 200) {
    //         console.log('上传成功');
    //         that.setData({
    //           bgm_music: path22
    //         })
    //       }
    //     }, () => { })
    //   }
    // })
  },
  previewImage(e: any) {
    let {
      img,
    } = e.currentTarget.dataset
    previewImage([img],img, )
  },

  // 上传背景图
  setBcImg() {
    let that = this;
    chooseMedia(1, (res: any) => {
      // res.tempFiles.map((val:any) => {
      console.log(res.tempFiles, "tempFiles")
      let path = res.tempFiles[0].tempFilePath
      getFormDataParams(path, (data: any, path22: any) => {
        if (data.statusCode === 200) {
          console.log('上传成功');
          that.setData({
            bgm: path22
          })
        }
      }, () => { })
      // })
    }, () => { })
  },
  // 上传音乐

  // 上传营业执照
  setAttestation() {
    let that = this;
    chooseMedia(1, (res: any) => {
      // res.tempFiles.map((val:any) => {
      console.log(res.tempFiles, "tempFiles")
      let path = res.tempFiles[0].tempFilePath
      getFormDataParams(path, (data: any, path22: any) => {
        if (data.statusCode === 200) {
          console.log('上传成功');
          that.setData({
            attestation: path22
          })
        }
      }, () => { })
      // })
    }, () => { })
  },

  // 上传头像
  uploadImg() {
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
      }, () => { })
      // })
    }, () => { })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    //  获取之前保存过的数据
    this.getOldUserMsg()
  },
  //  获取之前保存过的数据
  async getOldUserMsg() {
    let res: any = await request(false, util.getuserinfo, 'GET', {})
    console.log(res)
    if (res.data.code == 0) {
      let {
        name,
        head,
        sex,
        introduction,
        business,
        // birthday,
        phone,
        wechat,
        city,
        province,
        bgm,
        company_name,
        job,
        attestation,
        university,
        high_school,
        part_time,
        industry,
        honor,
        keywords,
        bgm_music,
      } = res.data.data
      this.setData({
        userName: name,
        imgUrl: head,
        sex: sex,
        introduction: introduction,
        business: business,
        // birthday:birthday,
        phone: phone,
        wechat: wechat,
        city: city,
        province: province,
        bgm,
        company_name,
        job,
        attestation,
        university,
        high_school,
        part_time,
        industry,
        honor,
        keywords,
        bgm_music,
        loading: false
      })
    }
  },
  async formSubmit(e: any) {
    let that = this
    let {
      userName,
      introduction,
      business,
      phone,
      wechat,
      university,
      high_school,
      part_time,
      industry,
      honor,
      keywords,
      bgm_music,
      company_name,
      job,
    } = e.detail.value
    let phonereg = /^[1][0-9]{10}$/;
    if (!userName) {
      showToast('昵称不能为空')
      return
    }
    else if (!phonereg.test(phone) && phone) {
      showToast('手机号格式不正确')
      return
    }
    else if (userName.length > 11) {
      showToast('昵称最多11个字符')
      return
    }
    let res: any = await request(false, util.setuserinfo, 'POST', {
      name: userName,
      sex: that.data.sex,
      introduction: introduction,
      business: business,
      phone: phone,
      wechat: wechat,
      university: university,
      high_school: high_school,
      part_time: part_time,
      industry: industry,
      honor: honor,
      keywords: keywords,
      bgm_music: bgm_music,
      company_name: company_name,
      job: job,
      //  birthday:that.data.birthday,
      bgm: that.data.bgm,
      attestation: that.data.attestation,
      city: that.data.region[1] || that.data.city,
      province: that.data.region[0] || that.data.province,
      head: that.data.imgUrl
    })
    if (res.data.code == 0) {
      showToast(res.data.message)
      // 更新用户的本地信息
      that.updateUserMsg()
    } else {
      showToast(res.data.message)
    }
  },
  async updateUserMsg() {
    let res: any = await request(false, util.getuserinfo, 'GET', {})
    if (res.data.code == 0) {
      // 获取上一页节点并追加
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      console.log(pages, prevPage,)
      prevPage.setData({
        info: res.data.data
      })
      wx.setStorageSync("info", res.data.data);
      navigateBack()
    }
  },
  bindRegionChange(e: any) {
    this.setData({
      region: e.detail.value
    })
  },

})