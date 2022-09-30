// index.ts
// let common=require("../../utils/common");
import { navigateTo, request,navigateBack } from "../../utils/common"
const { getuserinfo,get_dynamics_list } = require("../../utils/util");


Page({
  data: {
    info: "",
    rotateIndex: 1,
    animationData: {},
    id:'',
    uid:'',
    timeInterval: {},
    // navs: [
    //   {
    //     name: "简介"
    //   },
    //   {
    //     name: "作品"
    //   }
    // ],
  },
  async onLoad(options:any) {
    let id=options.id || options.uid?options.id:'';
    const result: any = await request(false, getuserinfo, "GET", {
      card_id:id
    })
    const dynamics_list= await this.get_dynamics_list(id)
    this.setData({
      info: result.data.data,
      id,
      uid:options.uid?options.uid:'',
      dynamics_list:dynamics_list.data.data.data
    })
  },
  async get_dynamics_list(id: Number | String) {
    const result: any = await request(false, get_dynamics_list, "GET", {
      card_id: id ? id : wx.getStorageSync("info").id
    })
    return result
  },
 async work() {
   let uid=this.data.uid;
   uid?navigateTo(`/pages/shareHome/shareHome?id=${uid}`):navigateBack()
  },
  onShareAppMessage() {
    let info:any=this.data.info;
    return {
      title:`${info.name}的主页`,
      path:`/pages/index/index?uid=${info.id}`
    }
  }
})

