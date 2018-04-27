import PickerYear from '@/components/PickerYear.vue'
import {shallow} from '@vue/test-utils'
import {en} from '@/locale'

describe('PickerYear', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(PickerYear, {
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

  it('cant select a disabled year', () => {
    const year = {isDisabled: true}
    expect(wrapper.vm.selectYear(year)).toEqual(false)
  })

  it('cant navigate to a disabled year', () => {
    expect(wrapper.vm.previousDecade()).toEqual(false)
    expect(wrapper.vm.nextDecade()).toEqual(false)
  })

  it('can\'t change decade when previous or next decades are disabled', () => {
    wrapper.setProps({
      pageDate: new Date(2016, 9, 15),
      disabledDates: {
        to: new Date(2010, 8, 6),
        from: new Date(2017, 10, 24)
      }
    })
    expect(wrapper.vm.isPreviousDecadeDisabled()).toEqual(true)
    expect(wrapper.vm.isNextDecadeDisabled()).toEqual(true)
  })

  it('can change decade despite having a disabled decade', () => {
    wrapper.setProps({
      pageDate: new Date(2016, 9, 15),
      disabledDates: {
        to: new Date(2000, 11, 19),
        from: new Date(2021, 11, 19)
      }
    })
    expect(wrapper.vm.isPreviousDecadeDisabled()).toEqual(false)
    expect(wrapper.vm.isNextDecadeDisabled()).toEqual(false)
  })
})
