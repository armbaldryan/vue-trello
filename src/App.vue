<template>
  <v-app>
    <v-app-bar color="indigo darken-2" dark max-height="70">
      <v-toolbar-title>Vue Trello</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-menu left bottom v-if="!this.$store.getters.user">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="item in menuItems"
            :key="item.route"
            :to="item.route"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn v-if="this.$store.getters.user" @click="logOut">Log Out</v-btn>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    menuItems: [
      {
        name: "Log in",
        route: "login",
      },
      {
        name: "Registration",
        route: "registration",
      },
    ],
  }),
  beforeMount() {
    if (window.localStorage.getItem("userId")) {
      this.$router.push("/");
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch("logoutUser");
      this.$router.push("/login");
    },
  },
};
</script>
