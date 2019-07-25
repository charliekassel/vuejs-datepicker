import PickerDay from '@/components/PickerDay.vue'
import {shallow} from '@vue/test-utils'
import {en} from '@/locale'

describe('PickerDay: disabled', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(PickerDay, {
      propsData: {
        allowedToShowView: () => true,
        showMonthCalendar: () => {},
        translation: en,
        disabledDates: {
          to: new Date(2016, 9, 4),
          from: new Date(2016, 9, 26)
        },
        pageDate: new Date(2016, 9, 1)
      }
    })
  })

  it('should detect a disabled date', () => {
    expect(wrapper.vm.isDisabledDate(new Date(2006, 9, 2))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2026, 9, 2))).toEqual(true)
  })

  it('should not select a disabled date', () => {
    expect(wrapper.vm.selectDate({isDisabled: true})).toEqual(false)
  })

  it('cant change to a disabled month', () => {
    wrapper.vm.previousMonth()
    expect(wrapper.vm.pageDate.getMonth()).toEqual(9)
    wrapper.vm.nextMonth()
    expect(wrapper.vm.pageDate.getMonth()).toEqual(9)
  })

  it('can change month despite having a disabled month', () => {
    expect(wrapper.vm.isNextMonthDisabled()).toBeTruthy()
  })

  it('should detect disabled dates', () => {
    wrapper.setProps({
      disabledDates: {
        ranges: [{
          from: new Date(2005, 6, 5),
          to: new Date(2016, 9, 4)
        }, {
          from: new Date(2016, 9, 26),
          to: new Date(2030, 12, 25)
        }]
      }
    })
    expect(wrapper.vm.isDisabledDate(new Date(2006, 9, 2))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2026, 9, 2))).toEqual(true)
  })

  it('can accept an array of disabled dates', () => {
    wrapper.setProps({
      disabledDates: {
        dates: [
          new Date(2016, 9, 2),
          new Date(2016, 9, 9),
          new Date(2016, 9, 16)
        ]
      }
    })
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 2))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 3))).toEqual(false)
  })

  it('can accept an array of disabled days of the week', () => {
    wrapper.setProps({
      disabledDates: {
        days: [6, 0]
      }
    })
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 2))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 3))).toEqual(false)
  })

  it('can accept an array of disabled days of the month', () => {
    wrapper.setProps({
      disabledDates: {
        daysOfMonth: [29, 30, 31]
      }
    })
    expect(wrapper.vm.isDisabledDate(new Date(2016, 8, 29))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 31))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 10, 30))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 11))).toEqual(false)
  })

  it('can accept a customPredictor to check if the date is disabled', () => {
    wrapper.setProps({
      disabledDates: {
        customPredictor (date) {
          if (date.getDate() % 4 === 0) {
            return true
          }
        }
      }
    })
    expect(wrapper.vm.isDisabledDate(new Date(2016, 8, 29))).toEqual(false)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 28))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 10, 24))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 11))).toEqual(false)
  })

  it('should emit a selectedDisabled event for a disabled date', () => {
    expect(wrapper.vm.selectDate({isDisabled: true})).toEqual(false)
    expect(wrapper.emitted().selectedDisabled).toBeTruthy()
  })
})
