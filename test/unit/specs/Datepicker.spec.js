import Datepicker from '@/components/Datepicker.vue'
import {shallow} from '@vue/test-utils'

describe('Datepicker unmounted', () => {
  it('has a mounted hook', () => {
    expect(typeof Datepicker.mounted).toEqual('function')
  })

  it('sets the correct default data', () => {
    expect(typeof Datepicker.data).toEqual('function')
    const defaultData = Datepicker.data()
    expect(defaultData.selectedDate).toEqual(null)
    expect(defaultData.showDayView).toEqual(false)
    expect(defaultData.showMonthView).toEqual(false)
    expect(defaultData.showYearView).toEqual(false)
    expect(defaultData.calendarHeight).toEqual(0)
  })

  it('correctly sets the value when created', () => {
    const date = new Date(2016, 1, 15)
    const wrapper = shallow(Datepicker, {
      propsData: {
        value: date
      }
    })
    expect(wrapper.vm.value).toEqual(date)
  })
})

describe('Datepicker: mounted component', () => {
  it('correctly sets the value from method', () => {
    const date = new Date(2016, 1, 15)
    const wrapper = shallow(Datepicker, {
      propsData: {
        value: date,
        format: 'yyyy-MM-dd'
      }
    })
    const newDate = new Date(2016, 9, 15)
    expect(typeof wrapper.vm.setValue).toEqual('function')
    wrapper.vm.setValue(newDate)
    expect(wrapper.vm.selectedDate).toEqual(newDate)
    const now = new Date()
    wrapper.vm.setValue()
    expect(wrapper.vm.selectedDate).toEqual(null)
    const pageDate = new Date(wrapper.vm.pageDate)
    expect(pageDate.getYear()).toEqual(now.getYear())
    expect(pageDate.getMonth()).toEqual(now.getMonth())
    expect(pageDate.getDate()).toEqual(1)
  })

  it('knows the selected year', () => {
    const newDate = new Date(2016, 9, 15)
    const wrapper = shallow(Datepicker)
    wrapper.vm.setValue(newDate)
    expect(wrapper.vm.isSelectedYear(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedYear(new Date(2017, 1, 15))).toEqual(false)
  })

  it('knows the selected month', () => {
    const newDate = new Date(2016, 9, 15)
    const wrapper = shallow(Datepicker)
    wrapper.vm.setValue(newDate)
    expect(wrapper.vm.isSelectedMonth(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedMonth(new Date(2017, 1, 15))).toEqual(false)
  })

  it('knows the selected date', () => {
    const newDate = new Date(2016, 9, 15)
    const wrapper = shallow(Datepicker)
    wrapper.vm.setValue(newDate)
    expect(wrapper.vm.isSelectedDate(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedDate(new Date(2017, 1, 1))).toEqual(false)
  })

  it('sets the date', () => {
    const date = new Date(2016, 9, 9)
    const wrapper = shallow(Datepicker, {
      propsData: {
        format: 'yyyy-MM-dd'
      }
    })
    wrapper.vm.setDate(date.getTime())
    expect(wrapper.vm.selectedDate.getTime()).toEqual(date.getTime())
  })

  it('clears the date', () => {
    const date = new Date(2016, 9, 9)
    const wrapper = shallow(Datepicker)
    wrapper.vm.setDate(date.getTime())
    wrapper.vm.clearDate()
    expect(wrapper.vm.selectedDate).toEqual(null)
  })
})

describe('Datepicker.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(Datepicker, {
      propsData: {
        format: 'yyyy-MM-dd',
        value: new Date(2016, 1, 15)
      }
    })
  })

  it('should render correct contents', () => {
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar').length).toEqual(3)
  })

  it('should set pageTimestamp to be now', () => {
    const data = Datepicker.data()
    const d = new Date(data.pageTimestamp)
    expect(d.getFullYear()).toEqual(new Date().getFullYear())
    expect(d.getMonth()).toEqual(new Date().getMonth())
    expect(d.getDate()).toEqual(1)
  })

  it('should open and close the calendar', () => {
    wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.showMonthCalendar()
    expect(wrapper.vm.isOpen).toEqual(true)

    wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.showYearCalendar()
    expect(wrapper.vm.isOpen).toEqual(true)

    wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.showDayCalendar()
    expect(wrapper.vm.isOpen).toEqual(true)
  })

  it('can select a day', () => {
    const date = new Date(2016, 9, 1)
    wrapper.vm.selectDate({timestamp: date.getTime()})
    expect(wrapper.vm.pageTimestamp).toEqual(date.getTime())
    expect(wrapper.vm.showDayView).toEqual(false)
  })

  it('can select a month', () => {
    const date = new Date(2016, 9, 9)
    wrapper.vm.selectMonth({timestamp: date.getTime()})
    expect(wrapper.vm.getPageMonth()).toEqual(9)
    expect(wrapper.vm.showDayView).toEqual(true)
  })

  it('can select a year', () => {
    const date = new Date(2016, 9, 9)
    wrapper.vm.selectYear({timestamp: date.getTime()})
    expect(wrapper.vm.getPageYear()).toEqual(2016)
    expect(wrapper.vm.showMonthView).toEqual(true)
  })

  it('can set the next month', () => {
    const date = new Date(2016, 9, 9)
    wrapper.vm.selectDate({timestamp: date.getTime()})
    wrapper.vm.nextMonth()
    expect(wrapper.vm.getPageMonth()).toEqual(10)
  })

  it('can set the next month correctly on the last day of a 31 day month', () => {
    const date = new Date(2017, 4, 31)
    expect(date.getMonth()).toEqual(4)
    wrapper.vm.selectDate({timestamp: date.getTime()})
    expect(wrapper.vm.getPageMonth()).toEqual(4)
    expect(wrapper.vm.getPageDate()).toEqual(1)
    wrapper.vm.nextMonth()
    expect(wrapper.vm.getPageMonth()).toEqual(5)
  })

  it('can set the previous month', () => {
    const date = new Date(2016, 9, 9)
    wrapper.vm.selectDate({timestamp: date.getTime()})
    wrapper.vm.previousMonth()
    expect(wrapper.vm.getPageMonth()).toEqual(8)
    wrapper.vm.previousMonth()
    expect(wrapper.vm.getPageMonth()).toEqual(7)
  })

  it('can set the next year', () => {
    const date = new Date(2016, 9, 9)
    wrapper.vm.selectDate({timestamp: date.getTime()})
    wrapper.vm.nextYear()
    expect(wrapper.vm.getPageYear()).toEqual(2017)
  })

  it('can set the previous year', () => {
    const date = new Date(2016, 9, 9)
    wrapper.vm.selectDate({timestamp: date.getTime()})
    wrapper.vm.previousYear()
    expect(wrapper.vm.getPageYear()).toEqual(2015)
  })

  it('can set the next decade', () => {
    const date = new Date(2016, 9, 9)
    wrapper.vm.selectDate({timestamp: date.getTime()})
    wrapper.vm.nextDecade()
    expect(wrapper.vm.getPageDecade()).toEqual('2020 - 2029')
  })

  it('can set the previous decade', () => {
    const date = new Date(2016, 9, 9)
    wrapper.vm.selectDate({timestamp: date.getTime()})
    wrapper.vm.previousDecade()
    expect(wrapper.vm.getPageDecade()).toEqual('2000 - 2009')
  })

  it('should reset to default date', () => {
    const date = new Date(2016, 9, 9)
    wrapper.vm.selectDate({timestamp: date.getTime()})
    expect(wrapper.vm.getPageMonth()).toEqual(9)
    wrapper.vm.nextMonth()
    expect(wrapper.vm.getPageMonth()).toEqual(10)
    wrapper.vm.resetDefaultDate()
    expect(wrapper.vm.getPageMonth()).toEqual(9)
    wrapper.vm.clearDate()
    wrapper.vm.resetDefaultDate()
    expect(wrapper.vm.getPageYear()).toEqual(new Date().getFullYear())
    expect(wrapper.vm.getPageMonth()).toEqual(new Date().getMonth())
  })
})

