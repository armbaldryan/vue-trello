import Vue from "vue";
import Vuex from "vuex";
import shared from "./shared";
import user from "./user";
import boards from "./boards";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 5,
  },
  mutations: {},
  actions: {},
  modules: {
    shared,
    user,
    boards,
  },
});
