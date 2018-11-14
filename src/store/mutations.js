const mutations = {
    SET_COOKIES (state, payload) {
        state[payload.key] = payload.value;
    },
    SET_AGENT (state, payload) {
        Object.keys(state.AGENT_SETTINGS).forEach(function(key) {
            if(state.AGENT_SETTINGS.hasOwnProperty(key)){
                state.AGENT_SETTINGS[key] = payload[key]
            }
        })

        let checkTxt = ''
        Object.keys(state.PRINT_SETTINGS).forEach(function(key) {
            if(state.PRINT_SETTINGS.hasOwnProperty(key)){
                if(key !== 'PRINT_CHECK_TXT'){
                    state.PRINT_SETTINGS[key] = payload[key]
                    checkTxt += payload[key]
                }
            }
        })
        state.PRINT_SETTINGS.PRINT_CHECK_TXT = checkTxt
    }
}

export default mutations
