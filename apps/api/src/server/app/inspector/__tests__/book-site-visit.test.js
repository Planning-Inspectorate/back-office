// @ts-check

import { yesterday } from '@pins/platform';
// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import format from 'date-fns/format/index.js';
import sinon, { assert } from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import appealRepository from '../../repositories/appeal.repository.js';
import { appealFactoryForTests } from '../../../../../prisma/seed.js';

/** @typedef {import('@pins/api').Schema.Appeal} Appeal */

const request = supertest(app);

const siteVisitBody = {
	siteVisitDate: '2030-01-01',
	siteVisitTimeSlot: '8am to 10am',
	siteVisitType: 'accompanied'
};

// todo: replace with factory
/** @type {DeepPartial<Appeal>} */
const originalAppeal = appealFactoryForTests(1, [{
	id: 1, status: 'site_visit_not_yet_booked', valid: true
}], 'HAS', false, false, false, false, new Date(), false, false, false, false);
// {
// 	id: 1, 
// 	reference: 'APP/Q9999/D/21/323259',
// 	planningApplicationReference: '0181/811/8181',
// 	localPlanningDepartment: 'Local planning dept',
// 	appealStatus: [{
// 		id: 1,
// 		status: 'site_visit_not_yet_booked',
// 		valid: true
// 	}],
// 	appealType: {
// 		type: 'household'
// 	},
// 	createdAt: new Date(2022, 0, 1),
// 	updatedAt: new Date(2022, 0, 1),
// 	userId: 100
// };

/** @type {DeepPartial<Appeal>} */
const updatedAppeal = {
	...originalAppeal,
	appealStatus: [{ id: 2, status: 'site_visit_booked', valid: true }],
	siteVisit: {
		id: 1,
		appealId: originalAppeal.id,
		visitDate: new Date(2030, 0, 1),
		visitSlot: '8am to 10am',
		visitType: 'accompanied'
	}
};

/** @type {DeepPartial<Appeal>} */
const invalidAppeal = {
	...originalAppeal,
	userId: 101
};

const getByIdStub = sinon.stub();
const updateStatusAndDataByIdStub = sinon.stub();

getByIdStub.withArgs(1).returns(originalAppeal);
getByIdStub.withArgs(1, { siteVisit: true }).returns(updatedAppeal);
getByIdStub.withArgs(2).returns(invalidAppeal);

sinon.stub(appealRepository, 'getById').callsFake(getByIdStub);
sinon.stub(appealRepository, 'updateStatusAndDataById').callsFake(updateStatusAndDataByIdStub);

test.beforeEach(() => {
	getByIdStub.resetHistory();
});

test('succeeds with a 200 when booking a site visit', async (t) => {
	const response = await request.post('/inspector/1/book').set('userId', '100').send(siteVisitBody);
	
	t.is(response.status, 200);
	t.snapshot(response.body);

	assert.calledWith(updateStatusAndDataByIdStub, 1, 'site_visit_booked', {
		siteVisit: {
			create: {
				visitDate: new Date(2030, 0, 1),
				visitSlot: '8am to 10am',
				visitType: 'accompanied'
			}
		}
	});
	assert.calledWith(getByIdStub, 1, { siteVisit: true });
});

test('fails with a 401 status when no `userId` is present', async (t) => {
	const response = await request
		.post('/inspector/1/book')
		.send(siteVisitBody);

	t.is(response.status, 401);
	t.deepEqual(response.body, {
		errors: {
			userid: 'Authentication error. Missing header `userId`.'
		}
	});
});

test('fails with a 403 status when the `userId` is different from the appeal user', async (t) => {
	const response = await request
		.post('/inspector/1/book')
		.set('userId', '101')
		.send(siteVisitBody);

	t.is(response.status, 403);
	t.deepEqual(response.body, {
		errors: {
			userid: 'User is not permitted to perform this action.'
		}
	});
});

test('fails with a 400 status when an invalid `siteVisitDate` is present', async (t) => {
	const response = await request
		.post('/inspector/1/book')
		.set('userId', '100')
		.send({ ...siteVisitBody, siteVisitDate: '*' });

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			siteVisitDate: 'Enter a site visit date'
		}
	});
});

test('fails with a 400 status when  a `siteVisitDate` is in an incorrect format', async (t) => {
	const response = await request
		.post('/inspector/1/book')
		.set('userId', '100')
		.send({ ...siteVisitBody, siteVisitDate: '01-01-2030' });

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			siteVisitDate: 'Enter a site visit date'
		}
	});
});

test('fails with a 400 status when a `siteVisitDate` is in the past', async (t) => {
	const response = await request
		.post('/inspector/1/book')
		.set('userId', '100')
		.send({ ...siteVisitBody, siteVisitDate: format(yesterday(), 'yyyy-MM-dd') });

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			siteVisitDate: 'Site visit date must be in the future'
		}
	});
});

test('fails with a 400 status when an invalid `siteVisitTimeSlot` is present', async (t) => {
	const response = await request
		.post('/inspector/1/book')
		.set('userId', '100')
		.send({ ...siteVisitBody, siteVisitTimeSlot: '*' });

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			siteVisitTimeSlot: 'Select a valid time slot'
		}
	});
});

test('fails with a 400 status when an invalid `siteVisitType` is present', async (t) => {
	const response = await request
		.post('/inspector/1/book')
		.set('userId', '100')
		.send({ ...siteVisitBody, siteVisitType: '*' });

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			siteVisitType: 'Select a type of site visit'
		}
	});
});
