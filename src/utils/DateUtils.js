module.exports = {

    /**
     * Validates a date object
     * @param {Date} date - an object instantiated with the new Date constructor
     */
    isValidDate(date) {
        if (Object.prototype.toString.call(date) !== "[object Date]") {
            return false;
        }
        return !isNaN(date.getTime());
    },

    /**
     * Return abbreviated week day name
     * @param {Date}
     * @return {String}
     */
    getDayNameAbbr(date) {
        if (typeof date !== 'object') {
            throw TypeError('Invalid Type');
        }
        let dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return dayNames[date.getDay()];
    },

    /**
     * Return name of the month
     * @param {Number|Date}
     * @return {String}
     */
    getMonthName(month) {
        let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (typeof month === 'object') {
            return monthNames[month.getMonth()];
        }
        if (typeof month === 'number') {
            return monthNames[month];
        }
        throw TypeError('Invalid type');
    },

    /**
     * Return an abbreviated version of the month
     * @param {Number|Date}
     * @return {String}
     */
    getMonthNameAbbr(month) {
        let monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (typeof month === 'object') {
            return monthAbbr[month.getMonth()];
        }
        if (typeof month === 'number') {
            return monthAbbr[month];
        }
        throw TypeError('Invalid type');
    },


    /**
     * Returns a UTC date with timezone information removed
     * @param {Date} date
     * @return {Date}
     */
    convertToUTC(date) {
        return new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
    },


    /**
     * Return the number of days in the month
     * @param {Number} year
     * @param {Number} month
     * @return {Number}
     */
    daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    },

    /**
     * Alternative get total number of days in month
     * @param {Number} y
     * @param {Number} m
     * @return {Number}
     */
    getDaysInMonth(y, m) {
       return /8|3|5|10/.test(--m)?30:m==1?(!(y%4)&&y%100)||!(y%400)?29:28:31;
    },

    /**
     * Returns number of days between two dates
     * @param {Date} start
     * @param {Date} end
     * @return {Number}
     */
    dayDiff(start, end) {
        const MS_PER_DAY = 1000 * 60 * 60 * 24;

        // Discard the time and time-zone information.
        let utc1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
        let utc2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

        return Math.floor((utc2 - utc1) / MS_PER_DAY);
    },


    /**
     * Get nth suffix for date
     * @param {Number} day
     * @return {String}
     */
    getNthSuffix(day) {
        switch (day) {
            case 1:
            case 21:
            case 31:
                return 'st';
            case 2:
            case 22:
                return 'nd';
            case 3:
            case 23:
                return 'rd';
            default:
                return 'th';
        }
    },

    /**
     * Formats date object
     * @param {Date}
     * @return {String}
     */
    formatDate(date, format) {
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let monthName = this.getMonthName(date.getMonth())
        let str = format
            .replace(/yyyy/, year)
            .replace(/yy/, String(year).slice(2))
            .replace(/MMMM/, this.getMonthName(date.getMonth()))
            .replace(/MMM/, this.getMonthNameAbbr(date.getMonth()))
            .replace(/MM/, ('0' + month).slice(-2))
            .replace(/M(?!a)/, month)
            .replace(/dd/, ('0' + day).slice(-2))
            .replace(/d/, day)
            .replace(/S/, this.getNthSuffix(date.getDate()))
            .replace(/D/, this.getDayNameAbbr(date))

        return str;
    },

    /**
     * Creates an array of dates for each day in between two dates.
     * @param {Date} start
     * @param {Date} end
     * @return {Array}
     */
    createDateArray(start, end) {
        let dates = [];
        while (start <= end) {
            dates.push(new Date(start))
            start.setDate(start.getDate() + 1);
        }
        return dates;
    }

}
