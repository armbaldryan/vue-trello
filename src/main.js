import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/index";
import vuetify from "./plugins/vuetify";
import firebase from "firebase";

Vue.config.productionTip = false;

new Vue({
  router,
  store,

  data: {
    title: "aaa",
  },
  beforeCreate() {
    var firebaseConfig = {
      apiKey: "AIzaSyCqI-uh93ubs8zZcS2HJb0P3mW-Y2pU65s",
      authDomain: "vue-trello-arm.firebaseapp.com",
      databaseURL: "https://vue-trello-arm.firebaseio.com",
      projectId: "vue-trello-arm",
      storageBucket: "vue-trello-arm.appspot.com",
      messagingSenderId: "926242816433",
      appId: "1:926242816433:web:8b197e3b901b8860",
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  },

  vuetify,
  render: h => h(App),
}).$mount("#app");
