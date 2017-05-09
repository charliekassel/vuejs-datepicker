/* global describe, it, expect, beforeEach */

import Vue from 'vue'
import Datepicker from '../../src/Datepicker.vue'

let vm

function dpc (state = {}) {
  return {
    template: '<div><datepicker :value="value" format="yyyy-MM-dd" name="dp1" v-ref:component></datepicker></div>',
    components: { Datepicker },
    data: function () {
      return state
    }
  }
}

describe('Datepicker unmounted', () => {
  it('has a ready hook', () => {
    expect(typeof Datepicker.ready).to.equal('function')
  })

  it('sets the correct default data', () => {
    expect(typeof Datepicker.data).to.equal('function')
    const defaultData = Datepicker.data()
    expect(defaultData.selectedDate).to.equal(null)
    expect(defaultData.showDayView).to.equal(false)
    expect(defaultData.showMonthView).to.equal(false)
    expect(defaultData.showYearView).to.equal(false)
    expect(defaultData.calendarHeight).to.equal(0)
  })

  it('correctly sets the value when created', () => {
    const date = new Date(2016, 1, 15)
    const vm = new Vue(dpc({value: date})).$mount()
    expect(vm.value).to.equal(date)
  })
})

describe('Datepicker: mounted component', () => {
  it('correctly sets the value from method', () => {
    const date = new Date(2016, 1, 15)
    const vm = new Vue(dpc({
      value: date
    })).$mount()
    const newDate = new Date(2016, 9, 15)
    expect(typeof vm.$refs.component.setValue).to.equal('function')
    vm.$refs.component.setValue(newDate)
    expect(vm.$refs.component.selectedDate).to.equal(newDate)
    expect(vm.$refs.component.formattedValue).to.equal('2016-10-15')
    const now = new Date()
    vm.$refs.component.setValue()
    expect(vm.$refs.component.selectedDate).to.equal(null)
    const currDate = new Date(vm.$refs.component.currDate)
    expect(currDate.getYear()).to.equal(now.getYear())
    expect(currDate.getMonth()).to.equal(now.getMonth())
    expect(currDate.getDate()).to.equal(1)
  })

  it('knows the selected year', () => {
    const newDate = new Date(2016, 9, 15)
    const vm = new Vue(dpc()).$mount()
    vm.$refs.component.setValue(newDate)
    expect(vm.$refs.component.isSelectedYear(newDate)).to.equal(true)
    expect(vm.$refs.component.isSelectedYear(new Date(2017, 1, 15))).to.equal(false)
  })

  it('knows the selected month', () => {
    const newDate = new Date(2016, 9, 15)
    const vm = new Vue(dpc()).$mount()
    vm.$refs.component.setValue(newDate)
    expect(vm.$refs.component.isSelectedMonth(newDate)).to.equal(true)
    expect(vm.$refs.component.isSelectedMonth(new Date(2017, 1, 15))).to.equal(false)
  })

  it('knows the selected date', () => {
    const newDate = new Date(2016, 9, 15)
    const vm = new Vue(dpc()).$mount()
    vm.$refs.component.setValue(newDate)
    expect(vm.$refs.component.isSelectedDate(newDate)).to.equal(true)
    expect(vm.$refs.component.isSelectedDate(new Date(2017, 1, 1))).to.equal(false)
  })

  it('sets the date', () => {
    const date = new Date(2016, 9, 9)
    const vm = new Vue(dpc()).$mount()
    vm.$refs.component.setDate(date.getTime())
    expect(vm.$refs.component.selectedDate.getTime()).to.equal(date.getTime())
    expect(vm.$refs.component.formattedValue).to.equal('2016-10-09')
  })

  it('cleares the date', () => {
    const date = new Date(2016, 9, 9)
    const vm = new Vue(dpc()).$mount()
    vm.$refs.component.setDate(date.getTime())
    vm.$refs.component.clearDate()
    expect(vm.$refs.component.selectedDate).to.equal(null)
  })
})

