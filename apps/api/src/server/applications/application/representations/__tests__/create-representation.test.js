import supertest from 'supertest';
import { app } from '../../../../app-test.js';
const { databaseConnector } = await import('../../../../utils/database-connector.js');

const request = supertest(app);

const createdRepresentation = {
	id: 1,
	reference: '',
	caseId: 1,
	status: 'DRAFT',
	originalRepresentation: '',
	redactedRepresentation: null,
	redacted: false,
	userId: null,
	received: '2023-05-11T09:57:06.139Z'
};

describe('Create Representation', () => {
	it('creates new representation with represented first and last names', async () => {
		// GIVEN
		databaseConnector.representation.create.mockResolvedValue(createdRepresentation);

		const updatedRepresentation = createdRepresentation;

		updatedRepresentation.reference = 'B0000001';
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
				caseId: 1,
				status: 'DRAFT',
				originalRepresentation: '',
				redacted: false,
				received: '2023-05-11T09:57:06.139Z',
				contacts: {
					create: [
						{
							firstName: 'Joe',
							lastName: 'Bloggs',
							under18: false,
							type: 'PERSON',
							address: {
								create: {}
							}
						}
					]
				}
			}
		});

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				reference: 'B0000001'
			}
		});
	});

	it('creates a new representation with represented and representative', async () => {
		// GIVEN
		databaseConnector.representation.create.mockResolvedValue(createdRepresentation);

		const updatedRepresentation = createdRepresentation;

		updatedRepresentation.reference = 'B0000001';
		databaseConnector.representation.update.mockResolvedValue(updatedRepresentation);

		// WHEN
		const response = await request.post('/applications/1/representations').send({
			received: '2023-05-11T09:57:06.139Z',
			originalRepresentation: 'This is a rep',
			represented: {
				firstName: 'Joe',
				lastName: 'Bloggs',
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
				caseId: 1,
				status: 'DRAFT',
				originalRepresentation: 'This is a rep',
				redacted: false,
				received: '2023-05-11T09:57:06.139Z',
				contacts: {
					create: [
						{
							firstName: 'Joe',
							lastName: 'Bloggs',
							under18: true,
							type: 'PERSON',
							address: {
								create: {
									addressLine1: 'Test Address'
								}
							}
						},
						{
							firstName: 'John',
							lastName: 'Smith',
							under18: false,
							type: 'AGENT',
							address: {
								create: {
									addressLine1: 'Test Address1',
									postcode: 'XX1 9XX'
								}
							}
						}
					]
				}
			}
		});

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				reference: 'B0000001'
			}
		});
	});

	it('Mandatory firstname not provided', async () => {
		// GIVEN

		// WHEN
		const response = await request.post('/applications/1/representations').send({
			received: '2023-05-11T09:57:06.139Z',
			originalRepresentation: 'This is a rep',
			represented: {
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
