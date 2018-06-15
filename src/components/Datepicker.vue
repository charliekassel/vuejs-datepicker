<template>
  <div class="vdp-datepicker" :class="[wrapperClass, isRtl ? 'rtl' : '']">
    <date-input
      :selectedDate="selectedDate"
      :selectedRange="selectedRange"
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
      :range="range"
      :bootstrapStyling="bootstrapStyling"
      @showCalendar="showCalendar"
      @closeCalendar="close"
      @typedDate="setTypedDate"
      @clearDate="clearDate">
      <slot name="afterDateInput" slot="afterDateInput"></slot>
    </date-input>


    <!-- Day View -->
    <picker-day
      v-if="allowedToShowView('day')"
      :pageDate="pageDate"
      :selectedDate="selectedDate"
      :showDayView="showDayView"
      :fullMonthName="fullMonthName"
      :allowedToShowView="allowedToShowView"
      :disabledDates="disabledDatesComputed"
      :highlighted="highlightedComputed"
      :calendarClass="calendarClass"
      :calendarStyle="calendarStyle"
      :translation="translation"
      :pageTimestamp="pageTimestamp"
      :isRtl="isRtl"
      :mondayFirst="mondayFirst"
      @changedMonth="setPageDate"
      @selectDate="selectDate"
      @showMonthCalendar="showMonthCalendar"
      @selectedDisabled="$emit('selectedDisabled')">
      <slot name="beforeCalendarHeader" slot="beforeCalendarHeader"></slot>
    </picker-day>

    <!-- Month View -->
    <picker-month
      v-if="allowedToShowView('month')"
      :pageDate="pageDate"
      :selectedDate="selectedDate"
      :showMonthView="showMonthView"
      :allowedToShowView="allowedToShowView"
      :disabledDates="disabledDatesComputed"
      :calendarClass="calendarClass"
      :calendarStyle="calendarStyle"
      :translation="translation"
      @selectMonth="selectMonth"
      @showYearCalendar="showYearCalendar"
      @changedYear="setPageDate">
      <slot name="beforeCalendarHeader" slot="beforeCalendarHeader"></slot>
    </picker-month>

    <!-- Year View -->
    <picker-year
      v-if="allowedToShowView('year')"
      :pageDate="pageDate"
      :selectedDate="selectedDate"
      :showYearView="showYearView"
      :allowedToShowView="allowedToShowView"
      :disabledDates="disabledDatesComputed"
      :calendarClass="calendarClass"
      :calendarStyle="calendarStyle"
      :translation="translation"
      @selectYear="selectYear"
      @changedDecade="setPageDate">
      <slot name="beforeCalendarHeader" slot="beforeCalendarHeader"></slot>
    </picker-year>
  </div>
