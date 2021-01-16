<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showDayView"
    :style="calendarStyle">
    <div>
      <picker-day
        :pageDate="pageDate"
        :selectedDate="selectedDate"
        :fullMonthName="fullMonthName"
        :allowedToShowView="allowedToShowView"
        :disabledDates="disabledDates"
        :highlighted="highlighted"
        :translation="translation"
        :pageTimestamp="pageTimestamp"
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
</template>
<script>

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
    return {}
  }
}
</script>
