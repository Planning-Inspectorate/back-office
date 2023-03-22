import supertest from 'supertest';
import { app } from '../../../app.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const existingRepresentations = [
	{
		id: 1,
		reference: 'BC0110001-2',
		status: 'VALID',
		originalRepresentation: 'I wish to object to this planning application.',
		redactedRepresentation: 'I wish to object to this planning application',
		redacted: true,
		received: '2023-03-14T14:28:25.704Z'
	},
	{
		id: 2,
		reference: 'BC0110001-2',
		status: 'INVALID',
		originalRepresentation: 'I wish to object to this planning application.',
		redacted: false,
		received: '2023-03-15T15:18:25.704Z'
	}
];

describe('Get Application Representations', () => {
	it('gets all reps for a case', async () => {
		databaseConnector.representation.count.mockResolvedValue(2);
		databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);

		const response = await request.get('/applications/1/representations');

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			page: 1,
			pageSize: 25,
			pageCount: 1,
			itemCount: 2,
			items: existingRepresentations
		});
	});
});
