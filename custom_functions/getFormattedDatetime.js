const { DateTime } = require('luxon');

function getFormattedDatetime() {
    return DateTime.fromJSDate(new Date()).setZone('America/Chicago').toFormat('yyyy-MM-dd HH:mm:ss');
}

function formatDatetime(datetime) {
    return DateTime.fromMillis(datetime).toFormat('yyyy/MM/dd HH:mm:ss')
} 

module.exports = { getFormattedDatetime, formatDatetime };
