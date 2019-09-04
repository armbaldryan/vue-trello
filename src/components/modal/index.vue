<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <slot />

        <v-card-actions>
          <div class="flex-grow-1"></div>

          <v-btn
            v-if="saveHandler"
            color="primary darken-1"
            text
            :disabled="!saveDisabled"
            @click="saveHandler()"
            :loading="loading"
          >Save</v-btn>
          <v-btn color="green darken-1" text @click="setOpen(false)">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      dialog: this.isOpen,
    };
  },
  props: {
    setOpen: Function,
    isOpen: Boolean,
    saveHandler: Function,
    saveDisabled: Boolean,
    loading: Boolean,
  },
  watch: {
    isOpen: function(newVal) {
      if (newVal !== this.dialog) {
        this.dialog = newVal;
      }
    },
    dialog: function(newVal) {
      if (newVal !== this.isOpen) {
        this.setOpen(false);
      }
    },
  },
};
</script>

<style></style>
