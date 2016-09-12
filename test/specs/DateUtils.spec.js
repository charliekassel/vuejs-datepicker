/* global describe, it, expect */

import DateUtils from '../../src/utils/DateUtils'

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
  })

  it('should give the correct day', () => {
    expect(DateUtils.formatDate(new Date(2016, 8, 12), 'D')).to.equal('Mon')
  })
})
