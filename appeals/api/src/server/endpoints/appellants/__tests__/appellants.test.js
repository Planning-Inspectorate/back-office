import { request } from '../../../app-test.js';
import {
	ERROR_CANNOT_BE_EMPTY_STRING,
	ERROR_FAILED_TO_SAVE_DATA,
	ERROR_MAX_LENGTH_CHARACTERS,
	ERROR_MUST_BE_NUMBER,
	ERROR_MUST_BE_STRING,
	ERROR_NOT_FOUND,
	MAX_LENGTH_300
} from '../../constants.js';
import { householdAppeal } from '#tests/data.js';
import errorMessageReplacement from '#utils/error-message-replacement.js';

const { databaseConnector } = await import('#utils/database-connector.js');

describe('appellants routes', () => {
	describe('/appeals/:appealId/appellants/:appellantId', () => {
		describe('GET', () => {
			test('gets a single appellant', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.get(
					`/appeals/${householdAppeal.id}/appellants/${householdAppeal.appellant.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					agentName: householdAppeal.appellant.agentName,
					appellantId: householdAppeal.appellant.id,
					company: householdAppeal.appellant.company,
					email: householdAppeal.appellant.email,
					name: householdAppeal.appellant.name
				});
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request.get(
					`/appeals/one/appellants/${householdAppeal.appellant.id}`
				);

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

				const response = await request.get(`/appeals/3/appellants/${householdAppeal.appellant.id}`);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if appellantId is not numeric', async () => {
				const response = await request.get(`/appeals/${householdAppeal.id}/appellants/one`);

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

				const response = await request.get(`/appeals/${householdAppeal.id}/appellants/3`);

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
					.send(patchBody);

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
					.send(patchBody);

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
					.send(patchBody);

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
					.send(patchBody);

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
					.send(patchBody);

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
					});

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
					});

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
						name: 'A'.repeat(MAX_LENGTH_300 + 1)
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						name: errorMessageReplacement(ERROR_MAX_LENGTH_CHARACTERS, MAX_LENGTH_300)
					}
				});
			});

			test('does not return an error when given an empty body', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellants/${householdAppeal.appellant.id}`)
					.send({});

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
					.send(patchBody);

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
