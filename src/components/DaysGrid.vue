<template>
  <div
    role="grid"
    aria-labelledby="month-button"
  >
    <span
      v-for="d in daysOfWeek"
      :key="d.timestamp"
      class="cell day-header"
    >{{ d }}</span>
    <template v-if="blankDays > 0">
      <span
        v-for="d in blankDays"
        :key="d.timestamp"
        class="cell day blank"
      />
    </template><!--
      --><span
            v-for="day in days"
            :key="day.timestamp"
            class="cell day"
            :class="dayClasses(day)"
            :tabindex="isFocused(day) ? 0 : -1"
            :aria-selected="day.isSelected"
            @mouseover="mouseOver(day)"
            @focus="mouseOver(day)"
            @keydown.left.prevent="$emit('focus-previous-day')"
            @keydown.right.prevent="$emit('focus-next-day')"
            @keydown.up.prevent="$emit('focus-previous-week')"
            @keydown.down.prevent="$emit('focus-next-week')"
            @keydown.space.enter.prevent="selectDate(day)"
            @keydown="$emit('keydown', $event)"
            @click="selectDate(day)"
            v-html="dayCellContent(day)"
          />
  </div>
</template>

<script>
export default {
  name: 'DaysGrid',
  props: {
    dayCellContent: {
      type: Function,
      default: day => day.date,
    },
    days: Array,
    focusedDate: {
      type: Number,
    },
    mondayFirst: Boolean,
    translation: Object,
    startDate: Date,
    useUtc: Boolean,
    utils: Object,
  },
  computed: {
    /**
     * Returns an array of day names
     * @return {String[]}
     */
    daysOfWeek () {
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
    blankDays () {
      const d = this.startDate;
      let dObj = this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
        : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes());
      if (this.mondayFirst) {
        return this.utils.getDay(dObj) > 0 ? this.utils.getDay(dObj) - 1 : 6;
      }
      return this.utils.getDay(dObj);
    },
  },
  methods: {
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
        'highlight-end': day.isHighlightEnd,
      };
    },
    isFocused(day) {
      const date = new Date(day.timestamp);
      const focusedDate = new Date(this.focusedDate);
      return this.utils.compareDates(date, focusedDate);
    },
    mouseOver (date) {
      this.$emit('mouseover', date);
    },
    selectDate (date) {
      this.$emit('select', date);
    },
  },
};
</script>

<style scoped>

</style>
