import PickerYear from '@/components/PickerYear.vue'
import {shallow} from '@vue/test-utils'
import languages from '@/utils/DateLanguages'

describe('PickerYear', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(PickerYear, {
      propsData: {
        allowedToShowView: () => true,
        translation: languages.translations.en,
        pageDate: new Date(2018, 1, 1),
        selectedDate: new Date(2018, 2, 24)
      }
    })
  })

  it('knows the selected year', () => {
    const newDate = new Date(2016, 9, 15)
    wrapper.setProps({
      selectedDate: newDate
    })
    expect(wrapper.vm.isSelectedYear(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedYear(new Date(2017, 1, 1))).toEqual(false)
  })

  it('can set the next decade', () => {
    wrapper.vm.nextDecade()
    expect(wrapper.emitted().changedDecade).toBeTruthy()
  })

  it('can set the previous decade', () => {
    wrapper.vm.previousDecade()
    expect(wrapper.emitted().changedDecade).toBeTruthy()
  })

  it('formats the decade range', () => {
    wrapper.setProps({
      pageDate: new Date(2021, 1, 1)
    })
    expect(wrapper.vm.getPageDecade).toEqual('2020 - 2029')
    wrapper.setProps({
      pageDate: new Date(2001, 1, 1)
    })
    expect(wrapper.vm.getPageDecade).toEqual('2000 - 2009')
  })
})
