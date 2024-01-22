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
			const context = appInsights.getCorrelationContext();
			const operationId = context?.operation.id ?? null;
			const traceId = context?.operation.traceparent?.traceId ?? null;

			/** @type {(m: string) => void} */
			return (...args) => {
				if (args.length === 1 && typeof args[0] === 'string') {
					target[prop]({ operationId, traceId, msg: args[0] });
				} else {
					const messages = args.map((arg) =>
						arg instanceof Error
							? {
									stack: arg.stack,
									message: arg.message
							  }
							: arg
					);
					target[prop]({ operationId, traceId }, ...messages);
				}
			};
		}
	}
};

const logger = new Proxy(pinoLogger, decorator);

export const httpLogger = pinoHttp({ logger: pinoLogger });

export default logger;
