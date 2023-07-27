import PickerYear from '@/components/PickerYear.vue'
import {mount} from '@vue/test-utils'
import {en} from '@/locale'

describe('PickerYear', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(PickerYear, {
      shallow: true,
      propsData: {
        allowedToShowView: () => true,
        translation: en,
        pageDate: new Date(2018, 1, 1),
        selectedDate: new Date(2018, 2, 24)
      }
    })
  })

  it('knows the selected year', async () => {
    const newDate = new Date(2016, 9, 15)
    await wrapper.setProps({
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

  it('formats the decade range', async () => {
    await wrapper.setProps({
      pageDate: new Date(2021, 1, 1)
    })
    expect(wrapper.vm.getPageDecade).toEqual('2020 - 2029')
    await wrapper.setProps({
      pageDate: new Date(2001, 1, 1)
    })
    expect(wrapper.vm.getPageDecade).toEqual('2000 - 2009')
  })

  it('emits an event when selected', () => {
    wrapper.vm.selectYear({isDisabled: false})
    expect(wrapper.emitted().selectYear).toBeTruthy()
  })
})
