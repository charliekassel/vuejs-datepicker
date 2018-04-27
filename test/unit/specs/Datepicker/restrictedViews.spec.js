import Datepicker from '@/components/Datepicker.vue'
import {mount} from '@vue/test-utils'

describe('Datepicker with restricted views', () => {
  let wrapper
  it('should default initialView to minimumView', () => {
    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'month',
        maximumView: 'month'
      }
    })
    expect(wrapper.vm.computedInitialView).toEqual('month')
  })

  it('should save and close when selecting on minimum-view "month"', () => {
    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'month',
        maximumView: 'year'
      }
    })
    const date = new Date(2016, 9, 12)
    wrapper.vm.selectYear({timestamp: date.getTime()})
    expect(wrapper.vm.isOpen).toEqual(true)
    wrapper.vm.selectMonth({timestamp: date.getTime()})
    expect(date.getFullYear()).toEqual(wrapper.vm.selectedDate.getFullYear())
    expect(date.getMonth()).toEqual(wrapper.vm.selectedDate.getMonth())
    expect(wrapper.vm.isOpen).toEqual(false)
  })

  it('should save and close when selecting on minimum-view "year"', () => {
    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'year',
        maximumView: 'year'
      }
    })
    const date = new Date(2016, 9, 12)
    wrapper.vm.selectYear({timestamp: date.getTime()})
    expect(wrapper.vm.isOpen).toEqual(false)
    expect(date.getFullYear()).toEqual(wrapper.vm.selectedDate.getFullYear())
  })

  it('should only allow views in min-max range', () => {
    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'day',
        maximumView: 'month'
      }
    })
    expect(wrapper.vm.allowedToShowView('year')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('day')).toEqual(true)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)
    expect(wrapper.vm.showYearCalendar()).toEqual(false)

    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'month',
        maximumView: 'month'
      }
    })
    expect(wrapper.vm.allowedToShowView('day')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('year')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)
    expect(wrapper.vm.showDayCalendar()).toEqual(false)
    expect(wrapper.vm.showYearCalendar()).toEqual(false)

    wrapper = mount(Datepicker, {
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
    wrapper = mount(Datepicker, {
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
    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'day',
        maximumView: 'day'
      }
    })
    wrapper.vm.showCalendar()
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar').length).toEqual(1)
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.month').length).toEqual(0)
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.year').length).toEqual(0)
    expect(wrapper.vm.showMonthCalendar()).toEqual(false)

    wrapper = mount(Datepicker, {
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