describe('Datepicker.vue', () => {
  beforeEach(() => {
    document.body.appendChild(document.createElement('div'))
    vm = new Vue({
      el: 'div',
      template: '<div><datepicker :value="value" name="dp2" format="yyyy-MM-d" v-ref:component></datepicker></div>',
      components: { Datepicker },
      data: function () {
        return {
          value: new Date(2016, 1, 15)
        }
      }
    })
  })

  it('should close when clicked outside', () => {
    vm.$refs.component.showDayCalendar()
    expect(vm.$refs.component.isOpen()).to.equal(true)
    vm.$refs.component.showDayCalendar()
    expect(vm.$refs.component.showDayView).to.equal(true)
    document.body.click()
    expect(vm.$refs.component.isOpen()).to.equal(false)
  })

  it('should render correct contents', (done) => {
    vm.$nextTick(() => {
      expect(vm.$el.querySelectorAll('.vdp-datepicker').length).to.equal(1)
      expect(vm.$el.querySelectorAll('input').length).to.equal(1)
      done()
    })
  })

  it('should set currdate to be now', (done) => {
    vm.$nextTick(() => {
      const data = Datepicker.data()
      const d = new Date(data.currDate)
      expect(d.getFullYear()).to.equal(new Date().getFullYear())
      expect(d.getMonth()).to.equal(new Date().getMonth())
      expect(d.getDate()).to.equal(1)
      done()
    })
  })

  it('should open and close the calendar', () => {
    vm.$refs.component.close()
    expect(vm.$refs.component.isOpen()).to.equal(false)

    vm.$refs.component.showMonthCalendar()
    expect(vm.$refs.component.isOpen()).to.equal(true)

    vm.$refs.component.close()
    expect(vm.$refs.component.isOpen()).to.equal(false)

    vm.$refs.component.showYearCalendar()
    expect(vm.$refs.component.isOpen()).to.equal(true)

    vm.$refs.component.close()
    expect(vm.$refs.component.isOpen()).to.equal(false)

    vm.$refs.component.showDayCalendar()
    expect(vm.$refs.component.isOpen()).to.equal(true)
  })

  it('can select a day', () => {
    const date = new Date(2016, 9, 1)
    vm.$refs.component.selectDate({timestamp: date.getTime()})
    expect(vm.$refs.component.currDate).to.equal(date.getTime())
    expect(vm.$refs.component.showDayView).to.equal(false)
  })

  it('can select a month', () => {
    const date = new Date(2016, 9, 9)
    vm.$refs.component.selectMonth({timestamp: date.getTime()})
    expect(vm.$refs.component.currDate).to.equal(date.getTime())
    expect(vm.$refs.component.showDayView).to.equal(true)
  })

  it('can select a year', () => {
    const date = new Date(2016, 9, 9)
    vm.$refs.component.selectYear({timestamp: date.getTime()})
    expect(vm.$refs.component.currDate).to.equal(date.getTime())
    expect(vm.$refs.component.showMonthView).to.equal(true)
  })

  it('can set the next month', () => {
    const date = new Date(2016, 9, 9)
    vm.$refs.component.selectDate({timestamp: date.getTime()})
    vm.$refs.component.nextMonth()
    expect(vm.$refs.component.getMonth()).to.equal(10)
  })

  it('can set the previous month', () => {
    const date = new Date(2016, 9, 9)
    vm.$refs.component.selectDate({timestamp: date.getTime()})
    vm.$refs.component.previousMonth()
    expect(vm.$refs.component.getMonth()).to.equal(8)
    vm.$refs.component.previousMonth()
    expect(vm.$refs.component.getMonth()).to.equal(7)
  })

  it('can set the next year', () => {
    const date = new Date(2016, 9, 9)
    vm.$refs.component.selectDate({timestamp: date.getTime()})
    vm.$refs.component.nextYear()
    expect(vm.$refs.component.getYear()).to.equal(2017)
  })

  it('can set the previous year', () => {
    const date = new Date(2016, 9, 9)
    vm.$refs.component.selectDate({timestamp: date.getTime()})
    vm.$refs.component.previousYear()
    expect(vm.$refs.component.getYear()).to.equal(2015)
  })

  it('can set the next decade', () => {
    const date = new Date(2016, 9, 9)
    vm.$refs.component.selectDate({timestamp: date.getTime()})
    vm.$refs.component.nextDecade()
    expect(vm.$refs.component.getDecade()).to.equal('2020\'s')
  })

  it('can set the previous decade', () => {
    const date = new Date(2016, 9, 9)
    vm.$refs.component.selectDate({timestamp: date.getTime()})
    vm.$refs.component.previousDecade()
    expect(vm.$refs.component.getDecade()).to.equal('2000\'s')
  })
})

