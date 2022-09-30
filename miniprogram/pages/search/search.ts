import { request,showToast } from "../../utils/common"
const { get_dynamics_find ,getHotWords} = require("../../utils/util");
// pages/search/search.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    work:[],
    noLength:false,
    page:1,
    key_word: '',
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let historyList = wx.getStorageSync('historyList')
    if (historyList) {
      this.setData({
        historyList
      })
    }
    // 获取热门搜索词
    this.getHotWords()
  },
  async getHotWords(){
       let res:any = await request(false, getHotWords, "GET", {})
       this.setData({
        hotWords:res.data.data
       })
  },
  words(e: any) {
    this.setData({
      key_word: e.detail.value,
      work:[]
    })
  },
  searchItem(e: any) {
    let {
      word
    } = e.currentTarget.dataset

    this.setData({
      page: 1,
      key_word: word,
      work:[]
    }, () => {
      this.dynamics_list()
    })
  },
  searchItem2(e: any){
    let {
      word
    } = e.currentTarget.dataset

    this.setData({
      page: 1,
      key_word: word,
      work:[]
    }, () => {
      this.dynamics_list()
      this.setHistory()
    })
  },
  clear(){
    this.setData({
      key_word:'',
      work:[]
    })
  },
  search() {
    let that = this
    if(!this.data.key_word.trim()){
      showToast('请输入搜索内容')
      return
    }
    this.setData({
      page: 1,
      key_word: that.data.key_word,
      work:[]
    }, () => {
      this.dynamics_list()
      this.setHistory()
    })
  },
  // 保存搜索历史记录并返回
  setHistory() {
    let value: string[] = this.data.historyList
    // console.log(typeof(value),typeof(this.data.historyList ))
    if(this.data.key_word.trim()){
      value.push(this.data.key_word)
    }
    if(this.data.historyList.length>20){
     let arr = this.data.historyList.reverse().slice(0,19)
      this.setData({
        historyList:arr
      })
    }
    wx.setStorageSync('historyList', [...new Set(this.data.historyList)])
  },
  delHistory() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '您确定要清空历史记录吗？',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.removeStorageSync('historyList')
          that.setData({
            historyList: []
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  async dynamics_list() {
    let that = this;
    const result: any = await request(true, get_dynamics_find, "GET", {
      page: that.data.page,
      key_word:that.data.key_word||''
    })
    let data=result.data.data.data;
    let work=that.data.work.concat(data);
    this.setData({
      work,
      worktype:work.length?false:true,
      noLength:data.length>=10?true:false
    })
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom(){
    if(!this.data.noLength) return;
    this.setData({
      page:++this.data.page
    },()=>{
      this.dynamics_list()
    })
  },

})