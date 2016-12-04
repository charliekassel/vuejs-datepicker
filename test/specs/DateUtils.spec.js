/* global describe, it, expect */

import DateUtils from '../../src/utils/DateUtils'
import DateLanguages from '../../src/utils/DateLanguages'

describe('DateUtils', () => {
  it('should detect invalid date object', () => {
    expect(DateUtils.isValidDate(null)).to.equal(false)
    expect(DateUtils.isValidDate(123)).to.equal(false)
    expect(DateUtils.isValidDate('abc')).to.equal(false)
    expect(DateUtils.isValidDate({})).to.equal(false)
    expect(DateUtils.isValidDate(new Date())).to.equal(true)
  })

  it('should give correct days in a month', () => {
    expect(DateUtils.daysInMonth(2016, 0)).to.equal(31)
    expect(DateUtils.daysInMonth(2016, 1)).to.equal(29)
    expect(DateUtils.daysInMonth(2015, 1)).to.equal(28)
    expect(DateUtils.daysInMonth(2016, 2)).to.equal(31)
    expect(DateUtils.daysInMonth(2016, 3)).to.equal(30)
    expect(DateUtils.daysInMonth(2016, 4)).to.equal(31)
    expect(DateUtils.daysInMonth(2016, 5)).to.equal(30)
    expect(DateUtils.daysInMonth(2016, 6)).to.equal(31)
    expect(DateUtils.daysInMonth(2016, 7)).to.equal(31)
    expect(DateUtils.daysInMonth(2016, 8)).to.equal(30)
    expect(DateUtils.daysInMonth(2016, 9)).to.equal(31)
    expect(DateUtils.daysInMonth(2016, 10)).to.equal(30)
    expect(DateUtils.daysInMonth(2016, 11)).to.equal(31)
  })

  it('should format date strings correctly in English', () => {
    expect(DateUtils.formatDate(new Date(2016, 0, 1), 'd MMMM yyyy')).to.equal('1 January 2016')
    expect(DateUtils.formatDate(new Date(2016, 0, 9), 'dd MMM yyyy')).to.equal('09 Jan 2016')
    expect(DateUtils.formatDate(new Date(2016, 0, 9), 'dd MMM yy')).to.equal('09 Jan 16')
    expect(DateUtils.formatDate(new Date(2016, 2, 9), 'yyyy-MM-dd')).to.equal('2016-03-09')
    expect(DateUtils.formatDate(new Date(2016, 2, 9), 'dsu MMMM yyyy')).to.equal('9th March 2016')
    expect(DateUtils.formatDate(new Date(2016, 2, 1), 'dsu MMMM yyyy')).to.equal('1st March 2016')
    expect(DateUtils.formatDate(new Date(2016, 2, 2), 'dsu MMMM yyyy')).to.equal('2nd March 2016')
    expect(DateUtils.formatDate(new Date(2016, 2, 3), 'dsu MMMM yyyy')).to.equal('3rd March 2016')
    expect(DateUtils.formatDate(new Date(2016, 7, 1), 'D dsu MMMM yyyy')).to.equal('Mon 1st August 2016')
    expect(DateUtils.formatDate(new Date(2016, 8, 1), 'D dsu MMMM yyyy')).to.equal('Thu 1st September 2016')
    expect(DateUtils.formatDate(new Date(2016, 7, 7), 'D dsu MMMM yyyy')).to.equal('Sun 7th August 2016')
    expect(DateUtils.formatDate(new Date(2016, 11, 2), 'dd MMM yyyy')).to.equal('02 Dec 2016')
  })

  it('should give the correct day', () => {
    expect(DateUtils.formatDate(new Date(2016, 8, 12), 'D')).to.equal('Mon')
  })

  it('can create an array of dates', () => {
    const start = new Date(2016, 9, 12)
    const end = new Date(2016, 9, 16)
    const dates = DateUtils.createDateArray(start, end)
    expect(dates.length).to.equal(5)
    let day = 12
    dates.forEach((date) => {
      expect(date.getDate()).to.equal(day)
      day++
    })
  })

  it('gives total days between two dates', () => {
    expect(DateUtils.dayDiff(new Date(2016, 9, 5), new Date(2016, 9, 6))).to.equal(1)
  })

  it('gives days in a month', () => {
    expect(DateUtils.daysInMonth(2016, 0)).to.equal(31)
    expect(DateUtils.daysInMonth(2016, 1)).to.equal(29)
    expect(DateUtils.daysInMonth(2016, 2)).to.equal(31)
  })

  it('converts to UTC. This is not a test...', () => {
    const d = new Date()
    expect(DateUtils.convertToUTC(d).getTime()).to.equal(d.getTime() + (d.getTimezoneOffset() * 60000))
  })

  it('getDayNameAbbr moans if date is not a Date object', () => {
    expect(() => DateUtils.getDayNameAbbr(123, DateLanguages.translations.en.months.original)).to.throw(TypeError)
  })

  it('getMonthName moans if date is not a Date object', () => {
    expect(() => DateUtils.getMonthName('string', DateLanguages.translations.en.months.original)).to.throw(TypeError)
  })

  it('getMonthName complains if missing months array', () => {
    expect(() => DateUtils.getMonthName(new Date())).to.throw(Error)
  })

  it('getMonthName accepts a number', () => {
    expect(DateUtils.getMonthName(3, DateLanguages.translations.en.months.original)).to.equal('April')
  })

  it('getMonthName accepts a Date object', () => {
    expect(DateUtils.getMonthName(new Date(2016, 9, 10), DateLanguages.translations.en.months.original)).to.equal('October')
  })

  it('getMonthNameAbbr moans if date is not a Date object', () => {
    expect(() => DateUtils.getMonthNameAbbr('abc', DateLanguages.translations.en.months.original)).to.throw(TypeError)
  })

  it('getMonthNameAbbr complains if missing months array', () => {
    expect(() => DateUtils.getMonthNameAbbr(new Date())).to.throw(Error)
  })

  it('getMonthNameAbbr accepts a Date object', () => {
    expect(DateUtils.getMonthNameAbbr(new Date(2016, 9, 10), DateLanguages.translations.en.months.abbr)).to.equal('Oct')
  })

  it('getMonthName accepts a number', () => {
    expect(DateUtils.getMonthNameAbbr(3, DateLanguages.translations.en.months.abbr)).to.equal('Apr')
  })
})
