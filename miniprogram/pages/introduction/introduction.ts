// pages/introduction/introduction.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
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
  },
  
})
