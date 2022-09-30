/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    statusBarHeight: Number,
    customBar: Number,
    isPhonex:Boolean,
  },
  login():void
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}