import PickerDay from '@/components/PickerDay.vue'
import {shallow} from '@vue/test-utils'
import languages from '@/utils/DateLanguages'

describe('PickerDay: Datepicker with monday as first day of week', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(PickerDay, {
      propsData: {
        mondayFirst: true,
        translation: languages.translations.en,
        allowedToShowView: () => true,
        pageDate: new Date(2018, 1, 1)
      }
    })
  })

  it('should return Monday as a first day of week', () => {
    expect(wrapper.vm.daysOfWeek[0]).toEqual('Mon')
  })

  it('should return Sunday as a seventh day of week', () => {
    expect(wrapper.vm.daysOfWeek[6]).toEqual('Sun')
  })

  it('should have 6 blankDays when month starts from Sunday', () => {
    wrapper.setProps({
      pageDate: new Date(2018, 3, 1)
    })
    expect(wrapper.vm.blankDays).toEqual(6)
  })

  it('should have no blankDays when month starts from Monday', () => {
    wrapper.setProps({
      pageDate: new Date(2018, 9, 1)
    })
    expect(wrapper.vm.blankDays).toEqual(0)
  })
})
