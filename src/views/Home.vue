<template>
  <v-container>
    <SideBar />
    <template v-if="this.$store.getters.loading">
      <Loading />
    </template>
    <Boards />
  </v-container>
</template>

<script>
import SideBar from "@/components/sidebar";
import Boards from "@/views/boards";
import Loading from "@/components/loading";

export default {
  data: () => ({}),
  components: {
    SideBar,
    Boards,
    Loading,
  },
};
</script>
