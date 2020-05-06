import axios from 'axios'
import Vue from 'vue';
import { Toast } from 'pagoda-mobile';
Vue.use(Toast);

// 基本配置
// let baseUrl = 'http://39.108.71.75:80'
let baseUrl = location.origin
let timeout = 60000
Object.assign(axios.defaults, {
  baseURL: baseUrl,
  timeout,
  headers: { 
    'Content-Type': 'application/json;charset=UTF-8',
    // 'token': localStorage.token
  },
  // withCredentials: true
})

// object对象存放每次new CancelToken生成的方法
let source = {}

// 每次请求前都会把api放在此数组中，响应成功后清除此请求api
let requestList = []

// 请求拦截器
axios.interceptors.request.use(config => {
  // do something
  // 查询状态提示...
  // 对请求参数做处理
  config.headers['token'] = localStorage.token
  if (config.method=='post') {
    Object.assign(config.data, {user_id: Number(localStorage.userId)})
  }
  
  if (!config.hideLoading) {
    Toast.loading({
      message: '加载中...',
      forbidClick: true
    });
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(response => {
  // do something
  // 关闭查询状态
  Toast.clear();
  // 获取请求的api
  const request = JSON.stringify(response.config.url)
  // 请求完成后，将此请求从请求列表中移除
  requestList.splice(requestList.findIndex(el => el === request), 1)
  return response
}, function (err) {
  Toast.clear();
  // 报错信息没法获取config
  if (axios.isCancel(err)) {
    // 根据业务场景确定是否需要清空
    // 例如：页面跳转前，清空离开页面的请求
    requestList.length = 0
  } else {
    console.log(err)
  }
  return Promise.reject(err)
})

// 定义取消方法
/**
 * 
 * @param {*} api 
 * @param {Boolean} allCancel 
 */
function cancelRequest(api, allCancel){
  // 请求列表里存在此api，即发起重复请求，把之前的请求取消掉
  if (api && requestList.includes(api) && typeof source[api] ==='function'){
    source[api]('终止请求')
  } else if (!api && allCancel) {
    // allCancel为true则请求列表里的请求全部取消
    requestList.forEach(el => {
      source[el]('批量终止请求')
    })
  }
}

function request(method, api, params = {}, options = {}) {
  // 取消上一次请求
  if (requestList.length) cancelRequest(api)
  return new Promise((resolve, reject) => {
    if (method === 'get') {
      options.params = params
    } else {
      options.data = params
    }
    const config = Object.assign(
      {
        url: api,
        method,
        // source对象保存取消方法
        cancelToken: new axios.CancelToken(function executor(c) {
          source[api] = c;
        })
      },
      options
    )
    // 请求前将api推入requestList
    requestList.push(api)
    axios.request(config)
    .then(res => {
      resolve(res)
    })
    .catch(err => {
      console.log(err)
      reject(err)
    })
  })
}

// 把cancelRequest方法暴露出去
const http = {
  // bind偏函数预设参数
  get: request.bind(null, 'get'),
  post: request.bind(null, 'post'),
  cancel: cancelRequest
}
export default http