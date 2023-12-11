import { request } from '../../../../app-test.js';

const { databaseConnector } = await import('../../../../utils/database-connector.js');

const existingRepresentations = [
	{
		id: 1,
		reference: 'BC0110001-2',
		status: 'VALID',
		redacted: true,
		received: '2023-03-14T14:28:25.704Z'
	},
	{
		id: 2,
		reference: 'BC0110001-2',
		status: 'INVALID',
		redacted: false,
		received: '2023-03-15T15:18:25.704Z'
	},
	{
		id: 3,
		reference: 'BC0110001-3',
		status: 'INVALID',
		redacted: false,
		received: '2023-03-15T15:18:25.704Z'
	},
	{
		id: 4,
		reference: 'BC0110001-4',
		status: 'VALID',
		redacted: false,
		received: '2023-03-15T15:18:25.704Z'
	},
	{
		id: 5,
		reference: 'BC0110001-5',
		status: 'INVALID',
		redacted: false,
		received: '2023-03-15T15:18:25.704Z'
	}
];

describe('Get Application Representations', () => {
	const numberOfRepresentations = existingRepresentations.length;
	const numberOfRepresentationsWhereRepresentedUnder18 = 3;

	beforeEach(() => {
		databaseConnector.representation.count
			.mockResolvedValueOnce(numberOfRepresentations)
			.mockResolvedValueOnce(numberOfRepresentationsWhereRepresentedUnder18);
		databaseConnector.representation.groupBy.mockReturnValueOnce([
			{ _count: { _all: 2 }, status: 'WITHDRAWN' }
		]);
		databaseConnector.representation.findMany.mockReturnValueOnce(existingRepresentations);
	});

	it('gets all reps for a case, defaulting pagination', async () => {
		const response = await request.get('/applications/1/representations');

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			filters: [
				{
					count: 3,
					name: 'UNDER_18'
				},
				{
					count: 2,
					name: 'WITHDRAWN'
				}
			],
			page: 1,
			pageSize: 25,
			pageCount: 1,
			itemCount: 5,
			items: existingRepresentations
		});
	});

	it('gets the second page of results', async () => {
		databaseConnector.representation.count.mockResolvedValue(existingRepresentations.length);
		databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);

		const response = await request.get('/applications/1/representations?pageSize=3&page=2');

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			filters: [
				{
					count: 3,
					name: 'UNDER_18'
				},
				{
					count: 2,
					name: 'WITHDRAWN'
				}
			],
			page: 2,
			pageSize: 3,
			pageCount: 2,
			itemCount: 5,
			items: existingRepresentations
		});
	});

	it('throws if pageSize > 100', async () => {
		databaseConnector.representation.count.mockResolvedValue(existingRepresentations.length);
		databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);

		const response = await request.get('/applications/1/representations?pageSize=103&page=2');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				pageSize: 'Invalid value'
			}
		});
	});

	it('supports a search term', async () => {
		const response = await request.get('/applications/1/representations?searchTerm=hello%20world');

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			filters: [
				{
					count: 3,
					name: 'UNDER_18'
				},
				{
					count: 2,
					name: 'WITHDRAWN'
				}
			],
			page: 1,
			pageSize: 25,
			pageCount: 1,
			itemCount: 5,
			items: existingRepresentations
		});
	});

	it('supports filters', async () => {
		const response = await request.get(
			'/applications/1/representations?under18=true&status=VALID&status=PUBLISHED'
		);

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			filters: [
				{
					count: 3,
					name: 'UNDER_18'
				},
				{
					count: 2,
					name: 'WITHDRAWN'
				}
			],
			page: 1,
			pageSize: 25,
			pageCount: 1,
			itemCount: 5,
			items: existingRepresentations
		});
	});

	it('supports filters - single status', async () => {
		const response = await request.get('/applications/1/representations?status=VALID');

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			filters: [
				{
					count: 3,
					name: 'UNDER_18'
				},
				{
					count: 2,
					name: 'WITHDRAWN'
				}
			],
			page: 1,
			pageSize: 25,
			pageCount: 1,
			itemCount: 5,
			items: existingRepresentations
		});
	});

	it('supports sorting', async () => {
		const response = await request.get('/applications/1/representations?sortBy=reference');

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			filters: [
				{
					count: 3,
					name: 'UNDER_18'
				},
				{
					count: 2,
					name: 'WITHDRAWN'
				}
			],
			page: 1,
			pageSize: 25,
			pageCount: 1,
			itemCount: 5,
			items: existingRepresentations
		});
	});

	it('supports sorting - desc', async () => {
		const response = await request.get('/applications/1/representations?sortBy=-reference');

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			filters: [
				{
					count: 3,
					name: 'UNDER_18'
				},
				{
					count: 2,
					name: 'WITHDRAWN'
				}
			],
			page: 1,
			pageSize: 25,
			pageCount: 1,
			itemCount: 5,
			items: existingRepresentations
		});
	});
});
