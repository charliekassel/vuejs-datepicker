import PickerDay from '@/components/PickerDay.vue'
import {shallow} from '@vue/test-utils'
import {en} from '@/locale'

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

  it('should render correct contents', () => {
    expect(wrapper.findAll('.vdp-datepicker__calendar')).toHaveLength(1)
  })
})
