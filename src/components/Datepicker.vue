<template>
  <div class="dvdp-datepicker" :class="[wrapperClass, isRtl ? 'rtl' : '']" @mouseleave="onMouseleave" @mouseup="onMouseup">
    <date-input
      :selectedDate="selectedDate"
      :resetTypedDate="resetTypedDate"
      :format="format"
      :translation="translation"
      :inline="inline"
      :id="id"
      :name="name"
      :refName="refName"
      :openDate="openDate"
      :placeholder="placeholder"
      :inputClass="inputClass"
      :typeable="typeable"
      :clearButton="clearButton"
      :clearButtonIcon="clearButtonIcon"
      :calendarButton="calendarButton"
      :calendarButtonIcon="calendarButtonIcon"
      :calendarButtonIconContent="calendarButtonIconContent"
      :disabled="disabled"
      :required="required"
      :bootstrapStyling="bootstrapStyling"
      :use-utc="useUtc"
      :showDayView="showDayView"
      @showCalendar="showCalendar"
      @toggleCalendar="toggleCalendar"
      @closeCalendar="close"
      @typedDate="setTypedDate"
      @clearDate="clearDate">
      <slot name="afterDateInput" slot="afterDateInput"></slot>
    </date-input>


    <!-- Day View -->
    <picker-day-wrap
      v-if="showDayView"
      :pageDate="pageDate"
      :selectedDate="selectedDate"
      :fullMonthName="fullMonthName"
      :disabledDates="disabledDates"
      :highlighted="highlighted"
      :calendarClass="calendarClass"
      :calendarStyle="calendarStyle"
      :translation="translation"
      :pageTimestamp="pageTimestamp"
      :indexOfRange="indexOfRange"
      :mouseOverDateTimestamp="mouseOverDateTimestamp"
      :isRtl="isRtl"
      :mondayFirst="mondayFirst"
      :use-utc="useUtc"
      :cols="cols"
      :rows="rows"
      :show-monthes-select="showMonthesSelect"
      :is-range="isRange"
      :rangeSliderMode="rangeSliderMode"
      @changedMonth="handleChangedMonthFromDayPicker"
      @selectDate="selectDate"
      @mouseOverDate="mouseOverDate"
      @dayMouseDown="dayMouseDown"
      @dayMouseUp="dayMouseUp"
      @selectedDisabled="selectDisabledDate">
      <slot name="beforeCalendarHeader" slot="beforeCalendarHeader"></slot>
      <slot name="dayCellContent" slot="dayCellContent" slot-scope="slotData" v-bind="slotData"></slot>
    </picker-day-wrap>

  </div>
