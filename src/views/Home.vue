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
import { mapState } from "vuex";
import SideBar from "@/components/sidebar";
import Boards from "@/views/boards";
import Loading from "@/components/loading";

export default {
  data: () => ({}),
  computed: {
    ...mapState({
      bldux: state => state.a,
      b: state => state.b,
    }),
  },
  components: {
    SideBar,
    Boards,
    Loading,
  },
  mounted() {
    this.message = "6666";
    /**
     *  fb.auth()
      .createUserWithEmailAndPassword("baldryanarmen@gmail.com", "1234556")
      .then(user => console.log(user));
     */
  },
};
</script>
