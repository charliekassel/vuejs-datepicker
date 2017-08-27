<template>
  <div class="vdp-datepicker" :class="[wrapperClass, isRtl ? 'rtl' : '']">
    <div :class="{'input-group' : bootstrapStyling}">
      <!-- Calendar Button -->
      <span class="vdp-datepicker__calendar-button" :class="{'input-group-addon' : bootstrapStyling}" v-if="calendarButton" @click="showCalendar">
        <i :class="calendarButtonIcon">
          <span v-if="calendarButtonIcon.length === 0">&hellip;</span>
        </i>
      </span>
      <!-- Input -->
      <input
        :type="inline ? 'hidden' : 'text'"
        :class="[ inputClass, { 'form-control' : bootstrapStyling } ]"
        :name="name"
        :id="id"
        @click="showCalendar"
        :value="formattedValue"
        :placeholder="placeholder"
        :clear-button="clearButton"
        :disabled="disabledPicker"
        :required="required"
        readonly>
      <!-- Clear Button -->
      <span class="vdp-datepicker__clear-button" :class="{'input-group-addon' : bootstrapStyling}" v-if="clearButton && selectedDate" @click="clearDate()">
        <i :class="clearButtonIcon">
          <span v-if="calendarButtonIcon.length === 0">&times;</span>
        </i>
      </span>
    </div>

        <!-- Day View -->
        <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showDayView" v-bind:style="calendarStyle">
            <header>
                <span
                    @click="isRtl ? nextMonth() : previousMonth()"
                    class="prev"
                    v-bind:class="{ 'disabled' : isRtl ? nextMonthDisabled(pageDate) : previousMonthDisabled(pageDate) }">&lt;</span>
                <span @click="showMonthCalendar" :class="!dayViewOnly ? 'up' : ''">{{ currMonthName }} {{ currYear }}
                </span>
                <span
                    @click="isRtl ? previousMonth() : nextMonth()"
                    class="next"
                    v-bind:class="{ 'disabled' : isRtl ? previousMonthDisabled(pageDate) : nextMonthDisabled(pageDate) }">&gt;</span>
            </header>
            <div :class="isRtl ? 'flex-rtl' : ''">
              <span class="cell day-header" v-for="d in daysOfWeek" :key="d.timestamp">{{ d }}</span>
              <span class="cell day blank" v-for="d in blankDays" :key="d.timestamp"></span><!--
              --><span class="cell day"
                  v-for="day in days"
                  :key="day.timestamp"
                  track-by="timestamp"
                  v-bind:class="dayClasses(day)"
                  @click="selectDate(day)">{{ day.date }}</span>
            </div>
        </div>

        <!-- Month View -->
        <template v-if="!dayViewOnly">
          <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showMonthView" v-bind:style="calendarStyle">
              <header>
                  <span
                      @click="previousYear"
                      class="prev"
                      v-bind:class="{ 'disabled' : previousYearDisabled(pageDate) }">&lt;</span>
                  <span @click="showYearCalendar" class="up">{{ getPageYear() }}</span>
                  <span
                      @click="nextYear"
                      class="next"
                      v-bind:class="{ 'disabled' : nextYearDisabled(pageDate) }">&gt;</span>
              </header>
              <span class="cell month"
                  v-for="month in months"
                  :key="month.timestamp"
                  track-by="timestamp"
                  v-bind:class="{ 'selected': month.isSelected, 'disabled': month.isDisabled }"
                  @click.stop="selectMonth(month)">{{ month.month }}</span>
          </div>
        </template>

        <!-- Year View -->
        <template v-if="!dayViewOnly">
          <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showYearView" v-bind:style="calendarStyle">
              <header>
                  <span @click="previousDecade" class="prev"
                      v-bind:class="{ 'disabled' : previousDecadeDisabled(pageDate) }">&lt;</span>
                  <span>{{ getPageDecade() }}</span>
                  <span @click="nextDecade" class="next"
                      v-bind:class="{ 'disabled' : nextMonthDisabled(pageDate) }">&gt;</span>
              </header>
              <span
                  class="cell year"
                  v-for="year in years"
                  :key="year.timestamp"
                  track-by="timestamp"
                  v-bind:class="{ 'selected': year.isSelected, 'disabled': year.isDisabled }"
                  @click.stop="selectYear(year)">{{ year.year }}</span>
          </div>
        </template>
  </div>
</template>

<script>
import DateUtils from '@/utils/DateUtils.js'
import DateLanguages from '@/utils/DateLanguages.js'

