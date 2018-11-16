const getters = {
    getAgentSettings (state) {
        return state.AGENT_SETTINGS
    },
    getPrintSettings (state) {
        return state.PRINT_SETTINGS
    },

    getAmountTypeTxt (state) {
        return (state.AGENT_SETTINGS.AMOUNT_DIV === '0' &&
            state.AGENT_SETTINGS.EGG_DIV === '0') ?
            ['판수량', '알수량', '전체수량'] :
            ['BOX수량', 'EA수량', '전체수량']
    },
}

export default getters
