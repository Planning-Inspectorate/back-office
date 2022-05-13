/**
 * @param {import('pino').Logger} pino
 * @returns {[import('got').BeforeRequestHook, import('got').AfterResponseHook]}
 */
export const createHttpLoggerHooks = (pino) => {
	/** @type {import('got').BeforeRequestHook} */
	const requestLogger = (options) => {
		if (options.url) {
			pino.debug(`${options.method} ${options.url.toString()} (pending)`);
		}
	};

	/** @type {import('got').AfterResponseHook} */
	const responseLogger = (response) => {
		// @ts-expect-error – `req` has not been added to type signature
		const { body, req, requestUrl, timings } = response;
		const url = `${req.method} ${requestUrl.toString()} (${timings.phases.total}ms)`;

		if (pino.isLevelEnabled('debug')) {
			if (body) {
				pino.debug(body, url);
			} else {
				pino.debug(url);
			}
		} else {
			pino.info(url);
		}
		return Promise.resolve(response);
	};

	return [requestLogger, responseLogger];
};
