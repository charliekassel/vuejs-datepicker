<template>
  <div
    :class="[calendarClass, 'vdp-datepicker__calendar']"
    v-show="showDayView"
    :style="calendarStyle"
  >
    <slot name="beforeCalendarHeader"></slot>   
    <header>
      <!-- <span
        @click="isRtl ? nextMonth() : previousMonth()"
        class="prev"
        :class="{'disabled': isLeftNavDisabled}"
      >&lt;</span> -->

      <a class="btn btn--secondary btn--inline btn--icon prev" :class="{'disabled': isLeftNavDisabled}" href="#" role="button" @click="isRtl ? nextMonth() : previousMonth()"><svg class="icon"><use xlink:href=""></use></svg></a>
   
      <div class="select-container date-select">
        <select class="select-container__input datepicker-month-select" id="datepicker-month-select" @change="selectDropdownMonthChanged($event.target.selectedIndex)">
          <option
            v-for="(date,index) in this.availableDates"
            :key="index"
            :selected="date.val == currentPageDate"
          >{{date.displayVal}}</option>
        </select>
        <svg class="select-container__icon">
          <use xlink:href />
        </svg>
      </div>
      <!-- <span
        @click="isRtl ? previousMonth() : nextMonth()"
        class="next"
        :class="{'disabled': isRightNavDisabled}"
      >&gt;</span> -->
      <a class="btn btn--secondary btn--inline btn--icon next" :class="{'disabled': isRightNavDisabled}" href="#" role="button" @click="isRtl ? previousMonth() : nextMonth()"><svg class="icon"><use xlink:href=""></use></svg></a>

    </header>
    <div class="picker-days" :class="isRtl ? 'flex-rtl' : ''">
      <span
        class="cell day-header color--white background--alpha"
        v-for="d in daysOfWeek"
        :key="d.timestamp"
      >{{ d }}</span>
      <template v-if="blankDays > 0">
        <span class="cell day blank background--india" v-for="d in blankDays" :key="d.timestamp"></span>
      </template>      
      <span
        class="cell day"
        v-for="day in days"
        :key="day.timestamp"
        :class="dayClasses(day)"
        v-html="dayCellContent(day)"
        @click="selectDate(day)"
        @mouseover="applyHoverStyles($event.target)"
        @mouseleave="removeHoverStyles($event.target)"
      ></span>
    </div>
  </div>
