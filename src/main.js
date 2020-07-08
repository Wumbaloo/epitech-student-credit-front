import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import Toasted from 'vue-toasted';

Vue.config.productionTip = false
Vue.use(require('vue-cookies'));
Vue.use(Toasted);

// axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers = {
  'Content-Type': 'application/json;charset=utf-8',
  // 'X-PINGOTHER': 'pingpong',
  // 'Accept': '*/*',
  // 'Origin': 'http://localhost:3000',
  // 'Access-Control-Allow-Origin': 'https://localhost:8080',
  // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  // 'Access-Control-Allow-Methods': 'GET,POST',
  // 'Access-Control-Allow-Credentials': 'true',
  // 'Vary': 'Origin'
};

Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
