/* global describe, it, expect, beforeEach */

import Vue from 'vue'
import Datepicker from '../../../src/components/Datepicker.vue'

let vm

function getViewModel (Component, propsData) {
  const Constructor = Vue.extend(Component)
  return new Constructor({ propsData }).$mount()
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
    const vm = getViewModel(Datepicker, {
      value: date
    })
    expect(vm.value).to.equal(date)
  })
})

describe('Datepicker: mounted component', () => {
  it('correctly sets the value from method', () => {
    const date = new Date(2016, 1, 15)
    const vm = getViewModel(Datepicker, {
      value: date,
      format: 'yyyy-MM-dd'
    })
    const newDate = new Date(2016, 9, 15)
    expect(typeof vm.setValue).to.equal('function')
    vm.setValue(newDate)
    expect(vm.selectedDate).to.equal(newDate)
    expect(vm.formattedValue).to.equal('2016-10-15')
    const now = new Date()
    vm.setValue()
    expect(vm.selectedDate).to.equal(null)
    const currDate = new Date(vm.currDate)
    expect(currDate.getYear()).to.equal(now.getYear())
    expect(currDate.getMonth()).to.equal(now.getMonth())
    expect(currDate.getDate()).to.equal(1)
  })

  it('knows the selected year', () => {
    const newDate = new Date(2016, 9, 15)
    const vm = getViewModel(Datepicker)
    vm.setValue(newDate)
    expect(vm.isSelectedYear(newDate)).to.equal(true)
    expect(vm.isSelectedYear(new Date(2017, 1, 15))).to.equal(false)
  })

  it('knows the selected month', () => {
    const newDate = new Date(2016, 9, 15)
    const vm = getViewModel(Datepicker)
    vm.setValue(newDate)
    expect(vm.isSelectedMonth(newDate)).to.equal(true)
    expect(vm.isSelectedMonth(new Date(2017, 1, 15))).to.equal(false)
  })

  it('knows the selected date', () => {
    const newDate = new Date(2016, 9, 15)
    const vm = getViewModel(Datepicker)
    vm.setValue(newDate)
    expect(vm.isSelectedDate(newDate)).to.equal(true)
    expect(vm.isSelectedDate(new Date(2017, 1, 1))).to.equal(false)
  })

  it('sets the date', () => {
    const date = new Date(2016, 9, 9)
    const vm = getViewModel(Datepicker, {
      format: 'yyyy-MM-dd'
    })
    vm.setDate(date.getTime())
    expect(vm.selectedDate.getTime()).to.equal(date.getTime())
    expect(vm.formattedValue).to.equal('2016-10-09')
  })

  it('cleares the date', () => {
    const date = new Date(2016, 9, 9)
    const vm = getViewModel(Datepicker)
    vm.setDate(date.getTime())
    vm.clearDate()
    expect(vm.selectedDate).to.equal(null)
  })
})

