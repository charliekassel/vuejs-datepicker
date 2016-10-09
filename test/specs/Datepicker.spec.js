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
  it('has a mounted hook', () => {
    expect(typeof Datepicker.mounted).to.equal('function')
  })

  it('sets the correct default data', () => {
    expect(typeof Datepicker.data).to.equal('function')
    const defaultData = Datepicker.data()
    expect(defaultData.selectedDate).to.equal(null)
    expect(defaultData.showDayView).to.equal(false)
    expect(defaultData.showMonthView).to.equal(false)
    expect(defaultData.showYearView).to.equal(false)
    expect(defaultData.formattedValue).to.equal(null)
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
    expect(vm.$refs.component.value.getTime()).to.equal(date.getTime())
    expect(vm.$refs.component.formattedValue).to.equal('2016-10-09')
  })
})

describe('Datepicker.vue', () => {
  beforeEach(() => {
    vm = new Vue({
      template: '<div><datepicker :value="value" name="dp2" format="yyyy-MM-d" v-ref:component></datepicker></div>',
      components: { Datepicker },
      data: function () {
        return {
          value: new Date(2016, 1, 15)
        }
      }
    }).$mount()
  })

  it('should render correct contents', (done) => {
    vm.$nextTick(() => {
      expect(vm.$el.querySelectorAll('.datepicker').length).to.equal(1)
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
      expect(d.getDay()).to.equal(new Date().getDay())
      done()
    })
  })

  it('should open and close the calendar', (done) => {
    vm.$nextTick(() => {
      Datepicker.methods.close()
      expect(Datepicker.methods.isOpen()).to.equal(false)

      Datepicker.methods.showMonthCalendar()
      expect(Datepicker.methods.isOpen()).to.equal(true)

      Datepicker.methods.close()
      expect(Datepicker.methods.isOpen()).to.equal(false)

      Datepicker.methods.showYearCalendar()
      expect(Datepicker.methods.isOpen()).to.equal(true)

      Datepicker.methods.close()
      expect(Datepicker.methods.isOpen()).to.equal(false)

      Datepicker.methods.showDayCalendar()
      expect(Datepicker.methods.isOpen()).to.equal(true)
      done()
    })
  })

  it('can select a day', () => {
    const date = new Date(2016, 9, 9)
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

describe('Datepicker.vue inline', () => {
  let state = {}
  beforeEach(() => {
    vm = new Vue({
      template: '<div><datepicker :inline="true" v-ref:component></datepicker></div>',
      components: { Datepicker },
      data: function () {
        return state
      }
    }).$mount()
  })

  it('should not showCalendar as already open', () => {
    expect(vm.$refs.component.showCalendar()).to.equal(false)
    expect(vm.$refs.component.isInline()).to.equal(true)
  })
})

describe('Datepicker disabled dates', () => {
  // TODO
})
