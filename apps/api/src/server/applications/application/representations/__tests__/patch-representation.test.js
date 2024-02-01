import { request } from '#app-test';
import { jest } from '@jest/globals';
import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_REPRESENTATION, SERVICE_USER } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';

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
		representationActions: [
			{
				actionBy: '',
				actionDate: '2022-03-31T23:00:00.000Z',
				invalidReason: '',
				notes: '',
				previousRedactStatus: false,
				previousStatus: 'AWAITING_REVIEW',
				redactStatus: true,
				referredTo: '',
				status: 'VALID',
				type: 'STATUS'
			}
		],
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
		caseId: 200,
		reference: 'BC0110001-3',
		status: 'PUBLISHED',
		redacted: true,
		unpublishedUpdates: false,
		received: '2023-03-14T14:28:25.704Z',
		originalRepresentation: 'the original representation',
		redactedRepresentation: 'redacted version',
		case: { id: 1, reference: 'BC0110001' },
		representationActions: [
			{
				actionBy: '',
				actionDate: '2022-03-31T23:00:00.000Z',
				invalidReason: '',
				notes: '',
				previousRedactStatus: false,
				previousStatus: 'AWAITING_REVIEW',
				redactStatus: true,
				referredTo: '',
				status: 'VALID',
				type: 'STATUS'
			}
		],
		attachments: []
	}
];

const rep1UpdatePayload = [
	{
		attachmentIds: [],
		caseId: 200,
		caseRef: 'BC0110001',
		dateReceived: '2023-03-14T14:28:25.704Z',
		examinationLibraryRef: '',
		originalRepresentation: 'the original representation',
		redactedRepresentation: 'redacted version',
		redacted: true,
		referenceId: 'BC0110001-2',
		representationId: 1,
		status: 'VALID',
		registerFor: undefined,
		representationFrom: 'AGENT',
		representationType: undefined,
		representativeId: '10382',
		representedId: '10381'
	}
];

const serviceUserUpdatePayload = [
	{
		id: '10381',
		firstName: 'Mrs',
		lastName: 'Sue',
		addressLine1: '123 Some Street',
		addressLine2: 'Somewhere Else',
		addressTown: 'Some Town',
		addressCounty: 'A County',
		addressCountry: 'England',
		postcode: 'B1 9BB',
		organisation: null,
		role: null,
		telephoneNumber: '01234 567890',
		emailAddress: 'sue@example.com',
		serviceUserType: 'RepresentationContact',
		sourceSuid: '10381'
	},
	{
		id: '10382',
		firstName: 'James',
		lastName: 'Bond',
		addressLine1: '1 Long Road',
		addressLine2: 'Smallville',
		addressTown: 'Some Town',
		addressCounty: 'A County',
		addressCountry: 'England',
		postcode: 'P7 9LN',
		organisation: null,
		role: null,
		telephoneNumber: '01234 567890',
		emailAddress: 'test-agent@example.com',
		serviceUserType: 'RepresentationContact',
		sourceSuid: '10382'
	}
];

describe('Patch Application Representation', () => {
	beforeAll(() => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[0]);
		databaseConnector.representation.findUnique.mockResolvedValue(existingRepresentations[0]);
	});
	afterEach(() => jest.clearAllMocks());

	it('Patch representation', async () => {
		const response = await request
			.patch('/applications/1/representations/1')
			.send({ originalRepresentation: 'Updated original rep' })
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			data: { originalRepresentation: 'Updated original rep' },
			where: { id: 1 }
		});
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 1,
			status: 'VALID'
		});

		// test event broadcasts
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_REPRESENTATION,
			rep1UpdatePayload,
			EventType.Update
		);
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			SERVICE_USER,
			serviceUserUpdatePayload,
			EventType.Update,
			{
				entityType: 'RepresentationContact'
			}
		);
	});

	it('Patch representation - with represented', async () => {
		const response = await request
			.patch('/applications/1/representations/1')
			.send({
				represented: {
					firstName: 'new name'
				}
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			data: { represented: { update: { firstName: 'new name' } } },
			where: { id: 1 }
		});
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 1,
			status: 'VALID'
		});

		// test event broadcasts
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_REPRESENTATION,
			rep1UpdatePayload,
			EventType.Update
		);
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			SERVICE_USER,
			serviceUserUpdatePayload,
			EventType.Update,
			{
				entityType: 'RepresentationContact'
			}
		);
	});

	it('Patch representation - with represented - address', async () => {
		databaseConnector.representation.findFirst.mockResolvedValue({
			...existingRepresentations[0],
			representedId: 1
		});

		const response = await request
			.patch('/applications/1/representations/1')
			.send({
				represented: {
					address: {
						addressLine1: 'updated address line 1'
					}
				}
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.serviceUser.update).toHaveBeenCalledWith({
			data: {
				address: {
					upsert: {
						create: {
							addressLine1: 'updated address line 1'
						},
						update: {
							addressLine1: 'updated address line 1'
						}
					}
				}
			},
			where: { id: 1 }
		});
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 1,
			status: 'VALID'
		});

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_REPRESENTATION,
			rep1UpdatePayload,
			EventType.Update
		);
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			SERVICE_USER,
			serviceUserUpdatePayload,
			EventType.Update,
			{
				entityType: 'RepresentationContact'
			}
		);
	});

	it('Patch representation - with representative', async () => {
		const response = await request
			.patch('/applications/1/representations/1')
			.send({
				representative: {
					firstName: 'new name'
				}
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			data: {
				representative: {
					upsert: { create: { firstName: 'new name' }, update: { firstName: 'new name' } }
				}
			},
			where: { id: 1 }
		});
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 1,
			status: 'VALID'
		});

		// test event broadcasts
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_REPRESENTATION,
			rep1UpdatePayload,
			EventType.Update
		);
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			SERVICE_USER,
			serviceUserUpdatePayload,
			EventType.Update,
			{
				entityType: 'RepresentationContact'
			}
		);
	});

	it('Patch representation - with representative - address', async () => {
		databaseConnector.representation.findFirst.mockResolvedValue({
			...existingRepresentations[0],
			representativeId: 1
		});

		const response = await request
			.patch('/applications/1/representations/1')
			.send({
				representative: {
					address: {
						addressLine1: 'updated address line 1'
					}
				}
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.serviceUser.update).toHaveBeenCalledWith({
			data: {
				address: {
					upsert: {
						create: {
							addressLine1: 'updated address line 1'
						},
						update: {
							addressLine1: 'updated address line 1'
						}
					}
				}
			},
			where: { id: 1 }
		});
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 1,
			status: 'VALID'
		});

		// test event broadcasts
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_REPRESENTATION,
			rep1UpdatePayload,
			EventType.Update
		);
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			SERVICE_USER,
			serviceUserUpdatePayload,
			EventType.Update,
			{
				entityType: 'RepresentationContact'
			}
		);
	});

	it('Patch published representation - set unpublishedUpdates', async () => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[1]);

		const response = await request
			.patch('/applications/1/representations/2')
			.send({ originalRepresentation: 'Updated original rep' })
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			data: {
				originalRepresentation: 'Updated original rep',
				unpublishedUpdates: true
			},
			where: { id: 2 }
		});
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 2,
			status: 'PUBLISHED'
		});

		// test event broadcasts
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_REPRESENTATION,
			rep1UpdatePayload,
			EventType.Update
		);
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			SERVICE_USER,
			serviceUserUpdatePayload,
			EventType.Update,
			{
				entityType: 'RepresentationContact'
			}
		);
	});
});
