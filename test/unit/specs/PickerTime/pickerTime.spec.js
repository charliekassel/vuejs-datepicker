import PickerTime from '@/components/PickerTime.vue'
import {shallow} from '@vue/test-utils'
import {en} from '@/locale'

describe('PickerTime', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(PickerTime, {
      propsData: {
        allowedToShowView: () => true,
        translation: en,
        format: 'yyyy-MM-dd',
        selectedDate: new Date(2018, 2, 24)
      }
    })
  })

  it('knows the selected date', () => {
    expect(wrapper.vm.formattedValue).not.toBe(null)
    wrapper.setProps({
      selectedDate: null
    })
    expect(wrapper.vm.formattedValue).toEqual(null)
  })

  it('emits date on change minutes', () => {
    wrapper.vm.setMinutes(1)
    expect(wrapper.emitted().selectDate).toBeTruthy()
    expect(wrapper.emitted().selectDate[0][0].timestamp).not.toBe(undefined)
  })

  it('add minutes', () => {
    const baseDate = new Date()
    wrapper.setProps({
      selectedDate: baseDate
    })
    const time = baseDate.getTime()
    const timePlusOne = new Date(time).setMinutes(baseDate.getMinutes() + 1)
    wrapper.vm.setMinutes(1)
    expect(wrapper.emitted().selectDate[0][0].timestamp).toEqual(timePlusOne)
  })

  it('decrease minutes', () => {
    const baseDate = new Date()
    wrapper.setProps({
      selectedDate: baseDate
    })
    const time = baseDate.getTime()
    const timeMinusOne = new Date(time).setMinutes(baseDate.getMinutes() - 1)
    wrapper.vm.setMinutes(-1)
    expect(wrapper.emitted().selectDate[0][0].timestamp).toEqual(timeMinusOne)
  })

  it('add hours', () => {
    const baseDate = new Date()
    wrapper.setProps({
      selectedDate: baseDate
    })
    const time = baseDate.getTime()
    const timePlusOne = new Date(time).setHours(baseDate.getHours() + 1)
    wrapper.vm.setHours(1)
    expect(wrapper.emitted().selectDate[0][0].timestamp).toEqual(timePlusOne)
  })

  it('decrease hours', () => {
    const baseDate = new Date()
    wrapper.setProps({
      selectedDate: baseDate
    })
    const time = baseDate.getTime()
    const timeMinusOne = new Date(time).setHours(baseDate.getHours() - 1)
    wrapper.vm.setHours(-1)
    expect(wrapper.emitted().selectDate[0][0].timestamp).toEqual(timeMinusOne)
  })

  it('emits show day calendar event when clicked on the day', () => {
    const dayBtn = wrapper.find('.day__calendar_btn')
    dayBtn.trigger('click')
    expect(wrapper.emitted().showDayCalendar).toBeTruthy()
  })
})