describe('Datepicker.vue set by object', () => {
  let state
  beforeEach(() => {
    state = {
      value: new Date(2016, 1, 20),
      format: 'yyyy-MM-dd'
    }
    vm = new Vue({
      template: '<div><datepicker :value="value" :format="format"></datepicker></div>',
      components: { Datepicker },
      data: function () {
        return state
      }
    }).$mount()
  })

  it('should allow value to be changed outside of component', (done) => {
    state.value = new Date(2016, 2, 15)
    vm.$nextTick(() => {
      expect(vm.$el.querySelector('input').value).to.equal('2016-03-15')
      done()
    })
  })
})

describe('Datepicker.vue set by string', () => {
  let state
  beforeEach(() => {
    state = {
      value: '2016-02-20',
      format: 'yyyy-MM-dd'
    }
    vm = new Vue({
      template: '<div><datepicker :value="value" :format="format"></datepicker></div>',
      components: { Datepicker },
      data: function () {
        return state
      }
    }).$mount()
  })

  it('should allow value to be changed outside of component', (done) => {
    state.value = '2016-03-15'
    vm.$nextTick(() => {
      expect(vm.$el.querySelector('input').value).to.equal('2016-03-15')
      done()
    })
  })

  it('should allow malformed value', (done) => {
    state.value = 'today'
    vm.$nextTick(() => {
      expect(vm.$el.querySelector('input').value).to.equal('')
      done()
    })
  })
})

describe('Datepicker.vue inline', () => {
  let state = {}
  beforeEach(() => {
    document.body.appendChild(document.createElement('div'))
    vm = new Vue({
      el: 'div',
      template: '<div><datepicker :inline="true" v-ref:component></datepicker></div>',
      components: { Datepicker },
      data: function () {
        return state
      }
    })
  })

  it('should not showCalendar as already open', () => {
    expect(vm.$refs.component.showCalendar()).to.equal(false)
    expect(vm.$refs.component.isInline()).to.equal(true)
  })

  it('should not close the caledar when date is selected', () => {
    const date = new Date()
    vm.$refs.component.selectDate({timestamp: date.getTime()})
    expect(vm.$refs.component.isOpen()).to.equal(true)
    document.body.click()
    expect(vm.$refs.component.isOpen()).to.equal(true)
  })
})

describe('Datepicker disabled dates', () => {
  beforeEach(() => {
    vm = new Vue({
      template: '<div><datepicker :inline="false" :disabled="disabled" v-ref:component></datepicker></div>',
      components: { Datepicker },
      data () {
        return {
          disabled: {
            to: new Date(2016, 9, 4),
            from: new Date(2016, 9, 26)
          }
        }
      }
    }).$mount()
    vm.$refs.component.setDate(new Date(2016, 9, 15))
  })

  it('should close showCalendar if already open', () => {
    expect(vm.$refs.component.isInline()).to.equal(false)
    vm.$refs.component.showCalendar()
    expect(vm.$refs.component.isOpen()).to.equal(true)
    vm.$refs.component.showCalendar()
    expect(vm.$refs.component.isOpen()).to.equal(false)
  })

  it('should detect a disabled date', () => {
    expect(vm.$refs.component.isDisabledDate(new Date(2006, 9, 2))).to.equal(true)
    expect(vm.$refs.component.isDisabledDate(new Date(2026, 9, 2))).to.equal(true)
  })

  it('should not select a disabled date', () => {
    expect(vm.$refs.component.selectDate({isDisabled: true})).to.equal(false)
    expect(vm.$refs.component.selectMonth({isDisabled: true})).to.equal(false)
    expect(vm.$refs.component.selectYear({isDisabled: true})).to.equal(false)
  })

  it('cant\'t change to a disabled month', () => {
    expect(vm.$refs.component.previousMonth()).to.equal(false)
    expect(vm.$refs.component.nextMonth()).to.equal(false)
  })

  it('cant\'t change to a disabled year', () => {
    expect(vm.$refs.component.previousYear()).to.equal(false)
    expect(vm.$refs.component.nextYear()).to.equal(false)
  })

  it('cant\'t change to a disabled decade', () => {
    expect(vm.$refs.component.previousDecade()).to.equal(false)
    expect(vm.$refs.component.nextDecade()).to.equal(false)
  })
})

