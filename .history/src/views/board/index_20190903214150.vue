<template>
  <div>
    <template v-if="this.$store.getters.loading">
      <Loading />
    </template>
    <div class="list-box">
      <div class="drag-container" v-drag-and-drop:options="options">
        <v-container fluid class="grey lighten-5 lists drag-container">
          <v-layout>
            <div
              v-if="!groups.length && !this.$store.getters.loading"
              class="notFoundTitle"
            >Not Found Lists</div>
            <div
              class="js-list list-wrapper drag-column"
              v-for="item in groups"
              :key="item.id"
              v-else
            >
              <div class="list js-list-content">
                <div class="list-header js-list-header u-clearfix is-menu-shown">
                  <div class="list-header-target js-editing-target"></div>
                  <h2 class="list-header-name-assist js-list-name-assist" dir="auto">{{ item.name }}</h2>
                </div>
                <div class="list-header-extras">
                  <span class="list-header-extras-subscribe js-list-subscribed hide">
                    <v-menu
                      v-model="menu[item.id]"
                      :close-on-content-click="false"
                      :nudge-width="200"
                      offset-x
                    >
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">mdi-dots-vertical</v-icon>
                      </template>

                      <v-card>
                        <v-list>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>List Actions</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>

                        <v-divider></v-divider>

                        <v-list>
                          <v-list-item @click="addCard">
                            <v-list-item-content>
                              <v-list-item-title>Add Card</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>

                          <v-list-item @click="editList(item)">
                            <v-list-item-content>
                              <v-list-item-title>Edit List</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>

                          <v-list-item @click="removeList(item)">
                            <v-list-item-content>
                              <v-list-item-title>Remove List</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-menu>
                  </span>
                </div>
                <v-divider color="grey" />
                <div
                  class="list-cards u-fancy-scrollbar u-clearfix js-list-cards js-sortable ui-sortable"
                >
                  <vue-draggable-group
                    :groups="groups"
                    :data-id="item.id"
                    @change="onGroupsChange"
                    :value="item.items"
                    :key="item.id"
                  >
                    <div class="drag-inner-list" :data-id="item.id">
                      <v-card
                        v-for="group in item.items"
                        :key="group.id"
                        :data-id="group.id"
                        class="single-card drag-item"
                      >
                        <v-card-text class="drag-item-text">
                          {{
                          group.name
                          }}
                        </v-card-text>
                      </v-card>
                    </div>
                  </vue-draggable-group>
                </div>
                <v-card v-if="selectedAddingCardList === item.id" class="card-input">
                  <v-text-field
                    name="cardTitle"
                    placeholder="Enter a title for this card…"
                    hide-details
                    flat
                    v-model="cardTitle"
                  ></v-text-field>
                  <v-card-actions>
                    <v-btn color="primary" @click="onAddCard(item.id)">Add</v-btn>
                    <v-icon @click="selectedAddingCardList = null">mdi-close</v-icon>
                  </v-card-actions>
                </v-card>
                <a
                  class="open-card-composer js-open-card-composer"
                  v-if="selectedAddingCardList !== item.id"
                  @click="addCard(item.id)"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="js-add-a-card hide">Add a card</span>
                </a>
              </div>
            </div>
            <div class="js-add-list list-wrapper mod-add is-idle">
              <form>
                <a class="open-add-list js-open-add-list" @click="addList">
                  <span class="placeholder">
                    <span class="icon-sm icon-add"></span>Add list
                  </span>
                </a>
              </form>
            </div>
            <Modal
              :isOpen="isModalOpen"
              :setOpen="setOpen"
              v-if="isModalOpen"
              :saveHandler="saveHandler"
              :saveDisabled="valid"
            >
              <v-flex xs12 sm12 md12>
                <v-toolbar dark color="primary">
                  <v-toolbar-title>Add new Board</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-form v-model="valid" ref="form" validation>
                    <v-text-field name="title" label="Title" v-model="title" :rules="fieldRules"></v-text-field>
                  </v-form>
                </v-card-text>
              </v-flex>
            </Modal>
            <Modal
              :isOpen="isEditModalOpen"
              :setOpen="setEditModalOpen"
              v-if="isEditModalOpen"
              :saveHandler="saveEditHandler"
              :saveDisabled="valid"
            >
              <v-flex xs12 sm12 md12>
                <v-toolbar dark color="primary">
                  <v-toolbar-title>Edit List</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-form v-model="valid" ref="form" validation>
                    <v-text-field
                      name="title"
                      label="Title"
                      :rules="fieldRules"
                      v-model="selectedList.title"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
              </v-flex>
            </Modal>
          </v-layout>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/loading";
import Modal from "@/components/modal";

export default {
  computed: {
    groups: {
      get: function() {
        return this.$store.getters.lists;
      },
      set: function(value) {
        console.log(value);
      },
    },
  },
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
      this.groups = e;
    },
  },
};
</script>

<style lang="scss">
@import "./style.scss";
</style>
