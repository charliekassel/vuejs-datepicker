import PickerMonth from '@/components/PickerMonth.vue'
import {shallow} from '@vue/test-utils'
import {en} from '@/locale'

describe('PickerMonth', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(PickerMonth, {
      propsData: {
        allowedToShowView: () => true,
        translation: en,
        pageDate: new Date(2018, 3, 1),
        selectedDate: new Date(2018, 3, 19),
        disabledDates: {
          to: new Date(2018, 2, 14),
          from: new Date(2018, 4, 15)
        }
      }
    })
  })

  it('cant select a disabled month', () => {
    const month = {isDisabled: true}
    expect(wrapper.vm.selectMonth(month)).toEqual(false)
  })

  it('can accept a customPredictor to check if the month is disabled', () => {
    wrapper.setProps({
      disabledDates: {
        customPredictor (date) {
          if (date.getMonth() % 4 === 0) {
            return true
          }
        }
      }
    })
    expect(wrapper.vm.isDisabledMonth(new Date(2018, 4, 29))).toEqual(true)
    expect(wrapper.vm.isDisabledMonth(new Date(2018, 9, 28))).toEqual(false)
    expect(wrapper.vm.isDisabledMonth(new Date(2018, 8, 24))).toEqual(true)
    expect(wrapper.vm.isDisabledMonth(new Date(2018, 2, 11))).toEqual(false)
  })
})
