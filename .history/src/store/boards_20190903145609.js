import * as fb from "firebase";

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
      state.lists = [];
    },
    loadLists(state, payload) {
      state.lists = payload;
    },
    updateList(state, { id, title }) {
      state.lists = state.lists.map(item => {
        if (item.id === id) {
          return {
            ...item,
            title,
          };
        }
        return item;
      });
    },
    removeList(state, id) {
      state.lists = state.lists.filter(item => item.id !== id);
    },
    createList(state, payload) {
      state.lists.push(payload);
    },
    addCard(state, { listId, newCard: card }) {
      state.lists = state.lists.map(item => {
        if (item.id === listId && !item.cards) {
          return {
            ...item,
            cards: {
              [card.id]: card,
            },
          };
        } else if (item.id === listId && item.cards) {
          console.log(item.cards, card);
          return {
            ...item,
            cards: { ...item.cards, [card.id]: card },
          };
        }
        return item;
      });
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

        const imageExt = payload.image.name.slice(
          payload.image.name.lastIndexOf(".")
        );

        await fb
          .storage()
          .ref(`boards/${myRef.key}${imageExt}`)
          .put(payload.image);

        const storage = fb.storage().ref();

        const imageSrc = await storage
          .child(`boards/${myRef.key}${imageExt}`)
          .getDownloadURL();

        newAd = {
          ...newAd,
          id: myRef.key,
          imageSrc: imageSrc,
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

        commit("loadLists", board.lists ? Object.values(board.lists) : []);
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
    async editList({ commit }, { userId, boardId, listId, title }) {
      commit("clearError");
      commit("setLoading", true);

      try {
        await fb
          .database()
          .ref(`boards/${userId}/${boardId}/lists/${listId}`)
          .update({
            title,
          });

        commit("updateList", {
          id: listId,
          title,
        });

        commit("setLoading", false);
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    },

    async removeList({ commit }, { userId, boardId, listId }) {
      commit("clearError");
      commit("setLoading", true);

      try {
        await fb
          .database()
          .ref(`boards/${userId}/${boardId}/lists/`)
          .child(listId)
          .remove();

        commit("removeList", listId);

        commit("setLoading", false);
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    },
    async addCard({ commit }, { userId, boardId, listId, title }) {
      commit("clearError");
      commit("setLoading", true);

      try {
        var myRef = fb
          .database()
          .ref(`boards/${userId}/${boardId}/lists/${listId}/cards`)
          .push({
            title,
          });

        const newCard = { title, id: myRef.key };

        await fb
          .database()
          .ref(`boards/${userId}/${boardId}/lists/${listId}/cards/${myRef.key}`)
          .set(newCard);

        console.log({ listId, newCard });

        commit("addCard", { listId, newCard });

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
