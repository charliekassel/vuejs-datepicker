<template>
  <div
    v-show="showDayView"
    :class="[
      calendarClass,
      'vdp-datepicker__calendar',
      {'vdp-datepicker__calendar-modal': modal},
      {'vdp-datepicker__calendar--side-by-side': sideBySide},
      {'visible': showDayView},
    ]"
    :style="calendarStyle"
    role="dialog"
    aria-modal="true"
    aria-label="Choose Date"
    @mousedown.prevent
  >
    <slot name="beforeCalendarHeader" />
    <header>
      <button
        class="prev"
        :aria-label="isRtl ? 'Next Month' : 'Previous Month'"
        :class="{'disabled': isLeftNavDisabled}"
        @click="isRtl ? nextMonth() : previousMonth()"
        @keydown="$emit('keydown', $event)"
      >
        &lt;
      </button>
      <button
        id="month-button"
        class="day__month_btn"
        :class="allowedToShowView('month') ? 'up' : ''"
        aria-live="polite"
        @click="showMonthCalendar"
        @keydown="$emit('keydown', $event)"
      >
        {{ isYmd ? currYearName : currMonthName }} {{ isYmd ? currMonthName : currYearName }}
      </button>
      <button
        v-if="sideBySide"
        class="day__month_btn"
        :class="allowedToShowView('month') ? 'up' : ''"
        aria-live="polite"
        @click="showMonthCalendar"
        @keydown="$emit('keydown', $event)"
      >
        {{ isYmd ? nextMonthYearName : nextMonthName }} {{ isYmd ? nextMonthName : nextMonthYearName }}
      </button>
      <button
        class="next"
        :aria-label="isRtl ? 'Previous Month' : 'Next Month'"
        :class="{'disabled': isRightNavDisabled}"
        @click="isRtl ? previousMonth() : nextMonth()"
        @keydown="$emit('keydown', $event)"
      >
        &gt;
      </button>
    </header>
    <div class="day-grids-wrapper">
      <DaysGrid
        data-test-id="first-grid"
        :class="[isRtl ? 'flex-rtl' : '', daysGridId]"
        :day-cell-content="dayCellContent"
        :days="days"
        :focused-date="focusedDate"
        :monday-first="mondayFirst"
        :start-date="pageDate"
        :translation="translation"
        :use-utc="useUtc"
        :utils="utils"
        @select="selectDate"
        @focus-next-day="focusNextDay"
        @focus-previous-day="focusPreviousDay"
        @focus-next-week="focusNextWeek"
        @focus-previous-week="focusPreviousWeek"
        @mouseover="highlightOnMouseover"
        @keydown="$emit('keydown', $event)"
      />
      <DaysGrid
        v-if="sideBySide"
        data-test-id="second-grid"
        :class="isRtl ? 'flex-rtl' : ''"
        :day-cell-content="dayCellContent"
        :days="nextMonthDays"
        :focused-date="focusedDate"
        :monday-first="mondayFirst"
        :start-date="nextMonthPageDate"
        :translation="translation"
        :use-utc="useUtc"
        :utils="utils"
        @select="selectDate"
        @focus-next-day="focusNextDay"
        @focus-previous-day="focusPreviousDay"
        @focus-next-week="focusNextWeek"
        @focus-previous-week="focusPreviousWeek"
        @mouseover="highlightOnMouseover"
        @keydown="$emit('keydown', $event)"
      />
    </div>
    <div>
      <slot name="afterCalendarContent" />
      <slot name="footer" />
      <PickerFooter
        v-if="showFooter && !$slots.footer"
        :selected-date="selectedDate"
        :clear-date="clearDate"
        :set-today="setToday"
        :footer-class="footerClass"
        :today-button-class="todayButtonClass"
        :clear-button-class="clearButtonClass"
        @keydown="$emit('keydown', $event)"
      />
    </div>
  </div>
