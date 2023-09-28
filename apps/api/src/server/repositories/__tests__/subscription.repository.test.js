import { subscriptionTypeToWhere } from '#repositories/subscription.respository.js';
import { Subscription } from '@pins/applications/lib/application/subscription.js';

describe('subscription-repository', () => {
	describe('subscriptionTypeToWhere', () => {
		/**
		 * @typedef {Object} SubTest
		 * @property {string} name
		 * @property {string} type
		 * @property {import('@prisma/client').Prisma.SubscriptionWhereInput} where
		 * @property {import('@prisma/client').Prisma.SubscriptionWhereInput} want
		 */
		/**
		 * @type {SubTest[]}
		 */
		const tests = [
			{
				name: 'empty',
				type: '',
				where: {},
				want: {}
			},
			{
				name: 'allUpdates',
				type: Subscription.Type.allUpdates,
				where: {},
				want: {
					subscribedToAllUpdates: true
				}
			},
			{
				name: 'applicationDecided',
				type: Subscription.Type.applicationDecided,
				where: {},
				want: {
					OR: [{ subscribedToAllUpdates: true }, { subscribedToApplicationDecided: true }]
				}
			}
		];

		it.each(tests)('$name', ({ type, where, want }) => {
			subscriptionTypeToWhere(type, where);
			expect(where).toEqual(want);
		});
	});
});
