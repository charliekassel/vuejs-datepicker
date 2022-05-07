export default class Language {
  constructor (language, months, monthsAbbr, days, calendarweek) {
    this.language = language
    this.months = months
    this.monthsAbbr = monthsAbbr
    this.days = days
    this.calendarweek = calendarweek
    this.rtl = false
    this.ymd = false
    this.yearSuffix = ''
  }

  get language () {
    return this._language
  }

  set language (language) {
    if (typeof language !== 'string') {
      throw new TypeError('Language must be a string')
    }
    this._language = language
  }

  get months () {
    return this._months
  }

  set months (months) {
    if (months.length !== 12) {
      throw new RangeError(`There must be 12 months for ${this.language} language`)
    }
    this._months = months
  }

  get monthsAbbr () {
    return this._monthsAbbr
  }

  set monthsAbbr (monthsAbbr) {
    if (monthsAbbr.length !== 12) {
      throw new RangeError(`There must be 12 abbreviated months for ${this.language} language`)
    }
    this._monthsAbbr = monthsAbbr
  }

  get days () {
    return this._days
  }

  set days (days) {
    if (days.length !== 7) {
      throw new RangeError(`There must be 7 days for ${this.language} language`)
    }
    this._days = days
  }

  get calendarweek () {
    return this._calendarweek
  }

  set calendarweek (calendarweek = '') {
    if (typeof calendarweek !== 'string') {
      throw new TypeError('Calendar week must be a string')
    }
    this._calendarweek = calendarweek
  }
}
// eslint-disable-next-line
;
