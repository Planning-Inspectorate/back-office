/**
 * @param {{maxAttempts: number, statusCodes: string}} config
 * @returns {{limit: number, statusCodes: Array<number>}}
 */
export const createHttpRetryParams = (config) => {
	const { maxAttempts, statusCodes } = config;
	const statusCodesArray = (statusCodes || '').split(',').map((sc) => Number(sc));

	return {
		limit: maxAttempts,
		statusCodes: statusCodesArray
	};
};
