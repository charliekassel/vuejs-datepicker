<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showDayView" :style="calendarStyle" @mousedown.prevent>
    <slot name="beforeCalendarHeader"></slot>
    <header>
      <span
        @click="isRtl ? nextMonth() : previousMonth()"
        class="prev"
        :class="{ 'disabled' : isRtl ? isNextMonthDisabled(pageTimestamp) : isPreviousMonthDisabled(pageTimestamp) }">&lt;</span>
      <span class="day__month_btn" @click="showMonthCalendar" :class="allowedToShowView('month') ? 'up' : ''">{{ isYmd ? currYearName : currMonthName }} {{ isYmd ? currMonthName : currYearName }}</span>
      <span
        @click="isRtl ? previousMonth() : nextMonth()"
        class="next"
        :class="{ 'disabled' : isRtl ? isPreviousMonthDisabled(pageTimestamp) : isNextMonthDisabled(pageTimestamp) }">&gt;</span>
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
          @click="selectDate(day)">{{ day.date }}</span>
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
    disabledDates: Object,
    highlighted: Object,
    calendarClass: [String, Object, Array],
    calendarStyle: Object,
    translation: Object,
    isRtl: Boolean,
    mondayFirst: Boolean
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
      let dObj = new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes())
      if (this.mondayFirst) {
        return dObj.getDay() > 0 ? dObj.getDay() - 1 : 6
      }
      return dObj.getDay()
    },
    /**
     * @return {Object[]}
     */
    days () {
      const d = this.pageDate
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
          isHighlightStart: this.isHighlightStart(dObj),
          isHighlightEnd: this.isHighlightEnd(dObj),
          isToday: dObj.toDateString() === (new Date()).toDateString(),
          isWeekend: dObj.getDay() === 0 || dObj.getDay() === 6,
          isSaturday: dObj.getDay() === 6,
          isSunday: dObj.getDay() === 0
        })
        dObj.setDate(dObj.getDate() + 1)
      }
      return days
    },
    /**
     * Gets the name of the month the current page is on
     * @return {String}
     */
    currMonthName () {
      const monthName = this.fullMonthName ? this.translation.months : this.translation.monthsAbbr
      return DateUtils.getMonthNameAbbr(this.pageDate.getMonth(), monthName)
    },
    /**
     * Gets the name of the year that current page is on
     * @return {Number}
     */
    currYearName () {
      const yearSuffix = this.translation.yearSuffix
      return `${this.pageDate.getFullYear()}${yearSuffix}`
    },
    /**
     * Is this translation using year/month/day format?
     * @return {Boolean}
     */
    isYmd () {
      return this.translation.ymd && this.translation.ymd === true
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
      return this.pageDate.getMonth()
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
      date.setMonth(date.getMonth() + incrementBy)
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
      return this.disabledDates.to.getMonth() >= d.getMonth() &&
        this.disabledDates.to.getFullYear() >= d.getFullYear()
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
      return this.disabledDates.from.getMonth() <= d.getMonth() &&
        this.disabledDates.from.getFullYear() <= d.getFullYear()
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
      let disabledDates = false

      if (typeof this.disabledDates === 'undefined') {
        return false
      }

      if (typeof this.disabledDates.dates !== 'undefined') {
        this.disabledDates.dates.forEach((d) => {
          if (date.toDateString() === d.toDateString()) {
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
      if (typeof this.disabledDates.days !== 'undefined' && this.disabledDates.days.indexOf(date.getDay()) !== -1) {
        disabledDates = true
      }
      if (typeof this.disabledDates.daysOfMonth !== 'undefined' && this.disabledDates.daysOfMonth.indexOf(date.getDate()) !== -1) {
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

      if (typeof this.highlighted.daysOfMonth !== 'undefined' && this.highlighted.daysOfMonth.indexOf(date.getDate()) !== -1) {
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
        (this.highlighted.from.getFullYear() === date.getFullYear()) &&
        (this.highlighted.from.getMonth() === date.getMonth()) &&
        (this.highlighted.from.getDate() === date.getDate())
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
        (this.highlighted.to.getFullYear() === date.getFullYear()) &&
        (this.highlighted.to.getMonth() === date.getMonth()) &&
        (this.highlighted.to.getDate() === date.getDate())
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
