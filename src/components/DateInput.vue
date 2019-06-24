<template>
  <div :class="{'input-group' : bootstrapStyling}">
    <!-- Calendar Button -->
    <span v-if="calendarButton" class="vdp-datepicker__calendar-button" :class="{'input-group-prepend' : bootstrapStyling}" @click="showCalendar" v-bind:style="{'cursor:not-allowed;' : disabled}">
      <span :class="{'input-group-text' : bootstrapStyling}">
        <i :class="calendarButtonIcon">
          {{ calendarButtonIconContent }}
          <span v-if="!calendarButtonIcon">&hellip;</span>
        </i>
      </span>
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
      :readonly="!typeable"
      @click="showCalendar"
      @keyup="parseTypedDate"
      @blur="inputBlurred"
      autocomplete="off">
    <!-- Clear Button -->
    <span v-if="clearButton && selectedDate" class="vdp-datepicker__clear-button" :class="{'input-group-append' : bootstrapStyling}" @click="clearDate()">
      <span :class="{'input-group-text' : bootstrapStyling}">
        <i :class="clearButtonIcon">
          <span v-if="!clearButtonIcon">&times;</span>
        </i>
      </span>
    </span>
    <slot name="afterDateInput"></slot>
  </div>
</template>
<script>
import { makeDateUtils } from '../utils/DateUtils'
export default {
  props: {
    selectedDate: Date,
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
    required: Boolean,
    typeable: Boolean,
    bootstrapStyling: Boolean,
    useUtc: Boolean
  },
  data () {
    const constructedDateUtils = makeDateUtils(this.useUtc)
    return {
      input: null,
      typedDate: false,
      utils: constructedDateUtils
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
      return typeof this.format === 'function'
        ? this.format(this.selectedDate)
        : this.utils.formatDate(new Date(this.selectedDate), this.format, this.translation)
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
    showCalendar () {
      this.$emit('showCalendar')
    },
    /**
     * Attempt to parse a typed date
     * @param {Event} event
     */
    parseTypedDate (event) {
      // close calendar if escape or enter are pressed
      if ([
        27, // escape
        13 // enter
      ].includes(event.keyCode)) {
        this.input.blur()
      }

      if (this.typeable) {
        let typedDate

        /**
         * Identify the correct separator used when
         * separating day, month, and year.
         *
         * Default: "/"
         */
        let separator = [' ', '.', ',', '-', '/'].find((val) => {
          let count = (this.format.match(new RegExp(val, 'g')) || []).length

          return count === 2
        }, '/')

        let formatParts = this.format.split(separator)
        let dateParts = this.input.value.split(separator)

        /**
         * Get each indexes/sequence for day, month,
         * and year based on the format.
         */
        let indexes = {
          day: formatParts.findIndex((part) => {
            return part.toLowerCase().includes('d')
          }),
          month: formatParts.findIndex((part) => {
            return part.toLowerCase().includes('m')
          }),
          year: formatParts.findIndex((part) => {
            return part.toLowerCase().includes('y')
          })
        }

        /**
         * Get each length of day, month, and year
         */
        let len = {
          day: formatParts[indexes.day],
          month: formatParts[indexes.month],
          year: formatParts[indexes.year]
        }

        /**
         * Get each value of day, month, and year
         */
        let values = {
          day: dateParts[indexes.day],
          month: dateParts[indexes.month],
          year: dateParts[indexes.year]
        }

        /**
         * Default month number format
         */
        let monthNum = values.month - 1

        /**
         * Only allow if day, month, and year
         * is already been typed.
         */
        if (values.day && values.month && values.year) {
          /**
           * Check the length of each item (day, month, year)
           * if its the same with the passed format.
           */
          if (values.day.length === len.day.length && values.month.length === len.month.length && values.year.length === len.year.length) {
            /**
             * We only support until this month format ("MMM").
             * No support yet for month format "MMMM"
             */
            let monthNames = [
              'Jan', 'Feb', 'Mar',
              'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'
            ]

            /**
             * Check once month value is 3 characters in length
             */
            if (values.month.length === 3) {
              monthNum = monthNames.findIndex((name) => {
                return name === values.month
              })
            }

            /**
             * Get the unix timestamp of typed date.
             */
            typedDate = new Date(values.year, monthNum, values.day).valueOf()
          }
        }

        if (!isNaN(typedDate)) {
          this.typedDate = this.input.value
          this.$emit('typedDate', new Date(typedDate))
        }
      }
    },
    /**
     * nullify the typed date to defer to regular formatting
     * called once the input is blurred
     */
    inputBlurred () {
      if (this.typeable && isNaN(this.selectedDate)) {
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
