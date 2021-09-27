<template>
  <div :class="[calendarClass, 'dvdp-datepicker__calendar']"
        :style="calendarStyle" @mousedown.prevent>
    <slot name="beforeCalendarHeader"></slot>
    <header class="navigation">
      <div
        @click="isRtl ? nextMonth() : previousMonth()"
        class="prev"
        :class="{'disabled': isLeftNavDisabled}">
          <svg width="11" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.7,15.8 3.9,9 10.7,2.2 8.9,0.4 0.3,9 8.9,17.6z" fill="currentColor"></path></svg>
        </div>
      
      <div
        @click="isRtl ? previousMonth() : nextMonth()"
        class="next"
        :class="{'disabled': isRightNavDisabled}">
          <svg width="11" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.3,2.2 7.1,9 0.3,15.8 2.1,17.6 10.7,9 2.1,0.4z" fill="currentColor"></path></svg>
        </div>
    </header>
    <div class="monthes-grid" :style="gridStyle">
      <div class="calendar" v-for="month in months" :key="month.timestamp">
        <picker-day
          :pageDate="month.pageDate"
          :pageTimestamp="month.timestamp"
          :selectedDate="selectedDate"
          :fullMonthName="fullMonthName"
          :disabledDates="disabledDates"
          :highlighted="highlighted"
          :translation="translation"
          :isRtl="isRtl"
          :mondayFirst="mondayFirst"
          :use-utc="useUtc"
          :show-monthes-select="showMonthesSelect"
          :indexOfRange="indexOfRange"
          :mouseOverDateTimestamp="mouseOverDateTimestamp"
          :is-range="isRange"
          :rangeSliderMode="rangeSliderMode"
          :mouseClickOnDate="mouseClickOnDate"
          @changedMonth="handleChangedMonthFromDayPicker"
          @mouseOverDate="mouseOverDate"
          @dayMouseDown="dayMouseDown"
          @dayMouseUp="dayMouseUp">
          <slot name="dayCellContent" slot="dayCellContent" slot-scope="slotData" v-bind="slotData"></slot>

          <template v-slot:monthes-select>
            <select class="monthes-select" v-model="month.selectedOption" @change="onSelectChange(month)" tabindex="-1" @mousedown.stop>
              <template v-for="(value, name) in monthesSelectOptions">
                <option disabled v-bind:key="name">{{name}}</option>
                <option v-for="option in value" v-bind:key="option.key" :value="option.key">
                  {{option.name}}
                </option>
              </template>
            </select>
          </template>
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
    calendarClass: [String, Object, Array],
    calendarStyle: Object,

    // To PickerDay
    pageDate: Date,
    selectedDate: {
      validator: val =>  val instanceof Date || val instanceof Array
    },
    fullMonthName: Boolean,
    disabledDates: Object,
    highlighted: Object,
    translation: Object,
    pageTimestamp: Number,
    indexOfRange: Number,
    mouseOverDateTimestamp: Number,
    isRtl: Boolean,
    mondayFirst: Boolean,
    useUtc: Boolean,
    cols: Number,
    rows: Number,
    showMonthesSelect: Boolean,
    isRange: Boolean,
    rangeSliderMode: Number,
    mouseClickOnDate: Object
  },
  data () {
    const constructedDateUtils = makeDateUtils(this.useUtc)
    return {
      utils: constructedDateUtils
    }
  },
  computed: {
    /**
     * Отображаемые блоки с месяцами
     */
    months () {
      const d = this.pageDate
      let months = []
      // set up a new date object to the beginning of the current 'page'
      let dObj = this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
        : new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes())

      for (let i = 0; i < (this.cols * this.rows); i++) {
        let timeStamp = dObj.getTime();
        months.push({
          pageDate: new Date(timeStamp),
          timestamp: timeStamp,
          selectedOption: this.utils.getFullYear(dObj) + '-' + this.utils.getMonth(dObj)
        })
        this.utils.setMonth(dObj, this.utils.getMonth(dObj) + 1)
      }
      return months
    },
    /**
     * Опции для select-бокса выбора месяца
     */
    monthesSelectOptions(){
      const d = this.pageDate;

      const maxMonthesInSelect = 13;


      var getOption = (date) => {
        let month = this.utils.getMonth(date);
        let year = this.utils.getFullYear(date);
        return {
          name: this.utils.getMonthName(month, this.translation.months),
          year: year,
          month: month,
          key: year + '-' + month
        };
      }

      let months = [];

      let dBackwardObj = this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
        : new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
      let dTowardObs = new Date(dBackwardObj.getTime());

      //Бежим по датам "назад"
      const disabledToMonthTime = this.disabledDates && this.disabledDates.to 
        ? this.utils.getUtcMonthDate(this.disabledDates.to).getTime()
        : undefined;
      for (let i = 0; i < maxMonthesInSelect; i++) {
        this.utils.setMonth(dBackwardObj, this.utils.getMonth(dBackwardObj) - 1);
        //Is date Disabled
        if (disabledToMonthTime && this.utils.getUtcMonthDate(dBackwardObj).getTime() < disabledToMonthTime) 
          break;
        months.unshift(getOption(dBackwardObj));
      }

      //Добавляем текущий месяц
      months.push(getOption(d));

      //Бежим по датам "туда"
      const disabledFromMonthTime = this.disabledDates && this.disabledDates.from 
        ? this.utils.getUtcMonthDate(this.disabledDates.from).getTime()
        : undefined;
      for (let i = 0; i < maxMonthesInSelect; i++) {
        this.utils.setMonth(dTowardObs, this.utils.getMonth(dTowardObs) + 1);
        //Is date Disabled
        if (disabledFromMonthTime && this.utils.getUtcMonthDate(dTowardObs).getTime() > disabledFromMonthTime) 
          break;
        months.push(getOption(dTowardObs));
      }
   
      //group by year
      let group = months.reduce((r, a) => {
        r[a.year] = [...r[a.year] || [], a];
        return r;
      }, {});
      return group;
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
    },
    gridStyle(){
      return{
        'grid-template-columns' : 'repeat(' + this.cols + ', 1fr)',
        'grid-template-rows' : 'repeat('+ this.rows + ', 1fr)'
      }
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
     * Hover на дату
     * @param {Object} date
     */
    mouseOverDate (date) {
      this.$emit('mouseOverDate', date)
    },
    /**
     * Нажали кнопкой мыши на дату
     * @param {Object} date
     */
    dayMouseDown (date) {
      this.$emit('dayMouseDown', date)
    },
    /**
     * Отпустили кнопку мыши на дате
     * @param {Object} date
     */
    dayMouseUp (date) {
      this.$emit('dayMouseUp', date)
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
      let d = new Date(this.pageDate.getTime())
      //Добавляем кол-во отображаемых календарей
      let showingMothesCount = (this.cols * this.rows);
      this.utils.setMonth(d, this.utils.getMonth(d) + (showingMothesCount - 1))
      

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
      this.$emit('changedMonth', date)
    },
    /**
     * При смене значения селектбокса месяца
     * @param {Object} month
     */
    onSelectChange (month){
      let data = this.monthesSelectOptions;
      let option;
      for (const year in data){
        option = data[year].find(x=> x.key == month.selectedOption);
        if (option) break;
      }
      if (!option) return;
      
      //Текущий месяц в календаре
      let d1 = new Date(month.pageDate.getTime());
      d1.setUTCHours(0, 0, 0, 0)
      //Выбранный месяц
      let d2 = new Date(Date.UTC(option.year, option.month, 1));

      //Считаем разницу в месяцах между датами
      let diffInMonthes = (d2.getFullYear() - d1.getFullYear()) * 12;
      diffInMonthes -= d1.getMonth();
      diffInMonthes += d2.getMonth();
      this.changeMonth(diffInMonthes);
    }
  },
  mounted: function() {
    // inline функция для получения объекта даты из DOM элемента
    const getDateElement = (elem) =>{
      if (!elem) return;
      const dataKey = elem.getAttribute("data-key");
      if (!dataKey) return;
      const component = elem.closest("[data-component]").__vue__;
      return component.days.find(d=>
        d.key === dataKey
      );
    }

    /*
     * Далее идет набор touch событий, которые мы перехватываем на глобальном календаре
     * для отслеживания перетаскивания range-ей дат.
     * 
     * Необходимо для мобильных устройств
     */
    let touchMoved = false;
    this.$el.addEventListener("touchstart", (ev) => {
      touchMoved = false;
      const date = getDateElement(ev.target);
      if (date) this.$emit('dayMouseDown', date);
    }, false);
    this.$el.addEventListener("touchend", (ev) => {
      if (!touchMoved || (this.mouseClickOnDate && this.mouseClickOnDate.isInRange))
      {
        ev.preventDefault();
        var changedTouch = ev.changedTouches[0];
        var elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);

        const date = getDateElement(elem);
        this.$emit('dayMouseUp', date);
      }
    }, false);
    this.$el.addEventListener("touchcancel", (ev) => {
      //console.log('touch cancel');
    }, false);
    this.$el.addEventListener("touchmove", (ev) => {
      touchMoved = true;
      if (this.mouseClickOnDate && this.mouseClickOnDate.isInRange)
      {
        ev.preventDefault();
      }
      //console.log('touchmove', ev, this.mouseClickOnDate)

      var changedTouch = ev.changedTouches[0];
      var elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
      const date = getDateElement(elem);
      if (date) this.$emit('mouseOverDate', date);
    }, false);
  }
}
</script>
