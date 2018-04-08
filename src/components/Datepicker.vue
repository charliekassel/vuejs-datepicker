<template>
  <div class="vdp-datepicker" :class="[wrapperClass, isRtl ? 'rtl' : '']">
    <date-input :props="inputProps" @showCalendar="showCalendar" />

    <!-- Day View -->
    <picker-day
      v-if="allowedToShowView('day')"
      :pageDate="pageDate"
      :selectedDate="selectedDate"
      :showDayView="showDayView"
      :fullMonthName="fullMonthName"
      :allowedToShowView="allowedToShowView"
      :disabled="disabled"
      :highlighted="highlighted"
      :calendarClass="calendarClass"
      :calendarStyle="calendarStyle"
      :translation="translation"
      :pageTimestamp="pageTimestamp"
      :isRtl="isRtl"
      :mondayFirst="mondayFirst"
      @changedMonth="setPageDate"
      @selectDate="selectDate"
      @showMonthCalendar="showMonthCalendar"
      @selectedDisabled="$emit('selectedDisabled')"
    />

    <!-- Month View -->
    <picker-month
      v-if="allowedToShowView('month')"
      :pageDate="pageDate"
      :selectedDate="selectedDate"
      :showMonthView="showMonthView"
      :allowedToShowView="allowedToShowView"
      :disabled="disabled"
      :calendarClass="calendarClass"
      :calendarStyle="calendarStyle"
      :translation="translation"
      @selectMonth="selectMonth"
      @showYearCalendar="showYearCalendar"
      @changedYear="setPageDate"
    />

    <!-- Year View -->
    <picker-year
      v-if="allowedToShowView('year')"
      :pageDate="pageDate"
      :selectedDate="selectedDate"
      :showYearView="showYearView"
      :allowedToShowView="allowedToShowView"
      :disabled="disabled"
      :calendarClass="calendarClass"
      :calendarStyle="calendarStyle"
      :translation="translation"
      @selectYear="selectYear"
      @changedDecade="setPageDate"
    />
  </div>