describe('Datepicker.vue set by string', () => {
  let wrapper
  it('can parse a string date', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        format: 'yyyy MM dd',
        value: '2016-02-20'
      }
    })
    expect(wrapper.vm.selectedDate.getFullYear()).toEqual(2016)
    expect(wrapper.vm.selectedDate.getMonth()).toEqual(1)
    expect(wrapper.vm.selectedDate.getDate()).toEqual(20)
  })

  it('should nullify malformed value', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        value: 'today'
      }
    })
    expect(wrapper.vm.selectedDate).toBeNull()
  })
})

describe('Datepicker.vue set by timestamp', () => {
  let wrapper
  it('can parse unix timestamp', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        format: 'yyyy MM dd',
        value: 1517194697668
      }
    })
    expect(wrapper.vm.selectedDate.getFullYear()).toEqual(2018)
    expect(wrapper.vm.selectedDate.getMonth()).toEqual(0)
    expect(wrapper.vm.selectedDate.getDate()).toEqual(29)
  })
})

describe('Datepicker.vue inline', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(Datepicker, {
      propsData: {
        inline: true
      }
    })
  })

  it('should not showCalendar as already open', () => {
    expect(wrapper.vm.showCalendar()).toEqual(false)
    expect(wrapper.vm.isInline).toEqual(true)
  })

  it('should not close the calendar when date is selected', () => {
    const date = new Date()
    wrapper.vm.selectDate({timestamp: date.getTime()})
    expect(wrapper.vm.isOpen).toEqual(true)
    document.body.click()
    expect(wrapper.vm.isOpen).toEqual(true)
  })
})

