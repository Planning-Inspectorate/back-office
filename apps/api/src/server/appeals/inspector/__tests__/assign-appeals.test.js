import { jest } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../../app-test.js';
import formatAddressLowerCase from '../../../utils/address-formatter-lowercase.js';
import { appealFactoryForTests } from '../../../utils/appeal-factory-for-tests.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const appeal1 = {
	...appealFactoryForTests({
		appealId: 1,
		statuses: [
			{
				id: 1,
				status: 'available_for_inspector_pickup',
				valid: true,
				subStateMachineName: 'lpaQuestionnaireAndInspectorPickup'
			},
			{
				id: 2,
				status: 'available_for_final_comments',
				valid: true,
				subStateMachineName: 'statementsAndFinalComments'
			}
		],
		typeShorthand: 'FPA',
		inclusions: { siteVisitBooked: true, lpaQuestionnaire: true },
		dates: {
			createdAt: new Date(2022, 1, 23),
			startedAt: new Date(2022, 1, 25)
		}
	}),
	lpaQuestionnaire: { siteVisibleFromPublicLand: false },
	appealDetailsFromAppellant: { siteVisibleFromPublicLand: true }
};

const appeal2 = {
	...appealFactoryForTests({
		appealId: 2,
		statuses: [
			{
				id: 3,
				status: 'available_for_inspector_pickup',
				valid: true
			}
		],
		typeShorthand: 'HAS',
		inclusions: { siteVisitBooked: true, lpaQuestionnaire: true },
		dates: {
			createdAt: new Date(2022, 1, 25),
			startedAt: new Date(2022, 3, 29)
		}
	}),
	lpaQuestionnaire: { siteVisibleFromPublicLand: true },
	appealDetailsFromAppellant: { siteVisibleFromPublicLand: true }
};

const appeal3 = {
	...appealFactoryForTests({
		appealId: 3,
		statuses: [
			{
				id: 4,
				status: 'available_for_inspector_pickup',
				valid: true
			}
		],
		typeShorthand: 'HAS',
		inclusions: { lpaQuestionnaire: true },
		dates: { createdAt: new Date(2022, 1, 25), startedAt: new Date(2022, 3, 29) }
	}),
	lpaQuestionnaire: { siteVisibleFromPublicLand: true },
	appealDetailsFromAppellant: { siteVisibleFromPublicLand: true }
};

const appeal4 = {
	...appealFactoryForTests({
		appealId: 4,
		statuses: [
			{
				id: 5,
				status: 'site_visit_not_yet_booked',
				valid: true
			}
		],
		typeShorthand: 'HAS',
		inclusions: { lpaQuestionnaire: true },
		dates: { createdAt: new Date(2022, 1, 25), startedAt: new Date(2022, 3, 29) }
	}),
	lpaQuestionnaire: { siteVisibleFromPublicLand: true },
	appealDetailsFromAppellant: { siteVisibleFromPublicLand: false }
};

const appeal5 = {
	...appealFactoryForTests({
		appealId: 5,
		statuses: [
			{
				id: 6,
				status: 'available_for_inspector_pickup',
				valid: true
			}
		],
		typeShorthand: 'HAS',
		inclusions: { lpaQuestionnaire: true, connectToUser: true },
		dates: { createdAt: new Date(2022, 1, 25), startedAt: new Date(2022, 3, 29) }
	}),
	lpaQuestionnaire: { siteVisibleFromPublicLand: false },
	appealDetailsFromAppellant: { siteVisibleFromPublicLand: false }
};

jest.useFakeTimers({ now: 1_649_319_144_000 });

