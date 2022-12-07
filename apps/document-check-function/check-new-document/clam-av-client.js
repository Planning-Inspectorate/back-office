import NodeClam from 'clamscan';
import config from './config.js';

const clamAvHost = config.CLAM_AV_HOST;
const clamAvPort = config.CLAM_AV_PORT;

export const clamAvClient = await new NodeClam().init({
	debugMode: false,
	clamdscan: {
		host: clamAvHost,
		port: clamAvPort,
		bypassTest: config.NODE_ENV === 'test'
	}
});
