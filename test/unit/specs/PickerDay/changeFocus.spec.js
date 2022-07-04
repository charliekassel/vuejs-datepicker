import PickerDay from '@/components/PickerDay.vue'
import {shallow} from '@vue/test-utils'
import {en} from '@/locale'

describe('PickerDay: changing focus', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(PickerDay, {
      propsData: {
        translation: en,
        allowedToShowView: () => true,
        selectedDate: new Date(Date.UTC(2018, 2, 24)),
        pageDate: new Date(Date.UTC(2018, 1, 1)),
        focusedDate: new Date(Date.UTC(2018, 1, 15)).getTime(),
        useUtc: true,
      }
    })
  })

  describe('focusNextDay', () => {
    it('changes the focused date to the next day', () => {
      wrapper.vm.focusNextDay();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2018, 1, 16)).getTime()]])
    })

    it('changes to the next month if the current focused date is the last day of the month', () => {
      wrapper.setProps({focusedDate: new Date(Date.UTC(2018, 1, 28)).getTime()})
      wrapper.vm.focusNextDay();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2018, 2, 1)).getTime()]])
    })

    it('displays the next month if the current focused date is the last day of the month', () => {
      wrapper.setProps({
        pageTimestamp: new Date(Date.UTC(2018, 1, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2018, 1, 28)).getTime(),
      })
      wrapper.vm.focusNextDay();
      expect(wrapper.emitted('changedMonth')).toEqual([[new Date(Date.UTC(2018, 2, 1))]])
    })

    it('does not display the next month if it is side by side and the current focused date is the last day of the first visible month', () => {
      wrapper.setProps({
        pageTimestamp: new Date(Date.UTC(2018, 1, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2018, 1, 28)).getTime(),
        sideBySide: true
      })
      wrapper.vm.focusNextDay();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2018, 2, 1)).getTime()]])
      expect(wrapper.emitted('changedMonth')).toBeUndefined()
    })
  })

  describe('focusPreviousDay', () => {
    it('changes the focused date to the previous day', () => {
      wrapper.vm.focusPreviousDay();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2018, 1, 14)).getTime()]])
    })

    it('changes to the previous month if the current focused date is the first day of the month', () => {
      wrapper.setProps({focusedDate: new Date(Date.UTC(2018, 1, 1)).getTime()})
      wrapper.vm.focusPreviousDay();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2018, 0, 31)).getTime()]])
    })

    it('displays the previous month if the current focused date is the first day of the month', () => {
      wrapper.setProps({
        pageDate: new Date(Date.UTC(2018, 2, 1)),
        pageTimestamp: new Date(Date.UTC(2018, 2, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2018, 2, 1)).getTime(),
      })
      wrapper.vm.focusPreviousDay();
      expect(wrapper.emitted('changedMonth')).toEqual([[new Date(Date.UTC(2018, 1, 1))]])
    })

    it('does not display the previous month if it is side by side and the current focused date is the first day of the first visible month', () => {
      wrapper.setProps({
        pageTimestamp: new Date(Date.UTC(2018, 1, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2018, 2, 1)).getTime(),
        sideBySide: true
      })
      wrapper.vm.focusPreviousDay();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2018, 1, 28)).getTime()]])
      expect(wrapper.emitted('changedMonth')).toBeUndefined()
    })
  })

  describe('focusNextWeek', () => {
    it('changes the focused date to the next week', () => {
      wrapper.vm.focusNextWeek();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2018, 1, 22)).getTime()]])
    })

    it('changes to the next month if the current focused date is the last week of the month', () => {
      wrapper.setProps({focusedDate: new Date(Date.UTC(2018, 1, 26)).getTime()})
      wrapper.vm.focusNextWeek();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2018, 2, 5)).getTime()]])
    })

    it('displays the next month if the current focused date is the last week of the month', () => {
      wrapper.setProps({
        pageTimestamp: new Date(Date.UTC(2018, 1, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2018, 1, 26)).getTime(),
      })
      wrapper.vm.focusNextWeek();
      expect(wrapper.emitted('changedMonth')).toEqual([[new Date(Date.UTC(2018, 2, 1))]])
    })

    it('does not display the next month if it is side by side and the current focused date is the last week of the first visible month', () => {
      wrapper.setProps({
        pageTimestamp: new Date(Date.UTC(2018, 1, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2018, 1, 26)).getTime(),
        sideBySide: true
      })
      wrapper.vm.focusNextWeek();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2018, 2, 5)).getTime()]])
      expect(wrapper.emitted('changedMonth')).toBeUndefined()
    })
  })

  describe('focusPreviousWeek', () => {
    it('changes the focused date to the previous week', () => {
      wrapper.vm.focusPreviousWeek();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2018, 1, 8)).getTime()]])
    })

    it('changes to the previous month if the current focused date is the first week of the month', () => {
      wrapper.setProps({focusedDate: new Date(Date.UTC(2018, 1, 6)).getTime()})
      wrapper.vm.focusPreviousWeek();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2018, 0, 30)).getTime()]])
    })

    it('displays the previous month if the current focused date is the first week of the month', () => {
      wrapper.setProps({
        pageDate: new Date(Date.UTC(2018, 2, 1)),
        pageTimestamp: new Date(Date.UTC(2018, 2, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2018, 2, 5)).getTime(),
      })
      wrapper.vm.focusPreviousWeek();
      expect(wrapper.emitted('changedMonth')).toEqual([[new Date(Date.UTC(2018, 1, 1))]])
    })

    it('does not display the previous month if it is side by side and the current focused date is the first week of the second visible month', () => {
      wrapper.setProps({
        pageDate: new Date(Date.UTC(2018, 1, 1)),
        pageTimestamp: new Date(Date.UTC(2018, 1, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2018, 2, 5)).getTime(),
        sideBySide: true
      })
      wrapper.vm.focusPreviousWeek();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2018, 1, 26)).getTime()]])
      expect(wrapper.emitted('changedMonth')).toBeUndefined()
    })
  })
})
