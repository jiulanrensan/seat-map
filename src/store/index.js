import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user_id: 1
  },
  mutations: {
    changeUserId (state, payload) {
      state.user_id = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
