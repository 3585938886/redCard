// 红方片

const up_img = 'https://sc.7deer.cn/api/apialiyunuploadImg' //上传图片地址
const url_video = "https://sc.7deer.cn/api/uploadVideo" // 上传视频
// let appid = 'wx18c12828e25214ce'
// let urls = "https://ncard.7deer.cn/api/" //接口地址

// 趣神游
let urls = "https://sc.7deer.cn/api/" //接口地址
let appid = 'wx44f5f72d39a4debc'

const crypto = require('crypto-js');
const { Base64 } = require('js-base64')
// import { Base64 } from 'js-base64';

// 计算签名。
function computeSignature(accessKeySecret: any, canonicalString: any) {
  return crypto.enc.Base64.stringify(crypto.HmacSHA1(canonicalString, accessKeySecret));
}

const date = new Date();
date.setHours(date.getHours() + 1);
const policyText = {
  expiration: date.toISOString(), // 设置policy过期时间。
  conditions: [
    // 限制上传大小。
    ["content-length-range", 0, 1024 * 1024 * 1024],
  ],
};



async function getFormDataParams(filePath: any, callback: any, fails: any) {
  let credentials: any = null
  await new Promise((resolve, reject) => {
    wx.request({
      url: 'https://file.anhuage.com/sts.php',
      method: 'GET',
      dataType: "json",
      header: {
        'content-type': 'application/json;charset=UTF-8',
        'appid': appid,
        'openid': wx.getStorageSync('identity').openid
      },
      success: (res => {
        resolve(res)
        credentials = res.data
      }),
      fail: (err => {
        reject(err)
      })
    })
  })
  const policy = Base64.encode(JSON.stringify(policyText)) // policy必须为base64的string。
  const signature = computeSignature(credentials.AccessKeySecret, policy)
  const formData = {
    OSSAccessKeyId: credentials.AccessKeyId,
    signature,
    policy,
    'x-oss-security-token': credentials.SecurityToken
  }
  getaaa(formData, filePath, callback, fails)
  return formData
}

function prePage(){
   let pages=getCurrentPages();
   let page=pages[pages.length -2]
   return page
}

// console.log(getFormDataParams())
function getaaa(formData: any, filePath2: any, callback: any, fails: any) {
  // console.log(credentials,formData)
  // const host = '<host>';
  let id = wx.getStorageSync('info').id || ''
  let dateTime = +new Date()
  const signature = formData.signature;
  const ossAccessKeyId = formData.OSSAccessKeyId;
  const policy = formData.policy;
  let filePath3 = filePath2.split('/')
  let filePath4 = filePath3[filePath3.length - 1]
  // console.log(filePath4)
  const key = 'qushenyo/' + id + '_' + dateTime + '_' + filePath4;
  const securityToken = formData['x-oss-security-token'];
  const filePath = filePath2; // 待上传文件的文件路径。
  wx.uploadFile({
    url: 'https://zy-znmp.oss-cn-shanghai.aliyuncs.com', // 开发者服务器的URL。
    filePath: filePath,
    name: 'file', // 必须填file。
    formData: {
      key,
      policy,
      OSSAccessKeyId: ossAccessKeyId,
      signature,
      success_action_status: "200",
      'x-oss-security-token': securityToken // 使用STS签名时必传。
    },
    success: (res) => {
      if (res.statusCode === 200) {
        let filePath11 = 'https://zy-znmp.oss-cn-shanghai.aliyuncs.com/' + key
        console.log('上传le', filePath11);
        callback(res, filePath11)
      }
    },
    fail: err => {
      console.log(err);
      fails(err)
    }
  });
}


function navigateTo(url: string) {
  wx.navigateTo({
    url: url,
  })
}
function navigateBack() {
  wx.navigateBack({
    delta: 1
  })
}

function reLaunch(url:string) {
  wx.reLaunch({
    url: url,
  })
}
function redirectTo(url:string) {
  wx.redirectTo({
    url: url,
  })
}
//请求层 async fun(){const a = await request() } 
function request(loading: Boolean, url: String, method: any, data: Object) {
  if (loading) {
    wx.showLoading({
      title: '加载中...',
    })
    // wx.showToast({
    //   title: '加载中...',
    //   icon: 'success',
    //   image:'/images/dd.gif',
    //   duration: 100000
    // })
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: urls + url,
      method: method,
      dataType: "json",
      header: {
        'content-type': 'application/json;charset=UTF-8',
        'appid': appid,
        'openid': wx.getStorageSync('identity').openid
      },
      data: data,
      success: (res => {
        wx.hideLoading()
        resolve(res)
      }),
      fail: (err => {
        reject(err)
      })
    })
  })

}
//上传图片
function uploadFile(filePath: string, callback: any, fails: any) {
  wx.uploadFile({
    filePath: filePath,
    name: 'file',
    url: up_img,
    header: {
      'content-type': 'application/json;charset=UTF-8',
      'appid': appid,
      'openid': wx.getStorageSync('identity').openid ? wx.getStorageSync('identity').openid : ''
    },
    formData: {
      file: filePath,
      _token: wx.getStorageSync('company_info').company_token
    },
    success: function (res) {
      callback(res)
    },
    fail(err) {
      fails(err)
      console.log(err)
    }
  })
}
//提示
function showToast(title: any) {
  wx.showToast({
    title: title,
    icon: "none"
  })
}
//打开视频
function chooseVideo(callfack: any, fails: any) {
  wx.chooseVideo({
    sourceType: ['album', 'camera'],
    maxDuration: 60,
    camera: 'back',
    compressed: false,
    success(res) {
      callfack(res)
    },
    fail(err) {
      fails(err)
    }
  })
}
//上传视频
function uploadVideo(filePath: string, callback: any, fails: any) {
  // console.log(url, "url")
  wx.uploadFile({
    filePath: filePath,
    name: 'file',
    url: url_video,
    header: {
      'content-type': 'application/json;charset=UTF-8',
      'appid': appid,
      'openid': wx.getStorageSync('openid') ? wx.getStorageSync('openid') : ''
    },
    formData: {
      file: filePath,
      _token: wx.getStorageSync('company_info').company_token
    },
    success: function (res) {
      callback(res)
    },
    fail(err) {
      fails(err)
      console.log(err)
    }
  })
}
//打开相册
function chooseMedia(count: any, callback: any, fails: any) {
  wx.chooseMedia({
    count: count,
    sourceType: ['album', 'camera'],
    mediaType: ['image'],
    sizeType: ['original', 'compressed'],
    success(res) {
      callback(res)
    },
    fail(err) {
      fails(err)
    }
  })
}
//图片预览
function previewImage(cur_img: any, imgs: any) {
  wx.previewImage({
    current: cur_img, // 当前显示图片的http链接
    urls: imgs, // 需要预览的图片http链接列表
    success() {

    }
  })
}



export {
  navigateTo,
  navigateBack,
  request,
  uploadFile,
  getFormDataParams,
  uploadVideo,
  chooseMedia,
  chooseVideo,
  showToast,
  previewImage,
  appid,
  reLaunch,
  redirectTo,
  prePage
}