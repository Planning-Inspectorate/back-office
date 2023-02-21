import supertest from 'supertest';
import { app } from '../../../app.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

/** @typedef {import('@pins/api').Schema.Appeal} Appeal */
/** @typedef {import('apps/api/src/server/appeals/case-officer/case-officer.controller.js').UpdateAppealDetailsBody} UpdateAppealDetailsBody */

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

describe('updating appeal details', () => {
	test('succeeds with a 200 when updating the listed building description', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique
			.mockResolvedValueOnce(originalAppeal)
			.mockResolvedValueOnce(updatedAppeal);

		// WHEN
		const response = await request.patch('/appeals/case-officer/1').send(appealDetailsBody);

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			appealStatus: [
				{
					id: 2,
					status: 'incomplete_lpa_questionnaire',
					valid: true
				}
			],
			createdAt: '2022-01-01T00:00:00.000Z',
			id: 1,
			localPlanningDepartment: 'Local planning dept',
			lpaQuestionnaire: {
				listedBuildingDescription: '*'
			},
			planningApplicationReference: '0181/811/8181',
			reference: 'APP/Q9999/D/21/323259',
			updatedAt: '2022-01-01T00:00:00.000Z',
			userId: 100
		});

		// expect(databaseConnector.appeal.update).toHaveBeenCalledWith(1, {
		// 	lpaQuestionnaire: {
		// 		update: {
		// 			listedBuildingDescription: '*'
		// 		}
		// 	}
		// });
		// expect(databaseConnector.appeal.findUnique).toHaveBeenCalledWith(1);
	});

	test('fails with a 409 status when the appeal is not in an incomplete state', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(invalidAppeal);

		// WHEN
		const response = await request.patch('/appeals/case-officer/2').send(appealDetailsBody);

		// THEN
		expect(response.status).toEqual(409);
		expect(response.body).toEqual({
			errors: {
				appeal: 'Appeal is in an invalid state'
			}
		});
	});

	test('fails with a 400 status when the `listedBuildingDescription` is too long', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(originalAppeal);

		// WHEN
		const response = await request.patch('/appeals/case-officer/1').send({
			listedBuildingDescription: '*'.repeat(501)
		});

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				listedBuildingDescription: 'Description must be 500 characters or fewer'
			}
		});
	});

	test('fails with a 400 status when the `listedBuildingDescription` is an empty string', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(originalAppeal);

		// WHEN
		const response = await request
			.patch('/appeals/case-officer/1')
			.send({ listedBuildingDescription: ' ' });

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				listedBuildingDescription: 'Enter a description'
			}
		});
	});
});
