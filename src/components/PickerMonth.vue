<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showMonthView" :style="calendarStyle" @mousedown.prevent>
    <slot name="beforeCalendarHeader"></slot>
    <header>
      <span
        @click="isRtl ? nextYear() : previousYear()"
        class="prev"
        :class="{'disabled': isLeftNavDisabled}">&lt;</span>
      <span class="month__year_btn" @click="showYearCalendar" :class="allowedToShowView('year') ? 'up' : ''">{{ pageYearName }}</span>
      <span
        @click="isRtl ? previousYear() : nextYear()"
        class="next"
        :class="{'disabled': isRightNavDisabled}">&gt;</span>
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
    isRtl: Boolean,
    allowedToShowView: Function,
    useUtc: Boolean
  },
  computed: {
    months () {
      const d = this.pageDate
      let months = []
      // set up a new date object to the beginning of the current 'page'
      let dObj = this.useUtc ?
        new Date(Date.UTC(d.getUTCFullYear(), 0, d.getUTCDate())) :
        new Date(d.getFullYear(), 0, d.getDate(), d.getHours(), d.getMinutes())
      for (let i = 0; i < 12; i++) {
        months.push({
          month: DateUtils.getMonthName(i, this.translation.months, this.useUtc),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedMonth(dObj),
          isDisabled: this.isDisabledMonth(dObj)
        })
        DateUtils.setMonth(dObj, DateUtils.getMonth(dObj, this.useUtc) + 1, this.useUtc)
      }
      return months
    },
    /**
     * Get year name on current page.
     * @return {String}
     */
    pageYearName () {
      const yearSuffix = this.translation.yearSuffix
      return `${DateUtils.getFullYear(this.pageDate, this.useUtc)}${yearSuffix}`
    },
    /**
     * Is the left hand navigation disabled
     * @return {Boolean}
     */
    isLeftNavDisabled () {
      return this.isRtl
        ? this.isNextYearDisabled(this.pageTimestamp)
        : this.isPreviousYearDisabled(this.pageTimestamp)
    },
    /**
     * Is the right hand navigation disabled
     * @return {Boolean}
     */
    isRightNavDisabled () {
      return this.isRtl
        ? this.isPreviousYearDisabled(this.pageTimestamp)
        : this.isNextYearDisabled(this.pageTimestamp)
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
      DateUtils.setFullYear(date, DateUtils.getFullYear(date, this.useUtc) + incrementBy, this.useUtc)
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
      return DateUtils.getFullYear(this.disabledDates.to, this.useUtc) >= DateUtils.getFullYear(this.pageDate, this.useUtc)
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
      return DateUtils.getFullYear(this.disabledDates.from, this.useUtc) <= DateUtils.getFullYear(this.pageDate, this.useUtc)
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
        DateUtils.getFullYear(this.selectedDate, this.useUtc) === DateUtils.getFullYear(date, this.useUtc) &&
        DateUtils.getMonth(this.selectedDate, this.useUtc) === DateUtils.getMonth(date, this.useUtc))
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
          (DateUtils.getMonth(date, this.useUtc) < DateUtils.getMonth(this.disabledDates.to, this.useUtc) && DateUtils.getFullYear(date, this.useUtc) <= DateUtils.getFullYear(this.disabledDates.to, this.useUtc)) ||
          DateUtils.getFullYear(date, this.useUtc) < DateUtils.getFullYear(this.disabledDates.to, this.useUtc)
        ) {
          disabledDates = true
        }
      }
      if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from) {
        if (
          this.disabledDates.from &&
          (DateUtils.getMonth(date, this.useUtc) > DateUtils.getMonth(this.disabledDates.from, this.useUtc) && DateUtils.getFullYear(date, this.useUtc) >= DateUtils.getFullYear(this.disabledDates.from, this.useUtc)) ||
          DateUtils.getFullYear(date, this.useUtc) > DateUtils.getFullYear(this.disabledDates.from, this.useUtc)
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
