import { request } from '#app-test';
import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_REPRESENTATION, SERVICE_USER } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';

const { databaseConnector } = await import('#utils/database-connector.js');

const serviceUserCreatePayload = [
	{
		id: '10381',
		firstName: 'Joe',
		lastName: 'Bloggs',
		addressLine1: '',
		addressLine2: null,
		addressTown: null,
		addressCounty: null,
		addressCountry: null,
		postcode: null,
		organisation: null,
		role: null,
		telephoneNumber: null,
		emailAddress: null,
		serviceUserType: 'RepresentationContact',
		sourceSuid: '10381'
	},
	{
		id: '10382',
		firstName: 'John',
		lastName: 'Smith',
		addressLine1: 'TestAddress1',
		addressLine2: null,
		addressTown: null,
		addressCounty: null,
		addressCountry: null,
		postcode: 'XX1 9XX',
		organisation: null,
		role: null,
		telephoneNumber: null,
		emailAddress: null,
		serviceUserType: 'RepresentationContact',
		sourceSuid: '10382'
	}
];

const createdRepresentation = {
	id: 1,
	reference: '',
	caseId: 1,
	status: 'DRAFT',
	originalRepresentation: 'the original representation',
	redactedRepresentation: null,
	redacted: false,
	userId: null,
	received: '2023-05-11T09:57:06.139Z'
};

const createdRepresentationFullDetails = {
	...createdRepresentation,
	reference: 'B0000001',
	case: { id: 1, reference: 'BC0110001' },
	attachments: []
};

const rep1CreateMsgPayload = {
	representationId: 1,
	referenceId: 'B0000001',
	examinationLibraryRef: '',
	caseRef: 'BC0110001',
	caseId: 1,
	status: 'DRAFT',
	redacted: false,
	originalRepresentation: 'the original representation',
	representationType: undefined,
	representedId: undefined,
	representativeId: undefined,
	representationFrom: undefined,
	registerFor: undefined,
	dateReceived: '2023-05-11T09:57:06.139Z',
	attachmentIds: []
};

const representedRec = {
	id: 10381,
	representationId: 6579,
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
		addressLine1: '',
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
			received: '2023-05-11T09:57:06.139Z',
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

		// test event broadcasts
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_REPRESENTATION,
			rep1CreateMsgPayload,
			EventType.Create
		);
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(2, SERVICE_USER, [], EventType.Create, {
			entityType: 'RepresentationContact'
		});
	});

	it('creates a new representation with represented and representative', async () => {
		// GIVEN
		const createdRepresentationFullDetailsWithUsers = {
			...createdRepresentationFullDetails,
			representative: representativeRec,
			represented: representedRec
		};
		const rep1CreateMsgPayloadWithUsers = {
			...rep1CreateMsgPayload,
			representationFrom: 'AGENT',
			representativeId: '10382',
			representedId: '10381'
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
			received: '2023-05-11T09:57:06.139Z',
			originalRepresentation: 'This is a rep',
			represented: {
				firstName: 'Joe',
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
				status: 'DRAFT',
				originalRepresentation: 'This is a rep',
				redacted: false,
				received: '2023-05-11T09:57:06.139Z',
				represented: {
					create: {
						firstName: 'Joe',
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

		// test event broadcasts
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			3,
			NSIP_REPRESENTATION,
			rep1CreateMsgPayloadWithUsers,
			EventType.Create
		);
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			4,
			SERVICE_USER,
			serviceUserCreatePayload,
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
			received: '2023-05-11T09:57:06.139Z',
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
			received: '2023-05-11T09:57:06.139Z',
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
