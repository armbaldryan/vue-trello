<template>
  <div>
    <v-navigation-drawer expand-on-hover absolute permanent left>
      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          @click.prevent="
            item.route ? routeHandler(item.route) : clickHandler()
          "
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <Modal
      :isOpen="isModalOpen"
      :setOpen="setOpen"
      v-if="isModalOpen"
      :saveHandler="saveHandler"
      :loading="loading"
      :saveDisabled="valid && !!image"
    >
      <v-flex xs12 sm12 md12>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Add new Board</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form v-model="valid" ref="form" validation>
            <v-text-field
              prepend-icon="mdi-email"
              name="title"
              label="Title"
              v-model="title"
              :rules="fieldRules"
            ></v-text-field>
            <v-text-field
              prepend-icon="mdi-key"
              name="description"
              label="Description"
              type="description"
              v-model="description"
              :rules="fieldRules"
            ></v-text-field>
            <v-layout row class="mb-3" justify-center>
              <v-btn class="warning" @click="triggerUpload">
                Upload
                <v-icon right dark>mdi-file-image</v-icon>
              </v-btn>
              <input
                ref="fileInput"
                type="file"
                style="display: none;"
                accept="image/*"
                @change="onFileChange"
              />
            </v-layout>
            <v-layout row class="mb-3" justify-center>
              <img :src="imageSrc" height="100" v-if="imageSrc" />
            </v-layout>
          </v-form>
        </v-card-text>
      </v-flex>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/modal";

export default {
  data: () => ({
    isModalOpen: false,
    items: [
      { title: "Boards", icon: "mdi-clipboard", route: "/" },
      { title: "Create Board", icon: "mdi-clipboard-text" },
    ],
    title: "",
    description: "",
    image: null,
    valid: false,
    fieldRules: [v => !!v || "Field is required"],
    imageSrc: "",
  }),
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
  },
  components: {
    Modal,
  },
  methods: {
    routeHandler(route) {
      return this.$router.push(route);
    },
    clickHandler() {
      this.isModalOpen = true;
    },
    setOpen(isOpen) {
      if (isOpen === false) {
        this.title = "";
        this.description = "";
        this.image = null;
        this.imageSrc = "";
      }
      this.isModalOpen = isOpen;
    },
    saveHandler() {
      this.$store
        .dispatch("createBoard", {
          title: this.title,
          description: this.description,
          image: this.image,
        })
        .then(() => this.setOpen(false));
    },
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(file);
      this.image = file;
    },
  },
};
</script>
