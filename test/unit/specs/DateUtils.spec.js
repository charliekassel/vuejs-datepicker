import DateUtils, { makeDateUtils } from '@/utils/DateUtils'
import {en} from '@/locale'

describe('DateUtils', () => {
  it('should detect invalid date object', () => {
    expect(DateUtils.isValidDate(null)).toEqual(false)
    expect(DateUtils.isValidDate(123)).toEqual(false)
    expect(DateUtils.isValidDate('abc')).toEqual(false)
    expect(DateUtils.isValidDate({})).toEqual(false)
    expect(DateUtils.isValidDate(new Date())).toEqual(true)
  })

  it('should give correct days in a month', () => {
    expect(DateUtils.daysInMonth(2016, 0)).toEqual(31)
    expect(DateUtils.daysInMonth(2016, 1)).toEqual(29)
    expect(DateUtils.daysInMonth(2015, 1)).toEqual(28)
    expect(DateUtils.daysInMonth(2016, 2)).toEqual(31)
    expect(DateUtils.daysInMonth(2016, 3)).toEqual(30)
    expect(DateUtils.daysInMonth(2016, 4)).toEqual(31)
    expect(DateUtils.daysInMonth(2016, 5)).toEqual(30)
    expect(DateUtils.daysInMonth(2016, 6)).toEqual(31)
    expect(DateUtils.daysInMonth(2016, 7)).toEqual(31)
    expect(DateUtils.daysInMonth(2016, 8)).toEqual(30)
    expect(DateUtils.daysInMonth(2016, 9)).toEqual(31)
    expect(DateUtils.daysInMonth(2016, 10)).toEqual(30)
    expect(DateUtils.daysInMonth(2016, 11)).toEqual(31)
  })

  it('should format date strings correctly in English', () => {
    expect(DateUtils.formatDate(new Date(2016, 0, 1), 'd MMMM yyyy')).toEqual('1 January 2016')
    expect(DateUtils.formatDate(new Date(2016, 0, 9), 'dd MMM yyyy')).toEqual('09 Jan 2016')
    expect(DateUtils.formatDate(new Date(2016, 0, 9), 'dd MMM yy')).toEqual('09 Jan 16')
    expect(DateUtils.formatDate(new Date(2016, 2, 9), 'yyyy-MM-dd')).toEqual('2016-03-09')
    expect(DateUtils.formatDate(new Date(2016, 2, 9), 'dsu MMMM yyyy')).toEqual('9th March 2016')
    expect(DateUtils.formatDate(new Date(2016, 2, 1), 'dsu MMMM yyyy')).toEqual('1st March 2016')
    expect(DateUtils.formatDate(new Date(2016, 2, 2), 'dsu MMMM yyyy')).toEqual('2nd March 2016')
    expect(DateUtils.formatDate(new Date(2016, 2, 3), 'dsu MMMM yyyy')).toEqual('3rd March 2016')
    expect(DateUtils.formatDate(new Date(2016, 7, 1), 'D dsu MMMM yyyy')).toEqual('Mon 1st August 2016')
    expect(DateUtils.formatDate(new Date(2016, 8, 1), 'D dsu MMMM yyyy')).toEqual('Thu 1st September 2016')
    expect(DateUtils.formatDate(new Date(2016, 7, 7), 'D dsu MMMM yyyy')).toEqual('Sun 7th August 2016')
    expect(DateUtils.formatDate(new Date(2016, 11, 2), 'dd MMM yyyy')).toEqual('02 Dec 2016')
  })

  it('should give the correct day', () => {
    expect(DateUtils.formatDate(new Date(2016, 8, 12), 'D')).toEqual('Mon')
  })

  it('can create an array of dates', () => {
    const start = new Date(2016, 9, 12)
    const end = new Date(2016, 9, 16)
    const dates = DateUtils.createDateArray(start, end)
    expect(dates.length).toEqual(5)
    let day = 12
    dates.forEach((date) => {
      expect(date.getDate()).toEqual(day)
      day++
    })
  })

  it('gives days in a month', () => {
    expect(DateUtils.daysInMonth(2016, 0)).toEqual(31)
    expect(DateUtils.daysInMonth(2016, 1)).toEqual(29)
    expect(DateUtils.daysInMonth(2016, 2)).toEqual(31)
  })

  it('getDayNameAbbr moans if date is not a Date object', () => {
    expect(() => DateUtils.getDayNameAbbr(123, en.months)).toThrow(TypeError)
  })

  it('getMonthName moans if date is not a Date object', () => {
    expect(() => DateUtils.getMonthName('string', en.months)).toThrow(TypeError)
  })

  it('getMonthName complains if missing months array', () => {
    expect(() => DateUtils.getMonthName(new Date())).toThrow(Error)
  })

  it('getMonthName accepts a number', () => {
    expect(DateUtils.getMonthName(3, en.months)).toEqual('April')
  })

  it('getMonthName accepts a Date object', () => {
    expect(DateUtils.getMonthName(new Date(2016, 9, 10), en.months)).toEqual('October')
  })

  it('getMonthNameAbbr moans if date is not a Date object', () => {
    expect(() => DateUtils.getMonthNameAbbr('abc', en.months)).toThrow(TypeError)
  })

  it('getMonthNameAbbr complains if missing months array', () => {
    expect(() => DateUtils.getMonthNameAbbr(new Date())).toThrow(Error)
  })

  it('getMonthNameAbbr accepts a Date object', () => {
    expect(DateUtils.getMonthNameAbbr(new Date(2016, 9, 10), en.monthsAbbr)).toEqual('Oct')
  })

  it('getMonthName accepts a number', () => {
    expect(DateUtils.getMonthNameAbbr(3, en.monthsAbbr)).toEqual('Apr')
  })

  it('should give correct week number', () => {
    expect(DateUtils.getWeekNumber(new Date(2018, 9, 31))).toEqual(44)
    expect(DateUtils.getWeekNumber(new Date(2018, 9, 22))).toEqual(43)
    expect(DateUtils.getWeekNumber(new Date(2018, 9, 20))).toEqual(42)
    expect(DateUtils.getWeekNumber(new Date(2018, 9, 20), true)).toEqual(42)
  })

  it('calendarweek equals cw', () => {
    expect(en.calendarweek).toEqual('CW')
  })
})

