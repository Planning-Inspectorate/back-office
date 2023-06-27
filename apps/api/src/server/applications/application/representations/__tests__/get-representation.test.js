import { request } from '../../../../app-test.js';
const { databaseConnector } = await import('../../../../utils/database-connector.js');

const existingRepresentations = [
	{
		id: 1,
		reference: 'BC0110001-2',
		status: 'VALID',
		redacted: true,
		received: '2023-03-14T14:28:25.704Z'
	}
];

describe('Get Application Representation', () => {
	it('gets rep for a case by id', async () => {
		databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);

		const response = await request.get('/applications/1/representations/1');

		expect(response.status).toEqual(200);
		expect(response.body).toEqual(existingRepresentations[0]);
	});
	it('gets rep with no id', async () => {
		databaseConnector.representation.findMany.mockResolvedValue({});

		const response = await request.get('/applications/1/representations/1');

		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: {
				repId: 'Must be an existing representation'
			}
		});
	});
});
