import DateInput from '@/components/DateInput.vue'
import {shallow} from '@vue/test-utils'
import {en} from '@/locale'

describe('DateInput', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(DateInput, {
      propsData: {
        format: 'dd MMM yyyy',
        translation: en,
        typeable: true
      }
    })
  })

  it('does not format the date when typed', () => {
    const dateString = '2018-04-24'
    wrapper.vm.input.value = dateString
    expect(wrapper.vm.input.value).toEqual(dateString)
    wrapper.setData({
      typedDate: dateString
    })
    wrapper.setProps({
      selectedDate: new Date(dateString)
    })
    expect(wrapper.vm.typedDate).toEqual(dateString)
    expect(wrapper.vm.formattedValue).toEqual(dateString)
  })

  it('uses custom date parser', () => {
    wrapper.vm.parse = function (str) {
      const tokens = str.split('/')
      const dd = parseInt(tokens[0])
      const MM = parseInt(tokens[1])
      const yyyy = parseInt(tokens[2])
      const dt = new Date(yyyy, MM - 1, dd)
      return dt.getTime()
    }
    wrapper.vm.format = 'dd/MM/yyyy'
    wrapper.vm.input.value = '07/01/2019'
    const input = wrapper.find('input')
    input.trigger('keyup')
    const dt = wrapper.emitted().typedDate[0][0]
    expect(dt.getDate()).toBe(7)
    expect(dt.getMonth()).toBe(0)
    expect(dt.getFullYear()).toBe(2019)
  })

  it('emits the date when typed', () => {
    const input = wrapper.find('input')
    wrapper.vm.input.value = '2018-04-24'
    input.trigger('keyup')
    expect(wrapper.emitted().typedDate).toBeDefined()
    expect(wrapper.emitted().typedDate[0][0]).toBeInstanceOf(Date)
  })

  it('emits closeCalendar when return is pressed', () => {
    const input = wrapper.find('input')
    const blurSpy = jest.spyOn(input.element, 'blur')
    input.trigger('keyup.enter')
    expect(blurSpy).toBeCalled()
  })

  it('clears a typed date if it does not parse', () => {
    const input = wrapper.find('input')
    wrapper.setData({typedDate: 'not a date'})
    input.trigger('blur')
    expect(wrapper.emitted().clearDate).toBeDefined()
  })

  it('doesn\'t emit the date if typeable=false', () => {
    const wrapper = shallow(DateInput, {
      propsData: {
        format: 'dd MMM yyyy',
        translation: en,
        typeable: false
      }
    })
    const input = wrapper.find('input')
    wrapper.vm.input.value = '2018-04-24'
    input.trigger('keydown')
    input.trigger('keyup')
    expect(wrapper.emitted().typedDate).not.toBeDefined()
  })
})
