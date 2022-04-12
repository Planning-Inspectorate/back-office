// @ts-check

import test from 'ava';
import { find } from 'lodash-es';
import path from 'path';
import sinon, { assert } from 'sinon';
import supertest from 'supertest';
import * as url from 'url';
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
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const pathToFile = path.join(__dirname, './assets/simple.pdf');

/** @type {TestAppeal[]} */
const appeals = [
	{ id: 1, status: 'decision_due', userId: 100 },
	{ id: 2, status: 'available_for_inspector_pickup', userId: 100 }
];
const updateById = sinon.stub(appealRepository, 'updateById').callsFake((id, { status }) => {
	const appeal = find(appeals, { id });
	return Promise.resolve({ ...appeal, status });
});

sinon.stub(appealRepository, 'getById').callsFake((id) => find(appeals, { id }));

test.beforeEach(() => {
	updateById.resetHistory();
});

test('succeeds with a 200 when issuing a decision', async (t) => {
	const response = await request
		.post('/inspector/1/issue-decision')
		.set('userId', '100')
		.attach('decisionLetter', pathToFile)
		.field('outcome', 'allowed');

	assert.calledWith(updateById, 1, {
		status: 'appeal_decided',
		inspectorDecision: {
			create: {
				appealId: 1,
				outcome: 'allowed',
				decisionLetterFilename: 'simple.pdf'
			}
		}
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, { id: 1, status: 'appeal_decided', userId: 100 });
});

test('fails with a 401 status when no `userId` is present', async (t) => {
	const response = await request.post('/inspector/1/issue-decision').attach('decisionLetter', pathToFile).field('outcome', 'allowed');

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
			status: 'Appeal is in an invalid state'
		}
	});
});

test('fails with a 400 status when an invalid `outcome` is present', async (t) => {
	const response = await request.post('/inspector/1/issue-decision').set('userId', '100').attach('decisionLetter', pathToFile).field('outcome', '*');

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			outcome: 'Select a valid decision'
		}
	});
});

test('fails with a 400 status when the `decisionLetter` is missing', async (t) => {
	const response = await request.post('/inspector/1/issue-decision').set('userId', '100').field('outcome', 'allowed');

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			decisionLetter: 'Select a decision letter'
		}
	});
});

test('fails with a 400 status when the `decisionLetter` is too large', async (t) => {
	const response = await request
		.post('/inspector/1/issue-decision')
		.set('userId', '100')
		.attach('decisionLetter', path.join(__dirname, './assets/anthropods.pdf'))
		.field('outcome', 'allowed');

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			decisionLetter: 'File too large'
		}
	});
});
