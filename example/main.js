import Vue from 'vue'
import Demo from './Demo.vue'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(Demo)
})
