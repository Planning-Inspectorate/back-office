import appInsights from 'applicationinsights';
import pino from 'pino';
import pinoHttp from 'pino-http';

export const pinoLogger = pino({
	timestamp: pino.stdTimeFunctions.isoTime,
	level: 'trace'
});

const decorator = {
	/**
	 * @param {*} target
	 * @param {string} prop
	 * */
	get(target, prop) {
		if (['info', 'warn', 'error', 'debug'].includes(prop)) {
			const client = appInsights.defaultClient;
			const oidKey = client?.context.keys.operationId;
			const operationId = client?.context.tags[oidKey] || null;

			/** @type {(m: string) => void} */
			return (...args) => {
				if (args.length === 1 && typeof args[0] === 'string') {
					target[prop]({ operationId, msg: args[0] });
				} else {
					target[prop]({ operationId }, ...args);
				}
			};
		}
	}
};

const logger = new Proxy(pinoLogger, decorator);

export const httpLogger = pinoHttp({ logger: pinoLogger });

export default logger;
