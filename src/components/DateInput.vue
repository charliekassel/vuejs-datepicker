<template>
  <div :class="{'input-group' : bootstrapStyling}">
    <!-- Calendar Button -->
    <span v-if="calendarButton" class="vdp-datepicker__calendar-button" :class="{'input-group-addon' : bootstrapStyling}" @click="showCalendar" v-bind:style="{'cursor:not-allowed;' : disabledPicker}">
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
      :disabled="disabledPicker"
      :required="required"
      @click="showCalendar"
      readonly>
    <!-- Clear Button -->
    <span v-if="clearButton && selectedDate" class="vdp-datepicker__clear-button" :class="{'input-group-addon' : bootstrapStyling}" @click="clearDate()">
      <i :class="clearButtonIcon">
        <span v-if="!clearButtonIcon">&times;</span>
      </i>
    </span>
  </div>
</template>
<script>
import DateUtils from '../utils/DateUtils'
export default {
  props: {
    selectedDate: Date,
    format: String,
    translation: Object,
    inline: Boolean,
    id: String,
    name: String,
    refName: String,
    openDate: Date,
    placeholder: String,
    inputClass: [String, Object],
    clearButton: Boolean,
    clearButtonIcon: String,
    calendarButton: Boolean,
    calendarButtonIcon: String,
    calendarButtonIconContent: String,
    disabledPicker: Boolean,
    required: Boolean,
    bootstrapStyling: Boolean
  },
  computed: {
    formattedValue () {
      if (!this.selectedDate) {
        return null
      }
      return typeof this.format === 'function'
        ? this.format(this.selectedDate)
        : DateUtils.formatDate(new Date(this.selectedDate), this.format, this.translation)
    },

    computedInputClass () {
      let cssClass = [this.inputClass]
      if (this.bootstrapStyling) {
        cssClass.push('form-control')
      }
      return cssClass.join(' ')
    }
  },
  methods: {
    showCalendar () {
      this.$emit('showCalendar')
    }
  }
}
// eslint-disable-next-line
;
</script>
