/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (context, employee) => {
	context.log('Received employee update', employee?.EmployeeId);
};
