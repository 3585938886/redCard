// pages/fan/fan.ts
import {navigateTo} from '../../utils/common'
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
    },
    type:{
      type:Number,
      observer:function(val){
        this.setData({
           type:val
        })
      }
    }
  },
  options:{
    addGlobalClass:true
  },
  methods:{
    goVisitor(){
        navigateTo('/pages/visitorList/visitorList')
    
    },
    goFanList(){
      navigateTo('/pages/fanList/fanList')
  
  },
  }
  
})
