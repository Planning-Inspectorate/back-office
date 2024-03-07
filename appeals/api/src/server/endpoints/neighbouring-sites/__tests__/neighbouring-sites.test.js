import { request } from '#tests/../app-test.js';
import { jest } from '@jest/globals';
import { azureAdUserId } from '#tests/shared/mocks.js';
import { householdAppeal } from '#tests/appeals/mocks.js';

const { databaseConnector } = await import('#utils/database-connector.js');
const validAddress = {
	addressLine1: 'addressLine1',
	town: 'London',
	postcode: 'W6 0XL'
};
const addressWithInvalidPostcode = {
	...validAddress,
	postcode: 'XXXXXXXXXX'
};
const addressWithMissingRequiredFields = {
	...validAddress,
	addressLine1: null
};

const appealWithNeighbouringSites = {
	...householdAppeal,
	neighbouringSites: [
		{
			id: 1,
			appealId: 1,
			addressId: 5
		}
	]
};

describe('appeal neighbouring sites routes', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('invalid requests', () => {
		test('returns 404 when the appeal is not found', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(null);
			const response = await request
				.post(`/appeals/0/neighbouring-sites`)
				.send(validAddress)
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(404);
		});

		test('returns 400 when creating a neighbouring site and the address is missing required fields', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
			const response = await request
				.post(`/appeals/${householdAppeal.id}/neighbouring-sites`)
				.send(addressWithMissingRequiredFields)
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
		});

		test('returns 400 when creating a neighbouring site and the address has a postcode not matching the regex', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
			const response = await request
				.post(`/appeals/${householdAppeal.id}/neighbouring-sites`)
				.send(addressWithInvalidPostcode)
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
		});

		test('returns 400 when updating a neighbouring site and the address is missing required fields', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(appealWithNeighbouringSites);
			// @ts-ignore
			databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
			const response = await request
				.patch(`/appeals/${householdAppeal.id}/neighbouring-sites`)
				.send({
					siteId: 1,
					address: addressWithMissingRequiredFields
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
		});

		test('returns 400 when updating a neighbouring site and the address has a postcode not matching the regex', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(appealWithNeighbouringSites);
			// @ts-ignore
			databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
			const response = await request
				.patch(`/appeals/${householdAppeal.id}/neighbouring-sites`)
				.send({
					siteId: 1,
					address: addressWithInvalidPostcode
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
		});

		test('returns 404 when updating a neighbouring site with an invalid siteId', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(appealWithNeighbouringSites);
			// @ts-ignore
			databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
			// @ts-ignore
			databaseConnector.$transaction = jest.fn().mockImplementation((callback) =>
				// @ts-ignore
				callback({
					neighbouringSite: {
						// @ts-ignore
						findUnique: jest.fn().mockResolvedValue(null),
						// @ts-ignore
						update: jest.fn().mockResolvedValueOnce(false)
					}
				})
			);

			const response = await request
				.patch(`/appeals/${householdAppeal.id}/neighbouring-sites`)
				.send({
					siteId: 0,
					address: validAddress
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(404);
			expect(databaseConnector.$transaction).toHaveBeenCalledTimes(1);
		});

		test('returns 404 when deleting a neighbouring site with an invalid siteId', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(appealWithNeighbouringSites);
			// @ts-ignore
			databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
			// @ts-ignore
			databaseConnector.$transaction = jest.fn().mockImplementation((callback) =>
				// @ts-ignore
				callback({
					neighbouringSite: {
						// @ts-ignore
						findUnique: jest.fn().mockResolvedValue(null),
						// @ts-ignore
						delete: jest.fn().mockResolvedValueOnce(false)
					}
				})
			);

			const response = await request
				.delete(`/appeals/${householdAppeal.id}/neighbouring-sites`)
				.send({
					siteId: 0
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(404);
			expect(databaseConnector.$transaction).toHaveBeenCalledTimes(1);
		});
	});

	describe('valid requests', () => {
		test('returns 200 when creating a neighbouring site with a valid address', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(appealWithNeighbouringSites);
			// @ts-ignore
			databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
			// @ts-ignore
			databaseConnector.neighbouringSite.create.mockResolvedValue({});

			const response = await request
				.post(`/appeals/${householdAppeal.id}/neighbouring-sites`)
				.send(validAddress)
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(200);
			expect(databaseConnector.neighbouringSite.create).toHaveBeenCalledTimes(1);
			expect(databaseConnector.neighbouringSite.create).toHaveBeenCalledWith({
				data: {
					appeal: {
						connect: { id: householdAppeal.id }
					},
					address: {
						create: {
							addressLine1: validAddress.addressLine1,
							addressTown: validAddress.town,
							postcode: validAddress.postcode
						}
					}
				},
				include: {
					address: true
				}
			});
		});

		test('returns 200 when updating a neighbouring site with a valid address', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(appealWithNeighbouringSites);
			// @ts-ignore
			databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
			// @ts-ignore
			databaseConnector.$transaction = jest.fn().mockImplementation((callback) =>
				// @ts-ignore
				callback({
					neighbouringSite: {
						// @ts-ignore
						findUnique: jest
							.fn()
							.mockResolvedValue(appealWithNeighbouringSites.neighbouringSites[0]),
						// @ts-ignore
						update: jest.fn().mockResolvedValueOnce(true)
					},
					address: {
						// @ts-ignore
						update: jest.fn().mockResolvedValueOnce({})
					}
				})
			);

			const response = await request
				.patch(`/appeals/${householdAppeal.id}/neighbouring-sites`)
				.send({
					siteId: 1,
					address: validAddress
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(200);
			expect(databaseConnector.$transaction).toHaveBeenCalledTimes(1);
		});

		test('returns 200 when deleting a neighbouring site with a valid siteId', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(appealWithNeighbouringSites);
			// @ts-ignore
			databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
			// @ts-ignore
			databaseConnector.$transaction = jest.fn().mockImplementation((callback) =>
				// @ts-ignore
				callback({
					neighbouringSite: {
						// @ts-ignore
						findUnique: jest
							.fn()
							.mockResolvedValue(appealWithNeighbouringSites.neighbouringSites[0]),
						// @ts-ignore
						delete: jest.fn().mockResolvedValueOnce(true)
					},
					address: {
						// @ts-ignore
						delete: jest.fn().mockResolvedValueOnce({})
					}
				})
			);

			const response = await request
				.delete(`/appeals/${householdAppeal.id}/neighbouring-sites`)
				.send({
					siteId: 1
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(200);
			expect(databaseConnector.$transaction).toHaveBeenCalledTimes(1);
		});
	});
});
