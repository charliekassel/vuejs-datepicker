/* global describe, it, expect, beforeEach */

import Vue from 'vue'
import Datepicker from '../src/components/Datepicker.vue'

let vm

describe('Datepicker.vue', () => {

    beforeEach(() => {
        vm = new Vue({
            template: '<div><datepicker :value="value" format="yyyy-MM-d"></datepicker></div>',
            components: { Datepicker },
            data: function() {
                return {
                    value: new Date(2016, 1, 15)
                }
            }
        }).$mount()
    })

    it('should render correct contents', (done)=> {
        vm.$nextTick(()=> {
            expect(vm.$el.querySelectorAll('.datepicker').length).toBe(1)
            expect(vm.$el.querySelector('input').value).toBe('2016-02-15')
            done()
        })
    })

    it('should set currdate to be now', (done)=> {
        vm.$nextTick(()=> {
            const data = Datepicker.data()
            const d = new Date(data.currDate)
            expect(d.getFullYear()).toBe(new Date().getFullYear())
            expect(d.getMonth()).toBe(new Date().getMonth())
            expect(d.getDay()).toBe(new Date().getDay())
            done()
        })
    })

    it('should open and close the calendar', (done)=> {
        vm.$nextTick(()=> {
            Datepicker.methods.close()
            expect(Datepicker.methods.isOpen()).toBe(false)

            Datepicker.methods.showMonthCalendar()
            expect(Datepicker.methods.isOpen()).toBe(true)

            Datepicker.methods.close()
            expect(Datepicker.methods.isOpen()).toBe(false)

            Datepicker.methods.showYearCalendar()
            expect(Datepicker.methods.isOpen()).toBe(true)

            Datepicker.methods.close()
            expect(Datepicker.methods.isOpen()).toBe(false)

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
            data: function() {
                return state
            }
        }).$mount()
    })

    it('should format a string prop value', (done)=> {
        vm.$nextTick(()=> {
            expect(vm.$el.querySelector('input').value).toBe('2016-02-20')
            done()
        })
    })
    it('should allow value to be changed outside of component', (done)=> {
        state.value = new Date(2016, 2, 15)
        vm.$nextTick(()=> {
            expect(vm.$el.querySelector('input').value).toBe('2016-03-15')
            done()
        })
    })
})
