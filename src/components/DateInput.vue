<template>
  <div :class="{'input-group' : bootstrapStyling}">
    <!-- Calendar Button -->
    <span v-if="calendarButton" class="vdp-datepicker__calendar-button" :class="{'input-group-addon' : bootstrapStyling}" @click="showCalendar" v-bind:style="{'cursor:not-allowed;' : disabled}">
      <i :class="calendarButtonIcon">
        {{ calendarButtonIconContent }}
        <span v-if="!calendarButtonIcon">&hellip;</span>
      </i>
    </span>
    <!-- Input -->
    <input
      :type="inline ? 'hidden' : 'text'"
      :class="computedInputClass"
      :name="name"
      :ref="refName"
      :id="id"
      :value="formattedValue"
      :open-date="openDate"
      :placeholder="placeholder"
      :clear-button="clearButton"
      :disabled="disabled"
      :required="required"
      @click="showCalendar"
      @keydown="allowTyping"
      @keyup="parseTypedDate"
      @blur="inputBlurred">
    <!-- Clear Button -->
    <span v-if="clearButton && selectedDate" class="vdp-datepicker__clear-button" :class="{'input-group-addon' : bootstrapStyling}" @click="clearDate()">
      <i :class="clearButtonIcon">
        <span v-if="!clearButtonIcon">&times;</span>
      </i>
    </span>
    <slot name="afterDateInput"></slot>
  </div>
</template>
<script>
import DateUtils from '../utils/DateUtils'

export default {
  props: {
    selectedDate: Date,
    selectedRange: Object,
    resetTypedDate: [Date],
    format: [String, Function],
    translation: Object,
    inline: Boolean,
    id: String,
    name: String,
    refName: String,
    openDate: Date,
    placeholder: String,
    inputClass: [String, Object, Array],
    clearButton: Boolean,
    clearButtonIcon: String,
    calendarButton: Boolean,
    calendarButtonIcon: String,
    calendarButtonIconContent: String,
    disabled: Boolean,
    range: Boolean,
    required: Boolean,
    typeable: Boolean,
    bootstrapStyling: Boolean
  },
  data () {
    return {
      input: null,
      typedDate: false
    }
  },
  computed: {
    formattedValue () {
      if (!this.selectedDate) {
        return null
      }
      if (this.typedDate) {
        return this.typedDate
      }
      if (this.range) {
        if (typeof this.format === 'function') {
          return this.format(this.selectedRange.from) + ' - ' + this.format(this.selectedRange.to)
        } else {
          return this.formatDate(this.selectedRange.from, this.selectedRange.to, true)
        }
      }
      return typeof this.format === 'function'
        ? this.format(this.selectedDate)
        : this.formatDate(this.selectedDate)
    },

    computedInputClass () {
      if (this.bootstrapStyling) {
        if (typeof this.inputClass === 'string') {
          return [this.inputClass, 'form-control'].join(' ')
        }
        return {'form-control': true, ...this.inputClass}
      }
      return this.inputClass
    }
  },
  watch: {
    resetTypedDate () {
      this.typedDate = false
    }
  },
  methods: {
    formatDate (date1, date2, range = false) {
      if (range) {
        let returnDate = this.formatDate(date1)
        if (date2) {
          // Return one date if the dates are the same
          if (date1.getTime() === date2.getTime()) {
            return this.formatDate(date1)
          }
          // removes month if date1 & 2 have the same.
          // NB: might be a cheaper solution, consider refactoring.
          returnDate += ' - ' + this.formatDate(date2)
          returnDate = returnDate.split(' ')
          .reverse()
          .filter((e, i, a) => i === a.indexOf(e))
          .reverse()
          .join(' ')
        }
        return returnDate
      } else {
        return DateUtils.formatDate(new Date(date1), this.format, this.translation)
      }
    },

    showCalendar () {
      this.$emit('showCalendar')
    },
    /**
     * Prevent typing if not typeable
     * @param {Event} event
     * @return {Boolean}
     */
    allowTyping (event) {
      if (!this.typeable) {
        event.preventDefault()
        return false
      }
      return true
    },
    /**
     * Attempt to parse a typed date
     * @param {Event} event
     */
    parseTypedDate (event) {
      // close calendar if escape or enter are pressed
      if ([
        27, // escape
        13  // enter
      ].includes(event.keyCode)) {
        this.input.blur()
      }

      if (this.typeable) {
        const typedDate = Date.parse(this.input.value)
        if (!isNaN(typedDate)) {
          this.typedDate = this.input.value
          this.$emit('typedDate', new Date(this.typedDate))
        }
      }
    },
    /**
     * nullify the typed date to defer to regular formatting
     * called once the input is blurred
     */
    inputBlurred () {
      if (this.typeable && isNaN(Date.parse(this.input.value))) {
        this.clearDate()
        this.input.value = null
        this.typedDate = null
      }

      this.$emit('closeCalendar')
    },
    /**
     * emit a clearDate event
     */
    clearDate () {
      this.$emit('clearDate')
    }
  },
  mounted () {
    this.input = this.$el.querySelector('input')
  }
}
// eslint-disable-next-line
;
</script>
