import config from '@pins/web/environment/config.js';
import path from 'node:path';
import pino from 'pino';

export default pino({
	timestamp: pino.stdTimeFunctions.isoTime,
	level: 'trace',
	transport: {
		targets: [
			{
				target: 'pino/file',
				level: config.LOG_LEVEL_FILE,
				options: {
					destination: path.join(config.cwd, './server.log')
				}
			},
			{
				target: 'pino-pretty',
				level: config.LOG_LEVEL_STDOUT,
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
