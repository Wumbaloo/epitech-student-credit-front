import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    autologin: "",
    accessToken: ""
  },
  mutations: {
    setAutologin(state, text) {
      state.autologin = text;
    },
    setAccessToken(state, text) {
      state.accessToken = text;
    }
  },
  actions: {
  },
  getters: {
    getAutologin: state => {
      return state.autologin;
    },
    getAccessToken: state => {
      return state.accessToken;
    }
  },
  modules: {
  }
})
