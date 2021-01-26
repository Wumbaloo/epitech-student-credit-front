import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    autologin: ""
  },
  mutations: {
    setAutologin(state, text) {
      state.autologin = text;
    }
  },
  actions: {
  },
  getters: {
    getAutologin: state => {
      return state.autologin;
    }
  },
  modules: {
  }
})