describe('Datepicker disabled dates', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(Datepicker, {
      propsData: {
        disabled: {
          to: new Date(2016, 9, 4),
          from: new Date(2016, 9, 26)
        }
      }
    })
    wrapper.vm.setDate(new Date(2016, 9, 15))
  })

  it('should close showCalendar if already open', () => {
    expect(wrapper.vm.isInline).toEqual(false)
    wrapper.vm.showCalendar()
    expect(wrapper.vm.isOpen).toEqual(true)
    wrapper.vm.showCalendar()
    expect(wrapper.vm.isOpen).toEqual(false)
  })

  it('should detect a disabled date', () => {
    expect(wrapper.vm.isDisabledDate(new Date(2006, 9, 2))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2026, 9, 2))).toEqual(true)
  })

  it('should not select a disabled date', () => {
    expect(wrapper.vm.selectDate({isDisabled: true})).toEqual(false)
    expect(wrapper.vm.selectMonth({isDisabled: true})).toEqual(false)
    expect(wrapper.vm.selectYear({isDisabled: true})).toEqual(false)
  })

  it('can\'t change to a disabled month', () => {
    wrapper.vm.previousMonth()
    expect(wrapper.vm.getPageMonth()).toEqual(9)
    wrapper.vm.nextMonth()
    expect(wrapper.vm.getPageMonth()).toEqual(9)
  })

  it('can\'t change to a disabled year', () => {
    wrapper.vm.previousYear()
    expect(wrapper.vm.getPageYear()).toEqual(2016)
    wrapper.vm.nextYear()
    expect(wrapper.vm.getPageYear()).toEqual(2016)
  })

  it('can\'t change to a disabled decade', () => {
    wrapper.vm.previousDecade()
    expect(wrapper.vm.getPageYear()).toEqual(2016)
    wrapper.vm.nextDecade()
    expect(wrapper.vm.getPageYear()).toEqual(2016)
  })
})

describe('Datepicker respects disabled ranges', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(Datepicker, {
      propsData: {
        disabled: {
          ranges: [{
            from: new Date(2005, 6, 5),
            to: new Date(2016, 9, 4)
          }, {
            from: new Date(2016, 9, 26),
            to: new Date(2030, 12, 25)
          }]
        }
      }
    })
  })

  it('should detect disabled dates', () => {
    expect(wrapper.vm.isDisabledDate(new Date(2006, 9, 2))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2026, 9, 2))).toEqual(true)
  })
})

