import PickerDay from '@/components/PickerDay.vue'
import {shallow} from '@vue/test-utils'
import {en} from '@/locale'
import DaysGrid from '@/components/DaysGrid'

describe('PickerDay: DOM', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(PickerDay, {
      propsData: {
        allowedToShowView: () => true,
        translation: en,
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
    wrapper.vm.selectDate({isDisabled: false})
    expect(wrapper.emitted().selectDate).toBeTruthy()
  })

  it('calls the function in highlightDate when hovering on a day cell', () => {
    wrapper.setProps({
      highlightDate: jest.fn()
    })
    const daysGrids = wrapper.findAll(DaysGrid)
    const daysGrid = daysGrids.wrappers[0]
    expect(daysGrid.exists()).toBe(true)
    daysGrid.vm.$emit('mouseover')
    expect(wrapper.props().highlightDate).toHaveBeenCalledTimes(1)
  })

  it('does not call the function in highlightDate when hovering on a disabled day cell', () => {
    const date = new Date(2021, 8, 30)
    wrapper.setProps({
      highlightDate: jest.fn(),
      disabledDates: {
        dates: [date]
      }
    })
    const daysGrids = wrapper.findAll(DaysGrid)
    const daysGrid = daysGrids.wrappers[0]
    expect(daysGrid.exists()).toBe(true)
    daysGrid.vm.$emit('mouseover', date)
    expect(wrapper.props().highlightDate).toHaveBeenCalledTimes(0)
  })

  it('calls the function in highlightDate when hovering on a day cell in the next month of a side by side calendar', () => {
    wrapper.setProps({
      highlightDate: jest.fn(),
      sideBySide: true
    })
    const daysGrids = wrapper.findAll(DaysGrid)
    const daysGrid = daysGrids.wrappers[1]
    expect(daysGrid.exists()).toBe(true)
    daysGrid.vm.$emit('mouseover')
    expect(wrapper.props().highlightDate).toHaveBeenCalledTimes(1)
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
