// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)
// window.jQuery = window.$ = require('jquery/dist/jquery')
// require('bootstrap')
// require('../node_modules/nprogress/nprogress.css')
// require('../node_modules/sweetalert/dist/sweetalert.css')

// Vue.use(bootstrap)
Vue.config.productionTip = false
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
