import PickerDay from '@/components/PickerDay.vue'
import {mount} from '@vue/test-utils'
import {en} from '@/locale'

describe('PickerDay: Datepicker with monday as first day of week', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(PickerDay, {
      shallow: true,
      propsData: {
        mondayFirst: true,
        translation: en,
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

  it('should have 6 blankDays when month starts from Sunday', async () => {
    await wrapper.setProps({
      pageDate: new Date(2018, 3, 1)
    })
    expect(wrapper.vm.blankDays).toEqual(6)
  })

  it('should have no blankDays when month starts from Monday', async () => {
    await wrapper.setProps({
      pageDate: new Date(2018, 9, 1)
    })
    expect(wrapper.vm.blankDays).toEqual(0)
  })
})
