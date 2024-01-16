import { Schemas } from 'pins-data-model';

/**
 * register-nsip-subscription schema for use in code
 */
export interface RegisterNSIPSubscription {
	nsipSubscription: Schemas.NsipSubscription;
	subscriptionTypes: Pick<Schemas.NsipSubscription, 'subscriptionType'>[];
}
