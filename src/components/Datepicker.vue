<template>
  <div class="vdp-datepicker" :class="[wrapperClass, isRtl ? 'rtl' : '']">
    <div :class="{'input-group' : bootstrapStyling}">
      <!-- Calendar Button -->
      <span v-if="calendarButton" class="vdp-datepicker__calendar-button" :class="{'input-group-addon' : bootstrapStyling}" @click="showCalendar" v-bind:style="{'cursor:not-allowed;' : disabledPicker}">
        <i :class="calendarButtonIcon">
          {{ calendarButtonIconContent }}
          <span v-if="!calendarButtonIcon">&hellip;</span>
        </i>
      </span>
      <!-- Input -->
      <input
        :type="inline ? 'hidden' : 'text'"
        :class="[ inputClass, { 'form-control' : bootstrapStyling } ]"
        :name="name"
        :ref="refName"
        :id="id"
        @click="showCalendar"
        :value="formattedValue"
        :open-date="openDate"
        :placeholder="placeholder"
        :clear-button="clearButton"
        :disabled="disabledPicker"
        :required="required"
        readonly>
      <!-- Clear Button -->
      <span v-if="clearButton && selectedDate" class="vdp-datepicker__clear-button" :class="{'input-group-addon' : bootstrapStyling}" @click="clearDate()">
        <i :class="clearButtonIcon">
          <span v-if="!clearButtonIcon">&times;</span>
        </i>
      </span>
    </div>

    <!-- Day View -->
    <template v-if="allowedToShowView('day')">
      <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showDayView" v-bind:style="calendarStyle">
          <header>
              <span
                  @click="isRtl ? nextMonth() : previousMonth()"
                  class="prev"
                  v-bind:class="{ 'disabled' : isRtl ? nextMonthDisabled(pageTimestamp) : previousMonthDisabled(pageTimestamp) }">&lt;</span>
              <span @click="showMonthCalendar" :class="allowedToShowView('month') ? 'up' : ''">{{ isYmd ? currYear : currMonthName }} {{ isYmd ? currMonthName : currYear }}</span>
              <span
                  @click="isRtl ? previousMonth() : nextMonth()"
                  class="next"
                  v-bind:class="{ 'disabled' : isRtl ? previousMonthDisabled(pageTimestamp) : nextMonthDisabled(pageTimestamp) }">&gt;</span>
          </header>
          <div :class="isRtl ? 'flex-rtl' : ''" @mouseleave="outCeils()">
            <span class="cell day-header" v-for="d in daysOfWeek" :key="d.timestamp">{{ d }}</span>
            <template v-if="blankDays > 0">
              <span class="cell day blank" v-for="d in blankDays" :key="d.timestamp"></span>
            </template><!--
            --><span class="cell day"
                v-for="day in daysCalc.days"
                :key="day.timestamp"
                track-by="timestamp"
                v-bind:style="day.style"
                v-bind:class="dayClasses(day)"
                @click="selectDate(day)"
                @mouseenter="setRangeSelect(day)"
                @mouseleave="outCeilStyle(day)">{{ day.date }}</span>
          </div>
      </div>
    </template>

    <!-- Month View -->
    <template v-if="allowedToShowView('month')">
      <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showMonthView" v-bind:style="calendarStyle">
          <header>
              <span
                  @click="previousYear"
                  class="prev"
                  v-bind:class="{ 'disabled' : previousYearDisabled(pageTimestamp) }">&lt;</span>
              <span @click="showYearCalendar" :class="allowedToShowView('year') ? 'up' : ''">{{ getPageYear() }}</span>
              <span
                  @click="nextYear"
                  class="next"
                  v-bind:class="{ 'disabled' : nextYearDisabled(pageTimestamp) }">&gt;</span>
          </header>
          <span class="cell month"
              v-for="month in months"
              :key="month.timestamp"
              track-by="timestamp"
              v-bind:class="{ 'selected': month.isSelected, 'disabled': month.isDisabled }"
              @click.stop="selectMonth(month)">{{ month.month }}</span>
      </div>
    </template>

    <!-- Year View -->
    <template v-if="allowedToShowView('year')">
      <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showYearView" v-bind:style="calendarStyle">
          <header>
              <span @click="previousDecade" class="prev"
                  v-bind:class="{ 'disabled' : previousDecadeDisabled(pageTimestamp) }">&lt;</span>
              <span>{{ getPageDecade() }}</span>
              <span @click="nextDecade" class="next"
                  v-bind:class="{ 'disabled' : nextMonthDisabled(pageTimestamp) }">&gt;</span>
          </header>
          <span
              class="cell year"
              v-for="year in years"
              :key="year.timestamp"
              track-by="timestamp"
              v-bind:class="{ 'selected': year.isSelected, 'disabled': year.isDisabled }"
              @click.stop="selectYear(year)">{{ year.year }}</span>
      </div>
    </template>
  </div>
