import PickerDay from '@/components/PickerDay.vue'
import {shallow} from '@vue/test-utils'
import {en} from '@/locale'

describe('PickerDay: Datepicker with calendar week and sunday as first day of week', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(PickerDay, {
      propsData: {
        calendarWeek: true,
        translation: en,
        allowedToShowView: () => true,
        pageDate: new Date(2018, 9, 1)
      }
    })
  })

  it('should return false to show calendar week if day is sunday and index equals zero', () => {
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[0], 0)).toEqual(false)
  })

  it('should return false to show calendar week if day is not sunday', () => {
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[1], 1)).toEqual(false)
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[2], 2)).toEqual(false)
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[3], 3)).toEqual(false)
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[4], 4)).toEqual(false)
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[5], 5)).toEqual(false)
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[7], 7)).toEqual(false)
  })

  it('should return true to show calendar week if day is sunday', () => {
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[6], 6)).toEqual(true)
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[13], 13)).toEqual(true)
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[20], 20)).toEqual(true)
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[27], 27)).toEqual(true)
  })
})

describe('PickerDay: Datepicker with calendar week and monday as first day of week', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(PickerDay, {
      propsData: {
        calendarWeek: true,
        mondayFirst: true,
        translation: en,
        allowedToShowView: () => true,
        pageDate: new Date(2019, 2, 1)
      }
    })
  })

  it('should return false to show calendar week if day is sunday and index equals number of days', () => {
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[30], 30, false)).toEqual(false)
  })

  it('should return false to show calendar week if day is not sunday', () => {
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[1], 1, false)).toEqual(false)
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[3], 3, false)).toEqual(false)
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[4], 4, false)).toEqual(false)
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[5], 5, false)).toEqual(false)
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[6], 6, false)).toEqual(false)
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[7], 7, false)).toEqual(false)
  })

  it('should return true to show calendar week if day is sunday', () => {
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[2], 2, false)).toEqual(true)
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[9], 9, false)).toEqual(true)
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[16], 16, false)).toEqual(true)
    expect(wrapper.vm.showCalendarWeek(wrapper.vm.days[23], 23, false)).toEqual(true)
  })
})