</template>
<script>
import { makeDateUtils } from '../utils/DateUtils';
import PickerFooter from './PickerFooter.vue';
import DaysGrid from './DaysGrid.vue';
import { ELEMENT_IDS } from '../config/ElementIds';
export default {
  components: { PickerFooter, DaysGrid },
  props: {
    focusedDate: Number,
    showFooter: Boolean,
    showDayView: Boolean,
    selectedDate: Date,
    pageDate: Date,
    pageTimestamp: Number,
    fullMonthName: Boolean,
    allowedToShowView: Function,
    clearDate: Function,
    setPageDate: Function,
    footerClass: [ String, Object, Array ],
    todayButtonClass: [ String, Object, Array ],
    clearButtonClass: [ String, Object, Array ],
    dayCellContent: {
      type: Function,
      default: day => day.date,
    },
    disabledDates: Object,
    highlighted: Object,
    calendarClass: [ String, Object, Array ],
    calendarStyle: Object,
    translation: Object,
    isRtl: Boolean,
    mondayFirst: Boolean,
    modal: Boolean,
    useUtc: Boolean,
    highlightDate: Function,
    sideBySide: {
      type: Boolean,
      default: false,
    },
    isInitialized: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    const constructedDateUtils = makeDateUtils(this.useUtc);
    return {
      daysGridId: ELEMENT_IDS.dayGrid,
      utils: constructedDateUtils,
    };
  },
  computed: {
    /**
     * Gets the name of the month the current page is on
     * @return {String}
     */
    currMonthName () {
      const monthName = this.fullMonthName ? this.translation.months : this.translation.monthsAbbr;
      return this.utils.getMonthNameAbbr(this.utils.getMonth(this.pageDate), monthName);
    },
    /**
     * Gets the name of the year that current page is on
     * @return {Number}
     */
    currYearName () {
      const yearSuffix = this.translation.yearSuffix;
      return `${this.utils.getFullYear(this.pageDate)}${yearSuffix}`;
    },
    /**
     * Gets the name of the month next to the current one
     * @return {String}
     */
    nextMonthName () {
      const monthName = this.fullMonthName ? this.translation.months : this.translation.monthsAbbr;
      return this.utils.getMonthNameAbbr(this.utils.getMonth(this.nextMonthPageDate), monthName);
    },
    /**
     * Gets the name of the year that current page is on
     * @return {Number}
     */
    nextMonthYearName () {
      const yearSuffix = this.translation.yearSuffix;
      return `${this.utils.getFullYear(this.nextMonthPageDate)}${yearSuffix}`;
    },
    /**
     * @return {Object[]}
     */
    days () {
      const d = this.pageDate;
      return this.getMonthDays(d);
    },
    nextMonthPageDate () {
      const d = new Date(this.pageDate);
      this.utils.setMonth(d, this.utils.getMonth(d) + 1);
      return d;
    },
    nextMonthDays () {
      return this.getMonthDays(this.nextMonthPageDate);
    },
    /**
     * Is this translation using year/month/day format?
     * @return {Boolean}
     */
    isYmd () {
      return this.translation.ymd && this.translation.ymd === true;
    },
    /**
     * Is the left hand navigation button disabled?
     * @return {Boolean}
     */
    isLeftNavDisabled () {
      return this.isRtl
        ? this.isNextMonthDisabled()
        : this.isPreviousMonthDisabled();
    },
    /**
     * Is the right hand navigation button disabled?
     * @return {Boolean}
     */
    isRightNavDisabled () {
      return this.isRtl
        ? this.isPreviousMonthDisabled()
        : this.isNextMonthDisabled();
    },
  },
  watch: {
    showDayView() {
      if (this.showDayView && this.isInitialized) {
        this.focusDayCell();
      }
    },
  },
  methods: {
    async focusDayCell() {
      await this.$nextTick();
      const focusableDay = this.$el.querySelector('.day-grids-wrapper [tabindex="0"]');
      if (focusableDay) {
        focusableDay.focus();
      }
    },
    focusNextDay() {
      const newDate = new Date(this.focusedDate);
      this.utils.setDate(newDate, newDate.getDate() + 1, this.useUtc);
      this.moveFocus(newDate);
    },
    focusPreviousDay () {
      const newDate = new Date(this.focusedDate);
      this.utils.setDate(newDate, newDate.getDate() - 1, this.useUtc);
      this.moveFocus(newDate);
    },
    focusNextWeek() {
      const newDate = new Date(this.focusedDate);
      this.utils.setDate(newDate, newDate.getDate() + 7, this.useUtc);
      this.moveFocus(newDate);
    },
    focusPreviousWeek () {
      const newDate = new Date(this.focusedDate);
      this.utils.setDate(newDate, newDate.getDate() - 7, this.useUtc);
      this.moveFocus(newDate);
    },
    getDateObject (date) {
      return {
        date: this.utils.getDate(date),
        timestamp: date.getTime(),
        isSelected: this.isSelectedDate(date),
        isDisabled: this.isDisabledDate(date),
        isHighlighted: this.isHighlightedDate(date),
        isHighlightStart: this.isHighlightStart(date),
        isHighlightEnd: this.isHighlightEnd(date),
        isToday: this.utils.compareDates(date, new Date()),
        isWeekend: this.utils.getDay(date) === 0 || this.utils.getDay(date) === 6,
        isSaturday: this.utils.getDay(date) === 6,
        isSunday: this.utils.getDay(date) === 0,
      };
    },
    getMonthDays (date) {
      let days = [];
      // set up a new date object to the beginning of the current 'page'
      let dObj = this.useUtc
        ? new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
        : new Date(date.getFullYear(), date.getMonth(), 1, date.getHours(), date.getMinutes());
      let daysInMonth = this.utils.daysInMonth(this.utils.getFullYear(dObj), this.utils.getMonth(dObj));
      for (let i = 0; i < daysInMonth; i++) {
        days.push(this.getDateObject(dObj));
        this.utils.setDate(dObj, this.utils.getDate(dObj) + 1);
      }
      return days;
    },
    async moveFocus(newDate, focusCell = true) {
      const monthsDifference = this.utils.getMonth(newDate)  - this.utils.getMonth(this.pageDate);
      const yearsDifference = this.utils.getFullYear(newDate) - this.utils.getFullYear(this.pageDate);
      const shouldChangePage = monthsDifference !== 0 && !(this.sideBySide && monthsDifference === 1);
      if (shouldChangePage) {
        this.changeMonth(monthsDifference + yearsDifference * 12);
      }

      this.$emit('update:focusedDate', newDate.getTime());

      if (focusCell) {
        this.focusDayCell();
      }
    },
    /**
     * Select date for today button
     */
    setToday () {
      const d = new Date();

      let dObj = this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
        : new Date(d.getFullYear(), d.getMonth(), d.getUTCDate(), d.getHours(), d.getMinutes());

      this.selectDate(this.getDateObject(dObj));
    },
    selectDate (date) {
      if (date.isDisabled) {
        this.$emit('selectedDisabled', date);
        return false;
      }
      this.$emit('selectDate', date);
    },
    /**
     * @return {Number}
     */
    getPageMonth () {
      return this.utils.getMonth(this.pageDate);
    },
    /**
     * Emit an event to show the month picker
     */
    showMonthCalendar () {
      this.$emit('showMonthCalendar');
    },
    /**
     * Change the page month
     * @param {Number} incrementBy
     */
    changeMonth (incrementBy) {
      let date = this.pageDate;
      this.utils.setMonth(date, this.utils.getMonth(date) + incrementBy);
      this.$emit('changedMonth', date);
    },
    /**
     * Decrement the page month
     */
    previousMonth () {
      if (!this.isPreviousMonthDisabled()) {
        const focusedDate = new Date(this.focusedDate);
        this.utils.setMonth(focusedDate, this.utils.getMonth(focusedDate) - 1, this.useUtc);
        this.moveFocus(focusedDate, false);
      }
    },
    /**
     * Is the previous month disabled?
     * @return {Boolean}
     */
    isPreviousMonthDisabled () {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false;
      }
      let d = this.pageDate;
      return this.utils.getMonth(this.disabledDates.to) >= this.utils.getMonth(d) &&
        this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(d);
    },
    /**
     * Increment the current page month
     */
    nextMonth () {
      if (!this.isNextMonthDisabled()) {
        const focusedDate = new Date(this.focusedDate);
        this.utils.setMonth(focusedDate, this.utils.getMonth(focusedDate) + 1, this.useUtc);
        this.moveFocus(focusedDate, false);
      }
    },
    /**
     * Emit an event to show the hovered date
     * @param {Date} date
     */
    highlightOnMouseover (date) {
      if (this.isDisabledDate(date)) return;
      this.highlightDate(date);
    },
    /**
     * Is the next month disabled?
     * @return {Boolean}
     */
    isNextMonthDisabled () {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false;
      }
      let d = this.pageDate;
      return this.utils.getMonth(this.disabledDates.from) <= this.utils.getMonth(d) &&
        this.utils.getFullYear(this.disabledDates.from) <= this.utils.getFullYear(d);
    },
    /**
     * Whether a day is selected
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedDate (dObj) {
      return this.selectedDate && this.utils.compareDates(this.selectedDate, dObj);
    },
    /**
     * Whether a day is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledDate (date) {
      let disabledDates = false;

      if (typeof this.disabledDates === 'undefined') {
        return false;
      }

      if (typeof this.disabledDates.dates !== 'undefined') {
        this.disabledDates.dates.forEach((d) => {
          if (this.utils.compareDates(date, d)) {
            disabledDates = true;
            return true;
          }
        });
      }
      if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to && date < this.disabledDates.to) {
        disabledDates = true;
      }
      if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from && date > this.disabledDates.from) {
        disabledDates = true;
      }
      if (typeof this.disabledDates.ranges !== 'undefined') {
        this.disabledDates.ranges.forEach((range) => {
          if (typeof range.from !== 'undefined' && range.from && typeof range.to !== 'undefined' && range.to) {
            if (date < range.to && date > range.from) {
              disabledDates = true;
              return true;
            }
          }
        });
      }
      if (typeof this.disabledDates.days !== 'undefined' && this.disabledDates.days.indexOf(this.utils.getDay(date)) !== -1) {
        disabledDates = true;
      }
      if (typeof this.disabledDates.daysOfMonth !== 'undefined' && this.disabledDates.daysOfMonth.indexOf(this.utils.getDate(date)) !== -1) {
        disabledDates = true;
      }
      if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
        disabledDates = true;
      }
      return disabledDates;
    },
    /**
     * Whether a day is highlighted (only if it is not disabled already except when highlighted.includeDisabled is true)
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightedDate (date) {
      if (!(this.highlighted && this.highlighted.includeDisabled) && this.isDisabledDate(date)) {
        return false;
      }

      let highlighted = false;

      if (typeof this.highlighted === 'undefined') {
        return false;
      }

      if (typeof this.highlighted.dates !== 'undefined') {
        this.highlighted.dates.forEach((d) => {
          if (this.utils.compareDates(date, d)) {
            highlighted = true;
            return true;
          }
        });
      }

      if (this.isDefined(this.highlighted.from) && this.isDefined(this.highlighted.to)) {
        highlighted = date >= this.highlighted.from && date <= this.highlighted.to;
      }

      if (typeof this.highlighted.days !== 'undefined' && this.highlighted.days.indexOf(this.utils.getDay(date)) !== -1) {
        highlighted = true;
      }

      if (typeof this.highlighted.daysOfMonth !== 'undefined' && this.highlighted.daysOfMonth.indexOf(this.utils.getDate(date)) !== -1) {
        highlighted = true;
      }

      if (typeof this.highlighted.customPredictor === 'function' && this.highlighted.customPredictor(date)) {
        highlighted = true;
      }

      return highlighted;
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
        (this.utils.getFullYear(this.highlighted.from) === this.utils.getFullYear(date)) &&
        (this.utils.getMonth(this.highlighted.from) === this.utils.getMonth(date)) &&
        (this.utils.getDate(this.highlighted.from) === this.utils.getDate(date));
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
        (this.utils.getFullYear(this.highlighted.to) === this.utils.getFullYear(date)) &&
        (this.utils.getMonth(this.highlighted.to) === this.utils.getMonth(date)) &&
        (this.utils.getDate(this.highlighted.to) === this.utils.getDate(date));
    },
    /**
     * Helper
     * @param  {mixed}  prop
     * @return {Boolean}
     */
    isDefined (prop) {
      return typeof prop !== 'undefined' && prop;
    },
  },
}
// eslint-disable-next-line
;
</script>
