import config from '@pins/web/environment/config.js';
import path from 'node:path';
import pino from 'pino';
import pinoHttp from 'pino-http';

const logger = pino({
	timestamp: pino.stdTimeFunctions.isoTime,
	level: 'trace',
	transport: {
		targets: [
			{
				target: 'pino/file',
				level: config.logLevelFile,
				options: {
					destination: path.join(config.cwd, './server.log')
				}
			},
			{
				target: 'pino-pretty',
				level: config.logLevelStdOut,
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
