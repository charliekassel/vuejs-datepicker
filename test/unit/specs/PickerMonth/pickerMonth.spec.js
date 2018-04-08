import PickerMonth from '@/components/PickerMonth.vue'
import {shallow} from '@vue/test-utils'
import languages from '@/utils/DateLanguages'

describe('PickerMonth', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(PickerMonth, {
      propsData: {
        allowedToShowView: () => true,
        translation: languages.translations.en,
        pageDate: new Date(2018, 1, 1),
        selectedDate: new Date(2018, 2, 24)
      }
    })
  })

  it('knows the selected month', () => {
    const newDate = new Date(2016, 9, 15)
    wrapper.setProps({
      selectedDate: newDate
    })
    expect(wrapper.vm.isSelectedMonth(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedMonth(new Date(2017, 1, 1))).toEqual(false)
  })

  it('can set the next year', () => {
    wrapper.vm.nextYear()
    expect(wrapper.emitted().changedYear[0][0].getFullYear()).toEqual(2019)
  })

  it('can set the previous year', () => {
    wrapper.vm.previousYear()
    expect(wrapper.emitted().changedYear[0][0].getFullYear()).toEqual(2017)
  })
})
