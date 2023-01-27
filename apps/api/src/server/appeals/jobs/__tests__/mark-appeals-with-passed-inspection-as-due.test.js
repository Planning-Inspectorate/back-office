import Prisma from '@prisma/client';
import sinon from 'sinon';
import { appealFactoryForTests } from '../../../utils/appeal-factory-for-tests.js';
import { databaseConnector } from '../../../utils/database-connector.js';
import findAndUpdateStatusForAppealsWithPassedInspection from '../mark-appeals-with-passed-inspection-as-due.js';

const appeal1 = appealFactoryForTests({
	appealId: 1,
	statuses: [
		{
			id: 1,
			status: 'site_visit_booked',
			valid: true
		}
	],
	typeShorthand: 'HAS'
});

const updateStub = sinon.stub().returns(appeal1);

const findManyStub = sinon.stub().returns([appeal1]);

const updateManyAppealStatusStub = sinon.stub();
const createAppealStatusStub = sinon.stub();

describe('Mark appeals with passed inspection as due', () => {
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
				create: createAppealStatusStub
			};
		});
		sinon.stub(Prisma.PrismaClient.prototype, '$transaction');
	});

	test('finds appeals to mark as overdue as updates their statuses', async () => {
		await findAndUpdateStatusForAppealsWithPassedInspection();
		sinon.assert.calledOnceWithExactly(findManyStub, {
			where: {
				appealStatus: {
					some: {
						status: 'site_visit_booked',
						valid: true
					}
				},
				siteVisit: {
					visitDate: {
						lt: sinon.match.any
					}
				}
			},
			include: {
				appealType: true
			}
		});
		sinon.assert.calledWith(updateManyAppealStatusStub, {
			where: { id: { in: [1] } },
			data: { valid: false }
		});
		sinon.assert.calledWith(createAppealStatusStub, {
			data: { status: 'decision_due', appealId: 1 }
		});
	});
});
