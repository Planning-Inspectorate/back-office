import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import formatAddress from '../../../utils/address-formatter.js';
import { appealFactoryForTests } from '../../../utils/appeal-factory-for-tests.js';
import { databaseConnector } from '../../../utils/database-connector.js';

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

const includeDetails = {
	address: true,
	appealType: true,
	appealStatus: {
		where: {
			valid: true
		}
	}
};

const includingDetailsForValidtion = {
	appealStatus: { where: { valid: true } },
	appealType: true
};

const findUniqueStub = sinon.stub();

findUniqueStub.withArgs({ where: { id: 1 }, include: includeDetails }).returns(appeal1);
findUniqueStub.withArgs({ where: { id: 2 }, include: includeDetails }).returns(appeal2);
findUniqueStub
	.withArgs({ where: { id: 1 }, include: includingDetailsForValidtion })
	.returns(appeal1);
findUniqueStub
	.withArgs({ where: { id: 2 }, include: includingDetailsForValidtion })
	.returns(appeal2);

describe('Getting appeal details for statements and comments', () => {
	beforeAll(() => {
		sinon.stub(databaseConnector, 'appeal').get(() => {
			return { findUnique: findUniqueStub };
		});
	});

	test('returns details for appeal awaiting statements', async () => {
		const resp = await request.get('/appeals/case-officer/1/statements-comments');

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
		const resp = await request.get('/appeals/case-officer/2/statements-comments');

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
