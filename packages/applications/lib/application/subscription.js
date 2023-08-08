/**
 * Subscription represents a subscriber interested in project updates for a case
 * when a project update is published, all subscribers are emailed
 * subscribers originate from the front-office - see nsip-subscription schema
 */
export class Subscription {
	/**
	 * Subscription type options
	 * @type {Object<string, import("@pins/applications/types/subscription.js").SubscriptionType>}
	 */
	static get Type() {
		return Object.freeze({
			allUpdates: 'allUpdates',
			applicationSubmitted: 'applicationSubmitted',
			applicationDecided: 'applicationDecided',
			registrationOpen: 'registrationOpen'
		});
	}

	/**
	 * Array of types, useful for validation.
	 */
	static get TypeList() {
		return Object.freeze(Object.values(Subscription.Type));
	}
}
