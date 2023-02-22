/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {*} myDocument
 */
export const publishDocument = (context, myDocument) => {
	context.log('test');
	context.log(myDocument);
};