describe('Datepicker has disabled dates but can change dates', () => {
  beforeEach(() => {
    vm = new Vue({
      template: '<div><datepicker :inline="true" :disabled="disabled" :value="value" v-ref:component></datepicker></div>',
      components: { Datepicker },
      data () {
        return {
          disabled: {
            to: new Date(2016, 8, 5),
            from: new Date(2016, 10, 25)
          }
        }
      }
    }).$mount()
  })

  it('cant change month despite having a disabled month', () => {
    const newDate = new Date(2016, 9, 15)
    vm.$refs.component.setValue(newDate)
    expect(vm.$refs.component.getMonth()).to.equal(9)
    expect(vm.$refs.component.previousMonth()).to.not.equal(false)
    expect(vm.$refs.component.nextMonth()).to.not.equal(false)
  })

  it('cant change year despite having a disabled year', () => {
    vm = new Vue({
      template: '<div><datepicker :inline="true" :disabled="disabled" v-ref:component></datepicker></div>',
      components: { Datepicker },
      data () {
        return {
          disabled: {
            to: new Date(2015, 8, 5),
            from: new Date(2017, 10, 25)
          }
        }
      }
    }).$mount()
    const newDate = new Date(2016, 9, 15)
    vm.$refs.component.setValue(newDate)
    expect(vm.$refs.component.previousYear()).to.not.equal(false)
    expect(vm.$refs.component.nextYear()).to.not.equal(false)
  })

  it('cant change decade previous or next decades are disabled', () => {
    vm = new Vue({
      template: '<div><datepicker :disabled="disabled" v-ref:component></datepicker></div>',
      components: { Datepicker },
      data () {
        return {
          disabled: {
            to: new Date(2010, 8, 6),
            from: new Date(2017, 10, 24)
          }
        }
      }
    }).$mount()
    const newDate = new Date(2016, 9, 15)
    vm.$refs.component.setValue(newDate)
    expect(vm.$refs.component.previousDecade()).to.equal(false)
    expect(vm.$refs.component.nextDecade()).to.equal(false)
  })

  it('can change decade despite having a disabled decade', () => {
    vm = new Vue({
      template: '<div><datepicker :disabled="disabled" v-ref:component></datepicker></div>',
      components: { Datepicker },
      data () {
        return {
          disabled: {
            to: new Date(2000, 11, 19),
            from: new Date(2021, 11, 19)
          }
        }
      }
    }).$mount()
    expect(vm.$refs.component.previousDecadeDisabled()).to.equal(false)
    expect(vm.$refs.component.nextDecadeDisabled()).to.equal(false)
  })

  it('can accept an array of disabled dates', () => {
    vm = new Vue({
      template: '<div><datepicker :disabled="disabled" v-ref:component></datepicker></div>',
      components: { Datepicker },
      data () {
        return {
          disabled: {
            dates: [
              new Date(2016, 9, 2),
              new Date(2016, 9, 9),
              new Date(2016, 9, 16)
            ]
          }
        }
      }
    }).$mount()
    expect(vm.$refs.component.isDisabledDate(new Date(2016, 9, 2))).to.equal(true)
    expect(vm.$refs.component.isDisabledDate(new Date(2016, 9, 3))).to.equal(false)
  })

  it('can accept an array of disabled days of the week', () => {
    vm = new Vue({
      template: '<div><datepicker :disabled="disabled" v-ref:component></datepicker></div>',
      components: { Datepicker },
      data () {
        return {
          disabled: {
            days: [6, 0]
          }
        }
      }
    }).$mount()
    expect(vm.$refs.component.isDisabledDate(new Date(2016, 9, 2))).to.equal(true)
    expect(vm.$refs.component.isDisabledDate(new Date(2016, 9, 3))).to.equal(false)
  })
})

