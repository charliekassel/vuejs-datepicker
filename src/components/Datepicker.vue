<template>
  <div
    class="vdp-datepicker"
    :class="[wrapperClass, isRtl ? 'rtl' : '']"
  >
    <date-input
      :id="id"
      ref="input"
      :selected-date="selectedDate"
      :reset-typed-date="resetTypedDate"
      :format="format"
      :translation="translation"
      :inline="inline"
      :name="name"
      :ref-name="refName"
      :open-date="openDate"
      :placeholder="placeholder"
      :input-class="inputClass"
      :typeable="typeable"
      :clear-button="clearButton"
      :clear-button-icon="clearButtonIcon"
      :calendar-button="calendarButton"
      :calendar-button-icon="calendarButtonIcon"
      :calendar-button-icon-content="calendarButtonIconContent"
      :disabled="disabled"
      :required="required"
      :bootstrap-styling="bootstrapStyling"
      :use-utc="useUtc"
      :is-open="isOpen"
      :active-grid-id="activeGridId"
      @showCalendar="showCalendar"
      @typedDate="setTypedDate"
      @clearDate="clearDate"
    >
      <slot
        slot="afterDateInput"
        name="afterDateInput"
      />
    </date-input>

    <div
      v-if="modal && isOpen"
      class="vdp-datepicker__overlay"
    />

    <!-- Day View -->
    <picker-day
      v-if="allowedToShowView('day')"
      :page-date="pageDate"
      :selected-date="selectedDate"
      :show-day-view="showDayView"
      :full-month-name="fullMonthName"
      :allowed-to-show-view="allowedToShowView"
      :clear-date="clearDate"
      :set-page-date="setPageDate"
      :disabled-dates="disabledDates"
      :highlighted="highlighted"
      :calendar-class="calendarClass"
      :calendar-style="calendarStyle"
      :translation="translation"
      :page-timestamp="pageTimestamp"
      :focused-date.sync="focusedDate"
      :is-rtl="isRtl"
      :monday-first="mondayFirst"
      :modal="modal"
      :day-cell-content="dayCellContent"
      :use-utc="useUtc"
      :footer-class="footerClass"
      :today-button-class="todayButtonClass"
      :clear-button-class="clearButtonClass"
      :show-footer="showFooter"
      :side-by-side="sideBySide"
      :is-initialized="isInitialized"
      :highlight-date="highlightDate"
      @changedMonth="handleChangedMonthFromDayPicker"
      @selectDate="selectDate"
      @showMonthCalendar="showMonthCalendar"
      @selectedDisabled="selectDisabledDate"
      @keydown.esc.prevent="close(true)"
      @keydown.tab="focusNextElement($event)"
    >
      <slot
        slot="beforeCalendarHeader"
        name="beforeCalendarHeader"
      />
      <slot
        slot="afterCalendarContent"
        name="afterCalendarContent"
      />
      <slot
        slot="footer"
        name="footer"
        :on-tab="(event) => focusNextElement(event)"
      />
    </picker-day>

    <!-- Month View -->
    <picker-month
      v-if="allowedToShowView('month')"
      :class="{'vdp-datepicker__calendar--side-by-side': sideBySide}"
      :page-date="pageDate"
      :focused-date.sync="focusedDate"
      :selected-date="selectedDate"
      :show-month-view="showMonthView"
      :allowed-to-show-view="allowedToShowView"
      :disabled-dates="disabledDates"
      :calendar-class="calendarClass"
      :calendar-style="calendarStyle"
      :modal="modal"
      :translation="translation"
      :is-rtl="isRtl"
      :use-utc="useUtc"
      :is-initialized="isInitialized"
      @selectMonth="selectMonth"
      @showYearCalendar="showYearCalendar"
      @changedYear="setPageDate"
      @keydown.esc.prevent="close(true)"
      @keydown.tab="focusNextElement($event)"
    >
      <slot
        slot="beforeCalendarHeader"
        name="beforeCalendarHeader"
      />
      <slot
        slot="afterCalendarContent"
        name="afterCalendarContent"
      />
    </picker-month>

    <!-- Year View -->
    <picker-year
      v-if="allowedToShowView('year')"
      :class="{'vdp-datepicker__calendar--side-by-side': sideBySide}"
      :page-date="pageDate"
      :focused-date.sync="focusedDate"
      :selected-date="selectedDate"
      :show-year-view="showYearView"
      :allowed-to-show-view="allowedToShowView"
      :disabled-dates="disabledDates"
      :calendar-class="calendarClass"
      :calendar-style="calendarStyle"
      :translation="translation"
      :modal="modal"
      :is-rtl="isRtl"
      :use-utc="useUtc"
      :is-initialized="isInitialized"
      @selectYear="selectYear"
      @changedDecade="setPageDate"
      @keydown.esc.prevent="close(true)"
      @keydown.tab="focusNextElement($event)"
    >
      <slot
        slot="beforeCalendarHeader"
        name="beforeCalendarHeader"
      />
      <slot
        slot="afterCalendarContent"
        name="afterCalendarContent"
      />
    </picker-year>
  </div>
