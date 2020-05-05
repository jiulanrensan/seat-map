import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './global/pagoda-mobile'
import apiUrl from './http/apiUrl'
import http from '@/http/axios'
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


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
