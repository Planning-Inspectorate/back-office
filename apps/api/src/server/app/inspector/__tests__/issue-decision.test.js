// @ts-check

import test from 'ava';
import path from 'node:path';
import * as url from 'node:url';
import sinon, { assert } from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import appealRepository from '../../repositories/appeal.repository.js';

/** @typedef {import('@pins/api').Schema.Appeal} Appeal */

const request = supertest(app);
const dirname = url.fileURLToPath(new URL('.', import.meta.url));
const pathToFile = path.join(dirname, './assets/simple.pdf');

// todo: replace with factory
const validAppeal = {
	id: 1,
	reference: 'APP/Q9999/D/21/323259',
	planningApplicationReference: '0181/811/8181',
	localPlanningDepartment: 'Local planning dept',
	appealStatus: [
		{
			id: 1,
			status: 'decision_due',
			valid: true
		}
	],
	appealType: {
		type: 'household'
	},
	createdAt: new Date(2022, 0, 1),
	updatedAt: new Date(2022, 0, 1),
	user: { azureReference: 100, id: 100 }
};

// todo: replace with factory
const invalidAppeal = {
	...validAppeal,
	id: 2,
	appealStatus: [
		{
			id: 1,
			status: 'site_visit_not_yet_booked',
			valid: true
		}
	]
};

const updatedAppeal = {
	...validAppeal,
	appealStatus: [{ id: 2, status: 'site_visit_booked', valid: true }],
	inspectorDecision: {
		id: 1,
		appealId: validAppeal.id,
		outcome: 'allowed',
		decisionLetterFilename: 'simple.pdf'
	}
};

const getByIdStub = sinon.stub();
const updateStatusAndDataByIdStub = sinon.stub();

getByIdStub.withArgs(1, { user: true }).returns(validAppeal);
getByIdStub.withArgs(1).returns(validAppeal);
getByIdStub.withArgs(1, { inspectorDecision: true }).returns(updatedAppeal);
getByIdStub.withArgs(2, { user: true }).returns(invalidAppeal);
getByIdStub.withArgs(2).returns(invalidAppeal);

sinon.stub(appealRepository, 'getById').callsFake(getByIdStub);
sinon.stub(appealRepository, 'updateStatusAndDataById').callsFake(updateStatusAndDataByIdStub);

test('succeeds with a 200 when issuing a decision', async (t) => {
	const response = await request
		.post('/inspector/1/issue-decision')
		.set('userId', '100')
		.attach('decisionLetter', pathToFile)
		.field('outcome', 'allowed');

	t.is(response.status, 200);
	t.snapshot(response.body);

	assert.calledWith(updateStatusAndDataByIdStub, 1, 'appeal_decided', {
		inspectorDecision: {
			create: {
				outcome: 'allowed',
				decisionLetterFilename: 'simple.pdf'
			}
		}
	});
	assert.calledWith(getByIdStub, 1, { inspectorDecision: true });
});

test('fails with a 401 status when no `userId` is present', async (t) => {
	const response = await request
		.post('/inspector/1/issue-decision')
		.attach('decisionLetter', pathToFile)
		.field('outcome', 'allowed');

	t.is(response.status, 401);
	t.deepEqual(response.body, {
		errors: {
			userid: 'Authentication error. Missing header `userId`.'
		}
	});
});

test('fails with a 403 status when the `userId` is different from the appeal user', async (t) => {
	const response = await request
		.post('/inspector/1/issue-decision')
		.set('userId', '101')
		.attach('decisionLetter', pathToFile)
		.field('outcome', 'allowed');

	t.is(response.status, 403);
	t.deepEqual(response.body, {
		errors: {
			userid: 'User is not permitted to perform this action.'
		}
	});
});

test('fails with a 409 status when the appeal in a state that cannot be be advanced', async (t) => {
	const response = await request
		.post('/inspector/2/issue-decision')
		.set('userId', '100')
		.attach('decisionLetter', pathToFile)
		.field('outcome', 'allowed');

	t.is(response.status, 409);
	t.deepEqual(response.body, {
		errors: {
			appeal: "Could not transition 'site_visit_not_yet_booked' using 'DECIDE'."
		}
	});
});

test('fails with a 400 status when an invalid `outcome` is present', async (t) => {
	const response = await request
		.post('/inspector/1/issue-decision')
		.set('userId', '100')
		.attach('decisionLetter', pathToFile)
		.field('outcome', '*');

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			outcome: 'Select a valid decision'
		}
	});
});

test('fails with a 400 status when the `decisionLetter` is missing', async (t) => {
	const response = await request
		.post('/inspector/1/issue-decision')
		.set('userId', '100')
		.field('outcome', 'allowed');

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			decisionLetter: 'Select a file'
		}
	});
});

test('fails with a 400 status when the `decisionLetter` is too large', async (t) => {
	const response = await request
		.post('/inspector/1/issue-decision')
		.set('userId', '100')
		.attach('decisionLetter', path.join(dirname, './assets/anthropods.pdf'))
		.field('outcome', 'allowed');

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			decisionLetter: 'File too large'
		}
	});
});
