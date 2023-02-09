import { appealFactoryForTests } from '../../../utils/appeal-factory-for-tests.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

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

describe('Mark appeals with passed inspection as due', () => {
	test('finds appeals to mark as overdue as updates their statuses', async () => {
		// GIVEN
		databaseConnector.appeal.findMany.mockResolvedValue([appeal1]);

		// WHEN
		await findAndUpdateStatusForAppealsWithPassedInspection();

		// THEN
		expect(databaseConnector.appeal.findMany).toHaveBeenCalledWith({
			where: {
				appealStatus: {
					some: {
						status: 'site_visit_booked',
						valid: true
					}
				},
				siteVisit: {
					visitDate: {
						lt: expect.any(Date)
					}
				}
			},
			include: {
				appealType: true
			}
		});
		expect(databaseConnector.appealStatus.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [1] } },
			data: { valid: false }
		});
		expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
			data: { status: 'decision_due', appealId: 1 }
		});
	});
});
