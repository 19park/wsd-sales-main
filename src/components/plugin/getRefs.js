let getRefs = {}

getRefs.install = function (Vue, options) {
    /**
     * 전역 인스턴스
     */
    Vue.prototype.$salesMain = function () {
        return this.$root.$children[0].$refs['sales-main']
    }
    Vue.prototype.$salesEntry = function () {
        return this.$salesMain().$refs['sales-entry']
    }
    Vue.prototype.$salesListWrap = function () {
        return this.$salesMain().$refs['list-panel']
    }
    Vue.prototype.$salesList = function () {
        return this.$salesMain().$refs['sales-list']
    }
    Vue.prototype.$salesLedger = function () {
        return this.$salesMain().$refs['sales-ledger']
    }
}

export default getRefs