</template>
<script>
import en from '../locale/translations/en';
import DateInput from './DateInput.vue';
import PickerDay from './PickerDay.vue';
import PickerMonth from './PickerMonth.vue';
import PickerYear from './PickerYear.vue';
import utils, { makeDateUtils } from '../utils/DateUtils';
import { ELEMENT_IDS } from '../config/ElementIds';
import { getFocusableChildren } from '../utils/FocusableElements';
export default {
  name: 'DatePicker',
  components: {
    DateInput,
    PickerDay,
    PickerMonth,
    PickerYear,
  },
  props: {
    bootstrapStyling: Boolean,
    calendarButton: Boolean,
    calendarButtonIcon: String,
    calendarButtonIconContent: String,
    calendarClass: [ String, Object, Array ],
    clearButtonClass: [ String, Object, Array ],
    clearButton: Boolean,
    clearButtonIcon: String,
    dayCellContent: Function,
    disabled: Boolean,
    disabledDates: Object,
    format: {
      type: [ String, Function ],
      default: 'dd MMM yyyy',
    },
    footerClass: [ String, Object, Array ],
    fullMonthName: Boolean,
    highlighted: Object,
    id: String,
    initialView: String,
    inline: Boolean,
    inputClass: [ String, Object, Array ],
    language: {
      type: Object,
      default: () => en,
    },
    maximumView: {
      type: String,
      default: 'year',
    },
    minimumView: {
      type: String,
      default: 'day',
    },
    modal: Boolean,
    mondayFirst: Boolean,
    name: String,
    openDate: {
      validator: val => utils.validateDateInput(val),
    },
    placeholder: String,
    refName: String,
    required: Boolean,
    showFooter: Boolean,
    todayButtonClass: [ String, Object, Array ],
    typeable: Boolean,
    useUtc: Boolean,
    value: {
      validator: val => utils.validateDateInput(val),
    },
    wrapperClass: [ String, Object, Array ],
    sideBySide: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    const startDate = this.openDate ? new Date(this.openDate) : new Date();
    const focusedDate = startDate.getTime();
    const constructedDateUtils = makeDateUtils(this.useUtc);
    const pageTimestamp = constructedDateUtils.setDate(startDate, 1);
    return {
      /*
       * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
       * This represents the first day of the current viewing month
       * {Number}
       */
      focusedDate,
      pageTimestamp,
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
      resetTypedDate: new Date(),
      utils: constructedDateUtils,
      isInitialized : false,
    };
  },
  computed: {
    activeGridId() {
      if (this.showDayView) return ELEMENT_IDS.dayGrid;
      if (this.showMonthView) return ELEMENT_IDS.monthGrid;
      if (this.showYearView) return ELEMENT_IDS.yearGrid;
      return null;
    },
    computedInitialView () {
      if (!this.initialView) {
        return this.minimumView;
      }

      return this.initialView;
    },
    pageDate () {
      return new Date(this.pageTimestamp);
    },

    translation () {
      return this.language;
    },

    calendarStyle () {
      return {
        position: this.isInline ? 'static' : undefined,
      };
    },
    isOpen () {
      return this.showDayView || this.showMonthView || this.showYearView;
    },
    isInline () {
      return !!this.inline;
    },
    isRtl () {
      return this.translation.rtl === true;
    },
  },
  watch: {
    value (value) {
      this.setValue(value);
    },
    openDate () {
      this.setPageDate();
      this.focusedDate = this.openDate.getTime();
    },
    initialView () {
      this.setInitialView();
    },
  },
  mounted () {
    this.init();
  },
  methods: {
    focusNextElement (event) {
      if (this.isInline) return;

      const focusableElements = getFocusableChildren(this.$el);
      const activeFocusableElements = [ ...focusableElements ].filter((element) => element.matches('.visible *'));
      const lastFocusableElement = activeFocusableElements[activeFocusableElements.length - 1];

      if (!event.shiftKey && lastFocusableElement === event.target) {
        event.preventDefault();
        activeFocusableElements[0].focus();
        return;
      }

      if (event.shiftKey && activeFocusableElements[0] === event.target) {
        event.preventDefault();
        lastFocusableElement.focus();
      }
    },
    /**
     * Called in the event that the user navigates to date pages and
     * closes the picker without selecting a date.
     */
    resetDefaultPageDate () {
      if (this.selectedDate === null) {
        this.setPageDate();
        return;
      }
      this.setPageDate(this.selectedDate);
    },
    /**
     * Effectively a toggle to show/hide the calendar
     * @return {mixed}
     */
    async showCalendar () {
      if (this.disabled || this.isInline) {
        return false;
      }
      if (this.isOpen) {
        return this.close(true);
      }
      this.setInitialView();
      await this.$nextTick();
      const activeCell = this.$el.querySelector(`.${this.activeGridId} [tabindex="0"]`);
      if (activeCell) activeCell.focus();
    },
    /**
     * Sets the initial picker page view: day, month or year
     */
    setInitialView () {
      const initialView = this.computedInitialView;
      if (!this.allowedToShowView(initialView)) {
        throw new Error(`initialView '${this.initialView}' cannot be rendered based on minimum '${this.minimumView}' and maximum '${this.maximumView}'`);
      }
      switch (initialView) {
      case 'year':
        this.showYearCalendar();
        break;
      case 'month':
        this.showMonthCalendar();
        break;
      default:
        this.showDayCalendar();
        break;
      }
    },
    /**
     * Are we allowed to show a specific picker view?
     * @param {String} view
     * @return {Boolean}
     */
    allowedToShowView (view) {
      const views = [ 'day', 'month', 'year' ];
      const minimumViewIndex = views.indexOf(this.minimumView);
      const maximumViewIndex = views.indexOf(this.maximumView);
      const viewIndex = views.indexOf(view);

      return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex;
    },
    /**
     * Show the day picker
     * @return {Boolean}
     */
    showDayCalendar () {
      if (!this.allowedToShowView('day')) {
        return false;
      }
      this.close();
      this.showDayView = true;
      return true;
    },
    /**
     * Show the month picker
     * @return {Boolean}
     */
    showMonthCalendar () {
      if (!this.allowedToShowView('month')) {
        return false;
      }
      this.close();
      this.showMonthView = true;
      return true;
    },
    /**
     * Show the year picker
     * @return {Boolean}
     */
    showYearCalendar () {
      if (!this.allowedToShowView('year')) {
        return false;
      }
      this.close();
      this.showYearView = true;
      return true;
    },
    /**
     * Set the selected date
     * @param {Number} timestamp
     */
    setDate (timestamp) {
      const date = new Date(timestamp);
      if (this.shouldChangePage(date)) {
        this.setPageDate(date);
      }
      this.selectedDate = date;
      this.$emit('selected', date);
      this.$emit('input', date);
    },
    shouldChangePage (date) {
      const isSameMonthThanCurrentPage = this.utils.getMonth(this.pageDate) === this.utils.getMonth(date);
      const isSameYearThanCurrentPage = this.utils.getFullYear(this.pageDate) === this.utils.getFullYear(date);
      if (isSameMonthThanCurrentPage && isSameYearThanCurrentPage) return false;

      if (!this.sideBySide) return true;

      const nextMonthPageDate = new Date(this.pageDate);
      this.utils.setMonth(nextMonthPageDate, this.utils.getMonth(nextMonthPageDate) + 1);
      const isSameMonthThanNextPage = this.utils.getMonth(nextMonthPageDate) === this.utils.getMonth(date);
      const isSameYearThanNextPage = this.utils.getFullYear(nextMonthPageDate) === this.utils.getFullYear(date);
      return !isSameMonthThanNextPage || !isSameYearThanNextPage;
    },
    /**
     * Clear the selected date
     */
    clearDate () {
      this.selectedDate = null;
      this.setPageDate();
      this.$emit('selected', null);
      this.$emit('input', null);
      this.$emit('cleared');
    },
    /**
     * @param {Object} date
     */
    selectDate (date) {
      this.setDate(date.timestamp);
      if (!this.isInline) {
        this.close(true);
      }
      this.resetTypedDate = new Date();
    },
    /**
     * @param {Object} date
     */
    selectDisabledDate (date) {
      this.$emit('selectedDisabled', date);
    },
    /**
     * @param {Object} month
     */
    selectMonth (month) {
      const date = new Date(month.timestamp);
      if (this.allowedToShowView('day')) {
        this.setPageDate(date);
        this.$emit('changedMonth', month);
        this.showDayCalendar();
      } else {
        this.selectDate(month);
      }
    },
    /**
     * @param {Object} year
     */
    selectYear (year) {
      const date = new Date(year.timestamp);
      if (this.allowedToShowView('month')) {
        this.setPageDate(date);
        this.$emit('changedYear', year);
        this.showMonthCalendar();
      } else {
        this.selectDate(year);
      }
    },
    highlightDate (date) {
      this.$emit('highlight-date', date);
    },
    /**
     * Set the datepicker value
     * @param {Date|String|Number|null} date
     */
    setValue (date) {
      if (typeof date === 'string' || typeof date === 'number') {
        let parsed = new Date(date);
        date = isNaN(parsed.valueOf()) ? null : parsed;
      }
      if (!date) {
        this.setPageDate();
        this.selectedDate = null;
        return;
      }
      this.selectedDate = date;
      this.setPageDate(date);
    },
    /**
     * Sets the date that the calendar should open on
     */
    setPageDate (date) {
      if (!date) {
        if (this.openDate) {
          date = new Date(this.openDate);
        } else {
          date = new Date();
        }
      }
      this.pageTimestamp = this.utils.setDate(new Date(date), 1);
    },
    /**
     * Handles a month change from the day picker
     */
    handleChangedMonthFromDayPicker (date) {
      this.setPageDate(date);
      this.$emit('changedMonth', date);
    },
    /**
     * Set the date from a typedDate event
     */
    setTypedDate (date) {
      this.setDate(date.getTime());
    },
    /**
     * Close all calendar layers
     * @param {Boolean} emitEvent - emit close event
     */
    close (emitEvent) {
      this.showDayView = this.showMonthView = this.showYearView = false;

      if (this.isInline) return;

      if (emitEvent) {
        this.$emit('closed');
        const input = this.$refs.input;
        if (!input) return;
        const inputEl = input.$el.querySelector('input');
        if (!inputEl) return;
        inputEl.focus();
      }

      document.removeEventListener('click', this.clickOutside, false);
    },
    /**
     * Initiate the component
     */
    async init () {
      if (this.value) {
        this.setValue(this.value);
      }
      if (this.isInline) {
        this.setInitialView();
      }

      // Prevent from focusing inline datepickers on load
      await this.$nextTick();
      this.isInitialized = true;
    },
  },
}
// eslint-disable-next-line
;
</script>
<style lang="stylus">
@import '../styles/style'
</style>
