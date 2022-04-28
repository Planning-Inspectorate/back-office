// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../../app.js';
import DatabaseFactory from '../../repositories/database.js';
import { appealFactoryForTests } from '../../utils/appeal-factory-for-tests.js';
import formatAddressLowerCase from '../../utils/address-formatter-lowercase.js';

const request = supertest(app);

const appeal_1 = appealFactoryForTests(1, [{
	status: 'available_for_statements',
	valid: true,
}], 'FPA');

const appeal_2 = appealFactoryForTests(2, [{
	status: 'available_for_final_comments',
	valid: true,
}], 'FPA');

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
	appealType: true,
};

const findUniqueStub = sinon.stub();
findUniqueStub.withArgs({ where: { id: 1 }, include: includeDetails }).returns(appeal_1);
findUniqueStub.withArgs({ where: { id: 2 }, include: includeDetails }).returns(appeal_2);
findUniqueStub.withArgs({ where: { id: 1 }, include: includingDetailsForValidtion }).returns(appeal_1);
findUniqueStub.withArgs({ where: { id: 2 }, include: includingDetailsForValidtion }).returns(appeal_2);


class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findUnique: findUniqueStub
			}
		};
	}
}

test.before('sets up mocking of database', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('returns details for appeal awaiting statements', async (t) => {
	const resp = await request.get('/case-officer/1/statements-comments');
	t.is(resp.status, 200);
	t.deepEqual(resp.body, {
		id: 1,
		reference: appeal_1.reference,
		appealSite: formatAddressLowerCase(appeal_1.address),
		localPlanningDepartment: appeal_1.localPlanningDepartment
	});
});

test('returns details for appeal awaiting final comments', async (t) => {
	const resp = await request.get('/case-officer/2/statements-comments');
	t.is(resp.status, 200);
	t.deepEqual(resp.body, {
		id: 2,
		reference: appeal_2.reference,
		appealSite: formatAddressLowerCase(appeal_2.address),
		localPlanningDepartment: appeal_2.localPlanningDepartment
	});
});
