/* global describe, it, expect */

import DateUtils from '../src/utils/DateUtils'

describe('DateUtils', () => {

    it('should detect invalid date object', ()=> {
        expect(DateUtils.isValidDate()).toBe(false)
        expect(DateUtils.isValidDate(123)).toBe(false)
        expect(DateUtils.isValidDate('abc')).toBe(false)
        expect(DateUtils.isValidDate({})).toBe(false)
        expect(DateUtils.isValidDate(new Date())).toBe(true)
    })

    it('should give correct days in a month', ()=> {
        expect(DateUtils.daysInMonth(2016, 0)).toBe(31)
        expect(DateUtils.daysInMonth(2016, 1)).toBe(29)
        expect(DateUtils.daysInMonth(2015, 1)).toBe(28)
        expect(DateUtils.daysInMonth(2016, 2)).toBe(31)
        expect(DateUtils.daysInMonth(2016, 3)).toBe(30)
        expect(DateUtils.daysInMonth(2016, 4)).toBe(31)
        expect(DateUtils.daysInMonth(2016, 5)).toBe(30)
        expect(DateUtils.daysInMonth(2016, 6)).toBe(31)
        expect(DateUtils.daysInMonth(2016, 7)).toBe(31)
        expect(DateUtils.daysInMonth(2016, 8)).toBe(30)
        expect(DateUtils.daysInMonth(2016, 9)).toBe(31)
        expect(DateUtils.daysInMonth(2016, 10)).toBe(30)
        expect(DateUtils.daysInMonth(2016, 11)).toBe(31)
    })

    it('should format date strings correctly in English', ()=> {
        expect(DateUtils.formatDate(new Date(2016, 0, 1), 'd MMMM yyyy')).toBe('1 January 2016')
        expect(DateUtils.formatDate(new Date(2016, 0, 9), 'dd MMM yyyy')).toBe('09 Jan 2016')
        expect(DateUtils.formatDate(new Date(2016, 0, 9), 'dd MMM yy')).toBe('09 Jan 16')
        expect(DateUtils.formatDate(new Date(2016, 2, 9), 'yyyy-MM-dd')).toBe('2016-03-09')
        expect(DateUtils.formatDate(new Date(2016, 2, 9), 'dsu MMMM yyyy')).toBe('9th March 2016')
        expect(DateUtils.formatDate(new Date(2016, 2, 1), 'dsu MMMM yyyy')).toBe('1st March 2016')
        expect(DateUtils.formatDate(new Date(2016, 2, 2), 'dsu MMMM yyyy')).toBe('2nd March 2016')
        expect(DateUtils.formatDate(new Date(2016, 2, 3), 'dsu MMMM yyyy')).toBe('3rd March 2016')
        expect(DateUtils.formatDate(new Date(2016, 7, 1), 'D dsu MMMM yyyy')).toBe('Mon 1st August 2016')
        expect(DateUtils.formatDate(new Date(2016, 8, 1), 'D dsu MMMM yyyy')).toBe('Thu 1st September 2016')
        expect(DateUtils.formatDate(new Date(2016, 7, 7), 'D dsu MMMM yyyy')).toBe('Sun 7th August 2016')
    })

})
