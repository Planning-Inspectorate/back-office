import { SubscriptionType } from '@pins/applications';

/**
 * nsip-subscription schema for use in code
 */
export interface NSIPSubscription {
	subscriptionId?: number;
	caseReference: string;
	emailAddress: string;
	subscriptionType: SubscriptionType;
	startDate?: string;
	endDate?: string;
	language?: 'English' | 'Welsh' | string;
}