export default {
  props: {
    value: {
      validator: function (val) {
        return val === null || val instanceof Date || typeof val === 'string'
      }
    },
    name: String,
    id: String,
    format: {
      type: [String, Function],
      default: 'dd MMM yyyy'
    },
    language: {
      type: String,
      default: 'en'
    },
    fullMonthName: {
      type: Boolean,
      default: false
    },
    disabled: Object,
    highlighted: Object,
    placeholder: String,
    inline: Boolean,
    calendarClass: [String, Object],
    inputClass: [String, Object],
    wrapperClass: [String, Object],
    mondayFirst: {
      type: Boolean,
      default: false
    },
    clearButton: {
      type: Boolean,
      default: false
    },
    clearButtonIcon: {
      type: String,
      default: ''
    },
    calendarButton: {
      type: Boolean,
      default: false
    },
    calendarButtonIcon: {
      type: String,
      default: ''
    },
    bootstrapStyling: {
      type: Boolean,
      default: false
    },
    initialView: {
      type: String,
      default: 'day'
    },
    disabledPicker: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    dayViewOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      /*
       * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
       * This represents the first day of the current viewing month
       * {Number}
       */
      pageDate: (new Date()).setDate(1),
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
    initialView () {
      this.setInitialView()
    }
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
    translation () {
      return DateLanguages.translations[this.language]
    },
    currMonthName () {
      const d = new Date(this.pageDate)
      return DateUtils.getMonthNameAbbr(d.getMonth(), this.fullMonthName ? this.translation.months.original : this.translation.months.abbr)
    },
    currYear () {
      const d = new Date(this.pageDate)
      return d.getFullYear()
    },
    /**
     * Returns the day number of the week less one for the first of the current month
     * Used to show amount of empty cells before the first in the day calendar layout
     * @return {Number}
     */
    blankDays () {
      const d = new Date(this.pageDate)
      let dObj = new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes())
      if (this.mondayFirst) {
        return dObj.getDay() > 0 ? dObj.getDay() - 1 : 6
      }
      return dObj.getDay()
    },
    daysOfWeek () {
      if (this.mondayFirst) {
        const tempDays = this.translation.days.slice()
        tempDays.push(tempDays.shift())
        return tempDays
      }
      return this.translation.days
    },
    days () {
      const d = new Date(this.pageDate)
      let days = []
      // set up a new date object to the beginning of the current 'page'
      let dObj = new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes())
      let daysInMonth = DateUtils.daysInMonth(dObj.getFullYear(), dObj.getMonth())
      for (let i = 0; i < daysInMonth; i++) {
        days.push({
          date: dObj.getDate(),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedDate(dObj),
          isDisabled: this.isDisabledDate(dObj),
          isHighlighted: this.isHighlightedDate(dObj),
          isToday: dObj.toDateString() === (new Date()).toDateString(),
          isWeekend: dObj.getDay() === 0 || dObj.getDay() === 6,
          isSaturday: dObj.getDay() === 6,
          isSunday: dObj.getDay() === 0
        })
        dObj.setDate(dObj.getDate() + 1)
      }
      return days
    },
    months () {
      const d = new Date(this.pageDate)
      let months = []
      // set up a new date object to the beginning of the current 'page'
      let dObj = new Date(d.getFullYear(), 0, d.getDate(), d.getHours(), d.getMinutes())
      for (let i = 0; i < 12; i++) {
        months.push({
          month: DateUtils.getMonthName(i, this.translation.months.original),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedMonth(dObj),
          isDisabled: this.isDisabledMonth(dObj)
        })
        dObj.setMonth(dObj.getMonth() + 1)
      }
      return months
    },
    years () {
      const d = new Date(this.pageDate)
      let years = []
      // set up a new date object to the beginning of the current 'page'
      let dObj = new Date(Math.floor(d.getFullYear() / 10) * 10, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes())
      for (let i = 0; i < 10; i++) {
        years.push({
          year: dObj.getFullYear(),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedYear(dObj),
          isDisabled: this.isDisabledYear(dObj)
        })
        dObj.setFullYear(dObj.getFullYear() + 1)
      }
      return years
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
    close () {
      this.showDayView = this.showMonthView = this.showYearView = false
      if (!this.isInline) {
        this.$emit('closed')
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
        return this.close()
      }
      this.setInitialView()
    },
    setInitialView () {
      switch (this.initialView) {
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
    showDayCalendar () {
      this.close()
      this.showDayView = true
      if (!this.isInline) {
        this.$emit('opened')
        document.addEventListener('click', this.clickOutside, false)
      }
    },
    showMonthCalendar () {
      if (this.dayViewOnly) return false
      this.close()
      this.showMonthView = true
      if (!this.isInline) {
        document.addEventListener('click', this.clickOutside, false)
      }
    },
    showYearCalendar () {
      this.close()
      this.showYearView = true
      if (!this.isInline) {
        document.addEventListener('click', this.clickOutside, false)
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
      if (day.isDisabled) {
        return false
      }
      this.setDate(day.timestamp)
      if (this.isInline) {
        return this.showDayCalendar()
      }
      this.close()
    },
    /**
     * @param {Object} month
     */
    selectMonth (month) {
      if (month.isDisabled) {
        return false
      }
      const date = new Date(month.timestamp)
      this.setPageDate(date)
      this.showDayCalendar()
      this.$emit('changedMonth', month)
    },
    /**
     * @param {Object} year
     */
    selectYear (year) {
      if (year.isDisabled) {
        return false
      }
      const date = new Date(year.timestamp)
      this.setPageDate(date)
      this.showMonthCalendar()
      this.$emit('changedYear', year)
    },
    /**
     * @return {Number}
     */
    getPageDate () {
      return (new Date(this.pageDate)).getDate()
    },
    /**
     * @return {Number}
     */
    getPageMonth () {
      return (new Date(this.pageDate)).getMonth()
    },
    /**
     * @return {Number}
     */
    getPageYear () {
      return (new Date(this.pageDate)).getFullYear()
    },
    /**
     * @return {String}
     */
    getPageDecade () {
      let date = new Date(this.pageDate)
      let sD = Math.floor(date.getFullYear() / 10) * 10
      return sD + '\'s'
    },
    changeMonth (incrementBy) {
      let date = new Date(this.pageDate)
      date.setMonth(date.getMonth() + incrementBy)
      this.setPageDate(date)
      this.$emit('changedMonth', date)
    },
    previousMonth () {
      if (!this.previousMonthDisabled()) {
        this.changeMonth(-1)
      }
    },
    previousMonthDisabled () {
      if (!this.disabled || !this.disabled.to) {
        return false
      }
      let d = new Date(this.pageDate)
      return this.disabled.to.getMonth() >= d.getMonth() &&
        this.disabled.to.getFullYear() >= d.getFullYear()
    },
    nextMonth () {
      if (!this.nextMonthDisabled()) {
        this.changeMonth(+1)
      }
    },
    nextMonthDisabled () {
      if (!this.disabled || !this.disabled.from) {
        return false
      }
      let d = new Date(this.pageDate)
      return this.disabled.from.getMonth() <= d.getMonth() &&
        this.disabled.from.getFullYear() <= d.getFullYear()
    },
    changeYear (incrementBy, emit = 'changedYear') {
      let date = new Date(this.pageDate)
      date.setYear(date.getFullYear() + incrementBy)
      this.setPageDate(date)
      this.$emit(emit)
    },
    previousYear () {
      if (!this.previousYearDisabled()) {
        this.changeYear(-1)
      }
    },
    previousYearDisabled () {
      if (!this.disabled || !this.disabled.to) {
        return false
      }
      let d = new Date(this.pageDate)
      return this.disabled.to.getFullYear() >= d.getFullYear()
    },
    nextYear () {
      if (!this.nextYearDisabled()) {
        this.changeYear(1)
      }
    },
    nextYearDisabled () {
      if (!this.disabled || !this.disabled.from) {
        return false
      }
      let d = new Date(this.pageDate)
      return this.disabled.from.getFullYear() <= d.getFullYear()
    },
    previousDecade () {
      if (!this.previousDecadeDisabled()) {
        this.changeYear(-10, 'changeDecade')
      }
    },
    previousDecadeDisabled () {
      if (!this.disabled || !this.disabled.to) {
        return false
      }
      let d = new Date(this.pageDate)
      return Math.floor(this.disabled.to.getFullYear() / 10) * 10 >= Math.floor(d.getFullYear() / 10) * 10
    },
    nextDecade () {
      if (!this.nextDecadeDisabled()) {
        this.changeYear(10, 'changeDecade')
      }
    },
    nextDecadeDisabled () {
      if (!this.disabled || !this.disabled.from) {
        return false
      }
      let d = new Date(this.pageDate)
      return Math.ceil(this.disabled.from.getFullYear() / 10) * 10 <= Math.ceil(d.getFullYear() / 10) * 10
    },

    /**
     * Whether a day is selected
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedDate (dObj) {
      return this.selectedDate && this.selectedDate.toDateString() === dObj.toDateString()
    },

    /**
     * Whether a day is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledDate (date) {
      let disabled = false

      if (typeof this.disabled === 'undefined') {
        return false
      }

      if (typeof this.disabled.dates !== 'undefined') {
        this.disabled.dates.forEach((d) => {
          if (date.toDateString() === d.toDateString()) {
            disabled = true
            return true
          }
        })
      }
      if (typeof this.disabled.to !== 'undefined' && this.disabled.to && date < this.disabled.to) {
        disabled = true
      }
      if (typeof this.disabled.from !== 'undefined' && this.disabled.from && date > this.disabled.from) {
        disabled = true
      }
      if (typeof this.disabled.days !== 'undefined' && this.disabled.days.indexOf(date.getDay()) !== -1) {
        disabled = true
      }
      return disabled
    },

    /**
     * Whether a day is highlighted (only if it is not disabled already)
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightedDate (date) {
      if (this.isDisabledDate(date)) {
        return false
      }

      let highlighted = false

      if (typeof this.highlighted === 'undefined') {
        return false
      }

      if (typeof this.highlighted.dates !== 'undefined') {
        this.highlighted.dates.forEach((d) => {
          if (date.toDateString() === d.toDateString()) {
            highlighted = true
            return true
          }
        })
      }

      if (this.isDefined(this.highlighted.from) && this.isDefined(this.highlighted.to)) {
        highlighted = date >= this.highlighted.from && date <= this.highlighted.to
      }

      if (typeof this.highlighted.days !== 'undefined' && this.highlighted.days.indexOf(date.getDay()) !== -1) {
        highlighted = true
      }
      return highlighted
    },

    /**
     * Helper
     * @param  {mixed}  prop
     * @return {Boolean}
     */
    isDefined (prop) {
      return typeof prop !== 'undefined' && prop
    },

    /**
     * Whether the selected date is in this month
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedMonth (date) {
      return (this.selectedDate &&
        this.selectedDate.getFullYear() === date.getFullYear() &&
        this.selectedDate.getMonth() === date.getMonth())
    },

    /**
     * Whether a month is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledMonth (date) {
      let disabled = false

      if (typeof this.disabled === 'undefined') {
        return false
      }

      if (typeof this.disabled.to !== 'undefined' && this.disabled.to) {
        if (
          (date.getMonth() < this.disabled.to.getMonth() && date.getFullYear() <= this.disabled.to.getFullYear()) ||
          date.getFullYear() < this.disabled.to.getFullYear()
        ) {
          disabled = true
        }
      }
      if (typeof this.disabled.from !== 'undefined' && this.disabled.from) {
        if (
          this.disabled.from &&
          (date.getMonth() > this.disabled.from.getMonth() && date.getFullYear() >= this.disabled.from.getFullYear()) ||
          date.getFullYear() > this.disabled.from.getFullYear()
        ) {
          disabled = true
        }
      }
      return disabled
    },

    /**
     * Whether a year is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedYear (date) {
      return this.selectedDate && this.selectedDate.getFullYear() === date.getFullYear()
    },

    /**
     * Whether a month is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledYear (date) {
      let disabled = false
      if (typeof this.disabled === 'undefined' || !this.disabled) {
        return false
      }

      if (typeof this.disabled.to !== 'undefined' && this.disabled.to) {
        if (date.getFullYear() < this.disabled.to.getFullYear()) {
          disabled = true
        }
      }
      if (typeof this.disabled.from !== 'undefined' && this.disabled.from) {
        if (date.getFullYear() > this.disabled.from.getFullYear()) {
          disabled = true
        }
      }

      return disabled
    },

    /**
     * Set the datepicker value
     * @param {Date|String|null} date
     */
    setValue (date) {
      if (typeof date === 'string') {
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

    setPageDate (date) {
      if (!date) {
        date = new Date()
      }
      this.pageDate = (new Date(date)).setDate(1)
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
        this.close()
        document.removeEventListener('click', this.clickOutside, false)
      }
    },

    dayClasses (day) {
      return {
        'selected': day.isSelected,
        'disabled': day.isDisabled,
        'highlighted': day.isHighlighted,
        'today': day.isToday,
        'weekend': day.isWeekend,
        'sat': day.isSaturday,
        'sun': day.isSunday
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