</template>
<script>
import { makeDateUtils } from "../utils/DateUtils";
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
    monthLimit: Number,
    useUtc: Boolean
  },
  mounted(){
    this.selectedDateIndex = this.selectedDropdownMonthIndex();
  },
  data() {
    const constructedDateUtils = makeDateUtils(this.useUtc);
    return {
      utils: constructedDateUtils,
      selectedDateIndex: 0    
    };
  },
  computed: {
    /**
     * Returns formatted page date (sets hours to 0,0,0,0 to ensure time is not an issue when comparing)
     * @return {Date}
     */
    currentPageDate() {
      return new Date(new Date(this.pageDate).setDate(1)).setHours(0, 0, 0, 0);
    },
    /**
     * Returns array of objects continaing display and timestamp vals for each month within the next 24 months
     * @return {[{}]}
     */
    availableDates() {
      var x;
      var months = [];
      var date = new Date();

      for (x = 0; x <= this.monthLimit; x++) {
        months.push({
          displayVal: `${this.utils.getMonthName(
            date.getMonth(),
            this.translation.months
          )} ${date.getFullYear()}`,
          val: new Date(new Date(date).setDate(1)).setHours(0, 0, 0, 0)
        });
        date.setMonth(date.getMonth() + 1);
      }

      return months;
    },
    /**
     * Returns an array of day names
     * @return {String[]}
     */
    daysOfWeek() {
      if (this.mondayFirst) {
        const tempDays = this.translation.days.slice();
        tempDays.push(tempDays.shift());
        return tempDays;
      }
      return this.translation.days;
    },
    /**
     * Returns the day number of the week less one for the first of the current month
     * Used to show amount of empty cells before the first in the day calendar layout
     * @return {Number}
     */
    blankDays() {
      const d = this.pageDate;
      let dObj = this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
        : new Date(
            d.getFullYear(),
            d.getMonth(),
            1,
            d.getHours(),
            d.getMinutes()
          );
      if (this.mondayFirst) {
        return this.utils.getDay(dObj) > 0 ? this.utils.getDay(dObj) - 1 : 6;
      }
      return this.utils.getDay(dObj);
    },
    /**
     * @return {Object[]}
     */
    days() {
      const d = this.pageDate;
      let days = [];
      // set up a new date object to the beginning of the current 'page'
      let dObj = this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
        : new Date(
            d.getFullYear(),
            d.getMonth(),
            1,
            d.getHours(),
            d.getMinutes()
          );
      let daysInMonth = this.utils.daysInMonth(
        this.utils.getFullYear(dObj),
        this.utils.getMonth(dObj)
      );
      for (let i = 0; i < daysInMonth; i++) {
        days.push({
          date: this.utils.getDate(dObj),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedDate(dObj),
          isDisabled: this.isDisabledDate(dObj),
          isHighlighted: this.isHighlightedDate(dObj),
          isHighlightStart: this.isHighlightStart(dObj),
          isHighlightEnd: this.isHighlightEnd(dObj),
          isToday: this.utils.compareDates(dObj, new Date()),
          isWeekend:
            this.utils.getDay(dObj) === 0 || this.utils.getDay(dObj) === 6,
          isSaturday: this.utils.getDay(dObj) === 6,
          isSunday: this.utils.getDay(dObj) === 0
        });
        this.utils.setDate(dObj, this.utils.getDate(dObj) + 1);
      }
      return days;
    },
    /**
     * Gets the name of the month the current page is on
     * @return {String}
     */
    currMonthName() {
      const monthName = this.fullMonthName
        ? this.translation.months
        : this.translation.monthsAbbr;
      return this.utils.getMonthNameAbbr(
        this.utils.getMonth(this.pageDate),
        monthName
      );
    },
    /**
     * Gets the name of the year that current page is on
     * @return {Number}
     */
    currYearName() {
      const yearSuffix = this.translation.yearSuffix;
      return `${this.utils.getFullYear(this.pageDate)}${yearSuffix}`;
    },
    /**
     * Is this translation using year/month/day format?
     * @return {Boolean}
     */
    isYmd() {
      return this.translation.ymd && this.translation.ymd === true;
    },
    /**
     * Is the left hand navigation button disabled?
     * @return {Boolean}
     */
    isLeftNavDisabled() {      
      return this.isRtl
        ? this.isNextMonthDisabled(this.pageTimestamp)
        : this.isPreviousMonthDisabled(this.pageTimestamp);
    },
    /**
     * Is the right hand navigation button disabled?
     * @return {Boolean}
     */
    isRightNavDisabled() {      
      return this.isRtl
        ? this.isPreviousMonthDisabled(this.pageTimestamp)
        : this.isNextMonthDisabled(this.pageTimestamp);
    }
  },
  methods: {
    selectDropdownMonthChanged(newIndex){
      var oldIndex = this.selectedDateIndex;
      console.log("New Index: " + newIndex, "Old Index: " + oldIndex);
      var monthDiff = newIndex - oldIndex;
      console.log(monthDiff);      
      this.changeMonth(monthDiff);
    },
    /**
     * Applies styleguide hover styles to the day box   
     */
    applyHoverStyles(element){
      element.classList.add("border--bravo");
    },
    /**
     * Removes styleguide hover styles to the day box   
     */
    removeHoverStyles(element){
      element.classList.remove("border--bravo");
    },
    /**
     * Returns the index of the currently selected date in the calendar dropdown
     * @return Number
     */
    selectedDropdownMonthIndex() { 
      return document.getElementById("datepicker-month-select") ? document.getElementById("datepicker-month-select").selectedIndex : 0;
    },    
    selectDate(date) {
      if (date.isDisabled) {
        this.$emit("selectedDisabled", date);
        return false;
      }
      this.$emit("selectDate", date);
    },
    /**
     * @return {Number}
     */
    getPageMonth() {
      return this.utils.getMonth(this.pageDate);
    },
    /**
     * Emit an event to show the month picker
     */
    showMonthCalendar() {
      this.$emit("showMonthCalendar");
    },
    /**
     * Change the page month
     * @param {Number} incrementBy
     */
    changeMonth(incrementBy) {     
      this.selectedDateIndex = this.selectedDateIndex + incrementBy;
      let date = this.pageDate;
      this.utils.setMonth(date, this.utils.getMonth(date) + incrementBy);
      this.$emit("changedMonth", date);  
    },
    /**
     * Decrement the page month
     */
    previousMonth() {
      this.changeMonth(-1);
    },
    /**
     * Is the previous month disabled?
     * @return {Boolean}
     */
    isPreviousMonthDisabled() {      
      let prevMonthDisabled = false;

      if (this.selectedDateIndex != 0) {
        let d = this.pageDate;
        if (this.disabledDates && this.disabledDates.to) {
          prevMonthDisabled =
            this.utils.getMonth(this.disabledDates.to) >=
              this.utils.getMonth(d) &&
            this.utils.getFullYear(this.disabledDates.to) >=
              this.utils.getFullYear(d);
        }
      } else {
        prevMonthDisabled = true;
      }

      return prevMonthDisabled;
    },
    /**
     * Increment the current page month
     */
    nextMonth() {        
        this.changeMonth(1);      
    },
    /**
     * Is the next month disabled?
     * @return {Boolean}
     */
    isNextMonthDisabled() {     
      let nextMonthDisabled = false;

      if (this.selectedDateIndex != this.monthLimit) {
        let d = this.pageDate;
        if (this.disabledDates && this.disabledDates.from) {
          nextMonthDisabled =
            this.utils.getMonth(this.disabledDates.from) <=
              this.utils.getMonth(d) &&
            this.utils.getFullYear(this.disabledDates.from) <=
              this.utils.getFullYear(d);
        }
      } else {
        nextMonthDisabled = true;
      }
     
      return nextMonthDisabled;
    },
    /**
     * Whether a day is selected
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedDate(dObj) {
      return (
        this.selectedDate && this.utils.compareDates(this.selectedDate, dObj)
      );
    },
    /**
     * Whether a day is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledDate(date) {
      let disabledDates = false;

      if (typeof this.disabledDates === "undefined") {
        return false;
      }

      if (typeof this.disabledDates.dates !== "undefined") {
        this.disabledDates.dates.forEach(d => {
          if (this.utils.compareDates(date, d)) {
            disabledDates = true;
            return true;
          }
        });
      }
      if (
        typeof this.disabledDates.to !== "undefined" &&
        this.disabledDates.to &&
        date < this.disabledDates.to
      ) {
        disabledDates = true;
      }
      if (
        typeof this.disabledDates.from !== "undefined" &&
        this.disabledDates.from &&
        date > this.disabledDates.from
      ) {
        disabledDates = true;
      }
      if (typeof this.disabledDates.ranges !== "undefined") {
        this.disabledDates.ranges.forEach(range => {
          if (
            typeof range.from !== "undefined" &&
            range.from &&
            typeof range.to !== "undefined" &&
            range.to
          ) {
            if (date < range.to && date > range.from) {
              disabledDates = true;
              return true;
            }
          }
        });
      }
      if (
        typeof this.disabledDates.days !== "undefined" &&
        this.disabledDates.days.indexOf(this.utils.getDay(date)) !== -1
      ) {
        disabledDates = true;
      }
      if (
        typeof this.disabledDates.daysOfMonth !== "undefined" &&
        this.disabledDates.daysOfMonth.indexOf(this.utils.getDate(date)) !== -1
      ) {
        disabledDates = true;
      }
      if (
        typeof this.disabledDates.customPredictor === "function" &&
        this.disabledDates.customPredictor(date)
      ) {
        disabledDates = true;
      }
      return disabledDates;
    },
    /**
     * Whether a day is highlighted (only if it is not disabled already except when highlighted.includeDisabled is true)
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightedDate(date) {
      if (
        !(this.highlighted && this.highlighted.includeDisabled) &&
        this.isDisabledDate(date)
      ) {
        return false;
      }

      let highlighted = false;

      if (typeof this.highlighted === "undefined") {
        return false;
      }

      if (typeof this.highlighted.dates !== "undefined") {
        this.highlighted.dates.forEach(d => {
          if (this.utils.compareDates(date, d)) {
            highlighted = true;
            return true;
          }
        });
      }

      if (
        this.isDefined(this.highlighted.from) &&
        this.isDefined(this.highlighted.to)
      ) {
        highlighted =
          date >= this.highlighted.from && date <= this.highlighted.to;
      }

      if (
        typeof this.highlighted.days !== "undefined" &&
        this.highlighted.days.indexOf(this.utils.getDay(date)) !== -1
      ) {
        highlighted = true;
      }

      if (
        typeof this.highlighted.daysOfMonth !== "undefined" &&
        this.highlighted.daysOfMonth.indexOf(this.utils.getDate(date)) !== -1
      ) {
        highlighted = true;
      }

      if (
        typeof this.highlighted.customPredictor === "function" &&
        this.highlighted.customPredictor(date)
      ) {
        highlighted = true;
      }

      return highlighted;
    },
    dayClasses(day) {
      return {
        selected: day.isSelected,
        "background--bravo": day.isSelected,
        "color--white": day.isSelected,
        disabled: day.isDisabled,
        highlighted: day.isHighlighted,
        today: day.isToday,
        weekend: day.isWeekend,
        sat: day.isSaturday,
        sun: day.isSunday,
        "highlight-start": day.isHighlightStart,
        "highlight-end": day.isHighlightEnd
      };
    },
    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightStart(date) {
      return (
        this.isHighlightedDate(date) &&
        this.highlighted.from instanceof Date &&
        this.utils.getFullYear(this.highlighted.from) ===
          this.utils.getFullYear(date) &&
        this.utils.getMonth(this.highlighted.from) ===
          this.utils.getMonth(date) &&
        this.utils.getDate(this.highlighted.from) === this.utils.getDate(date)
      );
    },
    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightEnd(date) {
      return (
        this.isHighlightedDate(date) &&
        this.highlighted.to instanceof Date &&
        this.utils.getFullYear(this.highlighted.to) ===
          this.utils.getFullYear(date) &&
        this.utils.getMonth(this.highlighted.to) ===
          this.utils.getMonth(date) &&
        this.utils.getDate(this.highlighted.to) === this.utils.getDate(date)
      );
    },
    /**
     * Helper
     * @param  {mixed}  prop
     * @return {Boolean}
     */
    isDefined(prop) {
      return typeof prop !== "undefined" && prop;
    }
  }
};
// eslint-disable-next-line
</script>