</template>

<script>
import DateUtils from '@/utils/DateUtils.js'
import DateLanguages from '@/utils/DateLanguages.js'

export default {
  props: {
    value: {
      validator: function (val) {
        return val === null || val instanceof Date || typeof val === 'string' || typeof val === 'number'
      }
    },
    name: String,
    refName: String,
    id: String,
    format: {
      type: [String, Function],
      default: 'dd MMM yyyy'
    },
    language: {
      type: String,
      default: 'en'
    },
    openDate: {
      validator: function (val) {
        return val === null || val instanceof Date || typeof val === 'string'
      }
    },
    fullMonthName: Boolean,
    disabled: Object,
    highlighted: Object,
    placeholder: String,
    inline: Boolean,
    calendarClass: [String, Object],
    inputClass: [String, Object],
    wrapperClass: [String, Object],
    mondayFirst: Boolean,
    clearButton: Boolean,
    clearButtonIcon: String,
    calendarButton: Boolean,
    calendarButtonIcon: String,
    calendarButtonIconContent: String,
    bootstrapStyling: Boolean,
    initialView: String,
    disabledPicker: Boolean,
    required: Boolean,
    minimumView: {
      type: String,
      default: 'day'
    },
    maximumView: {
      type: String,
      default: 'year'
    },
    selectedColor: {
      type: String,
      default: '#4bd'
    },
    rangeSelected: Boolean
  },
  data () {
    const startDate = this.openDate ? new Date(this.openDate) : new Date()
    return {
      /*
       * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
       * This represents the first day of the current viewing month
       * {Number}
       */
      pageTimestamp: startDate.setDate(1),
      /*
       * Selected Date
       * {Date}
       */
      selectedDate: null,
      /*
       * Flags to show calendar views
       * {Boolean}
       */
      showDayView: false,
      showMonthView: false,
      showYearView: false,
      /*
       * Positioning
       */
      calendarHeight: 0,
      rangeSelect: {
        start: undefined,
        finish: undefined
      },
      daysObj: {
        days: []
      }
    }
  },
  watch: {
    value (value) {
      this.setValue(value)
    },
    openDate () {
      this.setPageDate()
    },
    initialView () {
      this.setInitialView()
    }
  },
  computed: {
    computedInitialView () {
      if (!this.initialView) {
        return this.minimumView
      }

      return this.initialView
    },
    pageDate () {
      return new Date(this.pageTimestamp)
    },
    formattedValue () {
      if (!this.selectedDate) {
        return null
      }

      return typeof this.format === 'function'
        ? this.format(this.selectedDate)
        : DateUtils.formatDate(new Date(this.selectedDate), this.format, this.translation)
    },
    translation () {
      return DateLanguages.translations[this.language]
    },
    currMonthName () {
      const monthName = this.fullMonthName ? this.translation.months.original : this.translation.months.abbr
      return DateUtils.getMonthNameAbbr(this.pageDate.getMonth(), monthName)
    },
    currYear () {
      return this.pageDate.getFullYear()
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
    daysOfWeek () {
      if (this.mondayFirst) {
        const tempDays = this.translation.days.slice()
        tempDays.push(tempDays.shift())
        return tempDays
      }
      return this.translation.days
    },
    daysCalc () {
      const d = this.pageDate
      this.daysObj.days = []
      // set up a new date object to the beginning of the current 'page'
      // let dObj = new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes())
      let dObj = new Date(d.getFullYear(), d.getMonth(), 1)
      let daysInMonth = DateUtils.daysInMonth(dObj.getFullYear(), dObj.getMonth())
      for (let i = 0; i < daysInMonth; i++) {
        this.daysObj.days.push({
          date: dObj.getDate(),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedDate(dObj),
          isDisabled: this.isDisabledDate(dObj),
          isHighlighted: this.isHighlightedDate(dObj),
          style: this.getDateColor(dObj),
          isHighlightStart: this.isHighlightStart(dObj),
          isHighlightEnd: this.isHighlightEnd(dObj),
          isToday: dObj.toDateString() === (new Date()).toDateString(),
          isWeekend: dObj.getDay() === 0 || dObj.getDay() === 6,
          isSaturday: dObj.getDay() === 6,
          isSunday: dObj.getDay() === 0
        })
        dObj.setDate(dObj.getDate() + 1)
      }
      return this.daysObj
    },
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
    calendarStyle () {
      return {
        position: this.isInline ? 'static' : undefined
      }
    },
    isOpen () {
      return this.showDayView || this.showMonthView || this.showYearView
    },
    isInline () {
      return !!this.inline
    },
    isRtl () {
      return this.translation.rtl === true
    },
    isYmd () {
      return this.translation.ymd === true
    }
  },
  methods: {
    /**
     * Close all calendar layers
     */
    close (full) {
      this.showDayView = this.showMonthView = this.showYearView = false
      if (!this.isInline) {
        if (full) this.$emit('closed')
        document.removeEventListener('click', this.clickOutside, false)
      }
    },
    resetDefaultDate () {
      if (this.selectedDate === null) {
        this.setPageDate()
        return
      }
      this.setPageDate(this.selectedDate)
    },
    /**
     * Effectively a toggle to show/hide the calendar
     * @return {mixed} [description]
     */
    showCalendar () {
      if (this.disabledPicker || this.isInline) {
        return false
      }
      if (this.isOpen) {
        return this.close(true)
      }
      this.setInitialView()
      if (!this.isInline) {
        this.$emit('opened')
      }
    },
    setInitialView () {
      const initialView = this.computedInitialView

      if (!this.allowedToShowView(initialView)) {
        throw new Error(`initialView '${this.initialView}' cannot be rendered based on minimum '${this.minimumView}' and maximum '${this.maximumView}'`)
      }

      switch (initialView) {
        case 'year':
          this.showYearCalendar()
          break
        case 'month':
          this.showMonthCalendar()
          break
        default:
          this.showDayCalendar()
          break
      }
    },
    allowedToShowView (view) {
      const views = ['day', 'month', 'year']
      const minimumViewIndex = views.indexOf(this.minimumView)
      const maximumViewIndex = views.indexOf(this.maximumView)
      const viewIndex = views.indexOf(view)

      return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex
    },
    showDayCalendar () {
      if (!this.allowedToShowView('day')) return false

      this.close()
      this.showDayView = true
      this.addOutsideClickListener()
    },
    showMonthCalendar () {
      if (!this.allowedToShowView('month')) return false

      this.close()
      this.showMonthView = true
      this.addOutsideClickListener()
    },
    showYearCalendar () {
      if (!this.allowedToShowView('year')) return false

      this.close()
      this.showYearView = true
      this.addOutsideClickListener()
    },
    addOutsideClickListener () {
      if (!this.isInline) {
        setTimeout(() => {
          document.addEventListener('click', this.clickOutside, false)
        }, 100)
      }
    },
    setDate (timestamp) {
      const date = new Date(timestamp)
      this.selectedDate = new Date(date)
      this.setPageDate(date)
      this.$emit('selected', new Date(date))
      this.$emit('input', new Date(date))
    },
    setRangeDate (timestamp) {
      const date = new Date(timestamp)
      if (typeof this.rangeSelect.start === 'undefined' || typeof this.rangeSelect.finish !== 'undefined') {
        if (typeof this.rangeSelect.finish !== 'undefined') {
          this.unmarkRangeSelect(this.rangeSelect.start, this.rangeSelect.finish)
        }
        this.rangeSelect.start = date
        this.rangeSelect.finish = undefined
      } else {
        this.rangeSelect.finish = date
        this.$emit('selectedRange', this.rangeSelect)
      }
    },
    clearDate () {
      this.selectedDate = null
      this.$emit('selected', null)
      this.$emit('input', null)
      this.$emit('cleared')
    },
    /**
     * @param {Object} day
     */
    selectDate (day) {
      if (day.isDisabled) {
        this.$emit('selectedDisabled', day)
        return false
      }
      if (this.rangeSelected) {
        this.setRangeDate(day.timestamp)
      } else {
        this.setDate(day.timestamp)
      }
      if (!this.isInline) {
        this.close(true)
      }
    },
    maxMarkRangeSelect (start) {
      let i
      let day = DateUtils.daysInMonth(start.getFullYear(), start.getMonth())
      let date = new Date(start.getFullYear(), start.getMonth(), day)

      for (i = 0; i < this.daysObj.days.length; i++) {
        if (this.daysObj.days[i].isHighlighted) {
          if (this.daysObj.days[i].timestamp >= start.getTime()) {
            date = new Date(this.daysObj.days[i].timestamp)
            date.setDate(date.getDate() - 1)
            break
          }
        }
      }

      return date
    },
    markRangeSelect (start, finish) {
      let i = 0
      let dt
      let st = start.getTime()
      let fn = this.maxMarkRangeSelect(start).getTime()

      if (this.daysObj.days.length === 0) {
        return false
      }

      for (i = 0; i < this.daysObj.days.length; i++) {
        dt = new Date(this.daysObj.days[i].timestamp).getTime()
        if (st <= dt && fn >= dt) {
          this.daysObj.days[i].style.background = ''
        }
      }

      if (finish.getTime() < fn) {
        fn = finish.getTime()
      }

      if (st > fn) {
        this.rangeSelect.start = undefined
        this.rangeSelect.finish = undefined
        this.rangeSelect.enter = undefined
        return false
      }

      i = 0
      dt = new Date(this.daysObj.days[0].timestamp).getTime()
      while (dt <= fn) {
        if (dt >= st) {
          this.daysObj.days[i].style.background = this.selectedColor
        }

        i++
        if (i < this.daysObj.days.length) {
          dt = new Date(this.daysObj.days[i].timestamp).getTime()
        } else {
          dt++
        }
      }
    },
    unmarkRangeSelect (start, finish) {
      let dt
      let st = start.getTime()
      let fn = finish.getTime()

      for (let i = 0; i < this.daysObj.days.length; i++) {
        dt = new Date(this.daysObj.days[i].timestamp).getTime()
        if (st <= dt && fn >= dt) {
          this.daysObj.days[i].style.background = ''
        }
      }
    },
    setRangeSelect (day) {
      day.style.border = '1px solid ' + this.selectedColor
      if (!this.rangeSelected) {
        return false
      }
      if (typeof this.rangeSelect.start !== 'undefined' && typeof this.rangeSelect.finish === 'undefined') {
        this.markRangeSelect(this.rangeSelect.start, new Date(day.timestamp))
      }
    },
    outCeilStyle (day) {
      day.style.border = ''
    },
    outCeils () {
      if (!this.rangeSelected) {
        return false
      }

      if (typeof this.rangeSelect.start !== 'undefined' && typeof this.rangeSelect.finish === 'undefined') {
        let finish = this.maxMarkRangeSelect(this.rangeSelect.start)
        this.unmarkRangeSelect(this.rangeSelect.start, finish)

        this.rangeSelect.start = undefined
        this.rangeSelect.finish = undefined
        this.rangeSelect.enter = undefined
      }
    },
    /**
     * @param {Object} month
     */
    selectMonth (month) {
      if (month.isDisabled) {
        return false
      }

      const date = new Date(month.timestamp)
      if (this.allowedToShowView('day')) {
        this.setPageDate(date)
        this.$emit('changedMonth', month)
        this.showDayCalendar()
      } else {
        this.setDate(date)
        if (!this.isInline) {
          this.close(true)
        }
      }
    },
    /**
     * @param {Object} year
     */
    selectYear (year) {
      if (year.isDisabled) {
        return false
      }

      const date = new Date(year.timestamp)
      if (this.allowedToShowView('month')) {
        this.setPageDate(date)
        this.$emit('changedYear', year)
        this.showMonthCalendar()
      } else {
        this.setDate(date)
        if (!this.isInline) {
          this.close(true)
        }
      }
    },
    /**
     * @return {Number}
     */
    getPageDate () {
      return this.pageDate.getDate()
    },
    /**
     * @return {Number}
     */
    getPageMonth () {
      return this.pageDate.getMonth()
    },
    /**
     * @return {Number}
     */
    getPageYear () {
      return this.pageDate.getFullYear()
    },
    /**
     * @return {String}
     */
    getPageDecade () {
      const decadeStart = Math.floor(this.pageDate.getFullYear() / 10) * 10
      const decadeEnd = decadeStart + 9
      return `${decadeStart} - ${decadeEnd}`
    },
    changeMonth (incrementBy) {
      let date = this.pageDate
      date.setMonth(date.getMonth() + incrementBy)
      this.setPageDate(date)
      this.$emit('changedMonth', date)
    },
    previousMonth () {
      if (!this.previousMonthDisabled()) {
        this.changeMonth(-1)
      }
    },
    previousMonthDisabled () {
      if (!this.disabled || !this.disabled.to) {
        return false
      }
      let d = this.pageDate
      return this.disabled.to.getMonth() >= d.getMonth() &&
        this.disabled.to.getFullYear() >= d.getFullYear()
    },
    nextMonth () {
      if (!this.nextMonthDisabled()) {
        this.changeMonth(+1)
      }
    },
    nextMonthDisabled () {
      if (!this.disabled || !this.disabled.from) {
        return false
      }
      let d = this.pageDate
      return this.disabled.from.getMonth() <= d.getMonth() &&
        this.disabled.from.getFullYear() <= d.getFullYear()
    },
    changeYear (incrementBy, emit = 'changedYear') {
      let date = this.pageDate
      date.setYear(date.getFullYear() + incrementBy)
      this.setPageDate(date)
      this.$emit(emit, date)
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
    previousDecade () {
      if (!this.previousDecadeDisabled()) {
        this.changeYear(-10, 'changeDecade')
      }
    },
    previousDecadeDisabled () {
      if (!this.disabled || !this.disabled.to) {
        return false
      }
      return Math.floor(this.disabled.to.getFullYear() / 10) * 10 >= Math.floor(this.pageDate.getFullYear() / 10) * 10
    },
    nextDecade () {
      if (!this.nextDecadeDisabled()) {
        this.changeYear(10, 'changeDecade')
      }
    },
    nextDecadeDisabled () {
      if (!this.disabled || !this.disabled.from) {
        return false
      }
      return Math.ceil(this.disabled.from.getFullYear() / 10) * 10 <= Math.ceil(this.pageDate.getFullYear() / 10) * 10
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
      let disabled = false

      if (typeof this.disabled === 'undefined') {
        return false
      }

      if (typeof this.disabled.dates !== 'undefined') {
        this.disabled.dates.forEach((d) => {
          if (date.toDateString() === d.toDateString()) {
            disabled = true
            return true
          }
        })
      }
      if (typeof this.disabled.to !== 'undefined' && this.disabled.to && date < this.disabled.to) {
        disabled = true
      }
      if (typeof this.disabled.from !== 'undefined' && this.disabled.from && date > this.disabled.from) {
        disabled = true
      }
      if (typeof this.disabled.ranges !== 'undefined') {
        this.disabled.ranges.forEach((range) => {
          if (typeof range.from !== 'undefined' && range.from && typeof range.to !== 'undefined' && range.to) {
            if (date < range.to && date > range.from) {
              disabled = true
              return true
            }
          }
        })
      }
      if (typeof this.disabled.days !== 'undefined' && this.disabled.days.indexOf(date.getDay()) !== -1) {
        disabled = true
      }
      if (typeof this.disabled.daysOfMonth !== 'undefined' && this.disabled.daysOfMonth.indexOf(date.getDate()) !== -1) {
        disabled = true
      }
      if (typeof this.disabled.customPredictor === 'function' && this.disabled.customPredictor(date)) {
        disabled = true
      }
      return disabled
    },
    /**
     * Whether a day is highlighted (only if it is not disabled already)
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightedDate (date) {
      if (this.isDisabledDate(date)) {
        return false
      }

      let highlighted = false

      if (typeof this.highlighted === 'undefined') {
        return false
      }

      if (typeof this.highlighted.dateColor !== 'undefined') {
        for (let i = 0; i < this.highlighted.dateColor.length; i++) {
          if (date.toDateString() === this.highlighted.dateColor[i].date.toDateString()) {
            highlighted = true
            return true
          }
        }
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
    getDateColor (date) {
      let result = {
        background: '',
        border: ''
      }
      if (typeof this.highlighted !== 'undefined') {
        if (typeof this.highlighted.dateColor !== 'undefined') {
          this.highlighted.dateColor.forEach((d) => {
            if (date.toDateString() === d.date.toDateString()) {
              result.background = d.color
              return result
            }
          })
        }
      } else {
        if (this.isSelectedDate(date)) {
          result.background = this.selectedColor
        }
      }
      return result
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
    },
    /**
     * Set the datepicker value
     * @param {Date|String|Number|null} date
     */
    setValue (date) {
      if (typeof date === 'string' || typeof date === 'number') {
        let parsed = new Date(date)
        date = isNaN(parsed.valueOf()) ? null : parsed
      }
      if (!date) {
        this.setPageDate()
        this.selectedDate = null
        return
      }
      this.selectedDate = date
      this.setPageDate(date)
    },
    setPageDate (date) {
      if (!date) {
        if (this.openDate) {
          date = new Date(this.openDate)
        } else {
          date = new Date()
        }
      }
      this.pageTimestamp = (new Date(date)).setDate(1)
    },
    /**
     * Close the calendar if clicked outside the datepicker
     * @param  {Event} event
     */
    clickOutside (event) {
      if (this.$el && !this.$el.contains(event.target)) {
        if (this.isInline) {
          return this.showDayCalendar()
        }
        this.resetDefaultDate()
        this.close(true)
        document.removeEventListener('click', this.clickOutside, false)
      }
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
    init () {
      if (this.value) {
        this.setValue(this.value)
      }
      if (this.isInline) {
        this.setInitialView()
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="stylus">

$width = 300px

.rtl
    direction:rtl
.vdp-datepicker
    position relative
    text-align left
    *
        box-sizing border-box

.vdp-datepicker__calendar
    position absolute
    z-index 100
    background white
    width $width
    border 1px solid #ccc
    header
        display block
        line-height 40px
        span
            display inline-block
            text-align center
            width (100 - (100/7)*2)%
            float left

        .prev
        .next
            width (100/7)%
            float left
            text-indent -10000px
            position relative
            &:after
                content ''
                position absolute
                left 50%
                top 50%
                transform translateX(-50%) translateY(-50%)
                border 6px solid transparent

        .prev
            &:after
                border-right 10px solid #000
                margin-left -5px
            &.disabled:after
                border-right 10px solid #ddd
        .next
            &:after
                border-left 10px solid #000
                margin-left 5px
            &.disabled:after
                border-left 10px solid #ddd

        .prev:not(.disabled)
        .next:not(.disabled)
        .up:not(.disabled)
            cursor pointer
            &:hover
                background #eee

    .disabled
        color #ddd
        cursor default
    .flex-rtl
        display flex
        width inherit
        flex-wrap wrap

    .cell
        display inline-block
        padding 0 5px
        width (100/7)%
        height 40px
        line-height 40px
        text-align center
        vertical-align middle
        border 1px solid transparent
        &:not(.blank):not(.disabled).day
        &:not(.blank):not(.disabled).month
        &:not(.blank):not(.disabled).year
            cursor pointer
        &.highlighted
            background #cae5ed
        &.grey
            color #888

            &:hover
                background inherit


        &.day-header
            font-size 75%
            white-space no-wrap
            cursor inherit
            &:hover
                background inherit

    .month,
    .year
        width 33.333%

.vdp-datepicker__clear-button
.vdp-datepicker__calendar-button
    cursor pointer
    font-style normal
    &.disabled
      color #999
      cursor default
</style>
