<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showDayView"
    :style="calendarStyle" @mousedown.prevent>
    <slot name="beforeCalendarHeader"></slot>
    <header>
      <span
        @click="isRtl ? nextMonth() : previousMonth()"
        class="prev"
        :class="{'disabled': isLeftNavDisabled}">&lt;</span>
      
      <span
        @click="isRtl ? previousMonth() : nextMonth()"
        class="next"
        :class="{'disabled': isRightNavDisabled}">&gt;</span>
    </header>
    <div>
      <div v-for="month in months" :key="month.timestamp">
        <picker-day
          :pageDate="month.pageDate"
          :pageTimestamp="month.timestamp"
          :selectedDate="selectedDate"
          :fullMonthName="fullMonthName"
          :allowedToShowView="allowedToShowView"
          :disabledDates="disabledDates"
          :highlighted="highlighted"
          :translation="translation"
          :isRtl="isRtl"
          :mondayFirst="mondayFirst"
          :dayCellContent="dayCellContent"
          :use-utc="useUtc"
          @changedMonth="handleChangedMonthFromDayPicker"
          @selectDate="selectDate"
          @showMonthCalendar="showMonthCalendar"
          @selectedDisabled="selectDisabledDate">
          <slot name="beforeCalendarHeader" slot="beforeCalendarHeader"></slot>
        </picker-day>
      </div>
    </div>
  </div>
</template>
<script>
import { makeDateUtils } from '../utils/DateUtils'
import PickerDay from './PickerDay.vue'
export default {
  components: {
    PickerDay
  },
  props: {
    showDayView: Boolean,
    calendarClass: [String, Object, Array],
    calendarStyle: Object,

    // To PickerDay
    pageDate: Date,
    selectedDate: Date,
    fullMonthName: Boolean,
    allowedToShowView: Function,
    disabledDates: Object,
    highlighted: Object,
    translation: Object,
    pageTimestamp: Number,
    isRtl: Boolean,
    mondayFirst: Boolean,
    dayCellContent: {
      type: Function,
      default: day => day.date
    },
    useUtc: Boolean
  },
  data () {
    const constructedDateUtils = makeDateUtils(this.useUtc)
    return {
      utils: constructedDateUtils
    }
  },
  computed:{
    months () {
      const d = this.pageDate
      let months = []
      // set up a new date object to the beginning of the current 'page'
      let dObj = this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
        : new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes())
      
      for (let i = 0; i < 12; i++) {
        let timeStamp = dObj.getTime();
        months.push({
          pageDate: new Date(timeStamp),
          timestamp: timeStamp
          //isSelected: this.isSelectedMonth(dObj),
          //isDisabled: this.isDisabledMonth(dObj),
        })
        this.utils.setMonth(dObj, this.utils.getMonth(dObj) + 1)
      }
      return months
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
    
    /**
     * Handles a month change from the day picker
     */
    handleChangedMonthFromDayPicker (date) {
      this.$emit('changedMonth', date)
    },
    /**
     * @param {Object} date
     */
    selectDate (date) {
      this.$emit('selectDate', date)
    },
    /**
     * Show the month picker
     * @return {Boolean}
     */
    showMonthCalendar (date) {
      this.$emit('showMonthCalendar', date)
    },
    selectDisabledDate (date) {
      this.$emit('selectDisabledDate', date)
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
      return this.utils.getMonth(this.disabledDates.from) <= this.utils.getMonth(d) &&
        this.utils.getFullYear(this.disabledDates.from) <= this.utils.getFullYear(d)
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
      return this.utils.getMonth(this.disabledDates.to) >= this.utils.getMonth(d) &&
        this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(d)
    },
    /**
     * Change the page month
     * @param {Number} incrementBy
     */
    changeMonth (incrementBy) {
      let date = this.pageDate
      this.utils.setMonth(date, this.utils.getMonth(date) + incrementBy)
      console.log('change month', date)
      this.$emit('changedMonth', date)
    }
  },
}
</script>
