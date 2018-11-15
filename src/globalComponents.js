import BootstrapVue from "bootstrap-vue"
import Card from './components/cards/Card.vue'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import "./assets/css/base.css"

/* load handsontable styles */
import "handsontable-pro/dist/handsontable.full.css"
import "./assets/css/handsontable.custom.css"
import "./assets/css/sales-main.css"

import Toasted from 'vue-toasted'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faSave,
    faEdit,
    faPlusCircle,
    faTrashAlt,
    faInfoCircle,
    faSearch
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
library.add(faSave, faEdit, faPlusCircle, faTrashAlt, faInfoCircle, faSearch)

/* load custom plugin */
import getRefs from './components/plugin/getRefs'
import common from './components/plugin/common'

export default {
    install (Vue) {
        Vue.use(BootstrapVue)

        Vue.component('card', Card)
        Vue.component('font-awesome-icon', FontAwesomeIcon)

        //Vue.component('loading', Loading)
        Vue.use(Loading)
        Vue.use(Toasted, {
            theme: "primary",
            position: "bottom-center",
            duration: 3000
        })

        Object.defineProperty(Vue.prototype, "uniqId", {
            get: function uniqId() {
                return this._uid
            }
        })


        // use custom plugin
        Vue.use(getRefs)
        Vue.use(common)
    }
}

