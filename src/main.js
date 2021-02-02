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

//axios.defaults.baseURL = "https://willyaer.alwaysdata.net/";
axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers = {
  'Content-Type': 'application/json;charset=utf-8',
};

Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