</template>
<script>
import en from '../locale/translations/en'
import DateInput from './DateInput.vue'
import PickerDayWrap from './PickerDayWrap.vue'
import utils, { makeDateUtils } from '../utils/DateUtils'
let clickOutsideEvent;
export default {
  components: {
    DateInput,
    PickerDayWrap
  },
  props: {
    value: {
      validator: val => utils.validateDateInput(val)
    },
    name: String,
    refName: String,
    id: String,
    format: {
      type: [String, Function],
      default: 'dd MMM yyyy'
    },
    language: {
      type: Object,
      default: () => en
    },
    openDate: Number,
    fullMonthName: Boolean,
    disabledDates: Object,
    highlighted: Object,
    placeholder: String,
    inline: Boolean,
    calendarClass: [String, Object, Array],
    inputClass: [String, Object, Array],
    wrapperClass: [String, Object, Array],
    mondayFirst: Boolean,
    clearButton: Boolean,
    clearButtonIcon: String,
    calendarButton: Boolean,
    calendarButtonIcon: String,
    calendarButtonIconContent: String,
    bootstrapStyling: Boolean,
    initialView: String,
    disabled: Boolean,
    required: Boolean,
    typeable: Boolean,
    useUtc: Boolean,
    cols: {
      type: Number,
      default: () => 2
    },
    rows: {
      type: Number,
      default: () => 1
    },
    showMonthesSelect: Boolean,
    isRange: Boolean,
    isMobile: Boolean
  },
  data () {
    const startDate = this.openDate ? new Date(this.openDate) : new Date()
    const constructedDateUtils = makeDateUtils(this.useUtc)
    const pageTimestamp = constructedDateUtils.setDate(startDate, 1)
    return {
      /**
       * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
       * This represents the first day of the current viewing month
       * {Number}
       */
      pageTimestamp,
      /*
       * Selected Date
       * {Date}
       */
      selectedDate: null,
      /**
       * Flags to show calendar views
       * {Boolean}
       */
      showDayView: false,
      /**
       * Positioning
       */
      calendarHeight: 0,
      resetTypedDate: new Date(),
      utils: constructedDateUtils,

      /**
       * Номер текущего выбираемого элемента (если диапазон)
       */
      indexOfRange: 0,
      /**
       * Timestamp даты, на которую навели курсором
       */
      mouseOverDateTimestamp: undefined,
      /**
       * Если включился режим "ползунка" для даты range-a, здесь храним 0 или 1 в зависимости от начало/конец диапазона
       */
      rangeSliderMode: undefined,
      /**
       * Запоминаем дату, на которую изначально "нажали" курсором
       */
      mouseClickOnDate: undefined
    }
  },
  watch: {
    value (value) {
      this.setValue(value)
    },
    openDate () {
      this.setPageDate()
    },
    pageTimestamp:  function(newVal, oldVal){
      this.$emit('changePage', newVal);
    }
  },
  computed: {
    pageDate () {
      return new Date(this.pageTimestamp)
    },

    translation () {
      return this.language
    },

    calendarStyle () {
      return {
        position: this.isInline ? 'relative' : undefined,
        "z-index": this.isInline ? 'auto' : undefined
      }
    },
    isOpen () {
      return this.showDayView
    },
    isInline () {
      return !!this.inline
    },
    isRtl () {
      return this.translation.rtl === true
    }
  },
  methods: {
    /**
     * Called in the event that the user navigates to date pages and
     * closes the picker without selecting a date.
     */
    resetDefaultPageDate () {
      if (this.selectedDate === null) {
        this.setPageDate()
        return
      }
      this.setPageDate(this.selectedDate)
    },
    /**
     * Effectively a toggle to show/hide the calendar
     * @return {mixed}
     */
    toggleCalendar () {
      if (this.disabled || this.isInline) {
        return false
      }
      if (this.isOpen) {
        return this.close(true)
      }
      this.setInitialView()
    },
    /**
     * Effectively a toggle to show/hide the calendar
     * @return {mixed}
     */
    showCalendar () {
      if (this.disabled || this.isInline) {
        return false
      }
      if (this.isOpen) return;
      this.setInitialView()
    },
    /**
     * Sets the initial picker page view: day, month or year
     */
    setInitialView () {
      this.indexOfRange = 0;
      this.showDayCalendar()
    },
    /**
     * Show the day picker
     * @return {Boolean}
     */
    showDayCalendar () {
      this.close()
      this.showDayView = true
      return true
    },
    /**
     * Set the selected date
     * @param {Number} timestamp
     * @param {Number} indexOfRange если range - индекс устанавливаемого значения (0 - начало, 1 - конец)
     */
    setDate (timestamp, indexOfRange = 0) {
      const date = new Date(timestamp)
      if (this.selectedDate instanceof Array) {
        //Если range
        if (indexOfRange == 0){
          //Если устанавливаем первую дату range-a, то автоматом сбрасываем вторую дату
          this.$set(this.selectedDate, 0, date);
          this.$set(this.selectedDate, 1, date);
        }else{
          this.selectedDate[indexOfRange] = date;
          this.selectedDate = this.selectedDate.sort(function(a,b){return a.getTime() - b.getTime()});
          this.$emit('selected', this.selectedDate)
        }
      }else{
        
        this.selectedDate = date
        this.$emit('selected', this.selectedDate)
      }
      //Не меняем дату страницы, т.к. прыгает при нескольких календарях
      //this.setPageDate(date)
      this.$emit('input', this.selectedDate)
    },
    /**
     * Clear the selected date
     */
    clearDate () {
      this.selectedDate = null
      this.setPageDate()
      this.$emit('selected', null)
      this.$emit('input', null)
      this.$emit('cleared')
    },
    /**
     * @param {Object} date
     */
    selectDate (date) {
      this.setDate(date.timestamp, this.indexOfRange);
      if (!this.isInline && (!this.isRange || this.indexOfRange == 1)) {
        this.close(true)
      }
      this.resetTypedDate = new Date();
      if (this.isRange){
        if (!this.isMobile) this.indexOfRange++;
        if (this.indexOfRange > 1) this.indexOfRange = 0;
      }
    },
    /**
     * @param {Object} date
     */
    selectDisabledDate (date) {
      this.$emit('selectedDisabled', date)
    },
    /**
     * Навели на дату курсором
     * @param {Object} date
     */
    mouseOverDate (date) {
      if (!!this.mouseClickOnDate && typeof(this.rangeSliderMode) === "undefined"){
        if (this.mouseClickOnDate.isRangeStart){
          this.rangeSliderMode = 0;
        }else if (this.mouseClickOnDate.isRangeEnd){
          this.rangeSliderMode = 1;
        }
      }
      if (typeof(this.rangeSliderMode) !== 'undefined'){
          //Если включен режим перетягивания ползунка range-a
          let d = new Date(date.timestamp);
          //Проверяем, что бы дата не выходила на макс/мин диапазоны
          if (typeof this.disabledDates !== 'undefined') {
            if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to && d.getTime() < this.disabledDates.to) {
              d = new Date(this.utils.getCompareTime(this.disabledDates.to));
              d.setDate(d.getDate() + 1);
            }
            if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from && d.getTime() > this.disabledDates.from) {
              d = new Date(this.utils.getCompareTime(this.disabledDates.from));
            }
          }
          this.selectedDate[this.rangeSliderMode] = d;
          this.selectedDate = this.selectedDate.sort(function(a,b){return a.getTime() - b.getTime()});
          this.rangeSliderMode = this.selectedDate.indexOf(d);
      }else{
        this.mouseOverDateTimestamp = date.timestamp;
      }
    },
    /**
     * Нажали клавишу мыши на дате
     * @param {Object} date
     */
    dayMouseDown (date) {
      this.mouseClickOnDate = date;
      //this.rangeSliderMode = sliderPosition;
    },
    /**
     * Отпустили клавишу мыши на дате
     * @param {Object} date
     */
    dayMouseUp (date) {
      this.mouseClickOnDate = undefined;
      this.rangeSliderMode = undefined;
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
      //Не меняем дату страницы, если установлена общая дата страницы (для нескольких календарей)
      //Не меняем страницу, если включен режим "ползунков", т.е. перемещения дат
      if (!this.openDate && typeof(this.rangeSliderMode) === "undefined") 
        this.setPageDate(date)
    },
    /**
     * Sets the date that the calendar should open on
     */
    setPageDate (date) {
      if (date instanceof Array) date = date[0];
      if (!date) {
        if (this.openDate) {
          date = new Date(this.openDate)
        } else {
          date = new Date()
        }
      }
      this.pageTimestamp = this.utils.setDate(new Date(date), 1)
    },
    /**
     * Handles a month change from the day picker
     */
    handleChangedMonthFromDayPicker (date) {
      this.setPageDate(date)
      this.$emit('changedMonth', date)
    },
    /**
     * Set the date from a typedDate event
     */
    setTypedDate (date) {
      this.setDate(date.getTime())
    },
    /**
     * Close all calendar layers
     * @param {Boolean} emitEvent - emit close event
     */
    close (emitEvent) {
      this.showDayView = false
      if (!this.isInline) {
        if (emitEvent) {
          this.$emit('closed')
        }
        document.removeEventListener('click', this.clickOutside, false)
      }
    },
    /**
     * Initiate the component
     */
    init () {
      if (this.value) {
        this.setValue(this.value)
      }
      if (this.isInline) {
        this.setInitialView()
      }
    },

    /**
     * При уходе мышки с компонента в целом
     */
    onMouseleave () {
      this.mouseOverDateTimestamp = undefined;
      this.rangeSliderMode = undefined;
    },
    /**
     * Если "отжали" клавишу мышки на компоненте в целом
     */
    onMouseup (e) {
      this.rangeSliderMode = undefined;
      this.mouseClickOnDate = undefined;
      this.mouseOverDateTimestamp = undefined;
    }
  },
  mounted () {
    this.init();
    if (!this.isInline) {
      clickOutsideEvent = (event) => {
        // here I check that click was outside the el and his children
        if (!(this.$el == event.target || this.$el.contains(event.target))) {
          if (this.isOpen){
            this.close();
          }
        }
      };
      document.body.addEventListener('click', clickOutsideEvent);
    }
  },
  destroyed (){
    if (!this.isInline) {
      document.removeEventListener('click', clickOutsideEvent);
    }
  }
}
// eslint-disable-next-line
;
</script>
<style lang="stylus">
@import '../styles/style'
</style>
