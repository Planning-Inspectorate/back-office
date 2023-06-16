import got from 'got';
import config from './config.js';

/**
 *
 * @param {*} subscription
 * @returns {Promise<{id: number}>}
 */
function createSubscription(subscription) {
	return got
		.post(`https://${config.API_HOST}/applications/subscriptions/`, {
			json: subscription
		})
		.json();
}

export default {
	createSubscription
};
