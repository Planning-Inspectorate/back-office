import pinoLib from 'pino';
// const pretty = require("pino-pretty");

const pino = pinoLib({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
			ignore: 'pid,hostname,time'
		}
	}
});
export default pino;
