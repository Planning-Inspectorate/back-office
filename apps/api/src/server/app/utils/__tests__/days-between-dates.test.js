// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import daysBetweenDates from '../days-between-dates.js';

test('returns 1 between date at end of day and next day at start of day', (t) => {
	const days = daysBetweenDates(new Date(2022, 3, 6, 22), new Date(2022, 3, 7, 2));
	t.is(days, 1);
});

test('returns 0 when two dates on the same day', (t) => {
	const days = daysBetweenDates(new Date(2022, 3, 5, 3), new Date(2022, 3, 5, 20));
	t.is(days, 0);
});
