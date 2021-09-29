import DaysGrid from '@/components/DaysGrid.vue'
import {shallow} from '@vue/test-utils'
import {en} from '@/locale'
import {makeDateUtils} from '@/utils/DateUtils'

const constructedDateUtils = makeDateUtils(true)

describe('DaysGrid: Datepicker with monday as first day of week', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(DaysGrid, {
      propsData: {
        mondayFirst: true,
        translation: en,
        startDate: new Date(Date.UTC(2018, 1, 1)),
        utils: constructedDateUtils,
        useUtc: true
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
      startDate: new Date(Date.UTC(2018, 3, 1))
    })
    expect(wrapper.vm.blankDays).toEqual(6)
  })

  it('should have no blankDays when month starts from Monday', () => {
    wrapper.setProps({
      startDate: new Date(Date.UTC(2018, 9, 1))
    })
    expect(wrapper.vm.blankDays).toEqual(0)
  })
})
