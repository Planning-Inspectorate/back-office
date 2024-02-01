/**
 * @param {import('pino').Logger} pino
 * @param {string} stdOutLevel
 * @returns {[import('got').BeforeRequestHook, import('got').AfterResponseHook, import('got').BeforeRetryHook]}
 */
export const createHttpLoggerHooks = (pino, stdOutLevel) => {
	/** @type {import('got').BeforeRetryHook} */
	const retryLogger = (error, retryCount) => {
		const URL = error?.options?.url;
		const pathname = typeof URL === 'string' ? URL : URL?.pathname;
		pino.warn(
			`[API] ${error.options.method} ${pathname?.toString()} failed. Retry attempts: ${retryCount}`
		);
	};
	/** @type {import('got').BeforeRequestHook} */
	const requestLogger = (options) => {
		if (options.url) {
			pino.trace(`${options.method} ${options.url.toString()} (pending)`);
		}
	};

	/** @type {import('got').AfterResponseHook<any>} */
	const responseLogger = (response) => {
		// @ts-expect-error – `req` has not been added to type signature
		const { body, req, requestUrl, statusCode } = response;
		const responseItemsNumber = body.items?.length ?? body.length ?? Object.keys(body || {}).length;
		const responseMessage = `[API] ${
			req.method
		} ${requestUrl.pathname.toString()} (Response code: ${statusCode}) - (Items retrieved: ${responseItemsNumber})`;
		const stdOutLevelValue = pino.levels.values[stdOutLevel];
		const traceValue = pino.levels.values.trace;

		if (traceValue === stdOutLevelValue) {
			if (body) {
				pino.trace(body, responseMessage);
			} else {
				pino.trace(responseMessage);
			}
		} else {
			pino.info(responseMessage);
		}
		return Promise.resolve(response);
	};

	return [requestLogger, responseLogger, retryLogger];
};
