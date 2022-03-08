import got from 'got';
import kleur from 'kleur';
import { config } from '../config/config.js';

const instance = got.extend({
	prefixUrl: config.API_HOST,
	responseType: 'json',
	resolveBodyOnly: true,
	handlers: [
		(options, next) => {
			console.log(`Sending ${kleur.bgBlue(options.method)} to ${kleur.blue(options.url)}`);
			return next(options);
		}
	]
});

export default instance;
