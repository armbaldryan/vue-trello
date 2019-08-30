<template>
  <div>
    <div v-if="!this.$store.getters.lists">
      Not Found Lists
      <v-btn @click="addList">Add List</v-btn>
    </div>
    <div v-else>found Lists</div>
  </div>
</template>

<script>
export default {
  beforeMount() {
    this.$store.dispatch("fetchListsByBoardId", {
      userId: this.$store.getters.user.id,
      boardId: this.$router.history.current.params.id,
    });
  },
  mounted() {
    this.$store.dispatch("createList", {
      userId: this.$store.getters.user.id,
      boardId: this.$router.history.current.params.id,
      title: "aaaa",
    });
  },
  methods: {
    addList() {
      console.log(4);
    },
  },
};
</script>

<style></style>
