import { isFeatureActive } from '../feature-flags.js';

test('Returns flag as a boolean', () => {
	expect(typeof isFeatureActive()).toBe('boolean');
});

test('Returns false when no flag name passed', () => {
	expect(isFeatureActive()).toBe(false);
});

test('Returns false when no flag set in the .env file or in the config', () => {
	expect(isFeatureActive('featureFlagBOAS2SomeFeatrue')).toBe(false);
});
