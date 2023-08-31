import { request } from '../../../../app-test.js';

const { databaseConnector } = await import('../../../../utils/database-connector.js');

const existingRepresentations = [
	{
		id: 1,
		caseId: 200,
		reference: 'BC0110001-2',
		status: 'VALID',
		redacted: true,
		received: '2023-03-14T14:28:25.704Z'
	},
	{
		id: 2,
		caseId: 200,
		reference: 'BC0110001-3',
		status: 'PUBLISHED',
		redacted: true,
		unpublishedUpdates: false,
		received: '2023-03-14T14:28:25.704Z'
	}
];

describe('Patch Application Representation', () => {
	beforeAll(() => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[0]);
		databaseConnector.representationContact.findFirst.mockResolvedValue({ id: 1 });
		databaseConnector.representationContact.update.mockResolvedValue();
	});

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
	});

	it('Patch representation contact - with represented', async () => {
		const response = await request
			.patch('/applications/1/representations/1')
			.send({
				represented: {
					firstName: 'new name'
				}
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.representationContact.update).toHaveBeenCalledWith({
			data: { firstName: 'new name' },
			where: { id: 1 }
		});
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 1,
			status: 'VALID'
		});
	});

	it('Patch representation contact - with represented - address', async () => {
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

		expect(databaseConnector.representationContact.update).toHaveBeenCalledWith({
			data: {
				address: {
					update: {
						addressLine1: 'updated address line 1'
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
	});

	it('Patch representation contact - with representative', async () => {
		const response = await request
			.patch('/applications/1/representations/1')
			.send({
				representative: {
					firstName: 'new name'
				}
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.representationContact.update).toHaveBeenCalledWith({
			data: { firstName: 'new name' },
			where: { id: 1 }
		});
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 1,
			status: 'VALID'
		});
	});

	it('Patch representation contact - with representative - address', async () => {
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

		expect(databaseConnector.representationContact.update).toHaveBeenCalledWith({
			data: {
				address: {
					update: {
						addressLine1: 'updated address line 1'
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
	});
});