describe('Assign appeals', () => {
	test('assigns all appeals as they are all available', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique
			.mockResolvedValueOnce(appeal1)
			.mockResolvedValueOnce(appeal2)
			.mockResolvedValueOnce(appeal3);

		// WHEN
		const resp = await request.post('/appeals/inspector/assign').set('userId', 1).send([1, 2, 3]);

		// THEN
		expect(resp.status).toEqual(200);
		expect(databaseConnector.appealStatus.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [1] } },
			data: { valid: false }
		});
		expect(databaseConnector.appealStatus.createMany).toHaveBeenCalledWith({
			data: [
				{
					subStateMachineName: 'lpaQuestionnaireAndInspectorPickup',
					status: 'picked_up',
					compoundStateName: 'awaiting_lpa_questionnaire_and_statements',
					appealId: 1
				}
			]
		});
		expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: { updatedAt: expect.any(Date), user: { connect: { azureReference: 1 } } }
		});
		expect(databaseConnector.appealStatus.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [3] } },
			data: { valid: false }
		});
		expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
			data: { status: 'site_visit_not_yet_booked', appealId: 2 }
		});
		expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
			where: { id: 2 },
			data: { updatedAt: expect.any(Date), user: { connect: { azureReference: 1 } } }
		});
		expect(databaseConnector.appealStatus.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [4] } },
			data: { valid: false }
		});
		expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
			data: { status: 'site_visit_not_yet_booked', appealId: 3 }
		});
		expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
			where: { id: 3 },
			data: { updatedAt: expect.any(Date), user: { connect: { azureReference: 1 } } }
		});
		expect(resp.body).toEqual({
			successfullyAssigned: [
				{
					appealId: 1,
					reference: appeal1.reference,
					appealType: 'FPA',
					specialist: 'General',
					provisionalVisitType: 'access required',
					appealSite: formatAddressLowerCase(appeal1.address),
					appealAge: 41
				},
				{
					appealId: 2,
					reference: appeal2.reference,
					appealType: 'HAS',
					specialist: 'General',
					appealAge: 22,
					provisionalVisitType: 'unaccompanied',
					appealSite: formatAddressLowerCase(appeal2.address)
				},
				{
					appealId: 3,
					reference: appeal3.reference,
					appealType: 'HAS',
					specialist: 'General',
					appealAge: 22,
					provisionalVisitType: 'unaccompanied',
					appealSite: formatAddressLowerCase(appeal3.address)
				}
			],
			unsuccessfullyAssigned: []
		});
	});

	test('unable to assign appeals that are not in the appropriate state', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique
			.mockResolvedValueOnce(appeal3)
			.mockResolvedValueOnce(appeal4);

		// WHEN
		const resp = await request.post('/appeals/inspector/assign').set('userId', 1).send([3, 4]);

		// THEN
		expect(resp.status).toEqual(200);
		expect(databaseConnector.appealStatus.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [4] } },
			data: { valid: false }
		});
		expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
			data: { status: 'site_visit_not_yet_booked', appealId: 3 }
		});
		expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
			where: { id: 3 },
			data: { updatedAt: expect.any(Date), user: { connect: { azureReference: 1 } } }
		});
		expect(resp.body).toEqual({
			successfullyAssigned: [
				{
					appealId: 3,
					reference: appeal3.reference,
					appealType: 'HAS',
					specialist: 'General',
					appealAge: 22,
					provisionalVisitType: 'unaccompanied',
					appealSite: formatAddressLowerCase(appeal3.address)
				}
			],
			unsuccessfullyAssigned: [
				{
					appealId: 4,
					reason: 'appeal in wrong state',
					reference: appeal4.reference,
					appealType: 'HAS',
					specialist: 'General',
					appealAge: 22,
					provisionalVisitType: 'access required',
					appealSite: formatAddressLowerCase(appeal4.address)
				}
			]
		});
	});

	test('unable to assign appeals that are already assigned to someone', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique
			.mockResolvedValueOnce(appeal1)
			.mockResolvedValueOnce(appeal5);

		// WHEN
		const resp = await request.post('/appeals/inspector/assign').set('userId', 1).send([1, 5]);

		// THEN
		expect(resp.status).toEqual(200);
		expect(databaseConnector.appealStatus.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [1] } },
			data: { valid: false }
		});
		expect(databaseConnector.appealStatus.createMany).toHaveBeenCalledWith({
			data: [
				{
					subStateMachineName: 'lpaQuestionnaireAndInspectorPickup',
					status: 'picked_up',
					compoundStateName: 'awaiting_lpa_questionnaire_and_statements',
					appealId: 1
				}
			]
		});
		expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: { updatedAt: expect.any(Date), user: { connect: { azureReference: 1 } } }
		});
		expect(resp.body).toEqual({
			successfullyAssigned: [
				{
					appealId: 1,
					reference: appeal1.reference,
					appealType: 'FPA',
					specialist: 'General',
					provisionalVisitType: 'access required',
					appealSite: formatAddressLowerCase(appeal1.address),
					appealAge: 41
				}
			],
			unsuccessfullyAssigned: [
				{
					appealAge: 22,
					appealId: 5,
					appealSite: formatAddressLowerCase(appeal5.address),
					appealType: 'HAS',
					provisionalVisitType: 'access required',
					reason: 'appeal already assigned',
					reference: appeal5.reference,
					specialist: 'General'
				}
			]
		});
	});

	test('throws error if no userid provided', async () => {
		// GIVEN

		// WHEN
		const resp = await request.post('/appeals/inspector/assign').send([1]);

		// THEN
		expect(resp.status).toEqual(401);
		expect(resp.body).toEqual({
			errors: {
				userid: 'Authentication error. Missing header `userId`.'
			}
		});
	});

	test('throws error if no appeals provided', async () => {
		// GIVEN

		// WHEN
		const resp = await request.post('/appeals/inspector/assign').set('userId', 1);

		// THEN
		expect(resp.status).toEqual(400);
		expect(resp.body).toEqual({
			errors: {
				'': 'Provide a non-empty array of appeals to assign to the inspector'
			}
		});
	});

	test('throws error if empty array of appeals provided', async () => {
		// GIVEN

		// WHEN
		const resp = await request.post('/appeals/inspector/assign').set('userId', 1).send([]);

		// THEN
		expect(resp.status).toEqual(400);
		expect(resp.body).toEqual({
			errors: {
				'': 'Provide a non-empty array of appeals to assign to the inspector'
			}
		});
	});
});
