import pino from 'pino';
import pinoHttp from 'pino-http';
import config from './config.js';

const logger = pino({
	timestamp: pino.stdTimeFunctions.isoTime,
	level: 'trace',
	transport: {
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
	}
});

export const httpLogger = pinoHttp({ logger });

export default logger;
