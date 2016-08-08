export default {

    /**
     * Validates a date object
     * @param {Date} date - an object instantiated with the new Date constructor
     * @return {Boolean}
     */
    isValidDate: function(date) {
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
    getDayNameAbbr: function(date, days) {
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
    getMonthName: function(month, months) {
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
    getMonthNameAbbr: function(month, monthsAbbr) {
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
    convertToUTC: function(date) {
        return new Date(date.getTime() + (date.getTimezoneOffset() * 60000))
    },

    /**
     * Return the number of days in the month
     * @param {Number} year
     * @param {Number} month
     * @return {Number}
     */
    daysInMonth: function(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
    },

    /**
     * Alternative get total number of days in month
     * @param {Number} y
     * @param {Number} m
     * @return {Number}
     */
    getDaysInMonth: function(y, m) {
        return /8|3|5|10/.test(--m) ? 30 : m === 1 ? (!(y % 4) && y % 100) || !(y % 400) ? 29 : 28 : 31
    },

    /**
     * Returns number of days between two dates
     * @param {Date} start
     * @param {Date} end
     * @return {Number}
     */
    dayDiff: function(start, end) {
        const MS_PER_DAY = 1000 * 60 * 60 * 24

        // Discard the time and time-zone information.
        var utc1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
        var utc2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())

        return Math.floor((utc2 - utc1) / MS_PER_DAY)
    },

    /**
     * Get nth suffix for date
     * @param {Number} day
     * @return {String}
     */
    getNthSuffix: function(day) {
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
    formatDate: function(date, format, translation) {
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var str = format
            .replace(/yyyy/, year)
            .replace(/yy/, String(year).slice(2))
            .replace(/MMMM/, this.getMonthName(date.getMonth(), translation.months.original))
            .replace(/MMM/, this.getMonthNameAbbr(date.getMonth(), translation.months.abbr))
            .replace(/MM/, ('0' + month).slice(-2))
            .replace(/M(?!a)/, month)
            .replace(/dd/, ('0' + day).slice(-2))
            .replace(/d/, day)
            .replace(/su/, this.getNthSuffix(date.getDate()))
            .replace(/D/, this.getDayNameAbbr(date, translation.days))

        return str
    },

    /**
     * Creates an array of dates for each day in between two dates.
     * @param {Date} start
     * @param {Date} end
     * @return {Array}
     */
    createDateArray: function(start, end) {
        var dates = []
        while (start <= end) {
            dates.push(new Date(start))
            start.setDate(start.getDate() + 1)
        }
        return dates
    }

}
