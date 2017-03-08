import DateLanguages from './DateLanguages'

export default {

  /**
   * Validates a date object
   * @param {Date} date - an object instantiated with the new Date constructor
   * @return {Boolean}
   */
  isValidDate (date) {
    if (Object.prototype.toString.call(date) !== '[object Date]') {
      return false
    }
    return !isNaN(date.getTime())
  },

  /**
   * Return abbreviated week day name
   * @param {Date}
   * @param {Array}
   * @return {String}
   */
  getDayNameAbbr (date, days) {
    if (typeof date !== 'object') {
      throw TypeError('Invalid Type')
    }
    return days[date.getDay()]
  },

  /**
   * Return name of the month
   * @param {Number|Date}
   * @param {Array}
   * @return {String}
   */
  getMonthName (month, months) {
    if (!months) {
      throw Error('missing 2nd parameter Months array')
    }
    if (typeof month === 'object') {
      return months[month.getMonth()]
    }
    if (typeof month === 'number') {
      return months[month]
    }
    throw TypeError('Invalid type')
  },

  /**
   * Return an abbreviated version of the month
   * @param {Number|Date}
   * @return {String}
   */
  getMonthNameAbbr (month, monthsAbbr) {
    if (!monthsAbbr) {
      throw Error('missing 2nd paramter Months array')
    }
    if (typeof month === 'object') {
      return monthsAbbr[month.getMonth()]
    }
    if (typeof month === 'number') {
      return monthsAbbr[month]
    }
    throw TypeError('Invalid type')
  },

  /**
   * Returns a UTC date with timezone information removed
   * @param {Date} date
   * @return {Date}
   */
  convertToUTC (date) {
    return new Date(date.getTime() + (date.getTimezoneOffset() * 60000))
  },

  /**
   * Return the number of days in the month
   * @param {Number} year
   * @param {Number} month - month here is equal to getMonth() i.e index based
   * @return {Number}
   */
  daysInMonth (year, month) {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  },

  /**
   * Returns number of days between two dates
   * @param {Date} start
   * @param {Date} end
   * @return {Number}
   */
  dayDiff (start, end) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24

    // Discard the time and time-zone information.
    let utc1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
    let utc2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())

    return Math.floor((utc2 - utc1) / MS_PER_DAY)
  },

  /**
   * Get nth suffix for date
   * @param {Number} day
   * @return {String}
   */
  getNthSuffix (day) {
    switch (day) {
      case 1:
      case 21:
      case 31:
        return 'st'
      case 2:
      case 22:
        return 'nd'
      case 3:
      case 23:
        return 'rd'
      default:
        return 'th'
    }
  },

  /**
   * Formats date object
   * @param {Date}
   * @param {String}
   * @param {Object}
   * @return {String}
   */
  formatDate (date, format, translation) {
    translation = (!translation) ? DateLanguages.translations.en : translation
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let str = format
      .replace(/dd/, ('0' + day).slice(-2))
      .replace(/d/, day)
      .replace(/yyyy/, year)
      .replace(/yy/, String(year).slice(2))
      .replace(/MMMM/, this.getMonthName(date.getMonth(), translation.months.original))
      .replace(/MMM/, this.getMonthNameAbbr(date.getMonth(), translation.months.abbr))
      .replace(/MM/, ('0' + month).slice(-2))
      .replace(/M(?!a|ä)/, month)
      .replace(/su/, this.getNthSuffix(date.getDate()))
      .replace(/D(?!e|é|i)/, this.getDayNameAbbr(date, translation.days))
    return str
  },

  /**
   * Creates an array of dates for each day in between two dates.
   * @param {Date} start
   * @param {Date} end
   * @return {Array}
   */
  createDateArray (start, end) {
    let dates = []
    while (start <= end) {
      dates.push(new Date(start))
      start = new Date(start).setDate(new Date(start).getDate() + 1)
    }
    return dates
  }

}
