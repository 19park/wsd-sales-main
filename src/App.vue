<template>
  <div id="app">
    <SalesMain/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import SalesMain from './components/SalesMain.vue'

  import Snotify, { SnotifyPosition } from 'vue-snotify'
  import "vue-snotify/styles/material.scss"

  Vue.use(Snotify, {
      toast: {
          timeout: 4000,
          position: SnotifyPosition.rightTop
      }
  })

  export default {
    name: 'app',
    components: {
      SalesMain
    }
  }
</script>
