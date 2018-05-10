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
})

describe('Datepicker mounted', () => {
  let wrapper
  let date
  beforeEach(() => {
    date = new Date(2016, 1, 15)
    wrapper = shallow(Datepicker, {
      propsData: {
        format: 'yyyy-MM-dd',
        value: date
      }
    })
  })

  it('correctly sets the value when created', () => {
    expect(wrapper.vm.value).toEqual(date)
  })

  it('correctly sets the value from method', () => {
    const newDate = new Date(2016, 9, 15)
    expect(typeof wrapper.vm.setValue).toEqual('function')
    wrapper.vm.setValue(newDate)
    expect(wrapper.vm.selectedDate).toEqual(newDate)
    const now = new Date()
    wrapper.vm.setValue()
    expect(wrapper.vm.selectedDate).toEqual(null)
    const pageDate = new Date(wrapper.vm.pageDate)
    expect(pageDate.getFullYear()).toEqual(now.getFullYear())
    expect(pageDate.getMonth()).toEqual(now.getMonth())
    expect(pageDate.getDate()).toEqual(1)
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
    // calendar is already open so acts as a toggle
    wrapper.vm.showCalendar()
    expect(wrapper.vm.isOpen).toEqual(false)
  })

  it('can select a day', () => {
    const date = new Date(2016, 9, 1)
    wrapper.vm.selectDate({timestamp: date.getTime()})
    expect(wrapper.vm.pageTimestamp).toEqual(date.getTime())
    expect(wrapper.vm.selectedDate.getMonth()).toEqual(9)
    expect(wrapper.vm.showDayView).toEqual(false)
  })

  it('can select a month', () => {
    const date = new Date(2016, 9, 9)
    wrapper.vm.selectMonth({timestamp: date.getTime()})
    expect(wrapper.emitted().changedMonth).toBeTruthy()
    expect(wrapper.emitted().changedMonth[0][0].timestamp).toEqual(date.getTime())
    expect(new Date(wrapper.vm.pageTimestamp).getMonth()).toEqual(date.getMonth())
    expect(wrapper.vm.showDayView).toEqual(true)
  })

  it('can select a year', () => {
    const date = new Date(2018, 9, 9)
    wrapper.vm.selectYear({timestamp: date.getTime()})
    expect(wrapper.emitted().changedYear).toBeTruthy()
    expect(wrapper.emitted().changedYear[0][0].timestamp).toEqual(date.getTime())
    expect(new Date(wrapper.vm.pageTimestamp).getFullYear()).toEqual(date.getFullYear())
    expect(wrapper.vm.showMonthView).toEqual(true)
  })

  it('resets the default page date', () => {
    const wrapper = shallow(Datepicker)
    const today = new Date()
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(today.getFullYear())
    expect(wrapper.vm.pageDate.getMonth()).toEqual(today.getMonth())
    expect(wrapper.vm.pageDate.getDate()).toEqual(1)
    wrapper.vm.resetDefaultPageDate()
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(today.getFullYear())
    expect(wrapper.vm.pageDate.getMonth()).toEqual(today.getMonth())
    expect(wrapper.vm.pageDate.getDate()).toEqual(1)
  })

  it('does not set the default page date if a date is selected', () => {
    const wrapper = shallow(Datepicker)
    const today = new Date()
    const pastDate = new Date(2018, 3, 20)
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(today.getFullYear())
    expect(wrapper.vm.pageDate.getMonth()).toEqual(today.getMonth())
    expect(wrapper.vm.pageDate.getDate()).toEqual(1)
    wrapper.vm.setDate(pastDate.getTime())
    wrapper.vm.resetDefaultPageDate()
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(pastDate.getFullYear())
    expect(wrapper.vm.pageDate.getMonth()).toEqual(pastDate.getMonth())
    expect(wrapper.vm.pageDate.getDate()).toEqual(1)
  })

  it('sets the date on typedDate event', () => {
    const wrapper = shallow(Datepicker)
    const today = new Date()
    wrapper.vm.setTypedDate(today)
    expect(wrapper.vm.selectedDate).toEqual(today)
  })

  it('watches value', async () => {
    const wrapper = shallow(Datepicker, {
      propsData: {
        value: '2018-01-01'
      }
    })
    const spy = jest.spyOn(wrapper.vm, 'setValue')
    wrapper.vm.value = '2018-04-26'
    await wrapper.vm.$nextTick()
    expect(spy).toBeCalled()
  })

  it('watches openDate', async () => {
    const wrapper = shallow(Datepicker, {
      propsData: {
        openDate: new Date(2018, 0, 1)
      }
    })
    const spy = jest.spyOn(wrapper.vm, 'setPageDate')
    wrapper.vm.openDate = new Date(2018, 3, 26)
    await wrapper.vm.$nextTick()
    expect(spy).toBeCalled()
  })

  it('watches initialView', async () => {
    const wrapper = shallow(Datepicker, {
      propsData: {
        initialView: 'day'
      }
    })
    const spy = jest.spyOn(wrapper.vm, 'setInitialView')
    wrapper.vm.initialView = 'month'
    await wrapper.vm.$nextTick()
    expect(spy).toBeCalled()
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
    expect(wrapper.vm.selectedDate.getUTCFullYear()).toEqual(2016)
    expect(wrapper.vm.selectedDate.getUTCMonth()).toEqual(1)
    expect(wrapper.vm.selectedDate.getUTCDate()).toEqual(20)
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
    expect(wrapper.vm.selectedDate.getUTCFullYear()).toEqual(2018)
    expect(wrapper.vm.selectedDate.getUTCMonth()).toEqual(0)
    expect(wrapper.vm.selectedDate.getUTCDate()).toEqual(29)
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

