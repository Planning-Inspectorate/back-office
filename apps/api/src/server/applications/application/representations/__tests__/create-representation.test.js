import { request } from '#app-test';
import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_REPRESENTATION, SERVICE_USER } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';
import { buildPayloadEventsForSchema } from '#utils/schema-test-utils.js';

const { databaseConnector } = await import('#utils/database-connector.js');

const serviceUserCreatePayload = buildPayloadEventsForSchema(SERVICE_USER, [
	{
		id: '10381',
		firstName: 'Joe',
		lastName: 'Bloggs',
		sourceSuid: '10381',
		caseReference: 'BC0110001',
		sourceSystem: 'back-office-applications',
		serviceUserType: 'RepresentationContact'
	},
	{
		id: '10382',
		firstName: 'John',
		lastName: 'Smith',
		addressLine1: 'TestAddress1',
		postcode: 'XX1 9XX',
		sourceSuid: '10382',
		caseReference: 'BC0110001',
		sourceSystem: 'back-office-applications',
		serviceUserType: 'RepresentationContact'
	}
]);

const createdRepresentation = {
	id: 1,
	reference: null,
	caseId: 1,
	represented: {
		id: '100000001'
	},
	status: 'DRAFT',
	originalRepresentation: 'the original representation',
	redacted: false,
	userId: null,
	received: new Date('2023-05-11T09:57:06.139Z')
};

const createdRepresentationFullDetails = {
	...createdRepresentation,
	reference: 'B0000001',
	case: { id: 1, reference: 'BC0110001' },
	attachments: []
};

const rep1CreateMsgPayload = buildPayloadEventsForSchema(NSIP_REPRESENTATION, {
	representationId: 1,
	referenceId: 'B0000001',
	registerFor: null,
	representationFrom: 'AGENT',
	examinationLibraryRef: '',
	caseRef: 'BC0110001',
	caseId: 1,
	status: 'draft',
	redacted: false,
	originalRepresentation: 'the original representation',
	representationType: null,
	representativeId: '10382',
	representedId: '10381',
	dateReceived: '2023-05-11T09:57:06.139Z',
	attachmentIds: []
})[0];

const representedRec = {
	id: 10381,
	representationId: 6579,
	representedId: '100000001',
	firstName: 'Joe',
	lastName: 'Bloggs',
	jobTitle: null,
	under18: true,
	organisationName: null,
	email: null,
	phoneNumber: null,
	contactMethod: null,
	address: {
		id: 17059,
		addressLine1: null,
		addressLine2: null,
		postcode: null,
		county: null,
		town: null,
		country: null
	}
};

const representativeRec = {
	id: 10382,
	representationId: 6579,
	firstName: 'John',
	lastName: 'Smith',
	jobTitle: null,
	under18: false,
	organisationName: null,
	email: null,
	phoneNumber: null,
	contactMethod: null,
	address: {
		id: 17060,
		addressLine1: 'TestAddress1',
		addressLine2: null,
		postcode: 'XX1 9XX',
		county: null,
		town: null,
		country: null
	}
};

