import * as fb from "firebase";

export default {
  state: {
    boards: [],
  },
  mutations: {
    createBoard(state, payload) {
      state.boards.push(payload);
    },
    loadBoards(state, payload) {
      state.boards = payload;
    },
  },
  actions: {
    async createBoard({ commit, getters }, payload) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const newAd = {
          title: payload.title,
          description: payload.description,
          user: getters.user.id,
        };

        console.log(newAd);

        await fb
          .database()
          .ref(`boards/${getters.user.id}`)
          .push(newAd);

        commit("createBoard", newAd);

        commit("setLoading", false);
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    },
    async fetchBoardsById({ commit }, id) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const fbVal = await fb
          .database()
          .ref(`boards/${id}`)
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
  },
};
