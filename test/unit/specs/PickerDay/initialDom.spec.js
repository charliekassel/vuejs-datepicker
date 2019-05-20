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

  it('should render correct contents', () => {
    expect(wrapper.findAll('.vdp-datepicker__calendar')).toHaveLength(1)
  })
})
