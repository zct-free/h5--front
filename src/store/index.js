import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pkQuestionList: []
  },
  mutations: {
    // pk竞赛已答题列表(防止中途退出重新答题后赛事回顾题目不准备)
    SET_Pk_LIST(state, list) {
      state.pkQuestionList = list
    }
  },
  actions: {
    async SET_Pk_LIST({ commit }, status) {
      await commit('SET_Pk_LIST', status)
    }
  },
  modules: {}
})