describe('Datepicker has disabled dates but can change dates', () => {
  let wrapper
  it('can change month despite having a disabled month', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        disabled: {
          to: new Date(2016, 8, 5),
          from: new Date(2016, 10, 25)
        }
      }
    })
    const newDate = new Date(2016, 9, 15)
    wrapper.vm.setValue(newDate)
    expect(wrapper.vm.getPageMonth()).toEqual(9)
    wrapper.vm.previousMonth()
    expect(wrapper.vm.getPageMonth()).toEqual(8)
    wrapper.vm.nextMonth()
    expect(wrapper.vm.getPageMonth()).toEqual(9)
  })

  it('can change year despite having a disabled year', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        disabled: {
          to: new Date(2015, 8, 5),
          from: new Date(2017, 10, 25)
        }
      }
    })
    const newDate = new Date(2016, 9, 15)
    wrapper.vm.setValue(newDate)
    wrapper.vm.previousYear()
    expect(wrapper.vm.getPageYear()).toEqual(2015)
    wrapper.vm.nextYear()
    expect(wrapper.vm.getPageYear()).toEqual(2016)
  })

  it('can\'t change decade previous or next decades are disabled', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        disabled: {
          to: new Date(2010, 8, 6),
          from: new Date(2017, 10, 24)
        }
      }
    })
    const newDate = new Date(2016, 9, 15)
    wrapper.vm.setValue(newDate)
    wrapper.vm.previousDecade()
    expect(wrapper.vm.getPageYear()).toEqual(2016)
    wrapper.vm.nextDecade()
    expect(wrapper.vm.getPageYear()).toEqual(2016)
  })

  it('can change decade despite having a disabled decade', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        disabled: {
          to: new Date(2000, 11, 19),
          from: new Date(2021, 11, 19)
        }
      }
    })
    expect(wrapper.vm.previousDecadeDisabled()).toEqual(false)
    expect(wrapper.vm.nextDecadeDisabled()).toEqual(false)
  })

  it('can accept an array of disabled dates', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        disabled: {
          dates: [
            new Date(2016, 9, 2),
            new Date(2016, 9, 9),
            new Date(2016, 9, 16)
          ]
        }
      }
    })
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 2))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 3))).toEqual(false)
  })

  it('can accept an array of disabled days of the week', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        disabled: {
          days: [6, 0]
        }
      }
    })
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 2))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 3))).toEqual(false)
  })

  it('can accept an array of disabled days of the month', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        disabled: {
          daysOfMonth: [29, 30, 31]
        }
      }
    })
    expect(wrapper.vm.isDisabledDate(new Date(2016, 8, 29))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 31))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 10, 30))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 11))).toEqual(false)
  })

  it('can accept a customPredictor to check if the date is disabled', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        disabled: {
          customPredictor (date) {
            if (date.getDate() % 4 === 0) {
              return true
            }
          }
        }
      }
    })
    expect(wrapper.vm.isDisabledDate(new Date(2016, 8, 29))).toEqual(false)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 28))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 10, 24))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 11))).toEqual(false)
  })
})

