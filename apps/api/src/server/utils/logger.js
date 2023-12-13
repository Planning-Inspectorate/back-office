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
	// @ts-ignore
	get(target, prop) {
		if (['info', 'warn', 'error'].includes(prop)) {
			// @ts-ignore
			return (...args) => target[prop]({ foo: 'bar' }, ...args);
		}
	}
};

const logger = new Proxy(pinoLogger, decorator);

export const httpLogger = pinoHttp({ logger: pinoLogger });

export default logger;
