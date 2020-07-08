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
      console.log("Here with " + state.autologin);
      return state.autologin;
    }
  },
  modules: {
  }
})
