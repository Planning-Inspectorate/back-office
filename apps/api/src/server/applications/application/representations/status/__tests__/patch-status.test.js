import { jest } from '@jest/globals';
import { request } from '#app-test';
import { eventClient } from '#infrastructure/event-client.js';

const { databaseConnector } = await import('#utils/database-connector.js');

const existingRepresentations = [
	{
		id: 1,
		caseId: 200,
		reference: 'BC0110001-2',
		status: 'VALID',
		redacted: true,
		received: '2023-03-14T14:28:25.704Z',
		originalRepresentation: 'the original representation',
		redactedRepresentation: 'redacted version',
		case: { id: 1, reference: 'BC0110001' },
		representationActions: [],
		represented: {
			id: 10381,
			representationId: 6579,
			firstName: 'Mrs',
			lastName: 'Sue',
			jobTitle: null,
			under18: false,
			organisationName: null,
			email: 'sue@example.com',
			phoneNumber: '01234 567890',
			contactMethod: null,
			address: {
				id: 17059,
				addressLine1: '123 Some Street',
				addressLine2: 'Somewhere Else',
				postcode: 'B1 9BB',
				county: 'A County',
				town: 'Some Town',
				country: 'England'
			}
		},
		representative: {
			id: 10382,
			representationId: 6579,
			firstName: 'James',
			lastName: 'Bond',
			jobTitle: null,
			under18: false,
			organisationName: null,
			email: 'test-agent@example.com',
			phoneNumber: '01234 567890',
			contactMethod: null,
			address: {
				id: 17060,
				addressLine1: '1 Long Road',
				addressLine2: 'Smallville',
				postcode: 'P7 9LN',
				county: 'A County',
				town: 'Some Town',
				country: 'England'
			}
		},
		attachments: []
	},
	{
		id: 2,
		caseId: 1,
		reference: 'BC0110001-55',
		status: 'PUBLISHED',
		redacted: true,
		received: '2023-08-11T10:52:56.516Z'
	}
];

const expectedRepresentationUpdatePayload = [
	{
		representationId: 1,
		referenceId: 'BC0110001-2',
		examinationLibraryRef: '',
		caseRef: 'BC0110001',
		caseId: 200,
		status: 'VALID',
		redacted: true,
		originalRepresentation: 'the original representation',
		representationType: undefined,
		representedId: '10381',
		representativeId: '10382',
		representationFrom: 'AGENT',
		registerFor: undefined,
		dateReceived: '2023-03-14T14:28:25.704Z',
		attachmentIds: [],
		redactedRepresentation: 'redacted version'
	}
];

const mockDate = new Date('2023-01-02');

describe('Patch Application Representation Status', () => {
	beforeAll(() => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[0]);
		databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);
		databaseConnector.representation.findUnique.mockResolvedValue(existingRepresentations[0]);
		databaseConnector.representation.update.mockResolvedValue();
		databaseConnector.representationAction.create.mockResolvedValue();
		jest.useFakeTimers({ doNotFake: ['performance'] }).setSystemTime(mockDate);
	});
	afterEach(() => jest.clearAllMocks());

	it('Patch representation status', async () => {
		const response = await request
			.patch('/applications/1/representations/1/status')
			.send({
				actionBy: 'a person',
				status: 'INVALID',
				invalidReason: 'Duplicate',
				notes: 'the rep has been redacted',
				updatedBy: 'jim bo'
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			data: { status: 'INVALID' },
			where: { id: 1 }
		});
		expect(databaseConnector.representationAction.create).toHaveBeenCalledWith({
			data: {
				actionBy: 'jim bo',
				actionDate: mockDate,
				invalidReason: 'Duplicate',
				notes: 'the rep has been redacted',
				previousStatus: 'VALID',
				representationId: 1,
				status: 'INVALID',
				type: 'STATUS'
			}
		});

		// check event broadcast
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'nsip-representation',
			expectedRepresentationUpdatePayload,
			'Update'
		);

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			repId: 1
		});
	});

	it('Patch representation status - invalid request - missing mandatory field', async () => {
		const response = await request
			.patch('/applications/1/representations/1/status')
			.send({})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				status: 'Invalid value',
				updatedBy: 'is a required field'
			}
		});
	});

	it('Patch representation status - invalid request - status = INVALID', async () => {
		const response = await request
			.patch('/applications/1/representations/1/status')
			.send({
				updatedBy: 'a person',
				status: 'INVALID'
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				status: 'INVALID status requires invalidReason'
			}
		});
	});

	it('Patch representation status - invalid request - status = REFERRED', async () => {
		const response = await request
			.patch('/applications/1/representations/1/status')
			.send({
				updatedBy: 'a person',
				status: 'REFERRED'
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				status: 'REFERRED status requires referredTo'
			}
		});
	});

	it('Patch representation status - invalid request - status, invalidReason, referredTo', async () => {
		const response = await request
			.patch('/applications/1/representations/1/status')
			.send({
				updatedBy: 'a person',
				invalidReason: 'i did not feel like it',
				referredTo: 'myself'
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				status: 'Invalid value',
				invalidReason: 'Must be a valid: Duplicate,Merged,Not relevant,Resubmitted,Test',
				referredTo: 'Must be a valid: Case Team,Inspector,Central Admin Team,Interested Party'
			}
		});
	});

	it('Patch representation status from PUBLISHED to VALID', async () => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[1]);

		const response = await request
			.patch('/applications/1/representations/2/status')
			.send({
				status: 'VALID',
				notes: 'unpublishing rep',
				updatedBy: 'jim bo'
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			data: { status: 'VALID', unpublishedUpdates: false },
			where: { id: 2 }
		});
		expect(databaseConnector.representationAction.create).toHaveBeenCalledWith({
			data: {
				actionBy: 'jim bo',
				actionDate: mockDate,
				notes: 'unpublishing rep',
				previousStatus: 'PUBLISHED',
				representationId: 2,
				status: 'VALID',
				type: 'STATUS'
			}
		});
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'nsip-representation',
			expectedRepresentationUpdatePayload,
			'Update'
		);
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			repId: 2
		});
	});
});
