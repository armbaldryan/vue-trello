import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/index";
import vuetify from "./plugins/vuetify";
import * as fb from "firebase";
import { fbConfig } from "./fbConfig";
import VueDraggable from "vue-draggable";

Vue.config.productionTip = false;
Vue.use(VueDraggable);

new Vue({
  router,
  store,
  beforeCreate() {
    fb.initializeApp(fbConfig);
  },
  vuetify,
  render: h => h(App),
}).$mount("#app");
