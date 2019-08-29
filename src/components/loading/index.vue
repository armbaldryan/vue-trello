<template>
  <div class="loading-wrapper">
    <v-progress-circular
      indeterminate
      :size="100"
      :width="3"
      color="purple"
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  name: "loading",
};
</script>

<style scoped>
.loading-wrapper {
  align-items: center;
  cursor: none;
  display: flex;
  height: 100%;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 9;
}
</style>
