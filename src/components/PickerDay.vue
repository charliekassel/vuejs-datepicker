<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showDayView" :style="calendarStyle" @mousedown.prevent>
    <slot name="beforeCalendarHeader"></slot>
    <header>
      <span
        @click="isRtl ? nextMonth() : previousMonth()"
        class="prev"
        :class="{'disabled': isLeftNavDisabled}">&lt;</span>
      <span class="day__month_btn" @click="showMonthCalendar" :class="allowedToShowView('month') ? 'up' : ''">{{ isYmd ? currYearName : currMonthName }} {{ isYmd ? currMonthName : currYearName }}</span>
      <span
        @click="isRtl ? previousMonth() : nextMonth()"
        class="next"
        :class="{'disabled': isRightNavDisabled}">&gt;</span>
    </header>
    <div :class="isRtl ? 'flex-rtl' : ''">
      <span class="cell day-header" v-for="d in daysOfWeek" :key="d.timestamp">{{ d }}</span>
      <template v-if="blankDays > 0">
        <span class="cell day blank" v-for="d in blankDays" :key="d.timestamp"></span>
      </template><!--
      --><span class="cell day"
          v-for="day in days"
          :key="day.timestamp"
          :class="dayClasses(day)"
          v-html="dayCellContent(day)"
          @click="selectDate(day)"></span>
    </div>
  </div>
