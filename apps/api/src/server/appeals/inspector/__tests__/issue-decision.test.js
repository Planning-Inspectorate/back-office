import path from 'node:path';
import * as url from 'node:url';
import supertest from 'supertest';
import { app } from '../../../app-test.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

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

describe('Issue decision', () => {
	test('succeeds with a 200 when issuing a decision', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique
			.mockResolvedValueOnce(validAppeal)
			.mockResolvedValueOnce(validAppeal)
			.mockResolvedValueOnce(updatedAppeal);

		// WHEN
		const response = await request
			.post('/appeals/inspector/1/issue-decision')
			.set('userId', '100')
			.attach('decisionLetter', pathToFile)
			.field('outcome', 'allowed');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			appealId: 1,
			appealReceivedDate: '01 January 2022',
			inspectorDecision: {
				outcome: 'allowed'
			},
			localPlanningDepartment: 'Local planning dept',
			planningApplicationReference: '0181/811/8181',
			reference: 'APP/Q9999/D/21/323259',
			status: 'booked'
		});

		// expect(updateStatusAndDataByIdStub).toHaveBeenCalledWith(1, 'appeal_decided', {
		// 	inspectorDecision: {
		// 		create: {
		// 			outcome: 'allowed',
		// 			decisionLetterFilename: 'simple.pdf'
		// 		}
		// 	}
		// });
		// expect(databaseConnector.appeal.findUnique).toHaveBeenCalledWith(1, { inspectorDecision: true });
	});

	test('fails with a 401 status when no `userId` is present', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(validAppeal);

		// WHEN
		const response = await request
			.post('/appeals/inspector/1/issue-decision')
			// tests will fail if we use .attach - possibly related to https://github.com/ladjs/superagent/issues/747
			// not required for this validation check anyway
			// .attach('decisionLetter', pathToFile)
			.field('outcome', 'allowed');

		// THEN
		expect(response.status).toEqual(401);
		expect(response.body).toEqual({
			errors: {
				userid: 'Authentication error. Missing header `userId`.'
			}
		});
	});

	test('fails with a 403 status when the `userId` is different from the appeal user', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(validAppeal);

		// WHEN
		const response = await request
			.post('/appeals/inspector/1/issue-decision')
			.set('userId', '101')
			// tests will fail if we use .attach - possibly related to https://github.com/ladjs/superagent/issues/747
			// not required for this validation check anyway
			// .attach('decisionLetter', pathToFile)
			.field('outcome', 'allowed');

		// THEN
		expect(response.status).toEqual(403);
		expect(response.body).toEqual({
			errors: {
				userid: 'User is not permitted to perform this action.'
			}
		});
	});

	test('fails with a 409 status when the appeal in a state that cannot be be advanced', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(invalidAppeal);

		// WHEN
		const response = await request
			.post('/appeals/inspector/2/issue-decision')
			.set('userId', '100')
			.attach('decisionLetter', pathToFile)
			.field('outcome', 'allowed');

		// THEN
		expect(response.status).toEqual(409);
		expect(response.body).toEqual({
			errors: {
				appeal: "Could not transition 'site_visit_not_yet_booked' using 'DECIDE'."
			}
		});
	});

	test('fails with a 400 status when an invalid `outcome` is present', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(validAppeal);

		// WHEN
		const response = await request
			.post('/appeals/inspector/1/issue-decision')
			.set('userId', '100')
			.attach('decisionLetter', pathToFile)
			.field('outcome', '*');

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				outcome: 'Select a valid decision'
			}
		});
	});

	test('fails with a 400 status when the `decisionLetter` is missing', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(invalidAppeal);

		// WHEN
		const response = await request
			.post('/appeals/inspector/1/issue-decision')
			.set('userId', '100')
			.field('outcome', 'allowed');

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				decisionLetter: 'Select a file'
			}
		});
	});

	test('fails with a 400 status when the `decisionLetter` is too large', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(invalidAppeal);

		// WHEN
		const response = await request
			.post('/appeals/inspector/1/issue-decision')
			.set('userId', '100')
			.attach('decisionLetter', path.join(dirname, './assets/anthropods.pdf'))
			.field('outcome', 'allowed');

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				decisionLetter: 'File too large'
			}
		});
	});
});
