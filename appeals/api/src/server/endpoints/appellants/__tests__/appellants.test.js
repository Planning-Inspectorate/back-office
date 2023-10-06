import { request } from '../../../app-test.js';
import {
	ERROR_CANNOT_BE_EMPTY_STRING,
	ERROR_FAILED_TO_SAVE_DATA,
	ERROR_MAX_LENGTH_CHARACTERS,
	ERROR_MUST_BE_NUMBER,
	ERROR_MUST_BE_STRING,
	ERROR_NOT_FOUND,
	LENGTH_300
} from '../../constants.js';
import { azureAdUserId, householdAppeal } from '#tests/data.js';
import stringTokenReplacement from '#utils/string-token-replacement.js';

const { databaseConnector } = await import('#utils/database-connector.js');

describe('appellants routes', () => {
	describe('/appeals/:appealId/appellants/:appellantId', () => {
		describe('GET', () => {
			test('gets a single appellant', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.get(`/appeals/${householdAppeal.id}/appellants/${householdAppeal.appellant.id}`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					appellantId: householdAppeal.appellant.id,
					name: householdAppeal.appellant.name
				});
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request
					.get(`/appeals/one/appellants/${householdAppeal.appellant.id}`)
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
					.get(`/appeals/3/appellants/${householdAppeal.appellant.id}`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if appellantId is not numeric', async () => {
				const response = await request
					.get(`/appeals/${householdAppeal.id}/appellants/one`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appellantId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if appellantId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.get(`/appeals/${householdAppeal.id}/appellants/3`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appellantId: ERROR_NOT_FOUND
					}
				});
			});
		});

		describe('PATCH', () => {
			const patchBody = {
				name: 'Eva Sharma'
			};

			test('updates an appellant', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellants/${householdAppeal.appellant.id}`)
					.send(patchBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellant.update).toHaveBeenCalledWith({
					data: patchBody,
					where: {
						id: householdAppeal.appellant.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(patchBody);
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request
					.patch(`/appeals/one/appellants/${householdAppeal.appellant.id}`)
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
					.patch(`/appeals/3/appellants/${householdAppeal.appellant.id}`)
					.send(patchBody)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if appellantId is not numeric', async () => {
				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellants/one`)
					.send(patchBody)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appellantId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if appellantId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellants/3`)
					.send(patchBody)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appellantId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if name is not a string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellants/${householdAppeal.appellant.id}`)
					.send({
						name: [patchBody.name]
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						name: ERROR_MUST_BE_STRING
					}
				});
			});

			test('returns an error if name is an empty string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellants/${householdAppeal.appellant.id}`)
					.send({
						name: ''
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						name: ERROR_CANNOT_BE_EMPTY_STRING
					}
				});
			});

			test('returns an error if name is more than 300 characters', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellants/${householdAppeal.appellant.id}`)
					.send({
						name: 'A'.repeat(LENGTH_300 + 1)
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						name: stringTokenReplacement(ERROR_MAX_LENGTH_CHARACTERS, [LENGTH_300])
					}
				});
			});

			test('does not return an error when given an empty body', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellants/${householdAppeal.appellant.id}`)
					.send({})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({});
			});

			test('returns an error when unable to save the data', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellant.update.mockImplementation(() => {
					throw new Error('Internal Server Error');
				});

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellants/${householdAppeal.appellant.id}`)
					.send(patchBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellant.update).toHaveBeenCalledWith({
					data: patchBody,
					where: {
						id: householdAppeal.appellant.id
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
