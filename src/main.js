import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './global/pagoda-mobile'
import apiUrl from './http/apiUrl'
import http from '@/http/axios'
import nAxios from 'axios'
import utils from '@/utils/utils'
// 引入alloyFinger
import AlloyFinger from 'alloyfinger'
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger_vue.js'
Vue.use(AlloyFingerVue, { AlloyFinger:  AlloyFinger });

Vue.prototype.$HTTP = http
Vue.prototype.$api = apiUrl
Vue.prototype.$utils = utils



Vue.config.productionTip = false

// 注册全局组件
const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /\w+\.(vue|js)$/
)
requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)
  console.log(fileName) // 返回 ./HelloWorld.vue
  // 获取组件的 PascalCase 命名
  const componentName = fileName.split('/').pop().replace(/\.\w+$/, '')
  // 全局注册组件
  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})

// 暂时不区分环境
const VConsole = require('vconsole');
new VConsole();


let currentUrl = ''
let ticket = ''
let userInfo = {}
// 全局前置钩子
router.beforeEach((to, from, next) => {
  const { origin, pathname, hash, search } = location
    const searchObj = utils.splitUniqueWords(search)
    currentUrl = origin + pathname + hash + '?' + searchObj.searchStr
    ticket = searchObj.words
    if (sessionStorage.flag === 'true' && !ticket) {
      // 后端登录接口
      userInfo = JSON.parse(localStorage.userInfo)
      try {
        nAxios.post(apiUrl.login, {
          oaid: userInfo.oaid[0],
          user_name: userInfo.employeeName[0]
        }).then(res => {
          const {token, user_id} = res.data.data
          localStorage.setItem('token', token)
          localStorage.setItem('userId', user_id)
          console.log(location)
          if (localStorage.redirect.includes('seat-detail') && !to.path.includes('seat-detail')) {
            const path = localStorage.redirect
            localStorage.redirect = ''
            next(`${path}`)
          } else{
            next()
          }
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      to.path
      if (ticket) {
        authUser()
      } else {
        loginUser()
      }
    }
})

function authUser () {
  let query = `?${ticket}`
  query += `&format=json&service=${currentUrl}`
  nAxios.get(`http://cas.kt3.pagoda.com.cn/p3/serviceValidate${query}`)
    .then(res => {
      console.log(res)
      if (res.data.serviceResponse) {
        let userInfo = res.data.serviceResponse.authenticationSuccess.attributes
        // const username = userInfo.employeeName[0]
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        sessionStorage.setItem('flag', 'true')
        window.location.replace(location.origin + location.pathname)
      } else {
        // 重新进行单点登录
        loginUser()
      } 
    })
}
function loginUser () {
  if (location.hash.includes('seat-detail')) localStorage.setItem('redirect', location.hash.slice(1))
  // 进行单点登录
  setTimeout(() => {
    window.location.replace(`http://cas.kt3.pagoda.com.cn/cas2/login?service=${currentUrl}`)
  }, 200)
}


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
