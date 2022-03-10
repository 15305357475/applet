import App from './App'
// import uView from 'uview-ui'
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
// echarts
// import echarts from 'echarts'
// 必须用下面这种写法
// import * as echarts from 'echarts'
// Vue.prototype.$echarts = echarts

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

