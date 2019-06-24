import PickerDay from '@/components/PickerDay.vue'
import {shallow} from '@vue/test-utils'
import {en} from '@/locale'

describe('PickerDay: DOM table-like structure', () => {
  it('should render 28 cells', () => {
    let wrapper = shallow(PickerDay, {
      propsData: {
        allowedToShowView: () => true,
        translation: en,
        pageDate: new Date(2015, 1, 1),
        selectedDate: new Date(2015, 1, 1)
      }
    })
    expect(wrapper.findAll('.day')).toHaveLength(28)
  })
  it('should render 35 cells', () => {
    let wrapper = shallow(PickerDay, {
      propsData: {
        allowedToShowView: () => true,
        translation: en,
        pageDate: new Date(2019, 6, 1),
        selectedDate: new Date(2019, 6, 1)
      }
    })
    expect(wrapper.findAll('.day')).toHaveLength(35)
  })
  it('should render 42 cells', () => {
    let wrapper = shallow(PickerDay, {
      propsData: {
        allowedToShowView: () => true,
        translation: en,
        pageDate: new Date(2019, 5, 1),
        selectedDate: new Date(2019, 5, 1)
      }
    })
    expect(wrapper.findAll('.day')).toHaveLength(42)
  })
})
