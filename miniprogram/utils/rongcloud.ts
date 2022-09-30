const RongIMLib = require('@rongcloud/imlib-v4-adapter')
import index from '@rongcloud/imlib-v4-adapter'
const appkey = 'bmdehs6pb8sys'
var im = RongIMLib.init({
  appkey
})
function aaa(){

}
export  {
  im,
  aaa,
  index
}