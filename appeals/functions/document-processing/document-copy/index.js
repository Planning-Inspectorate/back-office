/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {*} msg
 */
export default async function (context, msg) {
	context.log('Document copy', msg);
}
