// @ts-nocheck
import { request } from '#tests/../app-test.js';
import { jest } from '@jest/globals';
import { azureAdUserId } from '#tests/shared/mocks.js';
import { householdAppeal, linkedAppeals } from '#tests/appeals/mocks.js';
import { linkedAppealRequest, linkedAppealLegacyRequest } from '#tests/linked-appeals/mocks.js';
import { CASE_RELATIONSHIP_LINKED, CASE_RELATIONSHIP_RELATED } from '#endpoints/constants.js';
import { horizonGetCaseSuccessResponse } from '#tests/horizon/mocks.js';
import { parseHorizonGetCaseResponse } from '#utils/mapping/map-horizon.js';

const { databaseConnector } = await import('#utils/database-connector.js');
const { default: got } = await import('got');

describe('appeal linked appeals routes', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('POST', () => {
		describe('Linked appeals', () => {
			test('returns 400 when the ID in the request is null', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appealRelationship.findMany.mockResolvedValue([]);

				const response = await request
					.post(`/appeals/${householdAppeal.id}/link-appeal`)
					.send({
						...linkedAppealRequest,
						linkedAppealId: null
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
			});

			test('returns 400 when the ID in the request is not a number', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appealRelationship.findMany.mockResolvedValue([]);

				const response = await request
					.post(`/appeals/${householdAppeal.id}/link-appeal`)
					.send({
						...linkedAppealRequest,
						linkedAppealId: 'a string'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
			});

			test('returns 404 when an internal appeal to link is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValueOnce(null);

				const response = await request
					.post(`/appeals/${householdAppeal.id}/link-appeal`)
					.send({
						...linkedAppealRequest,
						linkedAppealId: 100
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
			});

			test('returns 400 when an external appeal reference is empty', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appealRelationship.findMany.mockResolvedValue([]);

				const response = await request
					.post(`/appeals/${householdAppeal.id}/link-legacy-appeal`)
					.send({
						...linkedAppealLegacyRequest,
						linkedAppealReference: ''
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
			});

			test('returns 400 when an external appeal reference is null', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appealRelationship.findMany.mockResolvedValue([]);

				const response = await request
					.post(`/appeals/${householdAppeal.id}/link-legacy-appeal`)
					.send({
						...linkedAppealLegacyRequest,
						linkedAppealReference: null
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
			});

			test('returns 400 when an internal appeal is already a parent', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValueOnce(householdAppeal);
				// @ts-ignore
				databaseConnector.appealRelationship.findMany.mockResolvedValueOnce(linkedAppeals);

				const response = await request
					.post(`/appeals/${householdAppeal.id}/link-appeal`)
					.send({
						...linkedAppealRequest,
						isCurrentAppealParent: false
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
			});

			test('returns 200 when an external appeal reference is received', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
				got.post.mockReturnValueOnce({
					json: jest
						.fn()
						.mockResolvedValueOnce(parseHorizonGetCaseResponse(horizonGetCaseSuccessResponse))
				});

				const response = await request
					.post(`/appeals/${householdAppeal.id}/link-legacy-appeal`)
					.send({
						...linkedAppealLegacyRequest,
						linkedAppealReference: '123456'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(databaseConnector.appealRelationship.create).toHaveBeenCalledTimes(1);
				expect(databaseConnector.appealRelationship.create).toHaveBeenCalledWith({
					data: {
						parentId: 20486402,
						parentRef: '1000000',
						childRef: householdAppeal.reference,
						childId: householdAppeal.id,
						type: CASE_RELATIONSHIP_LINKED,
						externalSource: true
					}
				});
			});
		});

		describe('Related appeals', () => {
			test('returns 400 when the ID in the request is null', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appealRelationship.findMany.mockResolvedValue([]);

				const response = await request
					.post(`/appeals/${householdAppeal.id}/associate-appeal`)
					.send({
						...linkedAppealRequest,
						linkedAppealId: null
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
			});

			test('returns 400 when the ID in the request is not a number', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appealRelationship.findMany.mockResolvedValue([]);

				const response = await request
					.post(`/appeals/${householdAppeal.id}/associate-appeal`)
					.send({
						...linkedAppealRequest,
						linkedAppealId: 'a string'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
			});

			test('returns 404 when an internal appeal to link is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValueOnce(null);

				const response = await request
					.post(`/appeals/${householdAppeal.id}/associate-appeal`)
					.send({
						...linkedAppealRequest,
						linkedAppealId: 100
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
			});

			test('returns 400 when an external appeal reference is empty', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appealRelationship.findMany.mockResolvedValue([]);

				const response = await request
					.post(`/appeals/${householdAppeal.id}/associate-legacy-appeal`)
					.send({
						...linkedAppealLegacyRequest,
						linkedAppealReference: ''
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
			});

			test('returns 400 when an external appeal reference is null', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appealRelationship.findMany.mockResolvedValue([]);

				const response = await request
					.post(`/appeals/${householdAppeal.id}/associate-legacy-appeal`)
					.send({
						...linkedAppealLegacyRequest,
						linkedAppealReference: null
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
			});

			test('returns 200 when an external appeal reference is received', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
				got.post.mockReturnValueOnce({
					json: jest
						.fn()
						.mockResolvedValueOnce(parseHorizonGetCaseResponse(horizonGetCaseSuccessResponse))
				});

				const response = await request
					.post(`/appeals/${householdAppeal.id}/associate-legacy-appeal`)
					.send({
						...linkedAppealLegacyRequest,
						linkedAppealReference: '123456'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(databaseConnector.appealRelationship.create).toHaveBeenCalledTimes(1);
				expect(databaseConnector.appealRelationship.create).toHaveBeenCalledWith({
					data: {
						parentId: householdAppeal.id,
						parentRef: householdAppeal.reference,
						childRef: '123456',
						childId: 20486402,
						type: CASE_RELATIONSHIP_RELATED,
						externalSource: true
					}
				});
			});
		});
	});
});
