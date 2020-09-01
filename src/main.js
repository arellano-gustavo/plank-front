import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VModal from 'vue-js-modal'
import VueRouter from 'vue-router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

Vue.use(VueAxios, axios)
Vue.use(VueRouter, router)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VModal)

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://192.168.100.4:9999/';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common = {
  "X-CSRFToken": store.state.estado.jwt 
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')





