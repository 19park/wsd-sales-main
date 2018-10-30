const mutations = {
  SET_COOKIES (state, payload) {
    state[payload.key] = payload.value;
  },
}

export default mutations
