/* global describe, it, expect, beforeEach */

import Vue from 'vue'
import Datepicker from '../../src/Datepicker.vue'

let vm

function dpc (state) {
  return {
    template: '<div><datepicker :value="value" format="yyyy-MM-d" v-ref:component></datepicker></div>',
    components: { Datepicker },
    data: function () {
      return state
    }
  }
}

describe('Datepicker', () => {
  it('has a mounted hook', () => {
    expect(typeof Datepicker.mounted).to.equal('function')
  })

  it('sets the correct default data', () => {
    expect(typeof Datepicker.data).to.equal('function')
    const defaultData = Datepicker.data()
    expect(defaultData.selectedDate).to.equal(null)
    expect(defaultData.showDayView).to.equal(false)
    expect(defaultData.showMonthView).to.equal(false)
    expect(defaultData.showYearView).to.equal(false)
    expect(defaultData.formattedValue).to.equal(null)
    expect(defaultData.calendarHeight).to.equal(0)
    expect(defaultData.currDate).to.equal(new Date().getTime())
  })

  it('correctly sets the value when created', () => {
    const date = new Date(2016, 1, 15)
    const vm = new Vue(dpc({value: date})).$mount()
    expect(vm.value).to.equal(date)
  })

  it('correctly sets the value from method', () => {
    const date = new Date(2016, 1, 15)
    const vm = new Vue(dpc({
      value: date
    })).$mount()
    const newDate = new Date(2016, 9, 15)
    expect(typeof vm.$refs.component.setValue).to.equal('function')
    vm.$refs.component.setValue(newDate)
    expect(vm.$refs.component.selectedDate).to.equal(newDate)
    expect(vm.$refs.component.formattedValue).to.equal('2016-10-15')
  })
})

describe('Datepicker.vue', () => {
  beforeEach(() => {
    vm = new Vue({
      template: '<div><datepicker :value="value" format="yyyy-MM-d"></datepicker></div>',
      components: { Datepicker },
      data: function () {
        return {
          value: new Date(2016, 1, 15)
        }
      }
    }).$mount()
  })

  it('should render correct contents', (done) => {
    vm.$nextTick(() => {
      expect(vm.$el.querySelectorAll('.datepicker').length).to.equal(1)
      expect(vm.$el.querySelectorAll('input').length).to.equal(1)
      done()
    })
  })

  it('should set currdate to be now', (done) => {
    vm.$nextTick(() => {
      const data = Datepicker.data()
      const d = new Date(data.currDate)
      expect(d.getFullYear()).to.equal(new Date().getFullYear())
      expect(d.getMonth()).to.equal(new Date().getMonth())
      expect(d.getDay()).to.equal(new Date().getDay())
      done()
    })
  })

  it('should open and close the calendar', (done) => {
    vm.$nextTick(() => {
      Datepicker.methods.close()
      expect(Datepicker.methods.isOpen()).to.equal(false)

      Datepicker.methods.showMonthCalendar()
      expect(Datepicker.methods.isOpen()).to.equal(true)

      Datepicker.methods.close()
      expect(Datepicker.methods.isOpen()).to.equal(false)

      Datepicker.methods.showYearCalendar()
      expect(Datepicker.methods.isOpen()).to.equal(true)

      Datepicker.methods.close()
      expect(Datepicker.methods.isOpen()).to.equal(false)

      done()
    })
  })
})

describe('Datepicker.vue set by object', () => {
  let state
  beforeEach(() => {
    state = {
      value: new Date(2016, 1, 20),
      format: 'yyyy-MM-dd'
    }
    vm = new Vue({
      template: '<div><datepicker :value="value" :format="format"></datepicker></div>',
      components: { Datepicker },
      data: function () {
        return state
      }
    }).$mount()
  })

  it('should allow value to be changed outside of component', (done) => {
    state.value = new Date(2016, 2, 15)
    vm.$nextTick(() => {
      expect(vm.$el.querySelector('input').value).to.equal('2016-03-15')
      done()
    })
  })

  // it('should set the date', (done) => {
  //   vm.$nextTick(() => {
  //     const date = new Date(2016, 9, 8)
  //     // expect(date.getTime()).to.equal(1)
  //     console.log(vm)

  //     vm.methods.setDate(date.getTime())
  //     // console.log(data)
  //     expect(vm.data().selectedDate).to.equal(date)
  //     done()
  //   })
  // })
})
