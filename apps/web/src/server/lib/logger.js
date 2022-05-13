import config from '@pins/web/environment/config.js';
import path from 'node:path';
import pino from 'pino';

/** @type {import('pino').TransportTargetOptions[]} */
const targets = [];

if (config.isProd) {
	targets.push({
		target: 'pino/file',
		level: 'trace',
		options: {
			destination: path.join(config.cwd, './server.log')
		}
	});
} else {
	targets.push({
		target: 'pino-pretty',
		level: 'trace',
		options: {
			destination: 1,
			ignore: 'pid,hostname',
			colorize: true,
			translateTime: 'HH:MM:ss.l'
		}
	});
}

export default pino({
	level: config.LOG_LEVEL,
	timestamp: pino.stdTimeFunctions.isoTime,
	transport: {
		targets
	}
});