</template>
<script>
import en from '../locale/translations/en'
import DateInput from './DateInput.vue'
import PickerDay from './PickerDay.vue'
import PickerMonth from './PickerMonth.vue'
import PickerYear from './PickerYear.vue'
export default {
  components: {
    DateInput,
    PickerDay,
    PickerMonth,
    PickerYear
  },
  props: {
    value: {
      validator: (val) => {
        return val === null || val instanceof Date || typeof val === 'string' || typeof val === 'number' || typeof val === 'object'
      }
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
      validator: (val) => {
        return val === null || val instanceof Date || typeof val === 'string' || typeof val === 'number'
      }
    },
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
    range: Boolean,
    required: Boolean,
    typeable: Boolean,
    minimumView: {
      type: String,
      default: 'day'
    },
    maximumView: {
      type: String,
      default: 'year'
    }
  },
  data () {
    const startDate = this.openDate ? new Date(this.openDate) : new Date()
    return {
      /*
       * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
       * This represents the first day of the current viewing month
       * {Number}
       */
      pageTimestamp: startDate.setDate(1),
      /*
       * Selected Date
       * {Date}
       */
      selectedDate: null,

      /*
       * Selected range
       * {Object}
       */
      selectedRange: {
        from: null,
        to: null
      },
      /*
       * Flags to show calendar views
       * {Boolean}
       */
      showDayView: false,
      showMonthView: false,
      showYearView: false,
      /*
       * Positioning
       */
      calendarHeight: 0,
      resetTypedDate: new Date()
    }
  },
  watch: {
    value (value) {
      this.setValue(value)
    },
    openDate () {
      this.setPageDate()
    },
    initialView () {
      this.setInitialView()
    }
  },
  computed: {
    computedInitialView () {
      if (!this.initialView) {
        return this.minimumView
      }

      return this.initialView
    },

    disabledDatesComputed () {
      let disabled = {to: this.selectedRange.from}

      if (this.range) {
        if (this.selectedRange.from && this.selectedRange.to) {
          disabled.to = null
        }
        return Object.assign({}, this.disabledDates, disabled)
      } else {
        return this.disabledDates
      }
    },

    highlightedComputed () {
      return this.range ? this.selectedRange : this.highlighted
    },

    pageDate () {
      return new Date(this.pageTimestamp)
    },

    translation () {
      return this.language
    },

    calendarStyle () {
      return {
        position: this.isInline ? 'static' : undefined
      }
    },
    isOpen () {
      return this.showDayView || this.showMonthView || this.showYearView
    },
    isInline () {
      return !!this.inline
    },
    isRtl () {
      return this.translation.rtl === true
    },

    validRange () {
      const sr = this.selectedRange
      return sr.from !== null && sr.to !== null
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
      if (!this.isInline) {
        this.$emit('opened')
      }
    },
    /**
     * Sets the initial picker page view: day, month or year
     */
    setInitialView () {
      const initialView = this.computedInitialView
      if (!this.allowedToShowView(initialView)) {
        throw new Error(`initialView '${this.initialView}' cannot be rendered based on minimum '${this.minimumView}' and maximum '${this.maximumView}'`)
      }
      switch (initialView) {
        case 'year':
          this.showYearCalendar()
          break
        case 'month':
          this.showMonthCalendar()
          break
        default:
          this.showDayCalendar()
          break
      }
    },
    /**
     * Are we allowed to show a specific picker view?
     * @param {String} view
     * @return {Boolean}
     */
    allowedToShowView (view) {
      const views = ['day', 'month', 'year']
      const minimumViewIndex = views.indexOf(this.minimumView)
      const maximumViewIndex = views.indexOf(this.maximumView)
      const viewIndex = views.indexOf(view)

      return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex
    },
    /**
     * Show the day picker
     * @return {Boolean}
     */
    showDayCalendar () {
      if (!this.allowedToShowView('day')) {
        return false
      }
      this.close()
      this.showDayView = true
      return true
    },
    /**
     * Show the month picker
     * @return {Boolean}
     */
    showMonthCalendar () {
      if (!this.allowedToShowView('month')) {
        return false
      }
      this.close()
      this.showMonthView = true
      return true
    },
    /**
     * Show the year picker
     * @return {Boolean}
     */
    showYearCalendar () {
      if (!this.allowedToShowView('year')) {
        return false
      }
      this.close()
      this.showYearView = true
      return true
    },
    /**
     * Set the selected date
     * @param {Number} timestamp
     */
    setDate (timestamp) {
      const date = new Date(timestamp)
      this.selectedDate = date
      this.setPageDate(date)
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
      if (this.range) {
        this.selectRange(date.timestamp)
      } else {
        this.setDate(date.timestamp)
      }

      if (!this.isInline && !this.range) {
        this.close(true)
      }
      this.resetTypedDate = new Date()
    },
    /**
     * @param {Object} month
     */
    selectMonth (month) {
      const date = new Date(month.timestamp)
      if (this.allowedToShowView('day')) {
        this.setPageDate(date)
        this.$emit('changedMonth', month)
        this.showDayCalendar()
      } else {
        this.selectDate(month)
      }
    },
    /**
     * @param {Object} timestamp
     */
    selectRange (timestamp) {
      const date = new Date(timestamp)
      const range = this.selectedRange

      if (range.from && range.to) {
        this.$set(range, 'from', date)
        this.$set(range, 'to', null)
      } else if (!range.from) {
        this.$set(range, 'from', date)
      } else if (!range.to) {
        this.$set(range, 'to', date)
      }

      this.selectedDate = range.from
      this.setPageDate(range.from)
      this.$emit('selected', date)
      this.$emit('input', range)
      this.$emit('start', range.from)
      this.$emit('end', range.to)
    },
    /**
     * @param {Object} year
     */
    selectYear (year) {
      const date = new Date(year.timestamp)
      if (this.allowedToShowView('month')) {
        this.setPageDate(date)
        this.$emit('changedYear', year)
        this.showMonthCalendar()
      } else {
        this.selectDate(year)
      }
    },
    /**
     * Set the datepicker value
     * @param {Date|String|Number|null} date
     */
    setValue (date) {
      if (!date) {
        this.setPageDate()
        this.selectedDate = null
        return
      }

      if (this.range && !this.dataInitialized) {
        this.selectedDate = new Date(date.from)
        this.selectedRange = {
          from: new Date(date.from),
          to: date.to ? new Date(date.to) : null
        }
        this.setPageDate(date.from)
        this.dataInitialized = true
      } else {
        if (typeof date === 'string' || typeof date === 'number') {
          let parsed = new Date(date)
          date = isNaN(parsed.valueOf()) ? null : parsed
          this.selectedDate = date
          this.setPageDate(date)
        }
      }
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
      this.pageTimestamp = (new Date(date)).setDate(1)
    },
    /**
     * Set the date from a typedDate event
     */
    setTypedDate (date) {
      this.setDate(date.getTime())
    },
    /**
     * Close all calendar layers
     * @param {Boolean} full - emit close event
     */
    close (full) {
      this.showDayView = this.showMonthView = this.showYearView = false
      if (!this.isInline) {
        if (full) {
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
        if (this.range) {
          this.selectedRange = {from: new Date(this.value.from), to: new Date(this.value.to)}
        }
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
