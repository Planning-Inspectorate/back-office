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

const s51AdviceDocuments = [
	{
		id: 1,
		adviceId: 5,
		documentGuid: '458a2020-cafd-4885-a78c-1c13735e1aac',
		Document: {
			guid: '458a2020-cafd-4885-a78c-1c13735e1aac',
			reference: 'EN0110002-000003',
			folderId: 1734,
			createdAt: '2023-08-16T13:57:21.992Z',
			isDeleted: false,
			latestVersionId: 1,
			caseId: 29,
			fromFrontOffice: false,
			latestDocumentVersion: {
				fileName: '2048px-Pittsburgh_Steelers_logo.svg',
				mime: 'application/pdf',
				size: 207364,
				dateCreated: '2023-08-16T13:57:22.022Z',
				publishedStatus: 'awaiting_upload',
				documentGuid: '458a2020-cafd-4885-a78c-1c13735e1aac',
				version: 1
			}
		}
	}
];

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

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 2 }]
		});

		// THEN
		expect(response.status).toEqual(500);
		expect(response.body).toEqual({
			errors: 'All mandatory fields must be completed. Return to the S51 advice properties screen to make changes.'
		});
	});

	test('throws 500 error updating s51 advice when attachment is not scanned', async () => {
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
		databaseConnector.s51Advice.findUnique.mockResolvedValue(validS51AdviceUpdateResponse);
		databaseConnector.s51Advice.findMany.mockResolvedValue([1]);
		databaseConnector.s51Advice.update.mockResolvedValue();
		databaseConnector.s51AdviceDocument.findMany.mockResolvedValue(s51AdviceDocuments);

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 3 }]
		});

		// THEN
		expect(response.status).toEqual(500);
		expect(response.body).toEqual({
			errors: 'There are attachments which have failed the virus check. Return to the S51 advice properties screen to delete files.'
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
			errors: 'All mandatory fields must be completed. Return to the S51 advice properties screen to make changes.'
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
