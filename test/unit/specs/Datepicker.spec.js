/* global describe, it, expect, beforeEach */

import Vue from 'vue'
import Datepicker from '@/components/Datepicker.vue'

let vm

function getViewModel (Component, propsData) {
  const Constructor = Vue.extend(Component)
  return new Constructor({ propsData }).$mount()
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
    const pageDate = new Date(vm.pageDate)
    expect(pageDate.getYear()).to.equal(now.getYear())
    expect(pageDate.getMonth()).to.equal(now.getMonth())
    expect(pageDate.getDate()).to.equal(1)
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

  it('clears the date', () => {
    const date = new Date(2016, 9, 9)
    const vm = getViewModel(Datepicker)
    vm.setDate(date.getTime())
    vm.clearDate()
    expect(vm.selectedDate).to.equal(null)
  })

  it('delegates date formatting', () => {
    const vm = getViewModel(Datepicker, {
      value: new Date(2016, 1, 15),
      format: () => '2016/1/15'
    })
    expect(vm.formattedValue).to.equal('2016/1/15')
  })
})

describe('Datepicker.vue', () => {
  beforeEach(() => {
    vm = getViewModel(Datepicker, {
      format: 'yyyy-MM-dd',
      value: new Date(2016, 1, 15)
    })
  })

  it('should render correct contents', () => {
    expect(vm.$el.querySelectorAll('input').length).to.equal(1)
    expect(vm.$el.querySelectorAll('.vdp-datepicker__calendar').length).to.equal(3)
  })

  it('should set pageTimestamp to be now', () => {
    const data = Datepicker.data()
    const d = new Date(data.pageTimestamp)
    expect(d.getFullYear()).to.equal(new Date().getFullYear())
    expect(d.getMonth()).to.equal(new Date().getMonth())
    expect(d.getDate()).to.equal(1)
  })

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
    expect(vm.pageTimestamp).to.equal(date.getTime())
    expect(vm.showDayView).to.equal(false)
  })

  it('can select a month', () => {
    const date = new Date(2016, 9, 9)
    vm.selectMonth({timestamp: date.getTime()})
    expect(vm.getPageMonth()).to.equal(9)
    expect(vm.showDayView).to.equal(true)
  })

  it('can select a year', () => {
    const date = new Date(2016, 9, 9)
    vm.selectYear({timestamp: date.getTime()})
    expect(vm.getPageYear()).to.equal(2016)
    expect(vm.showMonthView).to.equal(true)
  })

  it('can set the next month', () => {
    const date = new Date(2016, 9, 9)
    vm.selectDate({timestamp: date.getTime()})
    vm.nextMonth()
    expect(vm.getPageMonth()).to.equal(10)
  })

  it('can set the next month correctly on the last day of a 31 day month', () => {
    const date = new Date(2017, 4, 31)
    expect(date.getMonth()).to.equal(4)
    vm.selectDate({timestamp: date.getTime()})
    expect(vm.getPageMonth()).to.equal(4)
    expect(vm.getPageDate()).to.equal(1)
    vm.nextMonth()
    expect(vm.getPageMonth()).to.equal(5)
  })

  it('can set the previous month', () => {
    const date = new Date(2016, 9, 9)
    vm.selectDate({timestamp: date.getTime()})
    vm.previousMonth()
    expect(vm.getPageMonth()).to.equal(8)
    vm.previousMonth()
    expect(vm.getPageMonth()).to.equal(7)
  })

  it('can set the next year', () => {
    const date = new Date(2016, 9, 9)
    vm.selectDate({timestamp: date.getTime()})
    vm.nextYear()
    expect(vm.getPageYear()).to.equal(2017)
  })

  it('can set the previous year', () => {
    const date = new Date(2016, 9, 9)
    vm.selectDate({timestamp: date.getTime()})
    vm.previousYear()
    expect(vm.getPageYear()).to.equal(2015)
  })

  it('can set the next decade', () => {
    const date = new Date(2016, 9, 9)
    vm.selectDate({timestamp: date.getTime()})
    vm.nextDecade()
    expect(vm.getPageDecade()).to.equal('2020\'s')
  })

  it('can set the previous decade', () => {
    const date = new Date(2016, 9, 9)
    vm.selectDate({timestamp: date.getTime()})
    vm.previousDecade()
    expect(vm.getPageDecade()).to.equal('2000\'s')
  })

  it('should reset to default date', () => {
    const date = new Date(2016, 9, 9)
    vm.selectDate({timestamp: date.getTime()})
    expect(vm.getPageMonth()).to.equal(9)
    vm.nextMonth()
    expect(vm.getPageMonth()).to.equal(10)
    vm.resetDefaultDate()
    expect(vm.getPageMonth()).to.equal(9)
    vm.clearDate()
    vm.resetDefaultDate()
    expect(vm.getPageYear()).to.equal(new Date().getFullYear())
    expect(vm.getPageMonth()).to.equal(new Date().getMonth())
  })
})

