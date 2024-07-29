import config from '#config/config.js';
import appInsights from 'applicationinsights';
import pino from 'pino';
import pinoHttp from 'pino-http';

const transport = {
	targets: [
		{
			target: 'pino-pretty',
			level: config.log.levelStdOut,
			options: {
				destination: 1,
				ignore: 'pid,hostname',
				colorize: true,
				translateTime: 'HH:MM:ss.l'
			}
		}
	]
};

const pinoLogger = pino({
	timestamp: pino.stdTimeFunctions.isoTime,
	level: config.log.levelStdOut,
	// only pretty print in dev
	transport: config.NODE_ENV === 'production' ? undefined : transport
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
					if (
						prop === 'error' &&
						messages.some((message) => message?.error?.toLowerCase().includes('a training case'))
					) {
						return; // skip reporting the error as it is related to a training case
					}
					target[prop]({ operationId, traceId }, ...messages);
				}
			};
		}
	}
};

const logger = new Proxy(pinoLogger, decorator);

export const httpLogger = pinoHttp({ logger: pinoLogger });

export default logger;
