import { appealFactoryForTests } from '../../../utils/appeal-factory-for-tests.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

import findAndUpdateStatusForAppealsWithOverdueQuestionnaires from '../mark-appeals-awaiting-questionnaire-as-overdue.js';

const appeal1 = appealFactoryForTests({
	appealId: 1,
	statuses: [
		{
			id: 1,
			status: 'awaiting_lpa_questionnaire',
			valid: true
		}
	],
	typeShorthand: 'HAS'
});

const appeal2 = appealFactoryForTests({
	appealId: 2,
	statuses: [
		{
			id: 21,
			status: 'awaiting_lpa_questionnaire',
			subStateMachineName: 'lpaQuestionnaireAndInspectorPickup',
			compoundStateName: 'awaiting_lpa_questionnaire_and_statements',
			valid: true
		},
		{
			id: 22,
			status: 'available_for_statements',
			valid: true,
			subStateMachineName: 'statementsAndFinalComments',
			compoundStateName: 'awaiting_lpa_questionnaire_and_statements'
		}
	],
	typeShorthand: 'FPA'
});

describe('Mark appeals awaiting questionnaire as overdue', () => {
	test('finds appeals to mark as overdue as updates their statuses', async () => {
		// GIVEN
		databaseConnector.appeal.findMany.mockResolvedValue([appeal1, appeal2]);

		// WHEN
		await findAndUpdateStatusForAppealsWithOverdueQuestionnaires();

		// THEN
		expect(databaseConnector.appeal.findMany).toHaveBeenCalledWith({
			where: {
				appealStatus: {
					some: {
						status: 'awaiting_lpa_questionnaire',
						valid: true,
						createdAt: {
							lt: expect.any(Date)
						}
					}
				}
			},
			include: {
				appealType: true,
				appealStatus: {
					where: {
						valid: true
					}
				}
			}
		});
		expect(databaseConnector.appealStatus.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [1] } },
			data: { valid: false }
		});
		expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
			data: { status: 'overdue_lpa_questionnaire', appealId: 1 }
		});
	});
});
