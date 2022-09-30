// pages/find/find.ts
import { navigateTo, request } from "../../utils/common"
const RongIMLib = require('crypto-js')
const { get_dynamics_find, getCatetoryList, getHotWords, get_fellow_list } = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navs: [
      {
        name: '推荐',
        type: 'tj'
      },
      {
        name: '同城老乡',
        type: 'lx'
      },
    ],
    key_word: '',
    id: 1,
    type: 'tj',
    page: 1,
    noLength: false,
    work: [],
    typeList: [],
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    const typeList: any = await request(false, getCatetoryList, "GET", {})
    this.setData({
      typeList: typeList.data.data
    })
    // let lastSaveUser=wx.getStorageSync('lastSaveUser');
    // !options.newOnce&&lastSaveUser ?navigateTo(`/pages/shareHome/shareHome?id${lastSaveUser}`):'' //最后访问存在就展示最后访问者名片
    this.dynamics_list()
    // 获取热门搜索词
    this.getHotWords()
  },
  tabChange(e: any) {
    let { type } = e.currentTarget.dataset;
    this.setData({
      type,
      page: 1,
      work: []
    }, () => {
      // console.log(this.data.work)
      this.dynamics_list()
    })
  },
  goSearch() {
    navigateTo('/pages/search/search')
  },
  async getHotWords() {
    let res: any = await request(false, getHotWords, "GET", {})
    this.setData({
      hotWord: res.data.data.length &&res.data.data[0].keyword || '请输入'
    })
  },
  async dynamics_list() {
    let that = this;
    let result: any = null
    if (that.data.type == 'lx') {
      result = await request(false, get_fellow_list, "GET", {
        page: that.data.page,
        latitude: '',
        longitude: '',
        key_word: '',
      })
    } else {
      result = await request(false, get_dynamics_find, "GET", {
        page: that.data.page,
        category_id: that.data.type == 'tj' ? '' : that.data.type,
        is_recommend: that.data.type == 'tj' ? 2 : '',
        key_word: that.data.key_word || ''
      })
    }
    let data = result.data.data.data;
    let work = that.data.work.concat(data);
    this.setData({
      work,
      worktype: work.length ? false : true,
      noLength: data.length >= 10 ? true : false,
      loading:false
    })
  },
  onReachBottom() {
    if (!this.data.noLength) return;
    this.setData({
      page: ++this.data.page
    }, () => {
      this.dynamics_list()
    })
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage() {
    const promise = new Promise(resolve => {
      resolve({
        title: '标记我的旅行生活',
      })
    })
    return {
      title: '标记我的旅行生活',
      path: '/page/find/find',
      promise
    }
  },
  onShareTimeline() {
    const promise = new Promise(resolve => {
      resolve({
        title: '标记我的旅行生活',
      })
    })
    return {
      title: '标记我的旅行生活',
      path: '/page/find/find',
      promise
    }
  }
})