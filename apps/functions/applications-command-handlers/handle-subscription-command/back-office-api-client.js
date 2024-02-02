import config from './config.js';
import { requestWithApiKey } from '../common/backend-api-request.js';

/**
 *
 * @param {string} caseReference
 * @param {string} emailAddress
 * @returns {Promise<{id: number}|null>}
 */
function getSubscription(caseReference, emailAddress) {
	return requestWithApiKey
		.post(`https://${config.API_HOST}/applications/subscriptions/`, {
			json: { caseReference, emailAddress }
		})
		.json();
}

/**
 *
 * @param {import('@pins/applications.api/src/server/applications/subscriptions/subscription.d.ts').Subscription} subscription
 * @returns {Promise<{id: number}>}
 */
function createOrUpdateSubscription(subscription) {
	return requestWithApiKey
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
	return requestWithApiKey
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
