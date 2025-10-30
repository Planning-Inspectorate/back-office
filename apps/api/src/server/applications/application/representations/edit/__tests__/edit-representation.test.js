// apps/api/src/server/applications/application/representations/edit/__tests__/edit-representation.test.js
import { jest } from '@jest/globals';
import { request } from '#app-test';
import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_REPRESENTATION } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';
import { buildPayloadEventsForSchema } from '#utils/schema-test-utils.js';

const { databaseConnector } = await import('#utils/database-connector.js');

const existingRepresentation = {
	id: 1,
	caseId: 200,
	reference: 'BC0110001-2',
	status: 'VALID',
	redacted: false,
	received: new Date('2023-03-14T14:28:25.704Z'),
	originalRepresentation: 'the original representation',
	editedRepresentation: null,
	editNotes: null,
	redactedRepresentation: null,
	case: { id: 1, reference: 'BC0110001' },
	type: 'Members of the public/businesses',
	representedType: 'AGENT',
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
};

const mockDate = new Date('2023-01-02');

const repUpdatePayload = buildPayloadEventsForSchema(NSIP_REPRESENTATION, {
	attachmentIds: [],
	caseId: 200,
	caseRef: 'BC0110001',
	dateReceived: '2023-03-14T14:28:25.704Z',
	examinationLibraryRef: '',
	originalRepresentation: 'the original representation',
	editedRepresentation: null,
	editNotes: null,
	redactedRepresentation: null,
	redacted: false,
	referenceId: 'BC0110001-2',
	representationId: 1,
	status: 'valid',
	registerFor: null,
	representationFrom: 'AGENT',
	representationType: 'Members of the Public/Businesses',
	representativeId: '10382',
	representedId: '10381'
})[0];

describe('Patch Application Representation Edit', () => {
	beforeAll(() => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentation);
		databaseConnector.representation.update.mockResolvedValue(existingRepresentation);
		databaseConnector.representationAction.create.mockResolvedValue(existingRepresentation);
		databaseConnector.representation.findUnique.mockResolvedValue(existingRepresentation);
		jest.useFakeTimers({ doNotFake: ['performance'] }).setSystemTime(mockDate);
	});
	afterEach(() => jest.clearAllMocks());

	it('Patch representation edit - valid request', async () => {
		const response = await request
			.patch('/applications/1/representations/1/edit')
			.send({
				actionBy: 'a person',
				editedRepresentation: 'Edited text',
				editNotes: 'Some notes'
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			data: {
				editedRepresentation: 'Edited text',
				editNotes: 'Some notes'
			},
			where: { id: 1 }
		});

		expect(databaseConnector.representationAction.create).toHaveBeenCalledWith({
			data: {
				actionBy: 'a person',
				actionDate: mockDate,
				notes: 'Some notes',
				previousRedactStatus: false,
				redactStatus: false,
				representationId: 1,
				type: 'EDIT'
			}
		});
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			editedRepresentation: 'Edited text',
			repId: 1
		});

		// just check the broadcast was sent;  don't expect it to with updated information because we are mocking
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_REPRESENTATION,
			[repUpdatePayload],
			EventType.Update
		);
	});

	it('Patch representation edit - invalid request - missing mandatory field', async () => {
		const response = await request
			.patch('/applications/1/representations/1/edit')
			.send({})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				editedRepresentation: 'is a mandatory field',
				actionBy: 'is a mandatory field'
			}
		});
	});
});
