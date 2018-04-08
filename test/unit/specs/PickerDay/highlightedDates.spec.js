import PickerDay from '@/components/PickerDay.vue'
import {shallow} from '@vue/test-utils'
import languages from '@/utils/DateLanguages'

describe('PickerDay highlight date', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(PickerDay, {
      propsData: {
        allowedToShowView: () => true,
        translation: languages.translations.en,
        pageDate: new Date(2016, 9, 1),
        highlighted: {
          to: new Date(2016, 12, 8),
          from: new Date(2016, 12, 4)
        },
        disabled: {
          dates: [ new Date(2016, 12, 5) ]
        }
      }
    })
  })

  it('should detect a highlighted date', () => {
    expect(wrapper.vm.isHighlightedDate(new Date(2006, 9, 2))).toEqual(false)
    expect(wrapper.vm.isHighlightedDate(new Date(2026, 9, 2))).toEqual(false)
  })

  it('should not highlight a disabled date', () => {
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 12, 5))).toEqual(false)
  })

  it('should highlight a disabled date when explicitly configured to', () => {
    wrapper.setProps({
      highlighted: {
        to: new Date(2016, 12, 8),
        from: new Date(2016, 12, 4),
        includeDisabled: true
      }
    })
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 12, 5))).toEqual(true)
  })

  it('should highlight a date before the to property', () => {
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 12, 7))).toEqual(true)
  })

  it('should not highlight a date after the to property', () => {
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 12, 9))).toEqual(false)
  })

  it('should highlight a date after the from property', () => {
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 12, 6))).toEqual(true)
  })

  it('should not highlight a date before the from property', () => {
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 12, 3))).toEqual(false)
  })

  it('can accept an array of highlighted dates', () => {
    wrapper.setProps({
      highlighted: {
        dates: [
          new Date(2016, 9, 2),
          new Date(2016, 9, 9),
          new Date(2016, 9, 16)
        ]
      }
    })
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 2))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 3))).toEqual(false)
  })

  it('can accept an array of highlighted days of the week', () => {
    wrapper.setProps({
      highlighted: {
        days: [6, 0]
      }
    })
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 2))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 3))).toEqual(false)
  })

  it('can accept an array of highlighted days of the month', () => {
    wrapper.setProps({
      highlighted: {
        daysOfMonth: [1, 10, 31]
      }
    })
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 1))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 10, 10))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 11, 31))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2017, 8, 10))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 8, 7))).toEqual(false)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 7, 20))).toEqual(false)
  })

  it('can accept a customPredictor to check if the date is highlighted', () => {
    wrapper.setProps({
      highlighted: {
        customPredictor (date) {
          if (date.getDate() % 5 === 0) {
            return true
          }
        }
      }
    })
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 8, 30))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 28))).toEqual(false)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 10, 20))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 11))).toEqual(false)
  })

  it('should detect the first date of the highlighted dates', () => {
    expect(wrapper.vm.isHighlightStart(new Date(2016, 12, 4))).toEqual(true)
    expect(wrapper.vm.isHighlightStart(new Date(2016, 12, 3))).toEqual(false)
    expect(wrapper.vm.isHighlightStart(new Date(2016, 12, 5))).toEqual(false)
  })

  it('should detect the last date of the highlighted dates', () => {
    expect(wrapper.vm.isHighlightEnd(new Date(2016, 12, 8))).toEqual(true)
    expect(wrapper.vm.isHighlightEnd(new Date(2016, 12, 6))).toEqual(false)
    expect(wrapper.vm.isHighlightEnd(new Date(2016, 12, 7))).toEqual(false)
  })
})
