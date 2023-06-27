import { NSIPSubscription, SubscriptionType } from '../events/nsip-subscription';

/**
 * register-nsip-subscription schema for use in code
 */
export interface RegisterNSIPSubscription {
	nsipSubscription: NSIPSubscription;
	subscriptionTypes: SubscriptionType[];
}
