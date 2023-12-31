const { DateTime } = require('luxon');

function getFormattedDatetime() {
    value =  DateTime.fromJSDate(new Date()).setZone('America/Chicago').toFormat('yyyy-MM-dd HH:mm:ss');
    return value
}

function formatDatetime(datetime) {
    return DateTime.fromMillis(datetime).toFormat('yyyy/MM/dd HH:mm:ss')
} 

function formatDate(datetime) {
    return DateTime.fromISO(datetime).toFormat('yyyy/MM/dd')
} 

function formatCSTTime(timestamp) {
    const dateObject = new Date(timestamp); 
	const cstOffset = -6 * 60; 
	dateObject.setMinutes(dateObject.getMinutes() + cstOffset);
	return dateObject.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

module.exports = { formatCSTTime, getFormattedDatetime, formatDatetime, formatDate };
