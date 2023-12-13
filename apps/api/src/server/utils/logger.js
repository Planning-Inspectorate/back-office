import AppInsights from 'applicationinsights';
import path from 'node:path';
import pino from 'pino';
import pinoHttp from 'pino-http';
import config from '../config/config.js';

export const pinoLogger = pino({
	timestamp: pino.stdTimeFunctions.isoTime,
	level: 'trace',
	transport: {
		targets: [
			{
				target: 'pino/file',
				level: config.log.levelFile,
				options: {
					destination: path.join(config.cwd, './server.log')
				}
			},
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
	}
});

const decorator = {
	/**
	 * @param {*} target
	 * @param {string} prop
	 * */
	get(target, prop) {
		if (['info', 'warn', 'error', 'debug'].includes(prop)) {
			const context = AppInsights.getCorrelationContext();
			const operationId = context?.operation.id;

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
