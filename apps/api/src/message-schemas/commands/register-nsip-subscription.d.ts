import { Schemas } from '@planning-inspectorate/data-model';

/**
 * register-nsip-subscription schema for use in code
 */
export interface RegisterNSIPSubscription {
	nsipSubscription: Schemas.NsipSubscription;
	subscriptionTypes: Pick<Schemas.NsipSubscription, 'subscriptionType'>[];
}
