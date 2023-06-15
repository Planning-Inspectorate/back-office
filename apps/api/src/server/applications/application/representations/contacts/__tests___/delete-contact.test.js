import supertest from 'supertest';
import { app } from '../../../../../app.js';

const { databaseConnector } = await import('../../../../../utils/database-connector.js');

const request = supertest(app);

const existingRepresentations = [
	{
		id: 1,
		representationId: 200,
		reference: 'BC0110001-2',
		status: 'VALID',
		redacted: true,
		received: '2023-03-14T14:28:25.704Z'
	}
];

describe('Delete Application Representation Contact', () => {
	beforeAll(() => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[0]);
		databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);
	});

	it('Delete representation contact', async () => {
		databaseConnector.representationContact.delete.mockResolvedValue();
		const response = await request
			.delete('/applications/1/representations/1/contacts/1')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			contactId: '1'
		});
	});
});
