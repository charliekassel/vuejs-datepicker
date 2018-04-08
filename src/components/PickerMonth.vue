<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showMonthView" :style="calendarStyle">
    <header>
      <span
        @click="previousYear"
        class="prev"
        :class="{ 'disabled' : previousYearDisabled(pageTimestamp) }">&lt;</span>
      <span @click="showYearCalendar" :class="allowedToShowView('year') ? 'up' : ''">{{ getPageYear }}</span>
      <span
        @click="nextYear"
        class="next"
        :class="{ 'disabled' : nextYearDisabled(pageTimestamp) }">&gt;</span>
    </header>
    <span class="cell month"
      v-for="month in months"
      :key="month.timestamp"
      :class="{'selected': month.isSelected, 'disabled': month.isDisabled}"
      @click.stop="selectMonth(month)">{{ month.month }}</span>
  </div>
</template>
<script>
import DateUtils from '@/utils/DateUtils'
export default {
  props: {
    showMonthView: Boolean,
    selectedDate: Date,
    pageDate: Date,
    pageTimestamp: Number,
    disabled: Object,
    calendarClass: String,
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
          month: DateUtils.getMonthName(i, this.translation.months.original),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedMonth(dObj),
          isDisabled: this.isDisabledMonth(dObj)
        })
        dObj.setMonth(dObj.getMonth() + 1)
      }
      return months
    },
    /**
     * @return {Number}
     */
    getPageYear () {
      return this.pageDate.getFullYear()
    }
  },
  methods: {
    selectMonth (month) {
      if (month.isDisabled) {
        return false
      }
      this.$emit('selectMonth', month)
    },
    changeYear (incrementBy) {
      let date = this.pageDate
      date.setYear(date.getFullYear() + incrementBy)
      this.$emit('changedYear', date)
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
      return this.disabled.to.getFullYear() >= this.pageDate.getFullYear()
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
      return this.disabled.from.getFullYear() <= this.pageDate.getFullYear()
    },
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
    }
  }
}
</script>
