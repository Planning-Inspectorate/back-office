/**
 * nsip-subscription schema for use in code
 */
export interface NSIPSubscription {
	subscriptionId?: number;
	caseReference: string;
	emailAddress: string;
	subscriptionType: 'decisionOnly' | 'allUpdates' | string;
	startDate?: string;
	endDate?: string;
	language?: 'English' | 'Welsh' | string;
}
