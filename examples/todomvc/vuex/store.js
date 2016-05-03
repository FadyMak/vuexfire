import Vue from 'vue'
import Vuex from 'vuex'
import VuexFire from '../../../src/vuexfire'
import Firebase from 'firebase'

Vue.use(Vuex)

const state = {
  todos: []
}

const mutations = {
  // local state mutations
}

const store = new Vuex.Store({
  state,
  mutations
})

// keys must match the state keys
export const refsConfig = {
  todos: {
    source: new Firebase('https://<YOUR-FIREBASE-APP>.firebaseio.com/todos'),
    asArray: true,
    // optional cancelCallback
    cancelCallback: function () {}
  }
}

VuexFire(store, refsConfig)

export default store
