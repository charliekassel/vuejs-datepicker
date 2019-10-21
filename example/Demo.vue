<template>

  <div id="app">
    <h1>Datepicker Examples</h1>
 
    <div class="example">
      <h3>Inline datepicker</h3>
      <datepicker :inline="true" :monday-first="true" :month-limit="24"></datepicker>
      <code>
          &lt;datepicker :inline="true" :monday-first="true" :month-limit="24" &gt;&lt;/datepicker&gt;
      </code>
    </div>

  </div>
</template>

<script>
import Datepicker from '../src/components/Datepicker.vue'
import * as lang from '../src/locale/index.js'

const state = {
  date1: new Date()
}

export default {
  name: 'demo',
  components: {
    Datepicker
  },
  mounted() {  
    let styleGuideJs = document.createElement('script')
    styleGuideJs.setAttribute('src', 'https://st-cdn.holidayhype.co.uk/RetailBase/hh/hh.bundle.js')
    document.head.appendChild(styleGuideJs)
  },
  data () {
    return {
      styleInput: null,
      format: 'd MMMM yyyy',
      disabledDates: {},
      openDate: null,
      disabledFn: {
        customPredictor (date) {
          if (date.getDate() % 3 === 0) {
            return true
          }
        }
      },
      highlightedFn: {
        customPredictor (date) {
          if (date.getDate() % 4 === 0) {
            return true
          }
        }
      },
      highlighted: {},
      eventMsg: null,
      state: state,
      vModelExample: null,
      languages: lang,
      language: 'en'
    }
  },
  computed: {
    getInputStyle () {
      return this.styleInput
    }
  },
  methods: {
    highlightTo (val) {
      if (typeof this.highlighted.to === 'undefined') {
        this.highlighted = {
          to: null,
          daysOfMonth: this.highlighted.daysOfMonth,
          from: this.highlighted.from
        }
      }
      this.highlighted.to = val
    },
    highlightFrom (val) {
      if (typeof this.highlighted.from === 'undefined') {
        this.highlighted = {
          to: this.highlighted.to,
          daysOfMonth: this.highlighted.daysOfMonth,
          from: null
        }
      }
      this.highlighted.from = val
    },
    setHighlightedDays (elem) {
      if (elem.target.value === 'undefined') {
        return
      }
      let highlightedDays = elem.target.value.split(',').map(day => parseInt(day))
      this.highlighted = {
        from: this.highlighted.from,
        to: this.highlighted.to,
        daysOfMonth: highlightedDays
      }
    },
    setDisabledDays (elem) {
      if (elem.target.value === 'undefined') {
        return
      }
      let disabledDays = elem.target.value.split(',').map(day => parseInt(day))
      this.disabledDates = {
        from: this.disabledDates.from,
        to: this.disabledDates.to,
        daysOfMonth: disabledDays
      }
    },
    disableTo (val) {
      if (typeof this.disabledDates.to === 'undefined') {
        this.disabledDates = {
          to: null,
          daysOfMonth: this.disabledDates.daysOfMonth,
          from: this.disabledDates.from
        }
      }
      this.disabledDates.to = val
    },
    disableFrom (val) {
      if (typeof this.disabledDates.from === 'undefined') {
        this.disabledDates = {
          to: this.disabledDates.to,
          daysOfMonth: this.disabledDates.daysOfMonth,
          from: null
        }
      }
      this.disabledDates.from = val
    }
  }
}
</script>

<style>

@import url('https://st-cdn.holidayhype.co.uk/RetailBase/hh/hh.bundle.css');

body {
    font-family: 'Helvetica Neue Light', Helvetica, sans-serif;
    padding: 1em 2em 2em;
}
input, select {
    padding: .75em .5em;
    font-size: 100%;
    border: 1px solid #ccc;
    width: 100%
}

.example {
    background: #f2f2f2;
    border: 1px solid #ddd;
    padding: 0em 1em 1em;
    margin-bottom: 2em;
}

code,
pre {
    margin: 1em 0;
    padding: 1em;
    border: 1px solid #bbb;
    display: block;
    background: #ddd;
    border-radius: 3px;
}

.settings {
    margin: 2em 0;
    border-top : 1px solid #bbb;
    background: #eee;
}

h5 {
    font-size:100%;
    padding: 0;
}

.form-group {
    margin-bottom: 1em;
}

.form-group label {
    font-size: 80%;
    display: block;
}
</style>
