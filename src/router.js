import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/auth/login";
import { authGuard } from "@/helpers";
import Registration from "./views/auth/registration";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      exact: true,
      path: "/",
      name: "home",
      component: Home,
      beforeEnter: authGuard,
    },
    {
      exact: true,
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      exact: true,
      path: "/registration",
      name: "registration",
      component: Registration,
    },
  ],
});
