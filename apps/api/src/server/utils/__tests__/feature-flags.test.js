import test from 'ava';
import { isFeatureActive } from '../feature-flags.js';

test('Returns flag as a boolean', (t) => {
	const flag = typeof isFeatureActive();

	t.is(flag, 'boolean');
});

test('Returns false when no flag name passed', (t) => {
	const flag = isFeatureActive();

	t.is(flag, false);
});

test('Returns false when no flag set in the .env file or in the config', (t) => {
	const flag = isFeatureActive('featureFlagBOAS2SomeFeatrue');

	t.is(flag, false);
});
