<template>
  <div class="d-flex flex-wrap ml-100">
    <v-card
      class="mr-10 mb-10"
      max-width="250"
      v-for="(item, index) in this.$store.getters.boards"
      :key="index"
    >
      <v-img
        class="white--text"
        height="200px"
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      >
        <v-card-title class="align-end fill-height">{{
          item.title
        }}</v-card-title>
      </v-img>

      <v-card-text>
        <span>{{ item.description }}</span>
      </v-card-text>

      <v-card-actions>
        <v-btn text color="orange">Open</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    boards: [],
  }),
  beforeCreate() {
    console.log(this.$store.getters.boards);
    this.$store.dispatch("fetchBoardsById", this.$store.getters.user.id);
  },
};
</script>

<style>
.ml-100 {
  margin-left: 100px;
}
</style>
