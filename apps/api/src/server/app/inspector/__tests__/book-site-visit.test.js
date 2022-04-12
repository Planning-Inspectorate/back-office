// @ts-check

import { yesterday } from '@pins/platform';
import test from 'ava';
import format from 'date-fns/format/index.js';
import { find } from 'lodash-es';
import sinon, { assert } from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import appealRepository from '../../repositories/appeal.repository.js';
import { inspectorStates } from '../../state-machine/inspector-states.js';

/** @typedef {keyof typeof inspectorStates} InspectorState */

/**
 * @typedef {object} TestAppeal
 * @property {number} id
 * @property {number} userId
 * @property {InspectorState} status
 */

const request = supertest(app);

/** @type {TestAppeal[]} */
const appeals = [{ id: 1, status: 'site_visit_not_yet_booked', userId: 100 }];
const updateById = sinon.stub(appealRepository, 'updateById').callsFake((id, { status }) => {
	const appeal = find(appeals, { id });
	return Promise.resolve({ ...appeal, status });
});

sinon.stub(appealRepository, 'getById').callsFake((id) => find(appeals, { id }));

test.beforeEach(() => {
	updateById.resetHistory();
});

const siteVisitBody = {
	siteVisitDate: '2030-01-01',
	siteVisitTimeSlot: '8am to 10am',
	siteVisitType: 'accompanied'
};

test('succeeds with a 200 when booking a site visit', async (t) => {
	const response = await request.post('/inspector/1/book').set('userId', '100').send(siteVisitBody);

	assert.calledWith(updateById, 1, {
		status: 'site_visit_booked',
		siteVisit: {
			create: {
				visitDate: new Date(siteVisitBody.siteVisitDate),
				visitSlot: '8am to 10am',
				visitType: 'accompanied'
			}
		}
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, { id: 1, status: 'site_visit_booked', userId: 100 });
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
