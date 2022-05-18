// @ts-check
import test from 'ava';
import sinon, { assert } from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import appealRepository from '../../repositories/appeal.repository.js';

/** @typedef {import('@pins/api').Schema.Appeal} Appeal */
/** @typedef {import('../case-officer.controller').UpdateAppealDetailsBody} UpdateAppealDetailsBody */

const request = supertest(app);

/** @type {UpdateAppealDetailsBody} */
const appealDetailsBody = {
	listedBuildingDescription: '*'
};

// todo: replace with factory

const originalAppeal = {
	id: 1,
	reference: 'APP/Q9999/D/21/323259',
	planningApplicationReference: '0181/811/8181',
	localPlanningDepartment: 'Local planning dept',
	appealStatus: [
		{
			id: 1,
			status: 'incomplete_lpa_questionnaire',
			valid: true
		}
	],
	createdAt: new Date(2022, 0, 1),
	updatedAt: new Date(2022, 0, 1),
	userId: 100
};

const updatedAppeal = {
	...originalAppeal,
	appealStatus: [{ id: 2, status: 'incomplete_lpa_questionnaire', valid: true }],
	lpaQuestionnaire: appealDetailsBody
};

const invalidAppeal = {
	...originalAppeal,
	appealStatus: [{ id: 2, status: 'received_lpa_questionnaire', valid: true }],
	userId: 100
};

const getByIdStub = sinon.stub();
const updateByIdStub = sinon.stub();

getByIdStub.withArgs(1).returns(originalAppeal);
getByIdStub.withArgs(1, { lpaQuestionnaire: true }).returns(updatedAppeal);
getByIdStub.withArgs(2).returns(invalidAppeal);

sinon.stub(appealRepository, 'getById').callsFake(getByIdStub);
sinon.stub(appealRepository, 'updateById').callsFake(updateByIdStub);

test.beforeEach(() => {
	updateByIdStub.resetHistory();
});

test('succeeds with a 200 when updating the listed building description', async (t) => {
	const response = await request.patch('/case-officer/1').send(appealDetailsBody);

	t.is(response.status, 200);
	t.snapshot(response.body);

	assert.calledWith(updateByIdStub, 1, {
		lpaQuestionnaire: {
			update: {
				listedBuildingDescription: '*'
			}
		}
	});
	assert.calledWith(getByIdStub, 1);
});

test('fails with a 409 status when the appeal is not in an incomplete state', async (t) => {
	const response = await request.patch('/case-officer/2').send(appealDetailsBody);

	t.is(response.status, 409);
	t.deepEqual(response.body, {
		errors: {
			appeal: 'Appeal is in an invalid state'
		}
	});
});

test('fails with a 400 status when the `listedBuildingDescription` is too long', async (t) => {
	const response = await request.patch('/case-officer/1').send({
		listedBuildingDescription: '*'.repeat(501)
	});

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			listedBuildingDescription: 'Description must be 500 characters or fewer'
		}
	});
});

test('fails with a 400 status when the `listedBuildingDescription` is an empty string', async (t) => {
	const response = await request.patch('/case-officer/1').send({ listedBuildingDescription: ' ' });

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			listedBuildingDescription: 'Enter a description'
		}
	});
});
