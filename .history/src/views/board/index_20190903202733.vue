<template>
  <div class="drag-container" v-drag-and-drop:options="options">
    <ul>
      <li v-for="group in lists" :key="group.id">
        <vue-draggable-group
          v-model="group.cards"
          :groups="groups"
          :data-id="group.id"
          @change="onGroupsChange"
        >
          <ul class="drag-inner-list" :data-id="group.id">
            <li class="drag-item" v-for="item in group.cards" :key="item.id" :data-id="item.id">
              <div class="drag-item-text">{{ item.title }}</div>
            </li>
          </ul>
        </vue-draggable-group>
      </li>
    </ul>
  </div>
</template>

<script>
import Loading from "@/components/loading";
import Modal from "@/components/modal";

export default {
  data: () => ({
    isModalOpen: false,
    isEditModalOpen: false,
    title: "",
    valid: false,
    fieldRules: [v => !!v || "Field is required"],
    menu: [],
    selectedList: null,
    selectedAddingCardList: null,
    cardTitle: "",
    options: {
      dropzoneSelector: ".drag-inner-list",
      draggableSelector: ".drag-item",
      showDropzoneAreas: true,
      multipleDropzonesItemsDraggingEnabled: true,
      onDrop: function(event, target) {
        console.log(1, event, target);
      },
      onDragstart: function(event, target) {
        console.log(2, event, target);
      },
      onDragend: function(event, target) {
        console.log(3, event, target);
      },
    },
    selectedCard: [],
  }),
  components: {
    Loading,
    Modal,
  },

  computed: {
    lists() {
      return this.$store.getters.lists.map(item => {
        return {
          ...item,
          cards: item.cards ? Object.values(item.cards) : item.cards,
        };
      });
    },
  },
  beforeCreate() {
    this.$store.dispatch("fetchListsByBoardId", {
      userId: this.$store.getters.user.id,
      boardId: this.$router.history.current.params.id,
    });
  },
  beforeDestroy() {
    this.$store.commit("removeLists");
  },
  methods: {
    addList() {
      this.isModalOpen = true;
    },
    setOpen(isOpen) {
      if (isOpen === false) {
        this.title = "";
      }
      this.isModalOpen = isOpen;
    },
    setEditModalOpen(isOpen) {
      if (isOpen === false) {
        this.selectedList = null;
      }
      this.isEditModalOpen = isOpen;
    },
    addCard(id) {
      this.selectedAddingCardList = id;
    },
    removeList(item) {
      this.$store
        .dispatch("removeList", {
          userId: this.$store.getters.user.id,
          boardId: this.$router.history.current.params.id,
          listId: item.id,
        })
        .then(() => this.setEditModalOpen(false));
    },
    editList(item) {
      this.selectedList = { ...item };
      this.isEditModalOpen = true;
    },
    saveHandler() {
      this.$store
        .dispatch("createList", {
          userId: this.$store.getters.user.id,
          boardId: this.$router.history.current.params.id,
          title: this.title,
        })
        .then(() => this.setOpen(false));
    },
    saveEditHandler() {
      this.$store
        .dispatch("editList", {
          userId: this.$store.getters.user.id,
          boardId: this.$router.history.current.params.id,
          listId: this.selectedList.id,
          title: this.selectedList.title,
        })
        .then(() => this.setEditModalOpen(false));
    },
    nameHandler(title) {
      this.selectedList.title = title;
    },

    onAddCard(id) {
      if (this.cardTitle) {
        this.$store
          .dispatch("addCard", {
            userId: this.$store.getters.user.id,
            boardId: this.$router.history.current.params.id,
            listId: id,
            title: this.cardTitle,
          })
          .then(() => {
            this.cardTitle = "";
            this.selectedAddingCardList = null;
          });
      }
    },
    onGroupsChange(e) {
      console.log(e, this.lists);
    },
  },
};
</script>

<style lang="scss">
@import "./style.scss";
</style>
