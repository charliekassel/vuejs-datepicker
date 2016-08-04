/* global describe, it, expect */

import Vue from 'vue'
import Datepicker from '../../src/components/Datepicker.vue'
import DateUtils from '../../src/utils/DateUtils'
import DateLanguages from '../../src/utils/DateLanguages'

let vm

describe('Datepicker.vue', () => {

    beforeEach((done) => {
      vm = new Vue({
        template: '<div><datepicker :value="value" format="yyyy-MM-d"></datepicker></div>',
        components: { Datepicker },
        data: function() {
            return {
                value: new Date(2016, 1, 15)
            }
        }
      }).$mount();
      vm.$nextTick(done)
    })

    it('should render correct contents', ()=> {
        expect(vm.$el.querySelectorAll('.datepicker').length).toBe(1)
        expect(vm.$el.querySelector('input').value).toBe('2016-02-15')
    })

    it('should set currdate to be now', ()=> {
        const data = Datepicker.data()
        const d = new Date(data.currDate)
        expect(d.getFullYear()).toBe(new Date().getFullYear())
        expect(d.getMonth()).toBe(new Date().getMonth())
        expect(d.getDay()).toBe(new Date().getDay())
    })

    it('should format date strings', ()=> {
        let str;
        let translation = DateLanguages.translations['en'];
        str = DateUtils.formatDate(new Date(2016, 0, 1), 'd MMMM yyyy', translation)
        expect(str).toBe('1 January 2016')
        str = DateUtils.formatDate(new Date(2016, 0, 9), 'dd MMM yyyy', translation)
        expect(str).toBe('09 Jan 2016')
        str = DateUtils.formatDate(new Date(2016, 0, 9), 'dd MMM yy', translation)
        expect(str).toBe('09 Jan 16')
        str = DateUtils.formatDate(new Date(2016, 2, 9), 'yyyy-MM-dd', translation)
        expect(str).toBe('2016-03-09')
    })

    it('should open and close the calendar', ()=> {
        const d = Datepicker.data();
        Datepicker.methods.close();
        expect(Datepicker.methods.isOpen()).toBe(false);
        // @fixme: showCalendar() method uses this.$nextTick() indirectly, which causes TypeError: undefined is not a function (evaluating 'this.$nextTick').
        // Temporary commented out before the test is fixed.
        // Datepicker.methods.showCalendar();
        // expect(Datepicker.methods.isOpen()).toBe(true);
        Datepicker.methods.close();
        expect(Datepicker.methods.isOpen()).toBe(false);
        // @fixme: showDayCalendar() method uses this.$nextTick(), which causes TypeError: undefined is not a function (evaluating 'this.$nextTick').
        // Temporary commented out before the test is fixed.
        // Datepicker.methods.showDayCalendar();
        // expect(Datepicker.methods.isOpen()).toBe(true);
        Datepicker.methods.showMonthCalendar();
        expect(Datepicker.methods.isOpen()).toBe(true);
    })
});

describe('Datepicker.vue set by object', () => {
    
    var state;

    beforeEach((done) => {
      state = new Date(2016, 1, 20)
      vm = new Vue({
        template: '<div><datepicker :value="value" :format="format"></datepicker></div>',
        components: { Datepicker },
        data: function() {
            return {
                value: state,
                format: 'yyyy-MM-dd'
            }
        }
      }).$mount();
      vm.$nextTick(done)
    })
    it('should format a string prop value', ()=> {
        expect(vm.$el.querySelector('input').value).toBe('2016-02-20')
    })
    it('should allow value to be changed outside of component', ()=> {
        state = new Date(2016, 2, 15)
        vm.$nextTick(function() {
            expect(vm.$el.querySelector('input').value).toBe('2016-03-15')
        });
    })
})
