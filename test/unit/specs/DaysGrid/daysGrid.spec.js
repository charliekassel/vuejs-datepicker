import DaysGrid from '@/components/DaysGrid.vue'
import {shallow} from '@vue/test-utils'
import {en} from '@/locale'
import {makeDateUtils} from '@/utils/DateUtils'

const constructedDateUtils = makeDateUtils(true)
const days = [
  getDateObject(2021, 9, 1),
  getDateObject(2021, 9, 2)
]

describe('DaysGrid: DOM', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(DaysGrid, {
      propsData: {
        mondayFirst: false,
        translation: en,
        startDate: new Date(Date.UTC(2018, 1, 1)),
        utils: constructedDateUtils,
        useUtc: true,
        days
      }
    })
  })

  it('emits an event when selecting a cell', () => {
    const dayCells = wrapper.findAll('.cell.day:not(.blank)')
    console.log(dayCells)
    const firstDayCell = dayCells.wrappers[0]
    expect(firstDayCell.exists()).toBe(true)

    firstDayCell.trigger('click')

    expect(wrapper.emitted().select).toBeTruthy()
    expect(wrapper.emitted().select[0]).toEqual([days[0]])
  })

  it('emits an event when moving the mouse over a cell', () => {
    const dayCells = wrapper.findAll('.cell.day:not(.blank)')
    const firstDayCell = dayCells.wrappers[0]
    expect(firstDayCell.exists()).toBe(true)

    firstDayCell.trigger('mouseover')

    expect(wrapper.emitted().mouseover).toBeTruthy()
    expect(wrapper.emitted().mouseover[0]).toEqual([days[0]])
  })

  it('displays the days of the week in the right order', () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dayHeaders = wrapper.findAll('.cell.day-header')
    days.forEach((day, index) => {
      expect(dayHeaders.at(index).text()).toEqual(day)
    })
  })

  it('displays the days of the week in the right order when Monday is the first day', () => {
    wrapper.setProps({mondayFirst: true})
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const dayHeaders = wrapper.findAll('.cell.day-header')
    days.forEach((day, index) => {
      expect(dayHeaders.at(index).text()).toEqual(day)
    })
  })
})

function getDateObject (year, month, day) {
  const date = new Date(Date.UTC(year, month, day))
  const timestamp = date.getTime()

  return {
    date,
    timestamp
  }
}
