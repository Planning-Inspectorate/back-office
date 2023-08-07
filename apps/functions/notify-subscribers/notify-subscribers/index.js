/**
 * @param {import('@azure/functions').Context} context
 * @param {any} myTimer
 */
export default async function (context, myTimer) {
	var timeStamp = new Date().toISOString();

	if (myTimer.isPastDue) {
		context.log('JavaScript is running late!');
	}
	context.log('JavaScript timer trigger function ran!', timeStamp);
}
