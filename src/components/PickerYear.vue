<template>
  <div :class="[
      calendarClass,
      'vdp-datepicker__calendar',
      {'vdp-datepicker__calendar-modal': modal},
      {'visible': showYearView},
      yearsGridId
    ]"
    v-show="showYearView"
    :style="calendarStyle"
    @mousedown.prevent
  >
    <slot name="beforeCalendarHeader"></slot>
    <header>
      <button
        @click="isRtl ? nextDecade() : previousDecade()"
        @keydown="$emit('keydown', $event)"
        class="prev"
        :class="{'disabled': isLeftNavDisabled}">&lt;</button>
      <button>{{ getPageDecade }}</button>
      <button
        @click="isRtl ? previousDecade() : nextDecade()"
        @keydown="$emit('keydown', $event)"
        class="next"
        :class="{'disabled': isRightNavDisabled}">&gt;</button>
    </header>
    <button
      class="cell year"
      v-for="year in years"
      :tabindex="year.isFocused ? 0 : -1"
      :key="year.timestamp"
      :class="{ 'selected': year.isSelected, 'disabled': year.isDisabled }"
      @click.stop="selectYear(year)"
      @keydown.right.prevent="focusNextYear"
      @keydown.left.prevent="focusPreviousYear"
      @keydown.down.prevent="focusNextRow"
      @keydown.up.prevent="focusPreviousRow"
      @keydown="$emit('keydown', $event)">{{ year.year }}</button>
    <div>
      <slot name="afterCalendarContent"></slot>
    </div>
  </div>
</template>
<script>
import { makeDateUtils } from '../utils/DateUtils'
import {ELEMENT_IDS} from '../config/ElementIds'

const ORPHAN_CELL_OFFSET = 4
const LAST_TO_FIRST_OFFSET = 1
const STANDARD_ROW_OFFSET = 3
const DECADE_OFFSET = 10

