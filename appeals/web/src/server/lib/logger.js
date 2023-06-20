import config from '@pins/appeals.web/environment/config.js';
import path from 'node:path';
import pino from 'pino';

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

export default logger;