describe('Datepicker highlight date', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(Datepicker, {
      propsData: {
        highlighted: {
          to: new Date(2016, 12, 8),
          from: new Date(2016, 12, 4)
        },
        disabled: {
          dates: [ new Date(2016, 12, 5) ]
        }
      }
    })
    wrapper.vm.setDate(new Date(2016, 9, 15))
  })

  it('should detect a highlighted date', () => {
    expect(wrapper.vm.isHighlightedDate(new Date(2006, 9, 2))).toEqual(false)
    expect(wrapper.vm.isHighlightedDate(new Date(2026, 9, 2))).toEqual(false)
  })

  it('should not highlight a disabled date', () => {
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 12, 5))).toEqual(false)
  })

  it('should highlight a disabled date when explicitly configured to', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        highlighted: {
          to: new Date(2016, 12, 8),
          from: new Date(2016, 12, 4),
          includeDisabled: true
        },
        disabled: {
          dates: [ new Date(2016, 12, 5) ]
        }
      }
    })
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 12, 5))).toEqual(true)
  })

  it('should highlight a date before the to property', () => {
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 12, 7))).toEqual(true)
  })

  it('should not highlight a date after the to property', () => {
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 12, 9))).toEqual(false)
  })

  it('should highlight a date after the from property', () => {
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 12, 6))).toEqual(true)
  })

  it('should not highlight a date before the from property', () => {
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 12, 3))).toEqual(false)
  })

  it('can accept an array of highlighted dates', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        highlighted: {
          dates: [
            new Date(2016, 9, 2),
            new Date(2016, 9, 9),
            new Date(2016, 9, 16)
          ]
        }
      }
    })
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 2))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 3))).toEqual(false)
  })

  it('can accept an array of highlighted days of the week', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        highlighted: {
          days: [6, 0]
        }
      }
    })
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 2))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 3))).toEqual(false)
  })

  it('can accept an array of highlighted days of the month', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        highlighted: {
          daysOfMonth: [1, 10, 31]
        }
      }
    })
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 1))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 10, 10))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 11, 31))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2017, 8, 10))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 8, 7))).toEqual(false)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 7, 20))).toEqual(false)
  })

  it('can accept a customPredictor to check if the date is highlighted', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        highlighted: {
          customPredictor (date) {
            if (date.getDate() % 5 === 0) {
              return true
            }
          }
        }
      }
    })
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 8, 30))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 28))).toEqual(false)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 10, 20))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 11))).toEqual(false)
  })

  it('should detect the first date of the highlighted dates', () => {
    expect(wrapper.vm.isHighlightStart(new Date(2016, 12, 4))).toEqual(true)
    expect(wrapper.vm.isHighlightStart(new Date(2016, 12, 3))).toEqual(false)
    expect(wrapper.vm.isHighlightStart(new Date(2016, 12, 5))).toEqual(false)
  })

  it('should detect the last date of the highlighted dates', () => {
    expect(wrapper.vm.isHighlightEnd(new Date(2016, 12, 8))).toEqual(true)
    expect(wrapper.vm.isHighlightEnd(new Date(2016, 12, 6))).toEqual(false)
    expect(wrapper.vm.isHighlightEnd(new Date(2016, 12, 7))).toEqual(false)
  })
})

describe('Datepicker with monday as first day of week', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(Datepicker, {
      propsData: {
        mondayFirst: true
      }
    })
  })

  it('should return Monday as a first day of week', () => {
    expect(wrapper.vm.daysOfWeek[0]).toEqual('Mon')
  })

  it('should return Sunday as a seventh day of week', () => {
    expect(wrapper.vm.daysOfWeek[6]).toEqual('Sun')
  })

  it('should have 6 blankDays when month starts from Sunday', () => {
    wrapper.vm.pageTimestamp = new Date(2016, 4, 1).getTime()
    expect(wrapper.vm.blankDays).toEqual(6)
  })

  it('should have no blankDays when month starts from Monday', () => {
    wrapper.vm.pageTimestamp = new Date(2017, 4, 1).getTime()
    expect(wrapper.vm.blankDays).toEqual(0)
  })
})

describe('Datepicker with initial-view', () => {
  let wrapper
  it('should open in Day view', () => {
    wrapper = shallow(Datepicker)
    wrapper.vm.showCalendar()
    expect(wrapper.vm.computedInitialView).toEqual('day')
    expect(wrapper.vm.showDayView).toEqual(true)
    expect(wrapper.vm.showMonthView).toEqual(false)
    expect(wrapper.vm.showYearView).toEqual(false)
  })

  it('should open in Month view', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        initialView: 'month'
      }
    })
    wrapper.vm.showCalendar()
    expect(wrapper.vm.computedInitialView).toEqual('month')
    expect(wrapper.vm.showDayView).toEqual(false)
    expect(wrapper.vm.showMonthView).toEqual(true)
    expect(wrapper.vm.showYearView).toEqual(false)
  })

  it('should open in Year view', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        initialView: 'year'
      }
    })
    wrapper.vm.showCalendar()
    expect(wrapper.vm.computedInitialView).toEqual('year')
    expect(wrapper.vm.showDayView).toEqual(false)
    expect(wrapper.vm.showMonthView).toEqual(false)
    expect(wrapper.vm.showYearView).toEqual(true)
  })
})

