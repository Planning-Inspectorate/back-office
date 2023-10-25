/**
 *
 * @param {number} timeHour
 * @param {number} timeMinute
 * @param {number} beforeTimeHour
 * @param {number} beforeTimeMinute
 * @returns {boolean} indicating whether time is before beforeTime
 */
export function timeIsBeforeTime(timeHour, timeMinute, beforeTimeHour, beforeTimeMinute) {
	return timeHour * 60 + timeMinute < beforeTimeHour * 60 + beforeTimeMinute;
}