describe('Create Representation', () => {
	it('creates new representation with represented first and last names', async () => {
		// GIVEN
		databaseConnector.representation.create.mockResolvedValue(createdRepresentation);

		const updatedRepresentation = createdRepresentation;

		updatedRepresentation.reference = 'B0000001';
		databaseConnector.representation.findUnique.mockResolvedValue(createdRepresentationFullDetails);
		databaseConnector.representation.update.mockResolvedValue(updatedRepresentation);

		// WHEN
		const response = await request.post('/applications/1/representations').send({
			received: new Date('2023-05-11T09:57:06.139Z'),
			represented: {
				firstName: 'Joe',
				lastName: 'Bloggs'
			}
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ id: 1, status: 'DRAFT' });

		expect(databaseConnector.representation.create).toHaveBeenCalledWith({
			data: {
				reference: '',
				case: { connect: { id: 1 } },
				status: 'DRAFT',
				originalRepresentation: '',
				editedRepresentation: '',
				editNotes: '',
				redacted: false,
				received: '2023-05-11T09:57:06.139Z',
				represented: {
					create: {
						firstName: 'Joe',
						lastName: 'Bloggs',
						address: {
							create: {}
						}
					}
				},
				representedType: undefined,
				type: undefined
			}
		});

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				reference: 'B0000001'
			}
		});

		expect(eventClient.sendEvents).not.toHaveBeenCalled();
	});

	it('creates a new representation with represented and representative', async () => {
		// GIVEN
		const createdRepresentationFullDetailsWithUsers = {
			...createdRepresentationFullDetails,
			representative: representativeRec,
			represented: representedRec
		};

		databaseConnector.representation.create.mockResolvedValue(createdRepresentation);

		const updatedRepresentation = createdRepresentation;

		updatedRepresentation.reference = 'B0000001';
		databaseConnector.representation.update.mockResolvedValue(updatedRepresentation);
		databaseConnector.representation.findUnique.mockResolvedValue(
			createdRepresentationFullDetailsWithUsers
		);

		// WHEN
		const response = await request.post('/applications/1/representations').send({
			received: new Date('2023-05-11T09:57:06.139Z'),
			originalRepresentation: 'This is a rep',
			represented: {
				firstName: 'Jim',
				lastName: '',
				under18: true,
				address: {
					addressLine1: 'Test Address'
				}
			},
			representative: {
				firstName: 'John',
				lastName: 'Smith',
				address: {
					addressLine1: 'Test Address1',
					postcode: 'XX1 9XX'
				}
			}
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ id: 1, status: 'DRAFT' });

		expect(databaseConnector.representation.create).toHaveBeenCalledWith({
			data: {
				reference: '',
				case: { connect: { id: 1 } },
				representedType: undefined,
				status: 'DRAFT',
				type: undefined,
				originalRepresentation: 'This is a rep',
				editedRepresentation: '',
				editNotes: '',
				redacted: false,
				received: '2023-05-11T09:57:06.139Z',
				represented: {
					create: {
						firstName: 'Jim',
						lastName: '',
						under18: true,
						address: {
							create: {
								addressLine1: 'Test Address'
							}
						}
					}
				},
				representative: {
					create: {
						firstName: 'John',
						lastName: 'Smith',
						address: {
							create: {
								addressLine1: 'Test Address1',
								postcode: 'XX1 9XX'
							}
						}
					}
				}
			}
		});

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				reference: 'B0000001'
			}
		});

		expect(eventClient.sendEvents).not.toHaveBeenCalled();
	});

	it('sends create event when status changes from DRAFT to AWAITING_REVIEW', async () => {
		// GIVEN
		const currentRepresentation = { ...createdRepresentation, reference: 'B0000001' };

		const updatedRepresentation = { ...currentRepresentation, status: 'AWAITING_REVIEW' };

		const createdRepresentationFullDetailsWithUsers = {
			...createdRepresentationFullDetails,
			representative: representativeRec,
			represented: representedRec,
			representedType: 'AGENT'
		};

		databaseConnector.representation.findFirst
			.mockResolvedValueOnce(currentRepresentation)
			.mockResolvedValueOnce(updatedRepresentation);
		databaseConnector.representation.update.mockResolvedValue(updatedRepresentation);

		databaseConnector.representation.findUnique.mockResolvedValue(
			createdRepresentationFullDetailsWithUsers
		);

		// WHEN
		const response = await request.patch(`/applications/1/representations/10381`).send({
			status: 'AWAITING_REVIEW'
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ id: 1, status: 'AWAITING_REVIEW' });

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			data: {
				status: 'AWAITING_REVIEW'
			},
			where: { id: 10381 }
		});

		expect(eventClient.sendEvents).toHaveBeenCalledTimes(2);

		// test event broadcasts
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_REPRESENTATION,
			[rep1CreateMsgPayload],
			EventType.Create
		);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			SERVICE_USER,
			buildPayloadEventsForSchema(SERVICE_USER, serviceUserCreatePayload),
			EventType.Create,
			{
				entityType: 'RepresentationContact'
			}
		);
	});

	it('Mandatory firstname not provided', async () => {
		// GIVEN

		// WHEN
		const response = await request.post('/applications/1/representations').send({
			received: new Date('2023-05-11T09:57:06.139Z'),
			originalRepresentation: 'This is a rep',
			represented: {
				firstName: '',
				lastName: 'Bloggs'
			}
		});

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({ errors: { 'represented.firstName': 'Invalid value' } });
	});

	it('Invalid Case Id in URL', async () => {
		// GIVEN

		// WHEN
		const response = await request.post('/applications/BAD_ID/representations').send({
			received: new Date('2023-05-11T09:57:06.139Z'),
			originalRepresentation: 'This is a rep',
			represented: {
				firstName: 'Joe',
				lastName: 'Bloggs'
			}
		});

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: { id: 'Application id must be a valid numerical value' }
		});
	});
});