describe('daysInMonth', () => {
  it('should give the correct days in a month', () => {
    expect(DateUtils.daysInMonth(2017, 0)).toEqual(31) // Jan
    expect(DateUtils.daysInMonth(2017, 1)).toEqual(28) // Feb
    expect(DateUtils.daysInMonth(2017, 2)).toEqual(31) // Mar
    expect(DateUtils.daysInMonth(2017, 3)).toEqual(30) // Apr
    expect(DateUtils.daysInMonth(2017, 4)).toEqual(31) // May
    expect(DateUtils.daysInMonth(2017, 5)).toEqual(30) // Jun
    expect(DateUtils.daysInMonth(2017, 6)).toEqual(31) // Jul
    expect(DateUtils.daysInMonth(2017, 7)).toEqual(31) // Aug
    expect(DateUtils.daysInMonth(2017, 8)).toEqual(30) // Sep
    expect(DateUtils.daysInMonth(2017, 9)).toEqual(31) // Oct
    expect(DateUtils.daysInMonth(2017, 10)).toEqual(30) // Nov
    expect(DateUtils.daysInMonth(2017, 11)).toEqual(31) // Dec
  })
})

const getAmbiguousDate = _ => {
  const timezoneOffset = ((new Date()).getTimezoneOffset() / 60)
  const ambiguousHour = 25 - timezoneOffset
  const ambiguousDate = new Date(2018, 11, 31, ambiguousHour)
  return ambiguousDate
}

describe('UTC functions', () => {
  const utcUtils = makeDateUtils(true)

  it('getFullYear', () => {
    const date = getAmbiguousDate()
    expect(DateUtils.getFullYear(date)).toEqual(date.getFullYear())
    expect(utcUtils.getFullYear(date)).toEqual(date.getUTCFullYear())
  })

  it('getMonth', () => {
    const date = getAmbiguousDate()
    expect(DateUtils.getMonth(date)).toEqual(date.getMonth())
    expect(utcUtils.getMonth(date)).toEqual(date.getUTCMonth())
  })

  it('getDate', () => {
    const date = getAmbiguousDate()
    expect(DateUtils.getDate(date)).toEqual(date.getDate())
    expect(utcUtils.getDate(date)).toEqual(date.getUTCDate())
  })

  it('getDay', () => {
    const date = getAmbiguousDate()
    expect(DateUtils.getDay(date)).toEqual(date.getDay())
    expect(utcUtils.getDay(date)).toEqual(date.getUTCDay())
  })

  it('getHours', () => {
    const date = getAmbiguousDate()
    expect(DateUtils.getHours(date)).toEqual(date.getHours())
    expect(utcUtils.getHours(date)).toEqual(date.getUTCHours())
  })

  it('getMinutes', () => {
    const date = getAmbiguousDate()
    expect(DateUtils.getMinutes(date)).toEqual(date.getMinutes())
    expect(utcUtils.getMinutes(date)).toEqual(date.getUTCMinutes())
  })

  it('getMinutes', () => {
    const date = new Date(2018, 9, 31)
    expect(DateUtils.getMinutes(date)).toEqual(date.getMinutes())
    expect(utcUtils.getMinutes(date)).toEqual(date.getUTCMinutes())
  })

  it('setFullYear', () => {
    const date = getAmbiguousDate()
    expect(DateUtils.setFullYear(date, 2018)).toEqual(date.setFullYear(2018))
    expect(utcUtils.setFullYear(date, 2018)).toEqual(date.setUTCFullYear(2018))
  })

  it('setMonth', () => {
    const date = getAmbiguousDate()
    expect(DateUtils.setMonth(date, 11)).toEqual(date.setMonth(11))
    expect(utcUtils.setMonth(date, 11)).toEqual(date.setUTCMonth(11))
  })

  it('setDate', () => {
    const date = getAmbiguousDate()
    expect(DateUtils.setDate(date, 31)).toEqual(date.setDate(31))
    expect(utcUtils.setDate(date, 31)).toEqual(date.setUTCDate(31))
  })
})
