<template>
  <div>
    <div
      class="list-cards u-fancy-scrollbar u-clearfix js-list-cards js-sortable ui-sortable"
      v-if="item.items"
    >
      <vue-draggable-group
        :groups="lists"
        :data-id="item.id"
        @change="onGroupsChange"
        :key="item.id"
        v-model="item.items"
      >
        <div class="drag-inner-list" :data-id="item.id">
          <v-card
            v-for="card in item.items"
            :key="card.id"
            :data-id="card.id"
            class="single-card drag-item"
            @mouseover="hover = card.id"
            @mouseleave="hover = null"
          >
            <v-card-text class="drag-item-text">{{ card.title }}</v-card-text>
            <v-icon
              class="edit-icon"
              @click="cardClickHandler(card)"
              v-show="hover === card.id"
            >mdi-pencil</v-icon>
          </v-card>
        </div>
      </vue-draggable-group>
    </div>
    <Modal
      :isOpen="isEditModalOpen"
      :setOpen="setEditModalOpen"
      v-if="isEditModalOpen"
      :saveHandler="saveEditHandler"
      :saveDisabled="valid"
      :loading="loading"
    >
      <v-flex xs12 sm12 md12>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Edit Card</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form v-model="valid" ref="form" validation>
            <v-text-field
              name="title"
              label="Title"
              :rules="fieldRules"
              v-model="selectedCard.title"
            ></v-text-field>
          </v-form>
        </v-card-text>
      </v-flex>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/modal";

export default {
  props: ["item", "lists", "onGroupsChange"],
  data() {
    return {
      hover: null,
      isEditModalOpen: false,
      title: "",
      valid: false,

      fieldRules: [v => !!v || "Field is required"],
      selectedCard: null,
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
  },
  components: {
    Modal,
  },
  methods: {
    cardClickHandler(item) {
      this.selectedCard = { ...item };
      this.isEditModalOpen = true;
    },
    setEditModalOpen(isOpen) {
      if (isOpen === false) {
        this.selectedCard = null;
      }
      this.isEditModalOpen = isOpen;
    },
    saveEditHandler() {
      this.$store
        .dispatch("editCard", {
          userId: this.$store.getters.user.id,
          boardId: this.$router.history.current.params.id,
          listId: this.item.id,
          selectedCard: this.selectedCard.cardId,
          title: this.selectedCard.title,
        })
        .then(() => this.setEditModalOpen(false));
    },
  },
};
</script>

<style>
</style>