export default {
  props: {
    focusedDate: Number,
    showYearView: Boolean,
    selectedDate: Date,
    pageDate: Date,
    pageTimestamp: Number,
    disabledDates: Object,
    highlighted: Object,
    calendarClass: [String, Object, Array],
    calendarStyle: Object,
    modal: Boolean,
    translation: Object,
    isRtl: Boolean,
    allowedToShowView: Function,
    useUtc: Boolean,
    isInitialized: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    years () {
      const d = this.pageDate
      let years = []
      // set up a new date object to the beginning of the current 'page'7
      let dObj = this.useUtc
        ? new Date(Date.UTC(Math.floor(d.getUTCFullYear() / 10) * 10, d.getUTCMonth(), d.getUTCDate()))
        : new Date(Math.floor(d.getFullYear() / 10) * 10, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes())
      for (let i = 0; i < 10; i++) {
        years.push({
          year: this.utils.getFullYear(dObj),
          timestamp: dObj.getTime(),
          isFocused: this.isFocusedYear(dObj),
          isSelected: this.isSelectedYear(dObj),
          isDisabled: this.isDisabledYear(dObj)
        })
        this.utils.setFullYear(dObj, this.utils.getFullYear(dObj) + 1)
      }
      return years
    },
    /**
     * @return {String}
     */
    getPageDecade () {
      const decadeStart = Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10
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
  data () {
    const constructedDateUtils = makeDateUtils(this.useUtc)
    return {
      utils: constructedDateUtils,
      yearsGridId: ELEMENT_IDS.yearGrid,
    }
  },
  watch: {
    showYearView() {
      if (this.showYearView && this.isInitialized) {
        this.focusYearCell()
      }
    }
  },
  methods: {
    async focusYearCell() {
      await this.$nextTick();
      const focusableYear = this.$el.querySelector('.year[tabindex="0"]')
      if (focusableYear) {
        focusableYear.focus()
      }
    },
    focusNextYear() {
      const newDate = new Date(this.focusedDate);
      this.utils.setFullYear(newDate,this.utils.getFullYear(newDate) + 1, this.useUtc);
      this.moveFocus(newDate)
    },
    focusPreviousYear () {
      const newDate = new Date(this.focusedDate);
      this.utils.setFullYear(newDate,this.utils.getFullYear(newDate) - 1, this.useUtc);
      this.moveFocus(newDate)
    },
    /*
    For row navigation, we have a dangling cell that requires some adaptation, so we can't just add or subtract 3
    as we do with months
     */
    focusNextRow() {
      const newDate = new Date(this.focusedDate);
      const focusedYear = this.utils.getFullYear(newDate)
      const lastDigit = focusedYear % 10
      const isOrphan = [7, 8].includes(lastDigit);
      const isLast = lastDigit === 9;
      let offset;
      if (isOrphan) {
        offset = ORPHAN_CELL_OFFSET;
      } else if (isLast) {
        offset = LAST_TO_FIRST_OFFSET;
      } else {
        offset = STANDARD_ROW_OFFSET;
      }
      this.utils.setFullYear(newDate, focusedYear + offset, this.useUtc)
      this.moveFocus(newDate)
    },
    focusPreviousRow () {
      const newDate = new Date(this.focusedDate);
      const focusedYear = this.utils.getFullYear(newDate)
      const lastDigit = focusedYear % 10
      const linksToOrphan = [1, 2].includes(lastDigit);
      const isFirst = lastDigit === 0;
      let offset;
      if (linksToOrphan) {
        offset = ORPHAN_CELL_OFFSET;
      } else if (isFirst) {
        offset = LAST_TO_FIRST_OFFSET;
      } else {
        offset = STANDARD_ROW_OFFSET;
      }
      this.utils.setFullYear(newDate,focusedYear - offset, this.useUtc)
      this.moveFocus(newDate)
    },
    selectYear (year) {
      if (year.isDisabled) {
        return false
      }
      this.$emit('selectYear', year)
    },
    changeYear (incrementBy) {
      let date = this.pageDate
      this.utils.setFullYear(date, this.utils.getFullYear(date) + incrementBy)
      this.$emit('changedDecade', date)
    },
    previousDecade () {
      if (this.isPreviousDecadeDisabled()) {
        return false
      }
      this.changeYear(-DECADE_OFFSET)
    },
    isPreviousDecadeDisabled () {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false
      }
      const disabledYear = this.utils.getFullYear(this.disabledDates.to)
      const lastYearInPreviousPage = Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10 - 1
      return disabledYear > lastYearInPreviousPage
    },
    nextDecade () {
      if (this.isNextDecadeDisabled()) {
        return false
      }
      this.changeYear(DECADE_OFFSET)
    },
    isNextDecadeDisabled () {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false
      }
      const disabledYear = this.utils.getFullYear(this.disabledDates.from)
      const firstYearInNextPage = Math.ceil(this.utils.getFullYear(this.pageDate) / 10) * 10
      return disabledYear < firstYearInNextPage
    },
    /**
     * Whether the focused date is in this year
     * @param date {Date}
     * @return {Boolean}
     */
    isFocusedYear (date) {
      const focusedDate = new Date(this.focusedDate);
      return (focusedDate &&
        this.utils.getFullYear(focusedDate) === this.utils.getFullYear(date))
    },
    /**
     * Whether the selected date is in this year
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedYear (date) {
      return this.selectedDate && this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date)
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
        if (this.utils.getFullYear(date) < this.utils.getFullYear(this.disabledDates.to)) {
          disabledDates = true
        }
      }
      if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from) {
        if (this.utils.getFullYear(date) > this.utils.getFullYear(this.disabledDates.from)) {
          disabledDates = true
        }
      }

      if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
        disabledDates = true
      }

      return disabledDates
    },
    moveFocus(newDate, focusCell = true) {
      const decadeFirstYear = Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10
      const yearsDifference = this.utils.getFullYear(newDate) - decadeFirstYear;
      if (yearsDifference < 0) {
        this.changeYear(-DECADE_OFFSET);
      } else if (yearsDifference >= DECADE_OFFSET) {
        this.changeYear(DECADE_OFFSET)
      }

      this.$emit('update:focusedDate', newDate.getTime());

      if (focusCell) {
        this.focusYearCell()
      }
    }
  }
}
// eslint-disable-next-line
;
</script>
