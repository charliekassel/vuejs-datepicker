<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showYearView" :style="calendarStyle" @mousedown.prevent>
    <slot name="beforeCalendarHeader"></slot>
    <header>
      <span
        @click="isRtl ? nextDecade() : previousDecade()"
        class="prev"
        :class="{'disabled': isLeftNavDisabled}">&lt;</span>
      <span>{{ getPageDecade }}</span>
      <span
        @click="isRtl ? previousDecade() : nextDecade()"
        class="next"
        :class="{'disabled': isRightNavDisabled}">&gt;</span>
    </header>
    <span
      class="cell year"
      v-for="year in years"
      :key="year.timestamp"
      :class="{ 'selected': year.isSelected, 'disabled': year.isDisabled }"
      @click.stop="selectYear(year)">{{ year.year }}</span>
  </div>
</template>
<script>
import DateUtils from '../utils/DateUtils'
export default {
  props: {
    showYearView: Boolean,
    selectedDate: Date,
    pageDate: Date,
    pageTimestamp: Number,
    disabledDates: Object,
    highlighted: Object,
    calendarClass: [String, Object, Array],
    calendarStyle: Object,
    translation: Object,
    isRtl: Boolean,
    allowedToShowView: Function,
    useUtc: Boolean
  },
  computed: {
    years () {
      const d = this.pageDate
      let years = []
      // set up a new date object to the beginning of the current 'page'7
      let dObj = this.useUtc ?
        new Date(Date.UTC(Math.floor(d.getUTCFullYear() / 10) * 10, d.getUTCMonth(), d.getUTCDate())) :
        new Date(Math.floor(d.getFullYear() / 10) * 10, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes())
      for (let i = 0; i < 10; i++) {
        years.push({
          year: DateUtils.getFullYear(dObj, this.useUtc),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedYear(dObj),
          isDisabled: this.isDisabledYear(dObj)
        })
        DateUtils.setFullYear(dObj, DateUtils.getFullYear(dObj, this.useUtc) + 1, this.useUtc)
      }
      return years
    },
    /**
     * @return {String}
     */
    getPageDecade () {
      const decadeStart = Math.floor(DateUtils.getFullYear(this.pageDate, this.useUtc) / 10) * 10
      const decadeEnd = decadeStart + 9
      const yearSuffix = this.translation.yearSuffix
      return `${decadeStart} - ${decadeEnd}${yearSuffix}`
    },
    /**
     * Is the left hand navigation button disabled?
     * @return {Boolean}
     */
    isLeftNavDisabled () {
      return this.isRtl
        ? this.isNextDecadeDisabled(this.pageTimestamp)
        : this.isPreviousDecadeDisabled(this.pageTimestamp)
    },
    /**
     * Is the right hand navigation button disabled?
     * @return {Boolean}
     */
    isRightNavDisabled () {
      return this.isRtl
        ? this.isPreviousDecadeDisabled(this.pageTimestamp)
        : this.isNextDecadeDisabled(this.pageTimestamp)
    }
  },
  methods: {
    selectYear (year) {
      if (year.isDisabled) {
        return false
      }
      this.$emit('selectYear', year)
    },
    changeYear (incrementBy) {
      let date = this.pageDate
      DateUtils.setFullYear(date, DateUtils.getFullYear(date, this.useUtc) + incrementBy, this.useUtc)
      this.$emit('changedDecade', date)
    },
    previousDecade () {
      if (this.isPreviousDecadeDisabled()) {
        return false
      }
      this.changeYear(-10)
    },
    isPreviousDecadeDisabled () {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false
      }
      return Math.floor(DateUtils.getFullYear(this.disabledDates.to, this.useUtc) / 10) * 10 >= Math.floor(DateUtils.getFullYear(this.pageDate, this.useUtc) / 10) * 10
    },
    nextDecade () {
      if (this.isNextDecadeDisabled()) {
        return false
      }
      this.changeYear(10)
    },
    isNextDecadeDisabled () {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false
      }
      return Math.ceil(DateUtils.getFullYear(this.disabledDates.from, this.useUtc) / 10) * 10 <= Math.ceil(DateUtils.getFullYear(this.pageDate, this.useUtc) / 10) * 10
    },

    /**
     * Whether the selected date is in this year
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedYear (date) {
      return this.selectedDate && DateUtils.getFullYear(this.selectedDate, this.useUtc) === DateUtils.getFullYear(date, this.useUtc)
    },
    /**
     * Whether a year is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledYear (date) {
      let disabledDates = false
      if (typeof this.disabledDates === 'undefined' || !this.disabledDates) {
        return false
      }

      if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to) {
        if (DateUtils.getFullYear(date, this.useUtc) < DateUtils.getFullYear(this.disabledDates.to, this.useUtc)) {
          disabledDates = true
        }
      }
      if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from) {
        if (DateUtils.getFullYear(date, this.useUtc) > DateUtils.getFullYear(this.disabledDates.from, this.useUtc)) {
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
