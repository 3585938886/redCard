// pages/myCard/myCard.ts
const { getuserinfo, get_top_dynamincs_list } = require("../../utils/util");
import { navigateTo, request, showToast,reLaunch } from "../../utils/common"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '',
    currentIndex:0,
    loading:true,
    id:'', //当前名片id
    userId:'',//自己id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let userId=wx.getStorageSync('info') && wx.getStorageSync('info').id
    let id=options.id?options.id:userId
    const res: any = await request(false, getuserinfo, "GET", { //名片信息
      card_id:id
    })
    const top_dynamincs_list: any = await request(false, get_top_dynamincs_list, "GET", {//笔记列表
      card_id: id
    })
    this.setData({
      info: res.data.data,
      top_list: top_dynamincs_list.data.data,
      id,
      loading:false,
      userId
    })
  },
   // 点击标签事件 去往好友列表
   tofriendsList(e: any) {
    let {title,thisid}=e.currentTarget.dataset;
    this.data.id == this.data.userId && navigateTo(`/pages/friendsList/friendsList?title=${title}&thisid=${thisid}`)
  },
  notesInfo(e:any){
    let {id,type}=e.currentTarget.dataset;
    type == 1 ? navigateTo(`/pages/workDetails/workDetails?id=${id}`) : navigateTo(`/pages/videoInfo/videoInfo?id=${id}`)
  },
  operate(e: any) {
    let { type } = e.currentTarget.dataset, info: any = this.data.info;
    switch (type) {
      case 'phone':
        if (!info.phone) {
          showToast(`手机号未填写`);
          return
        }
        wx.makePhoneCall({
          phoneNumber: info.phone
        })
        break;
      case 'copy':
        info.wechat && wx.setClipboardData({
          data: info.wechat,
          success(res) {
            wx.getClipboardData({
              success(res) {
                showToast(`复制成功`)
              }
            })
          }
        });
        break;
      case 'go':
        break;
    }
  },
  notes(e:any){
    let {id}=e.currentTarget.dataset;
    navigateTo(`/pages/shareHome/shareHome?id=${id}`)
  },
  message(){
    wx.pageScrollTo({
      scrollTop: 3000,
      duration: 300
    })
  },
  home(e:any){
    let {index}=e.currentTarget.dataset,url,id:any=this.data.id;
    this.setData({
      currentIndex:index
    })
    if(index==1 ){
      id == this.data.userId?url=`/pages/me/me`:url=`/pages/shareHome/shareHome?id=${id}`
      navigateTo(url)
      return;
    }
    index==0 && navigateTo(`/pages/find/find`);
  },
  fans(e:any){
    let {type}=e.currentTarget.dataset,url;
    if(this.data.id !=this.data.userId) return;//只有自己才能访问
    type=='fans'?url=`/pages/fanList/fanList`:url=`/pages/visitorList/visitorList`
    navigateTo(url)
  },
  onShareAppMessage(){
    let info:any=this.data.info;
    return {
      title: `${info.name}的名片`,
      path: `/pages/myCard/myCard?share=true&id=${info.id}`
    }
  },
  onShareTimeline() {
    let info:any=this.data.info;
    return {
      title: `我是${info.name}`,
      path: `/pages/myCard/myCard?id=${info.id}`,
      query:'share2=share&id=' + info.id,
    }
  }
})