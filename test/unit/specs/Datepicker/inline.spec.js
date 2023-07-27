import Datepicker from '@/components/Datepicker.vue'
import {mount} from '@vue/test-utils'

describe('Datepicker.vue inline', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(Datepicker, {
      shallow: true,
      propsData: {
        inline: true
      }
    })
  })

  it('should not showCalendar as already open', () => {
    expect(wrapper.vm.showCalendar()).toEqual(false)
    expect(wrapper.vm.isInline).toEqual(true)
  })

  it('should not close the calendar when date is selected', () => {
    const date = new Date()
    wrapper.vm.selectDate({timestamp: date.getTime()})
    expect(wrapper.vm.isOpen).toEqual(true)
    document.body.click()
    expect(wrapper.vm.isOpen).toEqual(true)
  })
})
