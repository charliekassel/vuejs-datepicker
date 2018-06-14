import en from '../locale/translations/en'

const utils = {
/**
   * Returns the full year, using UTC or not
   * @param {Date} date
   * @param {Boolean} useUtc
   */
  getFullYear (date, useUtc) {
    return useUtc ? date.getUTCFullYear() : date.getFullYear()
  },

  /**
   * Returns the month, using UTC or not
   * @param {Date} date
   * @param {Boolean} useUtc
   */
  getMonth (date, useUtc) {
    return useUtc ? date.getUTCMonth() : date.getMonth()
  },

  /**
   * Returns the date, using UTC or not
   * @param {Date} date
   * @param {Boolean} useUtc
   */
  getDate (date, useUtc) {
    return useUtc ? date.getUTCDate() : date.getDate()
  },

  /**
   * Returns the day, using UTC or not
   * @param {Date} date
   * @param {Boolean} useUtc
   */
  getDay (date, useUtc) {
    return useUtc ? date.getUTCDay() : date.getDay()
  },

  /**
   * Returns the hours, using UTC or not
   * @param {Date} date
   * @param {Boolean} useUtc
   */
  getHours (date, useUtc) {
    return useUtc ? date.getUTCHours() : date.getHours()
  },

  /**
   * Returns the minutes, using UTC or not
   * @param {Date} date
   * @param {Boolean} useUtc
   */
  getMinutes (date, useUtc) {
    return useUtc ? date.getUTCMinutes() : date.getMinutes()
  },

  /**
   * Sets the full year, using UTC or not
   * @param {Date} date
   * @param {Boolean} useUtc
   */
  setFullYear (date, value, useUtc) {
    return useUtc ? date.setUTCFullYear(value) : date.setFullYear(value)
  },

  /**
   * Sets the month, using UTC or not
   * @param {Date} date
   * @param {Boolean} useUtc
   */
  setMonth (date, value, useUtc) {
    return useUtc ? date.setUTCMonth(value) : date.setMonth(value)
  },

  /**
   * Sets the date, using UTC or not
   * @param {Date} date
   * @param {Number} value
   * @param {Boolean} useUtc
   */
  setDate (date, value, useUtc) {
    return useUtc ? date.setUTCDate(value) : date.setDate(value)
  },

  /**
   * Check if date1 is equivalent to date2, without comparing the time
   * @see https://stackoverflow.com/a/6202196/4455925
   * @param {Date} date1
   * @param {Date} date2
   * @param {Boolean} useUtc
   */
  compareDates (date1, date2, useUtc) {
    const d1 = new Date(date1.getTime())
    const d2 = new Date(date2.getTime())

    if (useUtc) {
      d1.setUTCHours(0, 0, 0, 0)
      d2.setUTCHours(0, 0, 0, 0)
    } else {
      d1.setHours(0, 0, 0, 0)
      d2.setHours(0, 0, 0, 0)
    }
    return d1.getTime() === d2.getTime()
  },

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
  getDayNameAbbr (date, days, useUtc) {
    if (typeof date !== 'object') {
      throw TypeError('Invalid Type')
    }
    return days[this.getDay(date, useUtc)]
  },

  /**
   * Return name of the month
   * @param {Number|Date}
   * @param {Array}
   * @return {String}
   */
  getMonthName (month, months, useUtc) {
    if (!months) {
      throw Error('missing 2nd parameter Months array')
    }
    if (typeof month === 'object') {
      return months[this.getMonth(month, useUtc)]
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
  getMonthNameAbbr (month, monthsAbbr, useUtc) {
    if (!monthsAbbr) {
      throw Error('missing 2nd paramter Months array')
    }
    if (typeof month === 'object') {
      return monthsAbbr[this.getMonth(month, useUtc)]
    }
    if (typeof month === 'number') {
      return monthsAbbr[month]
    }
    throw TypeError('Invalid type')
  },

  /**
   * Alternative get total number of days in month
   * @param {Number} year
   * @param {Number} m
   * @return {Number}
   */
  daysInMonth (year, month) {
    return /8|3|5|10/.test(month) ? 30 : month === 1 ? (!(year % 4) && year % 100) || !(year % 400) ? 29 : 28 : 31
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
  formatDate (date, format, translation, useUtc) {
    translation = (!translation) ? en : translation
    let year = this.getFullYear(date, useUtc)
    let month = this.getMonth(date, useUtc) + 1
    let day = this.getDate(date, useUtc)
    let str = format
      .replace(/dd/, ('0' + day).slice(-2))
      .replace(/d/, day)
      .replace(/yyyy/, year)
      .replace(/yy/, String(year).slice(2))
      .replace(/MMMM/, this.getMonthName(this.getMonth(date, useUtc), translation.months, useUtc))
      .replace(/MMM/, this.getMonthNameAbbr(this.getMonth(date, useUtc), translation.monthsAbbr, useUtc))
      .replace(/MM/, ('0' + month).slice(-2))
      .replace(/M(?!a|ä|e)/, month)
      .replace(/su/, this.getNthSuffix(this.getDate(date, useUtc)))
      .replace(/D(?!e|é|i)/, this.getDayNameAbbr(date, translation.days, useUtc))
    return str
  },

  /**
   * Creates an array of dates for each day in between two dates.
   * @param {Date} start
   * @param {Date} end
   * @return {Array}
   */
  createDateArray (start, end, useUtc) {
    let dates = []
    while (start <= end) {
      dates.push(new Date(start))
      start = this.setDate(new Date(start), this.getDate(new Date(start), useUtc) + 1, useUtc)
    }
    return dates
  }
}

export const makeDateUtils = useUtc => {
  const dateUtils = {}

  for (const key in utils) {
    dateUtils[key] = (...args) => utils[key](...args, useUtc)
  }
  return dateUtils
}

export default {
  ...utils,
  makeDateUtils
}
// eslint-disable-next-line
;