</template>
<script>
import DateUtils from '../utils/DateUtils'
export default {
  props: {
    showDayView: Boolean,
    selectedDate: Date,
    pageDate: Date,
    pageTimestamp: Number,
    fullMonthName: Boolean,
    allowedToShowView: Function,
    dayCellContent: {
      type: Function,
      default: day => day.date
    },
    disabledDates: Object,
    highlighted: Object,
    calendarClass: [String, Object, Array],
    calendarStyle: Object,
    translation: Object,
    isRtl: Boolean,
    mondayFirst: Boolean,
    useUtc: Boolean
  },
  computed: {
    /**
     * Returns an array of day names
     * @return {String[]}
     */
    daysOfWeek () {
      if (this.mondayFirst) {
        const tempDays = this.translation.days.slice()
        tempDays.push(tempDays.shift())
        return tempDays
      }
      return this.translation.days
    },
    /**
     * Returns the day number of the week less one for the first of the current month
     * Used to show amount of empty cells before the first in the day calendar layout
     * @return {Number}
     */
    blankDays () {
      const d = this.pageDate
      let dObj = this.useUtc ?
        new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)) :
        new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes())
      if (this.mondayFirst) {
        return DateUtils.getDay(dObj, this.useUtc) > 0 ? DateUtils.getDay(dObj, this.useUtc) - 1 : 6
      }
      return DateUtils.getDay(dObj, this.useUtc)
    },
    /**
     * @return {Object[]}
     */
    days () {
      const d = this.pageDate
      let days = []
      // set up a new date object to the beginning of the current 'page'
      let dObj = this.useUtc ?
        new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)) :
        new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes())
      let daysInMonth = DateUtils.daysInMonth(DateUtils.getFullYear(dObj, this.useUtc), DateUtils.getMonth(dObj, this.useUtc))
      for (let i = 0; i < daysInMonth; i++) {
        days.push({
          date: DateUtils.getDate(dObj, this.useUtc),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedDate(dObj),
          isDisabled: this.isDisabledDate(dObj),
          isHighlighted: this.isHighlightedDate(dObj),
          isHighlightStart: this.isHighlightStart(dObj),
          isHighlightEnd: this.isHighlightEnd(dObj),
          isToday: DateUtils.compareDates(dObj, new Date(), this.useUtc),
          isWeekend: DateUtils.getDay(dObj, this.useUtc) === 0 || DateUtils.getDay(dObj, this.useUtc) === 6,
          isSaturday: DateUtils.getDay(dObj, this.useUtc) === 6,
          isSunday: DateUtils.getDay(dObj, this.useUtc) === 0
        })
        DateUtils.setDate(dObj, DateUtils.getDate(dObj, this.useUtc) + 1, this.useUtc)
      }
      return days
    },
    /**
     * Gets the name of the month the current page is on
     * @return {String}
     */
    currMonthName () {
      const monthName = this.fullMonthName ? this.translation.months : this.translation.monthsAbbr
      return DateUtils.getMonthNameAbbr(DateUtils.getMonth(this.pageDate, this.useUtc), monthName, this.useUtc)
    },
    /**
     * Gets the name of the year that current page is on
     * @return {Number}
     */
    currYearName () {
      const yearSuffix = this.translation.yearSuffix
      return `${DateUtils.getFullYear(this.pageDate, this.useUtc)}${yearSuffix}`
    },
    /**
     * Is this translation using year/month/day format?
     * @return {Boolean}
     */
    isYmd () {
      return this.translation.ymd && this.translation.ymd === true
    },
    /**
     * Is the left hand navigation button disabled?
     * @return {Boolean}
     */
    isLeftNavDisabled () {
      return this.isRtl
        ? this.isNextMonthDisabled(this.pageTimestamp)
        : this.isPreviousMonthDisabled(this.pageTimestamp)
    },
    /**
     * Is the right hand navigation button disabled?
     * @return {Boolean}
     */
    isRightNavDisabled () {
      return this.isRtl
        ? this.isPreviousMonthDisabled(this.pageTimestamp)
        : this.isNextMonthDisabled(this.pageTimestamp)
    }
  },
  methods: {
    selectDate (date) {
      if (date.isDisabled) {
        this.$emit('selectedDisabled', date)
        return false
      }
      this.$emit('selectDate', date)
    },
    /**
     * @return {Number}
     */
    getPageMonth () {
      return DateUtils.getMonth(this.pageDate, this.useUtc)
    },
    /**
     * Emit an event to show the month picker
     */
    showMonthCalendar () {
      this.$emit('showMonthCalendar')
    },
    /**
     * Change the page month
     * @param {Number} incrementBy
     */
    changeMonth (incrementBy) {
      let date = this.pageDate
      DateUtils.setMonth(date, DateUtils.getMonth(date, this.useUtc) + incrementBy, this.useUtc)
      this.$emit('changedMonth', date)
    },
    /**
     * Decrement the page month
     */
    previousMonth () {
      if (!this.isPreviousMonthDisabled()) {
        this.changeMonth(-1)
      }
    },
    /**
     * Is the previous month disabled?
     * @return {Boolean}
     */
    isPreviousMonthDisabled () {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false
      }
      let d = this.pageDate
      return DateUtils.getMonth(this.disabledDates.to, this.useUtc) >= DateUtils.getMonth(d, this.useUtc) &&
        DateUtils.getFullYear(this.disabledDates.to, this.useUtc) >= DateUtils.getFullYear(d, this.useUtc)
    },
    /**
     * Increment the current page month
     */
    nextMonth () {
      if (!this.isNextMonthDisabled()) {
        this.changeMonth(+1)
      }
    },
    /**
     * Is the next month disabled?
     * @return {Boolean}
     */
    isNextMonthDisabled () {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false
      }
      let d = this.pageDate
      return DateUtils.getMonth(this.disabledDates.from, this.useUtc) <= DateUtils.getMonth(d, this.useUtc) &&
        DateUtils.getFullYear(this.disabledDates.from, this.useUtc) <= DateUtils.getFullYear(d, this.useUtc)
    },
    /**
     * Whether a day is selected
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedDate (dObj) {
      return this.selectedDate && DateUtils.compareDates(this.selectedDate, dObj, this.useUtc)
    },
    /**
     * Whether a day is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledDate (date) {
      let disabledDates = false

      if (typeof this.disabledDates === 'undefined') {
        return false
      }

      if (typeof this.disabledDates.dates !== 'undefined') {
        this.disabledDates.dates.forEach((d) => {
          if (DateUtils.compareDates(date, d, this.useUtc)) {
            disabledDates = true
            return true
          }
        })
      }
      if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to && date < this.disabledDates.to) {
        disabledDates = true
      }
      if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from && date > this.disabledDates.from) {
        disabledDates = true
      }
      if (typeof this.disabledDates.ranges !== 'undefined') {
        this.disabledDates.ranges.forEach((range) => {
          if (typeof range.from !== 'undefined' && range.from && typeof range.to !== 'undefined' && range.to) {
            if (date < range.to && date > range.from) {
              disabledDates = true
              return true
            }
          }
        })
      }
      if (typeof this.disabledDates.days !== 'undefined' && this.disabledDates.days.indexOf(DateUtils.getDay(date, this.useUtc)) !== -1) {
        disabledDates = true
      }
      if (typeof this.disabledDates.daysOfMonth !== 'undefined' && this.disabledDates.daysOfMonth.indexOf(DateUtils.getDate(date, this.useUtc)) !== -1) {
        disabledDates = true
      }
      if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
        disabledDates = true
      }
      return disabledDates
    },
    /**
     * Whether a day is highlighted (only if it is not disabled already except when highlighted.includeDisabled is true)
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightedDate (date) {
      if (!(this.highlighted && this.highlighted.includeDisabled) && this.isDisabledDate(date)) {
        return false
      }

      let highlighted = false

      if (typeof this.highlighted === 'undefined') {
        return false
      }

      if (typeof this.highlighted.dates !== 'undefined') {
        this.highlighted.dates.forEach((d) => {
          if (DateUtils.compareDates(date, d, this.useUtc)) {
            highlighted = true
            return true
          }
        })
      }

      if (this.isDefined(this.highlighted.from) && this.isDefined(this.highlighted.to)) {
        highlighted = date >= this.highlighted.from && date <= this.highlighted.to
      }

      if (typeof this.highlighted.days !== 'undefined' && this.highlighted.days.indexOf(DateUtils.getDay(date, this.useUtc)) !== -1) {
        highlighted = true
      }

      if (typeof this.highlighted.daysOfMonth !== 'undefined' && this.highlighted.daysOfMonth.indexOf(DateUtils.getDate(date, this.useUtc)) !== -1) {
        highlighted = true
      }

      if (typeof this.highlighted.customPredictor === 'function' && this.highlighted.customPredictor(date)) {
        highlighted = true
      }

      return highlighted
    },
    dayClasses (day) {
      return {
        'selected': day.isSelected,
        'disabled': day.isDisabled,
        'highlighted': day.isHighlighted,
        'today': day.isToday,
        'weekend': day.isWeekend,
        'sat': day.isSaturday,
        'sun': day.isSunday,
        'highlight-start': day.isHighlightStart,
        'highlight-end': day.isHighlightEnd
      }
    },
    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightStart (date) {
      return this.isHighlightedDate(date) &&
        (this.highlighted.from instanceof Date) &&
        (DateUtils.getFullYear(this.highlighted.from, this.useUtc) === DateUtils.getFullYear(date, this.useUtc)) &&
        (DateUtils.getMonth(this.highlighted.from, this.useUtc) === DateUtils.getMonth(date, this.useUtc)) &&
        (DateUtils.getDate(this.highlighted.from, this.useUtc) === DateUtils.getDate(date, this.useUtc))
    },
    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightEnd (date) {
      return this.isHighlightedDate(date) &&
        (this.highlighted.to instanceof Date) &&
        (DateUtils.getFullYear(this.highlighted.to, this.useUtc) === DateUtils.getFullYear(date, this.useUtc)) &&
        (DateUtils.getMonth(this.highlighted.to, this.useUtc) === DateUtils.getMonth(date, this.useUtc)) &&
        (DateUtils.getDate(this.highlighted.to, this.useUtc) === DateUtils.getDate(date, this.useUtc))
    },
    /**
     * Helper
     * @param  {mixed}  prop
     * @return {Boolean}
     */
    isDefined (prop) {
      return typeof prop !== 'undefined' && prop
    }
  }
}
// eslint-disable-next-line
;
</script>
