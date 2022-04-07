const getDateWithoutTime = function(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const daysBetweenDates = function(firstDate, secondDate) {
	const firstDateWithoutTime = getDateWithoutTime(firstDate);
	const secondDateWithoutTime = getDateWithoutTime(secondDate);
	const oneDay = 24 * 60 * 60 * 1000;
	return Math.round(Math.abs((firstDateWithoutTime - secondDateWithoutTime) / oneDay));
};

export default daysBetweenDates;
