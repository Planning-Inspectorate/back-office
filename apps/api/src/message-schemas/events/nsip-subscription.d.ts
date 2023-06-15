/**
 * nsip-subscription schema for use in code
 */
export interface NSIPSubscription {
	caseReference: string;
	emailAddress: string;
	subscriptionType: 'decisionOnly' | 'allUpdates' | string;
	startDate?: string;
	endDate?: string;
	language?: 'English' | 'Welsh' | string;
}
