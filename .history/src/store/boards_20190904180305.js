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
    manualUpdateList(state, payload) {
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
        if (item.id === listId && !item.items) {
          return {
            ...item,
            items: {
              [item.id]: card,
            },
          };
        } else if (item.id === listId && item.items) {
          return {
            ...item,
            items: { ...item.items, [card.id]: card },
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

        commit("loadBoards", boards ? Object.values(boards) : []);
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
    async editLists({ commit }, { userId, boardId, a }) {
      const b = [];
      console.log(a);
      a.forEach(element => {
        console.log(element);
        a.push(element.items);
      });
      console.log(b);
      // const newLists = list.reduce((acc, item) => {
      //   const a = item;
      //   console.log(55, a);
      //   // acc[item.id] = {
      //   //   id: item.id,
      //   //   items: item.items,
      //   //   title: item.title,
      //   // };
      //   return acc;
      // }, {});
      // console.log(newLists);
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
          .ref(`boards/${userId}/${boardId}/lists/${listId}/items`)
          .push({
            title,
          });

        const newCard = { title, id: new Date().valueOf(), cardId: myRef.key };

        await fb
          .database()
          .ref(`boards/${userId}/${boardId}/lists/${listId}/items/${myRef.key}`)
          .set(newCard);

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
      return state.lists.map(item => {
        return {
          ...item,
          items: item.items ? Object.values(item.items) : item.items,
        };
      });
    },
  },
};
