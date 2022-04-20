// @ts-check

// eslint-disable-next-line import/no-unresolved
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

const appeal_1 = {
	id: 1,
	appealStatus: [{
		status: 'decision_due',
		valid: true
	}],
	userId: 100
};
const appeal_2 = {
	id: 2,
	appealStatus: [{
		status: 'available_for_inspector_pickup',
		valid: true
	}],
	userId: 100
};

const updateStatusAndDataByIdStub = sinon.stub();
const appealRespositoryGetByIdStub = sinon.stub();
appealRespositoryGetByIdStub.withArgs(1).returns(appeal_1);
appealRespositoryGetByIdStub.withArgs(2).returns(appeal_2);
sinon.stub(appealRepository, 'getById').callsFake(appealRespositoryGetByIdStub);
sinon.stub(appealRepository, 'updateStatusAndDataById').callsFake(updateStatusAndDataByIdStub);

test('succeeds with a 200 when issuing a decision', async (t) => {
	const response = await request
		.post('/inspector/1/issue-decision')
		.set('userId', '100')
		.attach('decisionLetter', pathToFile)
		.field('outcome', 'allowed');

	assert.calledWith(updateStatusAndDataByIdStub, 1, 'appeal_decided', {
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
			appeal: 'Could not transition \'available_for_inspector_pickup\' using \'DECIDE\'.'
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
