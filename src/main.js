import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/index";
import vuetify from "./plugins/vuetify";
import * as fb from "firebase";
import { fbConfig } from "./fbConfig";

Vue.config.productionTip = false;

new Vue({
  router,
  store,

  data: {
    title: "aaa",
  },
  beforeCreate() {
    fb.initializeApp(fbConfig);
  },

  vuetify,
  render: h => h(App),
}).$mount("#app");
