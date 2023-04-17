import supertest from 'supertest';
import { app } from '../../../app-test.js';
import formatAddress from '../../../utils/address-formatter.js';
import { appealFactoryForTests } from '../../../utils/appeal-factory-for-tests.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const appeal1 = appealFactoryForTests({
	appealId: 1,
	statuses: [
		{
			status: 'available_for_statements',
			valid: true
		}
	],
	typeShorthand: 'FPA'
});

const appeal2 = appealFactoryForTests({
	appealId: 2,
	statuses: [
		{
			status: 'available_for_final_comments',
			valid: true
		}
	],
	typeShorthand: 'FPA'
});

describe('Getting appeal details for statements and comments', () => {
	test('returns details for appeal awaiting statements', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request.get('/appeals/case-officer/1/statements-comments');

		// THEN
		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual({
			AppealId: 1,
			AppealReference: appeal1.reference,
			AppealSite: formatAddress(appeal1.address),
			LocalPlanningDepartment: appeal1.localPlanningDepartment,
			acceptingStatements: true,
			acceptingFinalComments: false
		});
	});

	test('returns details for appeal awaiting final comments', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal2);

		// WHEN
		const resp = await request.get('/appeals/case-officer/2/statements-comments');

		// THEN
		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual({
			AppealId: 2,
			AppealReference: appeal2.reference,
			AppealSite: formatAddress(appeal2.address),
			LocalPlanningDepartment: appeal2.localPlanningDepartment,
			acceptingStatements: false,
			acceptingFinalComments: true
		});
	});
});
