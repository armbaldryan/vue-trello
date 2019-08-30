<template>
  <div>
    <template v-if="this.$store.getters.loading">
      <Loading />
    </template>
    <div v-if="!this.$store.getters.lists">
      Not Found Lists
      <v-btn @click="addList">Add List</v-btn>
    </div>
    <div v-else class="list-box">
      <v-container fluid class="grey lighten-5 lists">
        <div
          class="js-list list-wrapper"
          v-for="item in this.$store.getters.lists"
          :key="item.id"
        >
          <div class="list js-list-content">
            <div class="list-header js-list-header u-clearfix is-menu-shown">
              <div class="list-header-target js-editing-target"></div>
              <h2
                class="list-header-name-assist js-list-name-assist"
                dir="auto"
              >
                {{ item.title }}
              </h2>
            </div>
            <v-divider color="grey" />
            <a class="open-card-composer js-open-card-composer" href="#">
              <span class="icon-sm icon-add"></span>
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
                <v-text-field
                  name="title"
                  label="Title"
                  v-model="title"
                  :rules="fieldRules"
                ></v-text-field>
              </v-form>
            </v-card-text>
          </v-flex>
        </Modal>
      </v-container>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/loading";
import Modal from "@/components/modal";

export default {
  data: () => ({
    isModalOpen: false,
    title: "",
    valid: false,
    fieldRules: [v => !!v || "Field is required"],
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
    saveHandler() {
      this.$store
        .dispatch("createList", {
          userId: this.$store.getters.user.id,
          boardId: this.$router.history.current.params.id,
          title: this.title,
        })
        .then(() => this.setOpen(false));
    },
  },
};
</script>

<style scoped>
.lists {
  user-select: none;
  white-space: nowrap;
  margin-bottom: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.list-wrapper {
  width: 272px;
  margin: 0 4px;
  height: 100%;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
}
.list {
  background-color: #dfe1e6;
  border-radius: 3px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  position: relative;
  white-space: normal;
}
.list-header {
  flex: 0 0 auto;
  padding: 10px 8px;
  position: relative;
  min-height: 20px;
}
.list-header.is-menu-shown,
.list-header.is-subscribe-shown {
  padding-right: 36px;
}
.open-card-composer {
  border-radius: 0 0 3px 3px;
  color: #6b778c;
  display: block;
  flex: 0 0 auto;
  padding: 8px;
  position: relative;
  text-decoration: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.open-card-composer:active {
  background-color: rgba(9, 30, 66, 0.25);
}

.open-card-composer:hover {
  background-color: rgba(9, 30, 66, 0.13);
  color: #172b4d;
  text-decoration: underline;
}
.list-wrapper.mod-add.is-idle {
  background-color: #303f9f;
  cursor: pointer;
}

.list-wrapper.mod-add {
  background-color: #dfe1e6;
  border-radius: 3px;
  height: auto;
  min-height: 32px;
  padding: 4px;
  transition: background 85ms ease-in, opacity 40ms ease-in,
    border-color 85ms ease-in;
}
.list-wrapper.mod-add .open-add-list,
.list-wrapper.mod-add .too-many-lists {
  -webkit-text-decoration-line: none;
  text-decoration-line: none;
}
.list-wrapper.mod-add.is-idle .placeholder {
  display: block;
}

.list-wrapper.mod-add .placeholder {
  color: #fff;
  display: none;
  padding: 6px 8px;
  transition: color 85ms ease-in;
}
h2 {
  font-size: 17px;
  line-height: 24px;
}
</style>
