import got from 'got';
import config from './config.js';
import querystring from 'querystring';

/**
 *
 * @param {string} caseReference
 * @param {string} emailAddress
 * @returns {Promise<{id: number}|null>}
 */
function getSubscription(caseReference, emailAddress) {
	const query = querystring.stringify({ caseReference, emailAddress });
	return got.get(`https://${config.API_HOST}/applications/subscriptions/?${query}`).json();
}

/**
 *
 * @param {import('@pins/applications.api/src/server/applications/subscriptions/subscription.d.ts').Subscription} subscription
 * @returns {Promise<{id: number}>}
 */
function createOrUpdateSubscription(subscription) {
	return got
		.put(`https://${config.API_HOST}/applications/subscriptions/`, {
			json: subscription
		})
		.json();
}

/**
 *
 * @param {number} id
 * @param {*} subscription
 * @returns {Promise<{id: number}>}
 */
function updateSubscription(id, subscription) {
	return got
		.patch(`https://${config.API_HOST}/applications/subscriptions/${id}`, {
			json: subscription
		})
		.json();
}

export default {
	getSubscription,
	createOrUpdateSubscription,
	updateSubscription
};
