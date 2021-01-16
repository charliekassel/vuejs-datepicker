<template>
  <div class="vdp-datepicker" :class="[wrapperClass, isRtl ? 'rtl' : '']">
    <date-input
      :selectedDate="selectedDate"
      :resetTypedDate="resetTypedDate"
      :format="format"
      :translation="translation"
      :inline="inline"
      :id="id"
      :name="name"
      :refName="refName"
      :openDate="openDate"
      :placeholder="placeholder"
      :inputClass="inputClass"
      :typeable="typeable"
      :clearButton="clearButton"
      :clearButtonIcon="clearButtonIcon"
      :calendarButton="calendarButton"
      :calendarButtonIcon="calendarButtonIcon"
      :calendarButtonIconContent="calendarButtonIconContent"
      :disabled="disabled"
      :required="required"
      :bootstrapStyling="bootstrapStyling"
      :use-utc="useUtc"
      @showCalendar="showCalendar"
      @closeCalendar="close"
      @typedDate="setTypedDate"
      @clearDate="clearDate">
      <slot name="afterDateInput" slot="afterDateInput"></slot>
    </date-input>


    <!-- Day View -->
    <picker-day-wrap
      v-if="showDayView"
      :pageDate="pageDate"
      :selectedDate="selectedDate"
      :fullMonthName="fullMonthName"
      :disabledDates="disabledDates"
      :highlighted="highlighted"
      :calendarClass="calendarClass"
      :calendarStyle="calendarStyle"
      :translation="translation"
      :pageTimestamp="pageTimestamp"
      :isRtl="isRtl"
      :mondayFirst="mondayFirst"
      :dayCellContent="dayCellContent"
      :use-utc="useUtc"
      :cols="cols"
      :rows="rows"
      @changedMonth="handleChangedMonthFromDayPicker"
      @selectDate="selectDate"
      @selectedDisabled="selectDisabledDate">
      <slot name="beforeCalendarHeader" slot="beforeCalendarHeader"></slot>
    </picker-day-wrap>

  </div>
