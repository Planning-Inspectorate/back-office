import { request } from '../../../app-test.js';
import {
	ERROR_CANNOT_BE_EMPTY_STRING,
	ERROR_FAILED_TO_SAVE_DATA,
	ERROR_MAX_LENGTH_CHARACTERS,
	ERROR_MUST_BE_NUMBER,
	ERROR_MUST_BE_STRING,
	ERROR_NOT_FOUND,
	LENGTH_300,
	LENGTH_8
} from '../../constants.js';
import { azureAdUserId, householdAppeal } from '#tests/data.js';
import stringTokenReplacement from '#utils/string-token-replacement.js';

const { databaseConnector } = await import('#utils/database-connector.js');

describe('addresses routes', () => {
	describe('/appeals/:appealId/addresses/:addressId', () => {
		describe('GET', () => {
			test('gets a single address', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.get(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					addressId: householdAppeal.address.id,
					addressLine1: householdAppeal.address.addressLine1,
					addressLine2: householdAppeal.address.addressLine2,
					country: householdAppeal.address.addressCountry,
					county: householdAppeal.address.addressCounty,
					postcode: householdAppeal.address.postcode,
					town: householdAppeal.address.addressTown
				});
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request
					.get(`/appeals/one/addresses/${householdAppeal.address.id}`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if appealId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(null);

				const response = await request
					.get(`/appeals/3/addresses/${householdAppeal.address.id}`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if addressId is not numeric', async () => {
				const response = await request
					.get(`/appeals/${householdAppeal.id}/addresses/one`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						addressId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if addressId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.get(`/appeals/${householdAppeal.id}/addresses/3`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						addressId: ERROR_NOT_FOUND
					}
				});
			});
		});

		describe('PATCH', () => {
			const patchBody = {
				addressLine1: householdAppeal.address.addressLine1,
				addressLine2: householdAppeal.address.addressLine2,
				country: householdAppeal.address.addressCountry,
				county: householdAppeal.address.addressCounty,
				postcode: householdAppeal.address.postcode,
				town: householdAppeal.address.addressTown
			};
			const dataToSave = {
				addressLine1: patchBody.addressLine1,
				addressLine2: patchBody.addressLine2,
				addressCountry: patchBody.country,
				addressCounty: patchBody.county,
				postcode: patchBody.postcode,
				addressTown: patchBody.town
			};

			test('updates an address', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send(patchBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.address.update).toHaveBeenCalledWith({
					data: dataToSave,
					where: {
						id: householdAppeal.address.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(patchBody);
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request
					.patch(`/appeals/one/addresses/${householdAppeal.address.id}`)
					.send(patchBody)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if appealId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(null);

				const response = await request
					.patch(`/appeals/3/addresses/${householdAppeal.address.id}`)
					.send(patchBody)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if addressId is not numeric', async () => {
				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/one`)
					.send(patchBody)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						addressId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if addressId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/3`)
					.send(patchBody)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						addressId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if addressLine1 is not a string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						addressLine1: [patchBody.addressLine1]
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						addressLine1: ERROR_MUST_BE_STRING
					}
				});
			});

			test('returns an error if addressLine1 is an empty string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						addressLine1: ''
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						addressLine1: ERROR_CANNOT_BE_EMPTY_STRING
					}
				});
			});

			test('returns an error if addressLine1 is more than 300 characters', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						addressLine1: 'A'.repeat(LENGTH_300 + 1)
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						addressLine1: stringTokenReplacement(ERROR_MAX_LENGTH_CHARACTERS, [LENGTH_300])
					}
				});
			});

			test('returns an error if addressLine2 is not a string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						addressLine2: [patchBody.addressLine2]
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						addressLine2: ERROR_MUST_BE_STRING
					}
				});
			});

			test('returns an error if addressLine2 is an empty string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						addressLine2: ''
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						addressLine2: ERROR_CANNOT_BE_EMPTY_STRING
					}
				});
			});

			test('returns an error if addressLine2 is more than 300 characters', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						addressLine2: 'A'.repeat(LENGTH_300 + 1)
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						addressLine2: stringTokenReplacement(ERROR_MAX_LENGTH_CHARACTERS, [LENGTH_300])
					}
				});
			});

			test('returns an error if country is not a string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						country: [patchBody.country]
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						country: ERROR_MUST_BE_STRING
					}
				});
			});

			test('returns an error if country is an empty string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						country: ''
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						country: ERROR_CANNOT_BE_EMPTY_STRING
					}
				});
			});

			test('returns an error if country is more than 300 characters', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						country: 'A'.repeat(LENGTH_300 + 1)
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						country: stringTokenReplacement(ERROR_MAX_LENGTH_CHARACTERS, [LENGTH_300])
					}
				});
			});

			test('returns an error if county is not a string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						county: [patchBody.county]
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						county: ERROR_MUST_BE_STRING
					}
				});
			});

			test('returns an error if county is an empty string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						county: ''
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						county: ERROR_CANNOT_BE_EMPTY_STRING
					}
				});
			});

			test('returns an error if county is more than 300 characters', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						county: 'A'.repeat(LENGTH_300 + 1)
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						county: stringTokenReplacement(ERROR_MAX_LENGTH_CHARACTERS, [LENGTH_300])
					}
				});
			});

			test('returns an error if postcode is not a string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						postcode: [patchBody.postcode]
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						postcode: ERROR_MUST_BE_STRING
					}
				});
			});

			test('returns an error if postcode is an empty string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						postcode: ''
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						postcode: ERROR_CANNOT_BE_EMPTY_STRING
					}
				});
			});

			test('returns an error if postcode is more than 8 characters', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						postcode: 'A'.repeat(LENGTH_8 + 1)
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						postcode: stringTokenReplacement(ERROR_MAX_LENGTH_CHARACTERS, [LENGTH_8])
					}
				});
			});

			test('returns an error if town is not a string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						town: [patchBody.town]
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						town: ERROR_MUST_BE_STRING
					}
				});
			});

			test('returns an error if town is an empty string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						town: ''
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						town: ERROR_CANNOT_BE_EMPTY_STRING
					}
				});
			});

			test('returns an error if town is more than 300 characters', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({
						town: 'A'.repeat(LENGTH_300 + 1)
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						town: stringTokenReplacement(ERROR_MAX_LENGTH_CHARACTERS, [LENGTH_300])
					}
				});
			});

			test('does not return an error when given an empty body', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send({})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({});
			});

			test('returns an error when unable to save the data', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.address.update.mockImplementation(() => {
					throw new Error('Internal Server Error');
				});

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/addresses/${householdAppeal.address.id}`)
					.send(patchBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.address.update).toHaveBeenCalledWith({
					data: dataToSave,
					where: {
						id: householdAppeal.address.id
					}
				});
				expect(response.status).toEqual(500);
				expect(response.body).toEqual({
					errors: {
						body: ERROR_FAILED_TO_SAVE_DATA
					}
				});
			});
		});
	});
});