describe('Datepicker.vue', () => {
  beforeEach(() => {
    vm = getViewModel(Datepicker, {
      format: 'yyyy-MM-dd',
      value: new Date(2016, 1, 15)
    })
  })

  it('should close when clicked outside', async () => {
    vm.showDayCalendar()
    expect(vm.isOpen).to.equal(true)
    vm.showDayCalendar()
    expect(vm.showDayView).to.equal(true)
    document.body.click()
    expect(vm.isOpen).to.equal(false)
  })

  // it('should render correct contents', async () => {
  //   await vm.$nextTick(() => {
  //     expect(vm.$el.querySelectorAll('.vdp-datepicker').length).to.equal(1)
  //     expect(vm.$el.querySelectorAll('input').length).to.equal(1)
  //   })
  // })

  // it('should set currdate to be now', async () => {
  //   await vm.$nextTick(() => {
  //     const data = Datepicker.data()
  //     const d = new Date(data.currDate)
  //     expect(d.getFullYear()).to.equal(new Date().getFullYear())
  //     expect(d.getMonth()).to.equal(new Date().getMonth())
  //     expect(d.getDate()).to.equal(1)
  //   })
  // })

  it('should open and close the calendar', () => {
    vm.close()
    expect(vm.isOpen).to.equal(false)

    vm.showMonthCalendar()
    expect(vm.isOpen).to.equal(true)

    vm.close()
    expect(vm.isOpen).to.equal(false)

    vm.showYearCalendar()
    expect(vm.isOpen).to.equal(true)

    vm.close()
    expect(vm.isOpen).to.equal(false)

    vm.showDayCalendar()
    expect(vm.isOpen).to.equal(true)
  })

  it('can select a day', () => {
    const date = new Date(2016, 9, 1)
    vm.selectDate({timestamp: date.getTime()})
    expect(vm.currDate).to.equal(date.getTime())
    expect(vm.showDayView).to.equal(false)
  })

  it('can select a month', () => {
    const date = new Date(2016, 9, 9)
    vm.selectMonth({timestamp: date.getTime()})
    expect(vm.currDate).to.equal(date.getTime())
    expect(vm.showDayView).to.equal(true)
  })

  it('can select a year', () => {
    const date = new Date(2016, 9, 9)
    vm.selectYear({timestamp: date.getTime()})
    expect(vm.currDate).to.equal(date.getTime())
    expect(vm.showMonthView).to.equal(true)
  })

  it('can set the next month', () => {
    const date = new Date(2016, 9, 9)
    vm.selectDate({timestamp: date.getTime()})
    vm.nextMonth()
    expect(vm.getMonth()).to.equal(10)
  })

  it('can set the next month correctly on the last day of a 31 day month', () => {
    const date = new Date(2017, 4, 31)
    vm.selectDate({timestamp: date.getTime()})
    // when click document to close the modal will run resetDefaultDate();
    vm.resetDefaultDate()
    vm.nextMonth()
    expect(vm.getMonth()).to.equal(5)
  })

  it('can set the previous month', () => {
    const date = new Date(2016, 9, 9)
    vm.selectDate({timestamp: date.getTime()})
    vm.previousMonth()
    expect(vm.getMonth()).to.equal(8)
    vm.previousMonth()
    expect(vm.getMonth()).to.equal(7)
  })

  it('can set the next year', () => {
    const date = new Date(2016, 9, 9)
    vm.selectDate({timestamp: date.getTime()})
    vm.nextYear()
    expect(vm.getYear()).to.equal(2017)
  })

  it('can set the previous year', () => {
    const date = new Date(2016, 9, 9)
    vm.selectDate({timestamp: date.getTime()})
    vm.previousYear()
    expect(vm.getYear()).to.equal(2015)
  })

  it('can set the next decade', () => {
    const date = new Date(2016, 9, 9)
    vm.selectDate({timestamp: date.getTime()})
    vm.nextDecade()
    expect(vm.getDecade()).to.equal('2020\'s')
  })

  it('can set the previous decade', () => {
    const date = new Date(2016, 9, 9)
    vm.selectDate({timestamp: date.getTime()})
    vm.previousDecade()
    expect(vm.getDecade()).to.equal('2000\'s')
  })

  it('sets the default date to the first of the month', () => {
    vm.clearDate()
    vm.resetDefaultDate()
    expect(vm.selectedDate).to.be.null
    const defaultDate = new Date(vm.getDefaultDate())
    expect(defaultDate.getDate()).to.equal(1)
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
  beforeEach(() => {
    vm = getViewModel(Datepicker, {
      inline: true
    })
  })

  it('should not showCalendar as already open', () => {
    expect(vm.showCalendar()).to.equal(false)
    expect(vm.isInline).to.equal(true)
  })

  it('should not close the caledar when date is selected', () => {
    const date = new Date()
    vm.selectDate({timestamp: date.getTime()})
    expect(vm.isOpen).to.equal(true)
    document.body.click()
    expect(vm.isOpen).to.equal(true)
  })
})

describe('Datepicker disabled dates', () => {
  beforeEach(() => {
    vm = getViewModel(Datepicker, {
      disabled: {
        to: new Date(2016, 9, 4),
        from: new Date(2016, 9, 26)
      }
    })
    vm.setDate(new Date(2016, 9, 15))
  })

  it('should close showCalendar if already open', () => {
    expect(vm.isInline).to.equal(false)
    vm.showCalendar()
    expect(vm.isOpen).to.equal(true)
    vm.showCalendar()
    expect(vm.isOpen).to.equal(false)
  })

  it('should detect a disabled date', () => {
    expect(vm.isDisabledDate(new Date(2006, 9, 2))).to.equal(true)
    expect(vm.isDisabledDate(new Date(2026, 9, 2))).to.equal(true)
  })

  it('should not select a disabled date', () => {
    expect(vm.selectDate({isDisabled: true})).to.equal(false)
    expect(vm.selectMonth({isDisabled: true})).to.equal(false)
    expect(vm.selectYear({isDisabled: true})).to.equal(false)
  })

  it('cant\'t change to a disabled month', () => {
    expect(vm.previousMonth()).to.equal(false)
    expect(vm.nextMonth()).to.equal(false)
  })

  it('cant\'t change to a disabled year', () => {
    expect(vm.previousYear()).to.equal(false)
    expect(vm.nextYear()).to.equal(false)
  })

  it('cant\'t change to a disabled decade', () => {
    expect(vm.previousDecade()).to.equal(false)
    expect(vm.nextDecade()).to.equal(false)
  })
})

describe('Datepicker has disabled dates but can change dates', () => {
  // beforeEach(() => {
  //   vm = new Vue({
  //     template: '<div><datepicker :inline="true" :disabled="disabled" :value="value" v-ref:component></datepicker></div>',
  //     components: { Datepicker },
  //     data () {
  //       return {
  //         disabled: {
  //           to: new Date(2016, 8, 5),
  //           from: new Date(2016, 10, 25)
  //         }
  //       }
  //     }
  //   }).$mount()
  // })

  it('cant change month despite having a disabled month', () => {
    vm = getViewModel(Datepicker, {
      disabled: {
        to: new Date(2016, 8, 5),
        from: new Date(2016, 10, 25)
      }
    })
    const newDate = new Date(2016, 9, 15)
    vm.setValue(newDate)
    expect(vm.getMonth()).to.equal(9)
    expect(vm.previousMonth()).to.not.equal(false)
    expect(vm.nextMonth()).to.not.equal(false)
  })

  it('cant change year despite having a disabled year', () => {
    vm = getViewModel(Datepicker, {
      disabled: {
        to: new Date(2015, 8, 5),
        from: new Date(2017, 10, 25)
      }
    })
    const newDate = new Date(2016, 9, 15)
    vm.setValue(newDate)
    expect(vm.previousYear()).to.not.equal(false)
    expect(vm.nextYear()).to.not.equal(false)
  })

  it('cant change decade previous or next decades are disabled', () => {
    vm = getViewModel(Datepicker, {
      disabled: {
        to: new Date(2010, 8, 6),
        from: new Date(2017, 10, 24)
      }
    })
    const newDate = new Date(2016, 9, 15)
    vm.setValue(newDate)
    expect(vm.previousDecade()).to.equal(false)
    expect(vm.nextDecade()).to.equal(false)
  })

  it('can change decade despite having a disabled decade', () => {
    vm = getViewModel(Datepicker, {
      disabled: {
        to: new Date(2000, 11, 19),
        from: new Date(2021, 11, 19)
      }
    })
    expect(vm.previousDecadeDisabled()).to.equal(false)
    expect(vm.nextDecadeDisabled()).to.equal(false)
  })

  it('can accept an array of disabled dates', () => {
    vm = getViewModel(Datepicker, {
      disabled: {
        dates: [
          new Date(2016, 9, 2),
          new Date(2016, 9, 9),
          new Date(2016, 9, 16)
        ]
      }
    })
    expect(vm.isDisabledDate(new Date(2016, 9, 2))).to.equal(true)
    expect(vm.isDisabledDate(new Date(2016, 9, 3))).to.equal(false)
  })

  it('can accept an array of disabled days of the week', () => {
    vm = getViewModel(Datepicker, {
      disabled: {
        days: [6, 0]
      }
    })
    expect(vm.isDisabledDate(new Date(2016, 9, 2))).to.equal(true)
    expect(vm.isDisabledDate(new Date(2016, 9, 3))).to.equal(false)
  })
})

describe('Datepicker highlight date', () => {
  beforeEach(() => {
    vm = getViewModel(Datepicker, {
      highlighted: {
        to: new Date(2016, 12, 8),
        from: new Date(2016, 12, 4)
      },
      disabled: {
        dates: [ new Date(2016, 12, 5) ]
      }
    })
    vm.setDate(new Date(2016, 9, 15))
  })

  it('should detect a highlighted date', () => {
    expect(vm.isHighlightedDate(new Date(2006, 9, 2))).to.equal(false)
    expect(vm.isHighlightedDate(new Date(2026, 9, 2))).to.equal(false)
  })

  it('should not highlight a disabled date', () => {
    expect(vm.isHighlightedDate(new Date(2016, 12, 5))).to.equal(false)
  })

  it('should highlight a date before the to property', () => {
    expect(vm.isHighlightedDate(new Date(2016, 12, 7))).to.equal(true)
  })

  it('should not highlight a date after the to property', () => {
    expect(vm.isHighlightedDate(new Date(2016, 12, 9))).to.equal(false)
  })

  it('should highlight a date after the from property', () => {
    expect(vm.isHighlightedDate(new Date(2016, 12, 6))).to.equal(true)
  })

  it('should not highlight a date before the from property', () => {
    expect(vm.isHighlightedDate(new Date(2016, 12, 3))).to.equal(false)
  })

  it('can accept an array of highlighted dates', () => {
    vm = getViewModel(Datepicker, {
      highlighted: {
        dates: [
          new Date(2016, 9, 2),
          new Date(2016, 9, 9),
          new Date(2016, 9, 16)
        ]
      }
    })
    expect(vm.isHighlightedDate(new Date(2016, 9, 2))).to.equal(true)
    expect(vm.isHighlightedDate(new Date(2016, 9, 3))).to.equal(false)
  })

  it('can accept an array of highlighted days of the week', () => {
    vm = getViewModel(Datepicker, {
      highlighted: {
        days: [6, 0]
      }
    })
    expect(vm.isHighlightedDate(new Date(2016, 9, 2))).to.equal(true)
    expect(vm.isHighlightedDate(new Date(2016, 9, 3))).to.equal(false)
  })
})

describe('Datepicker with monday as first day of week', () => {
  beforeEach(() => {
    vm = getViewModel(Datepicker, {
      mondayFirst: true
    })
  })

  it('should return Monday as a first day of week', () => {
    expect(vm.daysOfWeek[0]).to.equal('Mon')
  })

  it('should return Sunday as a seventh day of week', () => {
    expect(vm.daysOfWeek[6]).to.equal('Sun')
  })

  it('should have 6 blankDays when month starts from Sunday', () => {
    vm.currDate = new Date(2016, 4, 1).getTime()
    expect(vm.blankDays).to.equal(6)
  })

  it('should have no blankDays when month starts from Monday', () => {
    vm.currDate = new Date(2017, 4, 1).getTime()
    expect(vm.blankDays).to.equal(0)
  })
})

describe('Datepicker with initial-view', () => {
  it('should open in Day view', () => {
    vm = getViewModel(Datepicker)
    vm.showCalendar()
    expect(vm.initialView).to.equal('day')
    expect(vm.showDayView).to.equal(true)
    expect(vm.showMonthView).to.equal(false)
    expect(vm.showYearView).to.equal(false)
  })

  it('should open in Month view', () => {
    vm = getViewModel(Datepicker, {
      initialView: 'month'
    })
    vm.showCalendar()
    expect(vm.initialView).to.equal('month')
    expect(vm.showDayView).to.equal(false)
    expect(vm.showMonthView).to.equal(true)
    expect(vm.showYearView).to.equal(false)
  })

  it('should open in Year view', () => {
    vm = getViewModel(Datepicker, {
      initialView: 'year'
    })
    vm.showCalendar()
    expect(vm.initialView).to.equal('year')
    expect(vm.showDayView).to.equal(false)
    expect(vm.showMonthView).to.equal(false)
    expect(vm.showYearView).to.equal(true)
  })
})