</template>
<script>
import en from '../locale/translations/en'
import DateInput from './DateInput.vue'
import PickerDayWrap from './PickerDayWrap.vue'
import utils, { makeDateUtils } from '../utils/DateUtils'
export default {
  components: {
    DateInput,
    PickerDayWrap
  },
  props: {
    value: {
      validator: val => utils.validateDateInput(val)
    },
    name: String,
    refName: String,
    id: String,
    format: {
      type: [String, Function],
      default: 'dd MMM yyyy'
    },
    language: {
      type: Object,
      default: () => en
    },
    openDate: {
      validator: val => utils.validateDateInput(val)
    },
    dayCellContent: Function,
    fullMonthName: Boolean,
    disabledDates: Object,
    highlighted: Object,
    placeholder: String,
    inline: Boolean,
    calendarClass: [String, Object, Array],
    inputClass: [String, Object, Array],
    wrapperClass: [String, Object, Array],
    mondayFirst: Boolean,
    clearButton: Boolean,
    clearButtonIcon: String,
    calendarButton: Boolean,
    calendarButtonIcon: String,
    calendarButtonIconContent: String,
    bootstrapStyling: Boolean,
    initialView: String,
    disabled: Boolean,
    required: Boolean,
    typeable: Boolean,
    useUtc: Boolean,
    cols: {
      type: Number,
      default: () => 2
    },
    rows: {
      type: Number,
      default: () => 1
    }
  },
  data () {
    const startDate = this.openDate ? new Date(this.openDate) : new Date()
    const constructedDateUtils = makeDateUtils(this.useUtc)
    const pageTimestamp = constructedDateUtils.setDate(startDate, 1)
    return {
      /*
       * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
       * This represents the first day of the current viewing month
       * {Number}
       */
      pageTimestamp,
      /*
       * Selected Date
       * {Date}
       */
      selectedDate: null,
      /*
       * Flags to show calendar views
       * {Boolean}
       */
      showDayView: false,
      /*
       * Positioning
       */
      calendarHeight: 0,
      resetTypedDate: new Date(),
      utils: constructedDateUtils
    }
  },
  watch: {
    value (value) {
      this.setValue(value)
    },
    openDate () {
      this.setPageDate()
    }
  },
  computed: {
    pageDate () {
      return new Date(this.pageTimestamp)
    },

    translation () {
      return this.language
    },

    calendarStyle () {
      return {
        position: this.isInline ? 'relative' : undefined,
        "z-index": this.isInline ? 'auto' : undefined
      }
    },
    isOpen () {
      return this.showDayView
    },
    isInline () {
      return !!this.inline
    },
    isRtl () {
      return this.translation.rtl === true
    }
  },
  methods: {
    /**
     * Called in the event that the user navigates to date pages and
     * closes the picker without selecting a date.
     */
    resetDefaultPageDate () {
      if (this.selectedDate === null) {
        this.setPageDate()
        return
      }
      this.setPageDate(this.selectedDate)
    },
    /**
     * Effectively a toggle to show/hide the calendar
     * @return {mixed}
     */
    showCalendar () {
      if (this.disabled || this.isInline) {
        return false
      }
      if (this.isOpen) {
        return this.close(true)
      }
      this.setInitialView()
    },
    /**
     * Sets the initial picker page view: day, month or year
     */
    setInitialView () {
      this.showDayCalendar()
    },
    /**
     * Show the day picker
     * @return {Boolean}
     */
    showDayCalendar () {
      this.close()
      this.showDayView = true
      return true
    },
    /**
     * Set the selected date
     * @param {Number} timestamp
     */
    setDate (timestamp) {
      const date = new Date(timestamp)
      this.selectedDate = date
      //Не меняем дату страницы, т.к. прыгает при нескольких календарях
      //this.setPageDate(date)
      this.$emit('selected', date)
      this.$emit('input', date)
    },
    /**
     * Clear the selected date
     */
    clearDate () {
      this.selectedDate = null
      this.setPageDate()
      this.$emit('selected', null)
      this.$emit('input', null)
      this.$emit('cleared')
    },
    /**
     * @param {Object} date
     */
    selectDate (date) {
      this.setDate(date.timestamp)
      if (!this.isInline) {
        this.close(true)
      }
      this.resetTypedDate = new Date()
    },
    /**
     * @param {Object} date
     */
    selectDisabledDate (date) {
      this.$emit('selectedDisabled', date)
    },
    /**
     * Set the datepicker value
     * @param {Date|String|Number|null} date
     */
    setValue (date) {
      if (typeof date === 'string' || typeof date === 'number') {
        let parsed = new Date(date)
        date = isNaN(parsed.valueOf()) ? null : parsed
      }
      if (!date) {
        this.setPageDate()
        this.selectedDate = null
        return
      }
      this.selectedDate = date
      this.setPageDate(date)
    },
    /**
     * Sets the date that the calendar should open on
     */
    setPageDate (date) {
      if (!date) {
        if (this.openDate) {
          date = new Date(this.openDate)
        } else {
          date = new Date()
        }
      }
      this.pageTimestamp = this.utils.setDate(new Date(date), 1)
    },
    /**
     * Handles a month change from the day picker
     */
    handleChangedMonthFromDayPicker (date) {
      this.setPageDate(date)
      this.$emit('changedMonth', date)
    },
    /**
     * Set the date from a typedDate event
     */
    setTypedDate (date) {
      this.setDate(date.getTime())
    },
    /**
     * Close all calendar layers
     * @param {Boolean} emitEvent - emit close event
     */
    close (emitEvent) {
      this.showDayView = false
      if (!this.isInline) {
        if (emitEvent) {
          this.$emit('closed')
        }
        document.removeEventListener('click', this.clickOutside, false)
      }
    },
    /**
     * Initiate the component
     */
    init () {
      if (this.value) {
        this.setValue(this.value)
      }
      if (this.isInline) {
        this.setInitialView()
      }
    }
  },
  mounted () {
    this.init()
  }
}
// eslint-disable-next-line
;
</script>
<style lang="stylus">
@import '../styles/style'
</style>