describe('Datepicker highlight date', () => {
  beforeEach(() => {
    vm = new Vue({
      template: '<div><datepicker :inline="false" :disabled="disabled" :highlighted="highlighted" v-ref:component></datepicker></div>',
      components: { Datepicker },
      data () {
        return {
          highlighted: {
            to: new Date(2016, 12, 8),
            from: new Date(2016, 12, 4)
          },
          disabled: {
            dates: [ new Date(2016, 12, 5) ]
          }
        }
      }
    }).$mount()
    vm.$refs.component.setDate(new Date(2016, 9, 15))
  })

  it('should detect a highlighted date', () => {
    expect(vm.$refs.component.isHighlightedDate(new Date(2006, 9, 2))).to.equal(false)
    expect(vm.$refs.component.isHighlightedDate(new Date(2026, 9, 2))).to.equal(false)
  })

  it('should not highlight a disabled date', () => {
    expect(vm.$refs.component.isHighlightedDate(new Date(2016, 12, 5))).to.equal(false)
  })

  it('should highlight a date before the to property', () => {
    expect(vm.$refs.component.isHighlightedDate(new Date(2016, 12, 7))).to.equal(true)
  })

  it('should not highlight a date after the to property', () => {
    expect(vm.$refs.component.isHighlightedDate(new Date(2016, 12, 9))).to.equal(false)
  })

  it('should highlight a date after the from property', () => {
    expect(vm.$refs.component.isHighlightedDate(new Date(2016, 12, 6))).to.equal(true)
  })

  it('should not highlight a date before the from property', () => {
    expect(vm.$refs.component.isHighlightedDate(new Date(2016, 12, 3))).to.equal(false)
  })

  it('can accept an array of highlighted dates', () => {
    vm = new Vue({
      template: '<div><datepicker :highlighted="highlighted" v-ref:component></datepicker></div>',
      components: { Datepicker },
      data () {
        return {
          highlighted: {
            dates: [
              new Date(2016, 9, 2),
              new Date(2016, 9, 9),
              new Date(2016, 9, 16)
            ]
          }
        }
      }
    }).$mount()
    expect(vm.$refs.component.isHighlightedDate(new Date(2016, 9, 2))).to.equal(true)
    expect(vm.$refs.component.isHighlightedDate(new Date(2016, 9, 3))).to.equal(false)
  })

  it('can accept an array of highlighted days of the week', () => {
    vm = new Vue({
      template: '<div><datepicker :highlighted="highlighted" v-ref:component></datepicker></div>',
      components: { Datepicker },
      data () {
        return {
          highlighted: {
            days: [6, 0]
          }
        }
      }
    }).$mount()
    expect(vm.$refs.component.isHighlightedDate(new Date(2016, 9, 2))).to.equal(true)
    expect(vm.$refs.component.isHighlightedDate(new Date(2016, 9, 3))).to.equal(false)
  })
})

describe('Datepicker with monday as first day of week', () => {
  beforeEach(() => {
    vm = new Vue({
      template: '<div><datepicker :monday-first="true" language="en" v-ref:component></datepicker></div>',
      components: { Datepicker }
    }).$mount()
  })

  it('should return Monday as a first day of week', () => {
    expect(vm.$refs.component.daysOfWeek[0]).to.equal('Mon')
  })

  it('should return Sunday as a seventh day of week', () => {
    expect(vm.$refs.component.daysOfWeek[6]).to.equal('Sun')
  })

  it('should have 6 blankDays when month starts from Sunday', () => {
    vm.$refs.component.currDate = new Date(2016, 4, 1).getTime()
    expect(vm.$refs.component.blankDays).to.equal(6)
  })

  it('should have no blankDays when month starts from Monday', () => {
    vm.$refs.component.currDate = new Date(2017, 4, 1).getTime()
    expect(vm.$refs.component.blankDays).to.equal(0)
  })
})
