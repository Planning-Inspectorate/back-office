export const logError = (context, message, error, details = {}) => {
	const caughtError = error instanceof Error ? error : new Error(String(error));
	context.log.error(message, {
		...details,
		errorName: caughtError.name,
		errorMessage: caughtError.message,
		errorStack: caughtError.stack,
		statusCode: caughtError.statusCode,
		errorCode: caughtError.code
	});
	return caughtError;
};
