import PickerDay from '@/components/PickerDay.vue'
import {shallow} from '@vue/test-utils'
import {en} from '@/locale'

describe('PickerDay: changing months', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(PickerDay, {
      propsData: {
        translation: en,
        allowedToShowView: () => true,
        selectedDate: new Date(2018, 2, 24),
        pageDate: new Date(2018, 1, 1)
      }
    })
  })

  it('can set the next month', () => {
    wrapper.vm.nextMonth()
    expect(wrapper.emitted().changedMonth).toBeTruthy()
    expect(wrapper.emitted().changedMonth[0][0].getMonth()).toEqual(2)
  })

  it('can set the previous month', () => {
    wrapper.vm.previousMonth()
    expect(wrapper.emitted().changedMonth).toBeTruthy()
    expect(wrapper.emitted().changedMonth[0][0].getMonth()).toEqual(0)
  })
})
