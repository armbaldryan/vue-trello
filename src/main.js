import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/index";
import vuetify from "./plugins/vuetify";
import firebase from "firebase";
import { fbConfig } from "./fbConfig";

Vue.config.productionTip = false;

new Vue({
  router,
  store,

  data: {
    title: "aaa",
  },
  beforeCreate() {
    firebase.initializeApp(fbConfig);
  },

  vuetify,
  render: h => h(App),
}).$mount("#app");
