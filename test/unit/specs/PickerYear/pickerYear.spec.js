import PickerYear from '@/components/PickerYear.vue'
import {shallow} from '@vue/test-utils'
import {en} from '@/locale'

describe('PickerYear', () => {
  let wrapper
  const eraTypeCal = {
    'CE': 0,
    'BE': 543
  }
  beforeEach(() => {
    wrapper = shallow(PickerYear, {
      propsData: {
        allowedToShowView: () => true,
        translation: en,
        pageDate: new Date(2018, 1, 1),
        selectedDate: new Date(2018, 2, 24),
        eraType: 'CE'
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

  it('years lists to selected', () => {
    let expectYears = []
    let expectShowYears = []
    let years

    /*
    * year type is CE
    */
    wrapper.setProps({
      pageDate: new Date(2021, 1, 1),
      eraType: 'CE'
    })
    for (let n = 0; n < 10; n++) {
      expectYears.push(2020 + n)
      expectShowYears.push(2020 + n + eraTypeCal[wrapper.vm.eraType])
    }
    years = wrapper.vm.years
    for (let index in years) {
      expect(expectYears.includes(years[index].year)).toBeTruthy()
      expect(expectShowYears.includes(years[index].showYear)).toBeTruthy()
    }

    /*
    * year type is BE
    */
    wrapper.setProps({
      pageDate: new Date(2021, 1, 1),
      eraType: 'BE'
    })
    for (let n = 0; n < 10; n++) {
      expectYears.push(2017 + n)
      expectShowYears.push(2017 + n + eraTypeCal[wrapper.vm.eraType])
    }
    years = wrapper.vm.years
    for (let index in years) {
      expect(expectYears.includes(years[index].year)).toBeTruthy()
      expect(expectShowYears.includes(years[index].showYear)).toBeTruthy()
    }
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
      pageDate: new Date(2021, 1, 1),
      eraType: 'CE'
    })
    expect(wrapper.vm.getPageDecade).toEqual('2020 - 2029')
    wrapper.setProps({
      pageDate: new Date(2021, 1, 1),
      eraType: 'BE'
    })
    expect(wrapper.vm.getPageDecade).toEqual('2560 - 2569')
    wrapper.setProps({
      pageDate: new Date(2001, 1, 1),
      eraType: 'CE'
    })
    expect(wrapper.vm.getPageDecade).toEqual('2000 - 2009')
    wrapper.setProps({
      pageDate: new Date(2001, 1, 1),
      eraType: 'BE'
    })
    expect(wrapper.vm.getPageDecade).toEqual('2540 - 2549')
  })

  it('emits an event when selected', () => {
    wrapper.vm.selectYear({isDisabled: false})
    expect(wrapper.emitted().selectYear).toBeTruthy()
  })
})
