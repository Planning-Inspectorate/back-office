// @ts-ignore
import { faker } from '@faker-js/faker';

export const generateSubscriptionPayload = (overrides = {}) => {
	const payload = {
		caseReference: faker.random.alphaNumeric(5),
		emailAddress: faker.internet.email(),
		subscriptionTypes: faker.helpers.arrayElements([
			'allUpdates',
			'applicationSubmitted',
			'applicationDecided',
			'registrationOpen'
		]),
		startDate: faker.date.recent(),
		endDate: faker.date.future(),
		language: faker.helpers.arrayElement(['English', 'Welsh']),
		...overrides
	};

	return payload;
};
