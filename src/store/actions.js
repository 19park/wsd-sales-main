import { agent } from '../api'

const actions = {
    FETCH_AGENT ({commit}) {
        return agent.fetch().then(data => {
            commit('SET_AGENT', data)
        })
    }
}

export default actions
