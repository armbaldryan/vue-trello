import * as fb from "firebase";
const uuidv1 = require("uuid/v1");

export default {
  state: {
    boards: [],
    lists: [],
  },
  mutations: {
    createBoard(state, payload) {
      state.boards.push(payload);
    },
    loadBoards(state, payload) {
      state.boards = payload;
    },
    removeLists(state) {
      state.lists = null;
    },
    loadLists(state, payload) {
      console.log(state);
      state.lists = payload;
    },
    createList(state, payload) {
      state.lists.push(payload);
    },
  },
  actions: {
    async createBoard({ commit, getters }, payload) {
      commit("clearError");
      commit("setLoading", true);

      try {
        let newAd = {
          title: payload.title,
          description: payload.description,
          user: getters.user.id,
        };

        var myRef = fb
          .database()
          .ref(`boards/${getters.user.id}`)
          .push(newAd);

        newAd = {
          ...newAd,
          id: myRef.key,
        };

        await fb
          .database()
          .ref(`boards/${getters.user.id}/${myRef.key}`)
          .set(newAd);

        commit("createBoard", newAd);

        commit("setLoading", false);
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    },
    async fetchBoardsById({ commit }, userId) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const fbVal = await fb
          .database()
          .ref(`boards/${userId}`)
          .once("value");
        const boards = fbVal.val();

        commit("loadBoards", Object.values(boards));
        commit("setLoading", false);
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    },
    async fetchListsByBoardId({ commit }, { userId, boardId }) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const fbVal = await fb
          .database()
          .ref(`boards/${userId}/${boardId}`)
          .once("value");
        const board = fbVal.val();

        console.log(board);
        commit("loadLists", Object.values(board.lists));
        commit("setLoading", false);
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    },
    async createList({ commit }, { userId, boardId, title }) {
      commit("clearError");
      commit("setLoading", true);

      try {
        var myRef = fb
          .database()
          .ref(`boards/${userId}/${boardId}/lists`)
          .push({
            title,
          });

        const newList = { title, id: myRef.key };

        await fb
          .database()
          .ref(`boards/${userId}/${boardId}/lists/${myRef.key}`)
          .set(newList);

        commit("createList", newList);

        commit("setLoading", false);
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    },
    async updateAd({ commit }, { title, description, id }) {
      commit("clearError");
      commit("setLoading", true);

      try {
        await fb
          .database()
          .ref("ads")
          .child(id)
          .update({
            title,
            description,
          });
        commit("updateAd", {
          title,
          description,
          id,
        });
        commit("setLoading", false);
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    },
  },
  getters: {
    boards(state) {
      return state.boards;
    },
    lists(state) {
      return state.lists;
    },
  },
};
