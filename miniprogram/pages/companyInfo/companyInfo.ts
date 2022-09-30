// pages/companyInfo/companyInfo.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isganzhu:{
      type:Boolean,
      observer:function(val){
        this.setData({
           isganzhu:val
        })
      }
    },
    data:{
      type:Object,
      observer:function(val){
        this.setData({
           info:val
        })
      }
    }
  },
  options: {
    styleIsolation:"apply-shared",
    // addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
