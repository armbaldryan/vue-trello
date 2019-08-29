import store from "@/store";

export async function authGuard(to, from, next) {
  if (window.localStorage.getItem("userId")) {
    next();
    if (!store.getters.user) {
      store.commit("setUser", {
        id: window.localStorage.getItem("userId"),
      });
    }
  } else {
    next("/login?loginError=true");
  }
}
