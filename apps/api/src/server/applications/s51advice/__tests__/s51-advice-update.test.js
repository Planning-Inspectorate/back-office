import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';

const { databaseConnector } = await import('#utils/database-connector.js');

const validS51AdviceBody = {
	caseId: 1,
	title: 'Advice 1',
	enquirer: 'New Power Company',
	firstName: 'John',
	lastName: 'Keats',
	enquiryMethod: 'email',
	enquiryDate: '2023-02-27T10:00:00Z',
	enquiryDetails: 'enquiryDetails',
	adviser: 'adviser',
	adviceDate: '2023-02-27T10:00:00Z',
	adviceDetails: 'adviceDetails'
};

describe('Test S51 advice update status and redacted status', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	test('updates s51 advice status to not_checked AND redacted status to redacted', async () => {
		// GIVEN
		const validS51AdviceWithId = {
			...validS51AdviceBody,
			id: 1,
			redactedStatus: 'redacted',
			publishedStatus: 'not_checked',
			publishedStatusPrev: ''
		};

		databaseConnector.s51Advice.findUnique.mockResolvedValue(validS51AdviceBody);
		databaseConnector.s51Advice.findMany.mockResolvedValue([1]);
		databaseConnector.s51Advice.update.mockResolvedValue(validS51AdviceWithId);

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'not_checked',
			redacted: true,
			items: [{ id: 1 }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				id: '1',
				redactedStatus: 'redacted',
				status: 'not_checked'
			}
		]);
		expect(databaseConnector.s51Advice.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				publishedStatus: 'not_checked',
				redactedStatus: 'redacted'
			}
		});
	});

	test('updates s51 advice status only to ready_to_publish, redaction status unchanged', async () => {
		// GIVEN
		const validS51AdviceWithId = {
			...validS51AdviceBody,
			id: 1,
			redactedStatus: 'redacted',
			publishedStatus: 'ready_to_publish',
			publishedStatusPrev: 'not_checked'
		};

		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		databaseConnector.s51Advice.findUnique.mockResolvedValue(validS51AdviceBody);
		databaseConnector.s51Advice.findMany.mockResolvedValue([1]);
		databaseConnector.s51Advice.update.mockResolvedValue(validS51AdviceWithId);
		databaseConnector.folder.findFirst.mockResolvedValue({ id: 1 });

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 1 }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				id: '1',
				redactedStatus: 'redacted',
				status: 'ready_to_publish'
			}
		]);
		expect(databaseConnector.s51Advice.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				publishedStatus: 'ready_to_publish'
			}
		});
	});

	test('updates s51 advice status to ready_to_publish, with enquirer organisation but no person', async () => {
		// GIVEN
		const validS51AdviceBodyNoPerson = { validS51AdviceBody, firstName: '', lastName: '' };
		const validS51AdviceUpdateResponse = {
			...validS51AdviceBodyNoPerson,
			id: 1,
			redactedStatus: 'redacted',
			publishedStatus: 'ready_to_publish',
			publishedStatusPrev: 'not_checked'
		};

		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		databaseConnector.s51Advice.findUnique.mockResolvedValue(validS51AdviceBodyNoPerson);
		databaseConnector.s51Advice.findMany.mockResolvedValue([1]);
		databaseConnector.s51Advice.update.mockResolvedValue(validS51AdviceUpdateResponse);
		databaseConnector.folder.findFirst.mockResolvedValue({ id: 1 });

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 1 }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				id: '1',
				redactedStatus: 'redacted',
				status: 'ready_to_publish'
			}
		]);
		expect(databaseConnector.s51Advice.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				publishedStatus: 'ready_to_publish'
			}
		});
	});

	test('updates s51 advice status only to ready_to_publish, with enquirer person but no organisation', async () => {
		// GIVEN
		const validS51AdviceBodyNoOrg = { validS51AdviceBody, enquirer: '' };
		const validS51AdviceUpdateResponse = {
			...validS51AdviceBodyNoOrg,
			id: 1,
			redactedStatus: 'redacted',
			publishedStatus: 'ready_to_publish',
			publishedStatusPrev: 'not_checked'
		};

		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		databaseConnector.s51Advice.findUnique.mockResolvedValue(validS51AdviceBodyNoOrg);
		databaseConnector.s51Advice.findMany.mockResolvedValue([1]);
		databaseConnector.s51Advice.update.mockResolvedValue(validS51AdviceUpdateResponse);
		databaseConnector.folder.findFirst.mockResolvedValue({ id: 1 });

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 1 }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				id: '1',
				redactedStatus: 'redacted',
				status: 'ready_to_publish'
			}
		]);
		expect(databaseConnector.s51Advice.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				publishedStatus: 'ready_to_publish'
			}
		});
	});

	test('throws 500 error updating s51 advice missing required data: title', async () => {
		// GIVEN
		const invalidS51AdviceBody = { ...validS51AdviceBody, id: 2, title: '' };

		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		databaseConnector.s51Advice.findUnique.mockResolvedValue(invalidS51AdviceBody);
		databaseConnector.s51Advice.findMany.mockResolvedValue([]);
		databaseConnector.s51Advice.update.mockResolvedValue();
		databaseConnector.folder.findFirst.mockResolvedValue({ id: 1 });

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 2 }]
		});

		// THEN
		expect(response.status).toEqual(500);
		expect(response.body).toEqual({
			errors: "Failed to publish S51 advices. [{\"id\":2}]"
		});
	});

	test('throws 500 error updating s51 advice missing required data: enquirer AND firstName + lastName', async () => {
		// GIVEN
		const invalidS51AdviceBody = {
			...validS51AdviceBody,
			id: 3,
			enquirer: '',
			firstName: '',
			lastName: ''
		};

		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		databaseConnector.s51Advice.findUnique.mockResolvedValue(invalidS51AdviceBody);
		databaseConnector.s51Advice.findMany.mockResolvedValue([]);
		databaseConnector.s51Advice.update.mockResolvedValue();

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 3 }]
		});

		// THEN
		expect(response.status).toEqual(500);
		expect(response.body).toEqual({
			errors: "Failed to publish S51 advices. [{\"id\":3}]"
		});
	});

	test('throws 500 error updating s51 advice with invalid advice id', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		databaseConnector.s51Advice.findUnique.mockResolvedValue(null);
		databaseConnector.s51Advice.findMany.mockResolvedValue([]);
		databaseConnector.s51Advice.update.mockResolvedValue();

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 999 }]
		});

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: { items: 'Unknown S51 Advice id 999' }
		});
	});

	test('returns 404 error updating s51 advice if case does not exist', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request.patch('/applications/1001/s51-advice').send({
			status: 'not_checked',
			redacted: true,
			items: [{ id: 1 }, { id: 2 }]
		});

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: { id: 'Must be an existing application' }
		});
	});
});
