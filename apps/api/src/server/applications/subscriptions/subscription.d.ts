import { SubscriptionType } from '../../../message-schemas/events/nsip-subscription';

/**
 * Subscription type used for the API responses and requests
 */
export interface Subscription {
	id?: number;
	caseReference: string;
	emailAddress: string;
	subscriptionTypes: SubscriptionType[];
	startDate?: string;
	endDate?: string;
	language?: 'English' | 'Welsh' | string;
}
