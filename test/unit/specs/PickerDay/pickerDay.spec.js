import PickerDay from '@/components/PickerDay.vue'
import { shallowMount } from '@vue/test-utils'

describe('PickerDay: DOM', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        allowedToShowView: () => true,

        pageDate: new Date(2018, 1, 1),
        selectedDate: new Date(2018, 2, 24)
      }
    })
  })

  it('knows the selected date', () => {
    const newDate = new Date(2016, 9, 15)
    wrapper.setProps({
      selectedDate: newDate
    })
    expect(wrapper.vm.isSelectedDate(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedDate(new Date(2017, 1, 1))).toEqual(false)
  })

  it('emits an event when selected', () => {
    wrapper.vm.selectDate({ isDisabled: false })
    expect(wrapper.emitted().selectDate).toBeTruthy()
  })

  it('knows the current page month', () => {
    expect(wrapper.vm.getPageMonth()).toEqual(1)
  })

  it('emits show year calendar event when clicked on the year', () => {
    const yearBtn = wrapper.find('.day__month_btn')
    yearBtn.trigger('click')
    expect(wrapper.emitted().showMonthCalendar).toBeTruthy()
  })
})
