import Vue from 'vue'
import ELEMENTUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/animate.min.css'
import $ from 'n-zepto'
import axios from 'axios'
import VUEUTIL from './util/vueutil.js'

Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.use(ELEMENTUI);
Vue.use(VUEUTIL);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
