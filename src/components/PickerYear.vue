<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showYearView" :style="calendarStyle">
    <header>
      <span @click="previousDecade" class="prev"
        :class="{ 'disabled' : previousDecadeDisabled(pageTimestamp) }">&lt;</span>
      <span>{{ getPageDecade }}</span>
      <span @click="nextDecade" class="next"
        :class="{ 'disabled' : nextDecadeDisabled(pageTimestamp) }">&gt;</span>
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
export default {
  props: {
    showYearView: Boolean,
    selectedDate: Date,
    pageDate: Date,
    pageTimestamp: Number,
    disabled: Object,
    highlighted: Object,
    calendarClass: String,
    calendarStyle: Object,
    translation: Object,
    allowedToShowView: Function
  },
  computed: {
    years () {
      const d = this.pageDate
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
    /**
     * @return {String}
     */
    getPageDecade () {
      const decadeStart = Math.floor(this.pageDate.getFullYear() / 10) * 10
      const decadeEnd = decadeStart + 9
      return `${decadeStart} - ${decadeEnd}`
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
      date.setYear(date.getFullYear() + incrementBy)
      this.$emit('changedDecade', date)
    },
    previousDecade () {
      if (this.previousDecadeDisabled()) {
        return false
      }
      this.changeYear(-10)
    },
    previousDecadeDisabled () {
      if (!this.disabled || !this.disabled.to) {
        return false
      }
      return Math.floor(this.disabled.to.getFullYear() / 10) * 10 >= Math.floor(this.pageDate.getFullYear() / 10) * 10
    },
    nextDecade () {
      if (this.nextDecadeDisabled()) {
        return false
      }
      this.changeYear(10)
    },
    nextDecadeDisabled () {
      if (!this.disabled || !this.disabled.from) {
        return false
      }
      return Math.ceil(this.disabled.from.getFullYear() / 10) * 10 <= Math.ceil(this.pageDate.getFullYear() / 10) * 10
    },

    /**
     * Whether the selected date is in this year
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedYear (date) {
      return this.selectedDate && this.selectedDate.getFullYear() === date.getFullYear()
    },
    /**
     * Whether a year is disabled
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
    }
  }
}
// eslint-disable-next-line
;
</script>
