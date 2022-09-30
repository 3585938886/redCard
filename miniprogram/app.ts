// app.ts
import { request,appid } from "./utils/common";
const { userlogin,getuserinfo } = require("./utils/util")
App<IAppOption>({
  globalData: {
    statusBarHeight: 0,
    customBar: 0,
    isPhonex: false,
  },
  onLaunch() {
    // 登录
    let that=this
    wx.getStorageSync("identity") ? wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail () {
        that.login()
      }
    }):that.login()
  },
  onShow() {
    let that = this;
    wx.getSystemInfo({
      success(res) {
        const statusBarHeight = res.statusBarHeight;
        const clientRect = wx.getMenuButtonBoundingClientRect();
        console.log(clientRect, "clientRect")
        that.globalData.isPhonex = res.model.indexOf('iPhone X') > -1 ? true : false;
        that.globalData.statusBarHeight = statusBarHeight;
        that.globalData.customBar = statusBarHeight + (clientRect.top - statusBarHeight) * 2 + clientRect.height;
      }
    })
  },
  login():void{
    wx.login({
      success: async res => {
        console.log(res.code)
        let result:any = await request(false, userlogin, "GET", {
          code: res.code,
          appid
        })
        // console.log(data,"data")
        result && result.data.code==0 ? wx.setStorageSync("identity",result.data.data):''
        const info: any = await request(false, getuserinfo, "GET", {
          card_id: '',
        })
        wx.setStorageSync("info", info.data.data);
      },
    })
  },
})