import test from 'ava';
import { buildAppealCompundStatus } from '../build-appeal-compound-status.js';

test('when appeal status has a single array of core status returns string', (t) => {
	const status = 'some status';
	const result = buildAppealCompundStatus([{ status }]);

	t.is(result, status);
});

test('when appeal status has multiple compound statuses returns object', (t) => {
	const result = buildAppealCompundStatus([
		{
			status: 'first status',
			subStateMachineName: 'state_machine_1'
		},
		{
			status: 'second status',
			subStateMachineName: 'state_machine_2'
		}
	]);

	t.deepEqual(result, {
		awaiting_lpa_questionnaire_and_statements: {
			state_machine_1: 'first status',
			state_machine_2: 'second status'
		}
	});
});

test('when appeal status has multiple core statuses throws error', (t) => {
	const error = t.throws(
		() => {
			buildAppealCompundStatus([{ status: 'first status' }, { status: 'second status' }]);
		},
		{ instanceOf: Error }
	);

	t.is(error.message, 'Something wrong with appeal status');
});

test('when appeal status has single compound status throws error', (t) => {
	const error = t.throws(
		() => {
			buildAppealCompundStatus([
				{ status: 'first status', subStateMachineName: 'state_machine_1' }
			]);
		},
		{ instanceOf: Error }
	);

	t.is(error.message, 'Something wrong with appeal status');
});

test('when appeal status has single compound and single core status throws error', (t) => {
	const error = t.throws(
		() => {
			buildAppealCompundStatus([
				{ status: 'first status', subStateMachineName: 'state_machine_1' },
				{ status: 'second status' }
			]);
		},
		{ instanceOf: Error }
	);

	t.is(error.message, 'Something wrong with appeal status');
});

test('when appeal status is empty throws error', (t) => {
	const error = t.throws(
		() => {
			buildAppealCompundStatus([]);
		},
		{ instanceOf: Error }
	);

	t.is(error.message, 'Something wrong with appeal status');
});
