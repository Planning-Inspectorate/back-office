/**
 * @typedef {{ error: any, info: any, log: any}} Context
 */

/**
 * @param {Context} context
 * @param {any} employee
 */
export const index = async (context, employee) => {
	context.log('Received employee update', employee);
};
