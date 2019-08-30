import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/auth/login";
import { authGuard } from "@/helpers";
import Registration from "./views/auth/registration";
import Board from "./views/board";
import NotFound from "./views/not-found";

Vue.use(Router);

export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      exact: true,
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
    {
      exact: true,
      path: "/board/:id",
      name: "board",
      component: Board,
      beforeEnter: authGuard,
    },
    {
      exact: true,
      path: "/404",
      name: "notFound",
      component: NotFound,
    },
    {
      path: "*",
      redirect: "/404",
    },
  ],
});
