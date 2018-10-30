import Vue from 'vue'

import BootstrapVue from "bootstrap-vue"
import Card from './components/cards/Card.vue'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import "./assets/css/base.css"

/* load handsontable styles */
import "handsontable-pro/dist/handsontable.full.css"
import "./assets/css/handsontable.custom.css"

// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.use(BootstrapVue)

export default {
  install (Vue) {
    Vue.component('card', Card)

    //Vue.component('loading', Loading)
    Vue.use(Loading);
  }
}

