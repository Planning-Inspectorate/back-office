import got	 from 'got';
import { config } from '../config/config.js';

const instance = got.extend({
	prefixUrl: config.API_ENDPOINT,
	responseType: 'json',
	resolveBodyOnly: true,
	handlers: [
		(options, next) => {
			console.log(`Sending ${options.method} to ${options.url}`);
			return next(options);
		}
	]
});

export default instance;
