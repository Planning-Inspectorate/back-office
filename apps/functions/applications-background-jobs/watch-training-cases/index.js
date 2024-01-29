/**
 * @type {import('@azure/functions').AzureFunction}
 * */
export const index = async (context, { caseId, caseReference }) => {
	if (/^TRAIN/.test(caseReference)) {
		throw new Error(
			`Found a Service Bus message for TRAINING case ${caseReference} with ID ${caseId}`
		);
	}
};