describe('Datepicker with open date', () => {
  const openDate = new Date(2016, 9, 12)
  let wrapper
  beforeEach(() => {
    wrapper = shallow(Datepicker, {
      propsData: {
        openDate: openDate
      }
    })
  })

  it('should be set to november', () => {
    expect(wrapper.vm.getPageMonth()).toEqual(9)
    expect(wrapper.vm.getPageYear()).toEqual(2016)
  })

  it('should set pageTimestamp to be first day of open date\'s month', () => {
    const d = new Date(wrapper.vm.pageTimestamp)
    expect(wrapper.vm.openDate.getTime()).toEqual(openDate.getTime())
    wrapper.vm.setPageDate()
    expect(d.getFullYear()).toEqual(openDate.getFullYear())
    expect(d.getMonth()).toEqual(openDate.getMonth())
    expect(d.getDate()).toEqual(1)
  })

  it('should open with selected date if one is set', () => {
    const newDate = new Date(2018, 10, 9)
    wrapper.vm.selectDate({timestamp: newDate.getTime()})
    expect(wrapper.vm.getPageMonth()).toEqual(10)
    expect(wrapper.vm.getPageYear()).toEqual(2018)
  })

  it('should show today\'s date if no open date is set', () => {
    wrapper = shallow(Datepicker)
    const today = new Date()
    expect(wrapper.vm.getPageMonth()).toEqual(today.getMonth())
    expect(wrapper.vm.getPageYear()).toEqual(today.getFullYear())
  })
})

describe('Datepicker with restricted views', () => {
  let wrapper
  it('should default initialVicomputedInitialViewew to minimumView', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        minimumView: 'month',
        maximumView: 'month'
      }
    })
    expect(wrapper.vm.computedInitialView).toEqual('month')
  })

  it('should save and close when selecting on minimum-view "month"', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        minimumView: 'month',
        maximumView: 'year'
      }
    })
    wrapper.vm.selectYear(wrapper.vm.years[0])
    expect(wrapper.vm.isOpen).toEqual(true)
    wrapper.vm.selectMonth(wrapper.vm.months[0])
    expect(wrapper.vm.years[0].year).toEqual(wrapper.vm.selectedDate.getFullYear())
    const inputDate = new Date(wrapper.vm.months[0].timestamp)
    expect(inputDate.getMonth()).toEqual(wrapper.vm.selectedDate.getMonth())
    expect(wrapper.vm.isOpen).toEqual(false)
  })

  it('should save and close when selecting on minimum-view "year"', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        minimumView: 'year',
        maximumView: 'year'
      }
    })
    wrapper.vm.selectYear(wrapper.vm.years[0])
    expect(wrapper.vm.isOpen).toEqual(false)
    expect(wrapper.vm.years[0].year).toEqual(wrapper.vm.selectedDate.getFullYear())
  })

  it('should only allow views in min-max range', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        minimumView: 'day',
        maximumView: 'month'
      }
    })
    expect(wrapper.vm.allowedToShowView('year')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('day')).toEqual(true)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)

    wrapper = shallow(Datepicker, {
      propsData: {
        minimumView: 'month',
        maximumView: 'month'
      }
    })
    expect(wrapper.vm.allowedToShowView('day')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('year')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)

    wrapper = shallow(Datepicker, {
      propsData: {
        minimumView: 'day',
        maximumView: 'year'
      }
    })
    expect(wrapper.vm.allowedToShowView('day')).toEqual(true)
    expect(wrapper.vm.allowedToShowView('year')).toEqual(true)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)
  })

  it('should throw an error on disallowed initial views', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        minimumView: 'day',
        maximumView: 'month',
        initialView: 'year'
      }
    })

    expect(function () {
      wrapper.vm.setInitialView()
    }).toThrow()
  })

  it('should not render unused views', () => {
    wrapper = shallow(Datepicker, {
      propsData: {
        minimumView: 'day',
        maximumView: 'day'
      }
    })
    wrapper.vm.showCalendar()
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar').length).toEqual(1)
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.month').length).toEqual(0)
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.year').length).toEqual(0)

    wrapper = shallow(Datepicker, {
      propsData: {
        minimumView: 'month',
        maximumView: 'year'
      }
    })
    wrapper.vm.showCalendar()
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar').length).toEqual(2)
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.day').length).toEqual(0)
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.year').length).toBeGreaterThan(0)
  })
})
