<template>
  <div :class="{'input-group' : props.bootstrapStyling}">
    <!-- Calendar Button -->
    <span v-if="props.calendarButton" class="vdp-datepicker__calendar-button" :class="{'input-group-addon' : props.bootstrapStyling}" @click="showCalendar" v-bind:style="{'cursor:not-allowed;' : props.disabledPicker}">
      <i :class="props.calendarButtonIcon">
        {{ props.calendarButtonIconContent }}
        <span v-if="!props.calendarButtonIcon">&hellip;</span>
      </i>
    </span>
    <!-- Input -->
    <input
      :type="props.inline ? 'hidden' : 'text'"
      :class="inputClass"
      :name="props.name"
      :ref="props.refName"
      :id="props.id"
      :value="formattedValue"
      :open-date="props.openDate"
      :placeholder="props.placeholder"
      :clear-button="props.clearButton"
      :disabled="props.disabledPicker"
      :required="props.required"
      @click="showCalendar"
      readonly>
    <!-- Clear Button -->
    <span v-if="props.clearButton && props.selectedDate" class="vdp-datepicker__clear-button" :class="{'input-group-addon' : props.bootstrapStyling}" @click="clearDate()">
      <i :class="props.clearButtonIcon">
        <span v-if="!props.clearButtonIcon">&times;</span>
      </i>
    </span>
  </div>
</template>
<script>
import DateUtils from '../utils/DateUtils'
export default {
  props: {
    props: Object
  },
  computed: {
    formattedValue () {
      if (!this.props.selectedDate) {
        return null
      }
      return typeof this.props.format === 'function'
        ? this.props.format(this.selectedDate)
        : DateUtils.formatDate(new Date(this.props.selectedDate), this.props.format, this.props.translation)
    },

    inputClass () {
      let cssClass = [this.props.inputClass]
      if (this.props.bootstrapStyling) {
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
</script>
