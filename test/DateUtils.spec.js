/* global describe, it, expect */

import DateUtils from '../src/utils/DateUtils'
import DateLanguages from '../src/utils/DateLanguages'

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

    it('should format date strings', ()=> {
        let str
        let translation = DateLanguages.translations['en']

        str = DateUtils.formatDate(new Date(2016, 0, 1), 'd MMMM yyyy', translation)
        expect(str).toBe('1 January 2016')

        str = DateUtils.formatDate(new Date(2016, 0, 9), 'dd MMM yyyy', translation)
        expect(str).toBe('09 Jan 2016')

        str = DateUtils.formatDate(new Date(2016, 0, 9), 'dd MMM yy', translation)
        expect(str).toBe('09 Jan 16')

        str = DateUtils.formatDate(new Date(2016, 2, 9), 'yyyy-MM-dd', translation)
        expect(str).toBe('2016-03-09')
    })
})
