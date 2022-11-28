import { isFeatureActive } from '../feature-flags.js';

describe('feature flags', () => {
	it('Returns flag as a boolean', () => {
		const feature = isFeatureActive();

		expect(typeof feature).toBe('boolean');
	});

	it('Returns false when no flag name passed', () => {
		const feature = isFeatureActive();

		expect(feature).toBe(false);
	});

	it('Returns false when no flag set in the .env file or in the config', () => {
		const feature = isFeatureActive('featureFlagBOAS2SomeFeatrue');

		expect(feature).toBe(false);
	});
});
