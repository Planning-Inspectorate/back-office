import config from '@pins/applications.web/environment/config.js';
import pino from 'pino';

const transport = {
	targets: [
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
};

const logger = pino({
	timestamp: pino.stdTimeFunctions.isoTime,
	level: config.logLevelStdOut,
	// only pretty print in dev
	transport: config.isProduction ? undefined : transport
});

export default logger;
