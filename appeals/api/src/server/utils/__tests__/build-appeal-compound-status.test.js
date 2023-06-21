import { buildAppealCompundStatus } from '../build-appeal-compound-status.js';

describe('Build appeal compound status', () => {
	test('when appeal status has a single array of core status returns string', () => {
		const status = 'some status';
		const result = buildAppealCompundStatus([{ status }]);

		expect(result).toEqual(status);
	});

	test('when appeal status has multiple compound statuses returns object', () => {
		const result = buildAppealCompundStatus([
			{
				id: 1,
				createdAt: new Date(),
				valid: true,
				status: 'first status',
				subStateMachineName: 'state_machine_1',
				compoundStateName: 'test',
				caseId: 1
			},
			{
				id: 1,
				createdAt: new Date(),
				valid: true,
				status: 'second status',
				subStateMachineName: 'state_machine_2',
				compoundStateName: 'test',
				caseId: 1
			}
		]);

		expect(result).toEqual({
			awaiting_lpa_questionnaire_and_statements: {
				state_machine_1: 'first status',
				state_machine_2: 'second status'
			}
		});
	});

	test('when appeal status has multiple core statuses throws error', () => {
		const buildCompoundStatusesWithTwoCoreStatuses = () => {
			buildAppealCompundStatus([{ status: 'first status' }, { status: 'second status' }]);
		};

		expect(buildCompoundStatusesWithTwoCoreStatuses).toThrow('Something wrong with appeal status');
	});

	test('when appeal status has single compound status throws error', () => {
		const buildCompoundStatusWithSinlgeStatus = () => {
			buildAppealCompundStatus([
				{ status: 'first status', subStateMachineName: 'state_machine_1' }
			]);
		};

		expect(buildCompoundStatusWithSinlgeStatus).toThrow('Something wrong with appeal status');
	});

	test('when appeal status has single compound and single core status throws error', () => {
		const buildCompoundStatusWithOnePrimaryStatus = () => {
			buildAppealCompundStatus([
				{ status: 'first status', subStateMachineName: 'state_machine_1' },
				{ status: 'second status' }
			]);
		};

		expect(buildCompoundStatusWithOnePrimaryStatus).toThrow('Something wrong with appeal status');
	});

	test('when appeal status is empty throws error', () => {
		const buildCompoundStatusFromNothing = () => {
			buildAppealCompundStatus([]);
		};

		expect(buildCompoundStatusFromNothing).toThrow('Something wrong with appeal status');
	});
});
