module.exports = {    

    /**
     * Return abbreviated week day name
     * @param {Date}
     * @return {String}
     */
    getDayNameAbbr(date) {
        let dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        if (typeof date !== 'object') {
            throw TypeError('Invalid Type');
        }
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
     * Return the number of days in the month
     * @param {Number} year
     * @param {Number} month
     * @return {Number}
     */
    daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    },

    /**
     * Returns number of days between two dates
     * @param {Date} start
     * @param {Date} end
     * @return {Number}
     */
    dayDiff(start, end) {
        return Math.floor((end - start) / (1000*60*60*24));
    }
}