describe('Datepicker.vue set by string', () => {
  it('can parse a string date', async () => {
    vm = getViewModel(Datepicker, {
      format: 'yyyy MM dd',
      value: '2016-02-20'
    })
    await vm.$nextTick(() => {
      expect(vm.$el.querySelector('input').value).to.equal('2016 02 20')
    })
  })

  it('should allow malformed value', async () => {
    vm = getViewModel(Datepicker, {
      value: 'today'
    })
    await vm.$nextTick(() => {
      expect(vm.$el.querySelector('input').value).to.equal('')
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

  it('should not close the calendar when date is selected', () => {
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

  it('can\'t change to a disabled month', () => {
    vm.previousMonth()
    expect(vm.getPageMonth()).to.equal(9)
    vm.nextMonth()
    expect(vm.getPageMonth()).to.equal(9)
  })

  it('can\'t change to a disabled year', () => {
    vm.previousYear()
    expect(vm.getPageYear()).to.equal(2016)
    vm.nextYear()
    expect(vm.getPageYear()).to.equal(2016)
  })

  it('can\'t change to a disabled decade', () => {
    vm.previousDecade()
    expect(vm.getPageYear()).to.equal(2016)
    vm.nextDecade()
    expect(vm.getPageYear()).to.equal(2016)
  })
})

describe('Datepicker respects disabled ranges', () => {
  beforeEach(() => {
    vm = getViewModel(Datepicker, {
      disabled: {
        ranges: [{
          from: new Date(2005, 6, 5),
          to: new Date(2016, 9, 4)
        }, {
          from: new Date(2016, 9, 26),
          to: new Date(2030, 12, 25)
        }]
      }
    })
  })

  it('should detect disabled dates', () => {
    expect(vm.isDisabledDate(new Date(2006, 9, 2))).to.equal(true)
    expect(vm.isDisabledDate(new Date(2026, 9, 2))).to.equal(true)
  })
})

describe('Datepicker has disabled dates but can change dates', () => {
  it('can change month despite having a disabled month', () => {
    vm = getViewModel(Datepicker, {
      disabled: {
        to: new Date(2016, 8, 5),
        from: new Date(2016, 10, 25)
      }
    })
    const newDate = new Date(2016, 9, 15)
    vm.setValue(newDate)
    expect(vm.getPageMonth()).to.equal(9)
    vm.previousMonth()
    expect(vm.getPageMonth()).to.equal(8)
    vm.nextMonth()
    expect(vm.getPageMonth()).to.equal(9)
  })

  it('can change year despite having a disabled year', () => {
    vm = getViewModel(Datepicker, {
      disabled: {
        to: new Date(2015, 8, 5),
        from: new Date(2017, 10, 25)
      }
    })
    const newDate = new Date(2016, 9, 15)
    vm.setValue(newDate)
    vm.previousYear()
    expect(vm.getPageYear()).to.equal(2015)
    vm.nextYear()
    expect(vm.getPageYear()).to.equal(2016)
  })

  it('can\'t change decade previous or next decades are disabled', () => {
    vm = getViewModel(Datepicker, {
      disabled: {
        to: new Date(2010, 8, 6),
        from: new Date(2017, 10, 24)
      }
    })
    const newDate = new Date(2016, 9, 15)
    vm.setValue(newDate)
    vm.previousDecade()
    expect(vm.getPageYear()).to.equal(2016)
    vm.nextDecade()
    expect(vm.getPageYear()).to.equal(2016)
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

  it('can accept an array of disabled days of the month', () => {
    vm = getViewModel(Datepicker, {
      disabled: {
        daysOfMonth: [29, 30, 31]
      }
    })
    expect(vm.isDisabledDate(new Date(2016, 8, 29))).to.equal(true)
    expect(vm.isDisabledDate(new Date(2016, 9, 31))).to.equal(true)
    expect(vm.isDisabledDate(new Date(2016, 10, 30))).to.equal(true)
    expect(vm.isDisabledDate(new Date(2016, 9, 11))).to.equal(false)
  })

  it('can accept a customPredictor to check if the date is disabled', () => {
    vm = getViewModel(Datepicker, {
      disabled: {
        customPredictor (date) {
          if (date.getDate() % 4 === 0) {
            return true
          }
        }
      }
    })
    expect(vm.isDisabledDate(new Date(2016, 8, 29))).to.equal(false)
    expect(vm.isDisabledDate(new Date(2016, 9, 28))).to.equal(true)
    expect(vm.isDisabledDate(new Date(2016, 10, 24))).to.equal(true)
    expect(vm.isDisabledDate(new Date(2016, 9, 11))).to.equal(false)
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

  it('can accept an array of highlighted days of the month', () => {
    vm = getViewModel(Datepicker, {
      highlighted: {
        daysOfMonth: [1, 10, 31]
      }
    })
    expect(vm.isHighlightedDate(new Date(2016, 9, 1))).to.equal(true)
    expect(vm.isHighlightedDate(new Date(2016, 10, 10))).to.equal(true)
    expect(vm.isHighlightedDate(new Date(2016, 11, 31))).to.equal(true)
    expect(vm.isHighlightedDate(new Date(2017, 8, 10))).to.equal(true)
    expect(vm.isHighlightedDate(new Date(2016, 8, 7))).to.equal(false)
    expect(vm.isHighlightedDate(new Date(2016, 7, 20))).to.equal(false)
  })

  it('can accept a customPredictor to check if the date is highlighted', () => {
    vm = getViewModel(Datepicker, {
      highlighted: {
        customPredictor (date) {
          if (date.getDate() % 5 === 0) {
            return true
          }
        }
      }
    })
    expect(vm.isHighlightedDate(new Date(2016, 8, 30))).to.equal(true)
    expect(vm.isHighlightedDate(new Date(2016, 9, 28))).to.equal(false)
    expect(vm.isHighlightedDate(new Date(2016, 10, 20))).to.equal(true)
    expect(vm.isHighlightedDate(new Date(2016, 9, 11))).to.equal(false)
  })

  it('should detect the first date of the highlighted dates', () => {
    expect(vm.isHighlightStart(new Date(2016, 12, 4))).to.equal(true)
    expect(vm.isHighlightStart(new Date(2016, 12, 3))).to.equal(false)
    expect(vm.isHighlightStart(new Date(2016, 12, 5))).to.equal(false)
  })

  it('should detect the last date of the highlighted dates', () => {
    expect(vm.isHighlightEnd(new Date(2016, 12, 8))).to.equal(true)
    expect(vm.isHighlightEnd(new Date(2016, 12, 6))).to.equal(false)
    expect(vm.isHighlightEnd(new Date(2016, 12, 7))).to.equal(false)
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
    vm.pageTimestamp = new Date(2016, 4, 1).getTime()
    expect(vm.blankDays).to.equal(6)
  })

  it('should have no blankDays when month starts from Monday', () => {
    vm.pageTimestamp = new Date(2017, 4, 1).getTime()
    expect(vm.blankDays).to.equal(0)
  })
})

describe('Datepicker with initial-view', () => {
  it('should open in Day view', () => {
    vm = getViewModel(Datepicker)
    vm.showCalendar()
    expect(vm.computedInitialView).to.equal('day')
    expect(vm.showDayView).to.equal(true)
    expect(vm.showMonthView).to.equal(false)
    expect(vm.showYearView).to.equal(false)
  })

  it('should open in Month view', () => {
    vm = getViewModel(Datepicker, {
      initialView: 'month'
    })
    vm.showCalendar()
    expect(vm.computedInitialView).to.equal('month')
    expect(vm.showDayView).to.equal(false)
    expect(vm.showMonthView).to.equal(true)
    expect(vm.showYearView).to.equal(false)
  })

  it('should open in Year view', () => {
    vm = getViewModel(Datepicker, {
      initialView: 'year'
    })
    vm.showCalendar()
    expect(vm.computedInitialView).to.equal('year')
    expect(vm.showDayView).to.equal(false)
    expect(vm.showMonthView).to.equal(false)
    expect(vm.showYearView).to.equal(true)
  })
})

describe('Datepicker with open date', () => {
  const openDate = new Date(2016, 9, 12)

  beforeEach(() => {
    vm = getViewModel(Datepicker, {
      openDate: openDate
    })
  })

  it('should be set to november', () => {
    expect(vm.getPageMonth()).to.equal(9)
    expect(vm.getPageYear()).to.equal(2016)
  })

  it('should set pageTimestamp to be first day of open date\'s month', () => {
    const d = new Date(vm.pageTimestamp)
    expect(vm.openDate.getTime()).to.equal(openDate.getTime())
    vm.setPageDate()
    expect(d.getFullYear()).to.equal(openDate.getFullYear())
    expect(d.getMonth()).to.equal(openDate.getMonth())
    expect(d.getDate()).to.equal(1)
  })

  it('should open with selected date if one is set', () => {
    const newDate = new Date(2018, 10, 9)
    vm.selectDate({timestamp: newDate.getTime()})
    expect(vm.getPageMonth()).to.equal(10)
    expect(vm.getPageYear()).to.equal(2018)
  })

  it('should show today\'s date if no open date is set', () => {
    vm = getViewModel(Datepicker, {})
    const today = new Date()
    expect(vm.getPageMonth()).to.equal(today.getMonth())
    expect(vm.getPageYear()).to.equal(today.getFullYear())
  })
})

describe('Datepicker with restricted views', () => {
  it('should default initialVicomputedInitialViewew to minimumView', () => {
    vm = getViewModel(Datepicker, {
      minimumView: 'month',
      maximumView: 'month'
    })
    expect(vm.computedInitialView).to.equal('month')
  })

  it('should save and close when selecting on minimum-view "month"', () => {
    vm = getViewModel(Datepicker, {
      minimumView: 'month',
      maximumView: 'year'
    })
    vm.selectYear(vm.years[0])
    expect(vm.isOpen).to.equal(true)
    vm.selectMonth(vm.months[0])
    expect(vm.years[0].year).to.equal(vm.selectedDate.getFullYear())
    const inputDate = new Date(vm.months[0].timestamp)
    expect(inputDate.getMonth()).to.equal(vm.selectedDate.getMonth())
    expect(vm.isOpen).to.equal(false)
  })

  it('should save and close when selecting on minimum-view "year"', () => {
    vm = getViewModel(Datepicker, {
      minimumView: 'year',
      maximumView: 'year'
    })
    vm.selectYear(vm.years[0])
    expect(vm.isOpen).to.equal(false)
    expect(vm.years[0].year).to.equal(vm.selectedDate.getFullYear())
  })

  it('should only allow views in min-max range', () => {
    vm = getViewModel(Datepicker, {
      minimumView: 'day',
      maximumView: 'month'
    })
    expect(vm.allowedToShowView('year')).to.equal(false)
    expect(vm.allowedToShowView('day')).to.equal(true)
    expect(vm.allowedToShowView('month')).to.equal(true)

    vm = getViewModel(Datepicker, {
      minimumView: 'month',
      maximumView: 'month'
    })
    expect(vm.allowedToShowView('day')).to.equal(false)
    expect(vm.allowedToShowView('year')).to.equal(false)
    expect(vm.allowedToShowView('month')).to.equal(true)

    vm = getViewModel(Datepicker, {
      minimumView: 'day',
      maximumView: 'year'
    })
    expect(vm.allowedToShowView('day')).to.equal(true)
    expect(vm.allowedToShowView('year')).to.equal(true)
    expect(vm.allowedToShowView('month')).to.equal(true)
  })

  it('should throw an error on disallowed initial views', () => {
    vm = getViewModel(Datepicker, {
      minimumView: 'day',
      maximumView: 'month',
      initialView: 'year'
    })

    expect(function () {
      vm.setInitialView()
    }).to.throw()
  })

  it('should not render unused views', () => {
    vm = getViewModel(Datepicker, {
      minimumView: 'day',
      maximumView: 'day'
    })
    vm.showCalendar()
    expect(vm.$el.querySelectorAll('.vdp-datepicker__calendar').length).to.equal(1)
    expect(vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.month').length).to.equal(0)
    expect(vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.year').length).to.equal(0)

    vm = getViewModel(Datepicker, {
      minimumView: 'month',
      maximumView: 'year'
    })
    vm.showCalendar()
    expect(vm.$el.querySelectorAll('.vdp-datepicker__calendar').length).to.equal(2)
    expect(vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.day').length).to.equal(0)
    expect(vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.year').length).to.not.equal(0)
  })
})
