/**
 * Checks if the given date should be disabled according to the specified config
 * @param {Date} date
 * @param {Object} disabledDates
 * @param {DateUtils} utils
 * @return {Boolean}
 */
export const isDateDisabled = function (date, disabledDates, utils) {
  // skip if no config
  if (typeof disabledDates === 'undefined') {
    return false
  }

  // check specific dates
  if (typeof disabledDates.dates !== 'undefined' && disabledDates.dates.length) {
    const dates = disabledDates.dates
    for (let i = 0; i < dates.length; i++) {
      if (utils.compareDates(date, dates[i])) {
        return true
      }
    }
  }

  if (typeof disabledDates.to !== 'undefined' && disabledDates.to && date < disabledDates.to) {
    return true
  }
  if (typeof disabledDates.from !== 'undefined' && disabledDates.from && date > disabledDates.from) {
    return true
  }

  // check date ranges
  if (typeof disabledDates.ranges !== 'undefined' && disabledDates.ranges.length) {
    const ranges = disabledDates.ranges
    for (let i = 0; i < ranges.length; i++) {
      let range = ranges[i]
      if (typeof range.from !== 'undefined' && range.from && typeof range.to !== 'undefined' && range.to) {
        if (date < range.to && date > range.from) {
          return true
        }
      }
    }
  }

  if (typeof disabledDates.days !== 'undefined' && disabledDates.days.indexOf(utils.getDay(date)) !== -1) {
    return true
  }
  if (typeof disabledDates.daysOfMonth !== 'undefined' && disabledDates.daysOfMonth.indexOf(utils.getDate(date)) !== -1) {
    return true
  }
  if (typeof disabledDates.customPredictor === 'function' && disabledDates.customPredictor(date)) {
    return true
  }

  return false
}

/**
 * Checks if the given month should be disabled according to the specified config
 * @param {Date} date
 * @param {Object} disabledDates
 * @param {DateUtils} utils
 * @return {Boolean}
 */
export const isMonthDisabled = function (date, disabledDates, utils) {
  // skip if no config
  if (typeof disabledDates === 'undefined') {
    return false
  }

  // check if the whole month is disabled before checking every individual days
  if (typeof disabledDates.to !== 'undefined' && disabledDates.to) {
    if (
      (utils.getMonth(date) < utils.getMonth(disabledDates.to) && utils.getFullYear(date) <= utils.getFullYear(disabledDates.to)) ||
      utils.getFullYear(date) < utils.getFullYear(disabledDates.to)
    ) {
      return true
    }
  }
  if (typeof disabledDates.from !== 'undefined' && disabledDates.from) {
    if (
      (utils.getMonth(date) > utils.getMonth(disabledDates.from) && utils.getFullYear(date) >= utils.getFullYear(disabledDates.from)) ||
      utils.getFullYear(date) > utils.getFullYear(disabledDates.from)
    ) {
      return true
    }
  }

  // now we have to check every days of the month
  let daysInMonth = utils.daysInMonth(utils.getFullYear(date), utils.getMonth(date))
  for (let j = 1; j <= daysInMonth; j++) {
    let dayDate = new Date(date)
    dayDate.setDate(j)
    // if at least one day of this month is NOT disabled, we can conclude that this month SHOULD be selectable
    if (!isDateDisabled(dayDate, disabledDates, utils)) {
      return false
    }
  }
  return true
}

/**
 * Checks if the given year should be disabled according to the specified config
 * @param {Date} date
 * @param {Object} disabledDates
 * @param {DateUtils} utils
 * @return {Boolean}
 */
export const isYearDisabled = function (date, disabledDates, utils) {
  // skip if no config
  if (typeof disabledDates === 'undefined' || !disabledDates) {
    return false
  }

  // check if the whole year is disabled before checking every individual months
  if (typeof disabledDates.to !== 'undefined' && disabledDates.to) {
    if (utils.getFullYear(date) < utils.getFullYear(disabledDates.to)) {
      return true
    }
  }
  if (typeof disabledDates.from !== 'undefined' && disabledDates.from) {
    if (utils.getFullYear(date) > utils.getFullYear(disabledDates.from)) {
      return true
    }
  }

  // now we have to check every months of the year
  for (let j = 0; j < 12; j++) {
    let monthDate = new Date(date)
    monthDate.setMonth(j)
    // if at least one month of this year is NOT disabled, we can conclude that this year SHOULD be selectable
    if (!isMonthDisabled(monthDate, disabledDates, utils)) {
      return false
    }
  }
  return true
}
