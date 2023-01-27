import Prisma from '@prisma/client';
import sinon from 'sinon';
import { appealFactoryForTests } from '../../../utils/appeal-factory-for-tests.js';
import { databaseConnector } from '../../../utils/database-connector.js';
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

const updateStub = sinon.stub();

updateStub.returns(appeal1);

const findManyStub = sinon.stub();

findManyStub.returns([appeal1, appeal2]);

const updateManyAppealStatusStub = sinon.stub();
const createAppealStatusStub = sinon.stub();

describe('Mark appeals awaiting questionnaire as overdue', () => {
	beforeAll(() => {
		sinon.stub(databaseConnector, 'appeal').get(() => {
			return {
				update: updateStub,
				findMany: findManyStub
			};
		});
		sinon.stub(databaseConnector, 'appealStatus').get(() => {
			return {
				updateMany: updateManyAppealStatusStub,
				create: createAppealStatusStub,
				createMany: sinon.stub()
			};
		});
		sinon.stub(Prisma.PrismaClient.prototype, '$transaction');
	});

	test('finds appeals to mark as overdue as updates their statuses', async () => {
		await findAndUpdateStatusForAppealsWithOverdueQuestionnaires();
		sinon.assert.calledOnceWithExactly(findManyStub, {
			where: {
				appealStatus: {
					some: {
						status: 'awaiting_lpa_questionnaire',
						valid: true,
						createdAt: {
							lt: sinon.match.any
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
		sinon.assert.calledWith(updateManyAppealStatusStub, {
			where: { id: { in: [1] } },
			data: { valid: false }
		});
		sinon.assert.calledWith(createAppealStatusStub, {
			data: { status: 'overdue_lpa_questionnaire', appealId: 1 }
		});
	});
});
