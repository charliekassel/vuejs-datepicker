<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showMonthView" :style="calendarStyle" @mousedown.prevent>
    <slot name="beforeCalendarHeader"></slot>
    <header>
      <span
        @click="previousYear"
        class="prev"
        :class="{ 'disabled' : isPreviousYearDisabled(pageTimestamp) }">&lt;</span>
      <span class="month__year_btn" @click="showYearCalendar" :class="allowedToShowView('year') ? 'up' : ''">{{ pageYearName }}</span>
      <span
        @click="nextYear"
        class="next"
        :class="{ 'disabled' : isNextYearDisabled(pageTimestamp) }">&gt;</span>
    </header>
    <span class="cell month"
      v-for="month in months"
      :key="month.timestamp"
      :class="{'selected': month.isSelected, 'disabled': month.isDisabled}"
      @click.stop="selectMonth(month)">{{ month.month }}</span>
  </div>
</template>
<script>
import DateUtils from '../utils/DateUtils'
export default {
  props: {
    showMonthView: Boolean,
    selectedDate: Date,
    pageDate: Date,
    pageTimestamp: Number,
    disabledDates: Object,
    calendarClass: [String, Object, Array],
    calendarStyle: Object,
    translation: Object,
    allowedToShowView: Function
  },
  computed: {
    months () {
      const d = this.pageDate
      let months = []
      // set up a new date object to the beginning of the current 'page'
      let dObj = new Date(d.getFullYear(), 0, d.getDate(), d.getHours(), d.getMinutes())
      for (let i = 0; i < 12; i++) {
        months.push({
          month: DateUtils.getMonthName(i, this.translation.months),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedMonth(dObj),
          isDisabled: this.isDisabledMonth(dObj)
        })
        dObj.setMonth(dObj.getMonth() + 1)
      }
      return months
    },
    /**
     * Get year name on current page.
     * @return {String}
     */
    pageYearName () {
      const yearSuffix = this.translation.yearSuffix
      return `${this.pageDate.getFullYear()}${yearSuffix}`
    }
  },
  methods: {
    /**
     * Emits a selectMonth event
     * @param {Object} month
     */
    selectMonth (month) {
      if (month.isDisabled) {
        return false
      }
      this.$emit('selectMonth', month)
    },
    /**
     * Changes the year up or down
     * @param {Number} incrementBy
     */
    changeYear (incrementBy) {
      let date = this.pageDate
      date.setYear(date.getFullYear() + incrementBy)
      this.$emit('changedYear', date)
    },
    /**
     * Decrements the year
     */
    previousYear () {
      if (!this.isPreviousYearDisabled()) {
        this.changeYear(-1)
      }
    },
    /**
     * Checks if the previous year is disabled or not
     * @return {Boolean}
     */
    isPreviousYearDisabled () {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false
      }
      return this.disabledDates.to.getFullYear() >= this.pageDate.getFullYear()
    },
    /**
     * Increments the year
     */
    nextYear () {
      if (!this.isNextYearDisabled()) {
        this.changeYear(1)
      }
    },
    /**
     * Checks if the next year is disabled or not
     * @return {Boolean}
     */
    isNextYearDisabled () {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false
      }
      return this.disabledDates.from.getFullYear() <= this.pageDate.getFullYear()
    },
    /**
     * Emits an event that shows the year calendar
     */
    showYearCalendar () {
      this.$emit('showYearCalendar')
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
      let disabledDates = false

      if (typeof this.disabledDates === 'undefined') {
        return false
      }

      if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to) {
        if (
          (date.getMonth() < this.disabledDates.to.getMonth() && date.getFullYear() <= this.disabledDates.to.getFullYear()) ||
          date.getFullYear() < this.disabledDates.to.getFullYear()
        ) {
          disabledDates = true
        }
      }
      if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from) {
        if (
          this.disabledDates.from &&
          (date.getMonth() > this.disabledDates.from.getMonth() && date.getFullYear() >= this.disabledDates.from.getFullYear()) ||
          date.getFullYear() > this.disabledDates.from.getFullYear()
        ) {
          disabledDates = true
        }
      }

      if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
        disabledDates = true
      }
      return disabledDates
    }
  }
}
// eslint-disable-next-line
;
</script>
