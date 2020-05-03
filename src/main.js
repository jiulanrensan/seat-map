import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './global/pagoda-mobile.js'
import http from '@/http/axios'
Vue.prototype.$HTTP = http

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