</template>
<script>
import DateLanguages from '@/utils/DateLanguages.js'
import DateInput from '@/components/DateInput'
import PickerDay from '@/components/PickerDay'
import PickerMonth from '@/components/PickerMonth'
import PickerYear from '@/components/PickerYear'
export default {
  components: {
    DateInput,
    PickerDay,
    PickerMonth,
    PickerYear
  },
  props: {
    value: {
      validator: function (val) {
        return val === null || val instanceof Date || typeof val === 'string' || typeof val === 'number'
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
      type: String,
      default: 'en'
    },
    openDate: {
      validator: function (val) {
        return val === null || val instanceof Date || typeof val === 'string'
      }
    },
    fullMonthName: Boolean,
    disabled: Object,
    highlighted: Object,
    placeholder: String,
    inline: Boolean,
    calendarClass: [String, Object],
    inputClass: [String, Object],
    wrapperClass: [String, Object],
    mondayFirst: Boolean,
    clearButton: Boolean,
    clearButtonIcon: String,
    calendarButton: Boolean,
    calendarButtonIcon: String,
    calendarButtonIconContent: String,
    bootstrapStyling: Boolean,
    initialView: String,
    disabledPicker: Boolean,
    required: Boolean,
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
       * Flags to show calendar views
       * {Boolean}
       */
      showDayView: false,
      showMonthView: false,
      showYearView: false,
      /*
       * Positioning
       */
      calendarHeight: 0
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
    inputProps () {
      return {
        selectedDate: this.selectedDate,
        format: this.format,
        translation: this.translation,
        inline: this.inline,
        id: this.id,
        name: this.name,
        refName: this.refName,
        openDate: this.openDate,
        placeholder: this.placeholder,
        inputClass: this.inputClass,
        clearButton: this.clearButton,
        clearButtonIcon: this.clearButtonIcon,
        calendarButton: this.calendarButton,
        calendarButtonIcon: this.calendarButtonIcon,
        calendarButtonIconContent: this.calendarButtonIconContent,
        disabledPicker: this.disabledPicker,
        required: this.required,
        bootstrapStyling: this.bootstrapStyling
      }
    },
    computedInitialView () {
      if (!this.initialView) {
        return this.minimumView
      }

      return this.initialView
    },
    pageDate () {
      return new Date(this.pageTimestamp)
    },

    translation () {
      return DateLanguages.translations[this.language]
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
    }
  },
  methods: {
    /**
     * Close all calendar layers
     */
    close (full) {
      this.showDayView = this.showMonthView = this.showYearView = false
      if (!this.isInline) {
        if (full) this.$emit('closed')
        document.removeEventListener('click', this.clickOutside, false)
      }
    },
    resetDefaultDate () {
      if (this.selectedDate === null) {
        this.setPageDate()
        return
      }
      this.setPageDate(this.selectedDate)
    },
    /**
     * Effectively a toggle to show/hide the calendar
     * @return {mixed} [description]
     */
    showCalendar () {
      if (this.disabledPicker || this.isInline) {
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
    allowedToShowView (view) {
      const views = ['day', 'month', 'year']
      const minimumViewIndex = views.indexOf(this.minimumView)
      const maximumViewIndex = views.indexOf(this.maximumView)
      const viewIndex = views.indexOf(view)

      return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex
    },
    showDayCalendar () {
      if (!this.allowedToShowView('day')) {
        return false
      }
      this.close()
      this.showDayView = true
      this.addOutsideClickListener()
    },
    showMonthCalendar () {
      if (!this.allowedToShowView('month')) {
        return false
      }
      this.close()
      this.showMonthView = true
      this.addOutsideClickListener()
    },
    showYearCalendar () {
      if (!this.allowedToShowView('year')) {
        return false
      }
      this.close()
      this.showYearView = true
      this.addOutsideClickListener()
    },
    addOutsideClickListener () {
      if (!this.isInline) {
        setTimeout(() => {
          document.addEventListener('click', this.clickOutside, false)
        }, 100)
      }
    },
    setDate (timestamp) {
      const date = new Date(timestamp)
      this.selectedDate = new Date(date)
      this.setPageDate(date)
      this.$emit('selected', new Date(date))
      this.$emit('input', new Date(date))
    },
    clearDate () {
      this.selectedDate = null
      this.$emit('selected', null)
      this.$emit('input', null)
      this.$emit('cleared')
    },
    /**
     * @param {Object} day
     */
    selectDate (day) {
      this.setDate(day.timestamp)
      if (!this.isInline) {
        this.close(true)
      }
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
        this.setDate(date)
        if (!this.isInline) {
          this.close(true)
        }
      }
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
        this.setDate(date)
        if (!this.isInline) {
          this.close(true)
        }
      }
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
      this.pageTimestamp = (new Date(date)).setDate(1)
    },
    /**
     * Close the calendar if clicked outside the datepicker
     * @param  {Event} event
     */
    clickOutside (event) {
      if (this.$el && !this.$el.contains(event.target)) {
        if (this.isInline) {
          return this.showDayCalendar()
        }
        this.resetDefaultDate()
        this.close(true)
        document.removeEventListener('click', this.clickOutside, false)
      }
    },

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
</script>

<style lang="stylus">

$width = 300px

.rtl
    direction:rtl
.vdp-datepicker
    position relative
    text-align left
    *
        box-sizing border-box

.vdp-datepicker__calendar
    position absolute
    z-index 100
    background white
    width $width
    border 1px solid #ccc
    header
        display block
        line-height 40px
        span
            display inline-block
            text-align center
            width (100 - (100/7)*2)%
            float left

        .prev
        .next
            width (100/7)%
            float left
            text-indent -10000px
            position relative
            &:after
                content ''
                position absolute
                left 50%
                top 50%
                transform translateX(-50%) translateY(-50%)
                border 6px solid transparent

        .prev
            &:after
                border-right 10px solid #000
                margin-left -5px
            &.disabled:after
                border-right 10px solid #ddd
        .next
            &:after
                border-left 10px solid #000
                margin-left 5px
            &.disabled:after
                border-left 10px solid #ddd

        .prev:not(.disabled)
        .next:not(.disabled)
        .up:not(.disabled)
            cursor pointer
            &:hover
                background #eee

    .disabled
        color #ddd
        cursor default
    .flex-rtl
        display flex
        width inherit
        flex-wrap wrap

    .cell
        display inline-block
        padding 0 5px
        width (100/7)%
        height 40px
        line-height 40px
        text-align center
        vertical-align middle
        border 1px solid transparent
        &:not(.blank):not(.disabled).day
        &:not(.blank):not(.disabled).month
        &:not(.blank):not(.disabled).year
            cursor pointer
            &:hover
                border 1px solid #4bd
        &.selected
            background #4bd
            &:hover
                background #4bd
            &.highlighted
                background #4bd
        &.highlighted
            background #cae5ed
            &.disabled
                color: #a3a3a3
        &.grey
            color #888

            &:hover
                background inherit


        &.day-header
            font-size 75%
            white-space no-wrap
            cursor inherit
            &:hover
                background inherit

    .month,
    .year
        width 33.333%

.vdp-datepicker__clear-button
.vdp-datepicker__calendar-button
    cursor pointer
    font-style normal
    &.disabled
      color #999
      cursor default
</style>
