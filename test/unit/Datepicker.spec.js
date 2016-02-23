/* global describe, it, expect */

import Vue from 'vue'
import Datepicker from '../../src/components/Datepicker.vue'

let vm

describe('Datepicker.vue', () => {

    beforeEach((done) => {
      vm = new Vue({
        template: '<div><datepicker value="2016-02-15" format="yyyy-MM-d"></datepicker></div>',
        components: { Datepicker }
      }).$mount();
      vm.$nextTick(done)
    })




    it('should render correct contents', ()=> {
        expect(vm.$el.querySelectorAll('.datepicker').length).toBe(1)
        expect(vm.$el.querySelector('input').value).toBe('2016-02-15')
    })

    it('should set currdate to be now', ()=> {
        const data = Datepicker.data()
        expect(data.currDate).toBe(new Date().getTime())
    })

    it('should format date strings', ()=> {
        let str;
        str = Datepicker.methods.formatDate(new Date(2016, 0, 1), 'd MMMM yyyy')
        expect(str).toBe('1 January 2016')
        str = Datepicker.methods.formatDate(new Date(2016, 0, 9), 'dd MMM yyyy')
        expect(str).toBe('09 Jan 2016')
        str = Datepicker.methods.formatDate(new Date(2016, 0, 9), 'dd MMM yy')
        expect(str).toBe('09 Jan 16')
        str = Datepicker.methods.formatDate(new Date(2016, 2, 9), 'yyyy-MM-dd')
        expect(str).toBe('2016-03-09')
    })

    it('should open and close the calendar', ()=> {        
        const d = Datepicker.data();
        Datepicker.methods.close();
        expect(Datepicker.methods.isOpen()).toBe(false);
        Datepicker.methods.showCalendar();
        expect(Datepicker.methods.isOpen()).toBe(true);
        Datepicker.methods.close();
        expect(Datepicker.methods.isOpen()).toBe(false);
        Datepicker.methods.showDayCalendar();
        expect(Datepicker.methods.isOpen()).toBe(true);
        Datepicker.methods.showMonthCalendar()
        expect(Datepicker.methods.isOpen()).toBe(true);
    })
});

describe('Datepicker.vue set by object', () => {
    beforeEach((done) => {
      vm = new Vue({
        template: '<div><datepicker :value="value" :format="format"></datepicker></div>',
        components: { Datepicker },
        data: function() {
            return {
                value: new Date(2016, 1, 20),
                format: 'yyyy-MM-dd'
            }
        }
      }).$mount();
      vm.$nextTick(done)
    })
    it('should format a string prop value', ()=> {
        expect(vm.$el.querySelector('input').value).toBe('2016-02-20')
    })
})
