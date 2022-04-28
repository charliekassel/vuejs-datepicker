<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showTimeView" :style="calendarStyle" @mousedown.prevent>
    <slot name="beforeCalendarHeader"></slot>
    <header>
        <div class="day__calendar_btn" @click="showDayCalendar" :class="allowedToShowView('day') ? 'up' : ''">{{ formattedValue }}</div>
    </header>
        <span class="cell time time_up" @click="setHours(1)">up</span><span class="cell"> </span><span class="cell time time_up" @click="setMinutes(1)">up</span>
        <span class="cell time">{{utils.getHours(selectedDate)}}</span><span class="cell">:</span><span class="cell time">{{utils.getMinutes(selectedDate)}}</span>
        <span class="cell time time_down" @click="setHours(-1)">down</span><span class="cell"> </span><span class="cell time time_down" @click="setMinutes(-1)">down</span>
  </div>
</template>
<script>
import { makeDateUtils } from '../utils/DateUtils'
export default {
  props: {
    showTimeView: Boolean,
    selectedDate: Date,
    format: [String, Function],
    allowedToShowView: Function,
    calendarClass: [String, Object, Array],
    calendarStyle: Object,
    useUtc: Boolean,
    translation: Object
  },
  data () {
    const constructedDateUtils = makeDateUtils(this.useUtc)
    return {
      utils: constructedDateUtils
    }
  },
  computed: {
    formattedValue () {
      if (!this.selectedDate) {
        return null
      }
      return typeof this.format === 'function'
        ? this.format(this.selectedDate)
        : this.utils.formatDate(new Date(this.selectedDate), this.format, this.translation)
    }
  },
  methods: {

    setHours (incrementBy) {
      let date = this.selectedDate
      this.utils.setHours(date, this.utils.getHours(date) + incrementBy)

      this.$emit('selectDate', {date: date, timestamp: date.getTime()})
    },
    setMinutes (incrementBy) {
      let date = this.selectedDate
      this.utils.setMinutes(date, this.utils.getMinutes(date) + incrementBy)

      this.$emit('selectDate', {date: date, timestamp: date.getTime()})
    },
    /**
     * Emit an event to show the day picker
     */
    showDayCalendar () {
      this.$emit('showDayCalendar')
    }
  }
}
// eslint-disable-next-line
;
</script>
