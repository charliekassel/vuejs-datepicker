import Vue from 'vue'
import App from './App.vue'

Vue.config.debug = true;


/* eslint-disable no-new */
let vm = new Vue({
  el: 'body',
  components: { App }
})
