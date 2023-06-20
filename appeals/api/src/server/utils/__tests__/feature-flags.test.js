import { isFeatureActive } from '../feature-flags.js';

describe('Feature flags', () => {
	test('Returns flag as a boolean', () => {
		const flag = typeof isFeatureActive();

		expect(flag).toEqual('boolean');
	});

	test('Returns false when no flag name passed', () => {
		const flag = isFeatureActive();

		expect(flag).toEqual(false);
	});

	test('Returns false when no flag set in the .env file or in the config', () => {
		const flag = isFeatureActive('featureFlagBOAS2SomeFeatrue');

		expect(flag).toEqual(false);
	});
});
