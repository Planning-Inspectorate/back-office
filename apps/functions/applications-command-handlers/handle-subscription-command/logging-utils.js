/**
 * @typedef {import('@pins/applications.api/src/message-schemas/commands/register-nsip-subscription').RegisterNSIPSubscription} PrevRegisterNSIPSubscription
 * @typedef {import('@planning-inspectorate/data-model').Schemas.RegisterNSIPSubscription} RegisterNSIPSubscription
 */

/**
 *
 * @param {RegisterNSIPSubscription | PrevRegisterNSIPSubscription} msg
 * @returns {RegisterNSIPSubscription | PrevRegisterNSIPSubscription}
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
