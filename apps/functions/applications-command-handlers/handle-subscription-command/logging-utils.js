/**
 * @typedef {import('@pins/applications.api/src/message-schemas/commands/register-nsip-subscription').RegisterNSIPSubscription} RegisterNSIPSubscription
 */

/**
 *
 * @param {RegisterNSIPSubscription} msg
 * @returns {RegisterNSIPSubscription}
 */
export const redactEmailForLogs = (msg) => {
	if (msg?.nsipSubscription?.emailAddress) {
		return {
			nsipSubscription: {
				...msg.nsipSubscription,
				emailAddress: '<redacted>'
			},
			subscriptionTypes: msg.subscriptionTypes
		};
	}
	return msg;
};
