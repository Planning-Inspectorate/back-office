// @ts-nocheck
import { jest } from '@jest/globals';
import { householdAppeal } from '#tests/appeals/mocks.js';
import { request } from '../../../app-test.js';
import { azureAdUserId } from '#tests/shared/mocks.js';
import { parseHorizonGetCaseResponse } from '#utils/mapping/map-horizon.js';
import {
	horizonGetCaseSuccessResponse,
	horizonGetCaseNotFoundResponse
} from '#tests/horizon/mocks.js';

const { databaseConnector } = await import('#utils/database-connector.js');
const { default: got } = await import('got');

describe('/appeals/linkable-appeal/:appealReference', () => {
	describe('GET', () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});
		test('gets a back office linkable appeal summary when the appeal exists in back office', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValueOnce(householdAppeal);
			const response = await request
				.get(`/appeals/linkable-appeal/${householdAppeal.reference}`)
				.set('azureAdUserId', azureAdUserId);
			expect(response.status).toEqual(200);
			expect(response.body).toEqual({
				appealId: householdAppeal.id.toString(),
				appealReference: householdAppeal.reference,
				appealType: householdAppeal.appealType?.type,
				appealStatus: householdAppeal.appealStatus[0].status,
				siteAddress: {
					siteAddressLine1: householdAppeal.address?.addressLine1,
					siteAddressLine2: householdAppeal.address?.addressLine2,
					siteAddressTown: householdAppeal.address?.addressTown,
					siteAddressCounty: householdAppeal.address?.addressCounty,
					siteAddressPostcode: householdAppeal.address?.postcode
				},
				localPlanningDepartment: householdAppeal.lpa.name,
				appellantName: `${householdAppeal.appellant?.firstName} ${householdAppeal.appellant?.lastName}`,
				agentName: `${householdAppeal.agent?.firstName} ${householdAppeal.agent?.lastName} ${
					householdAppeal.agent?.organisationName
						? '(' + householdAppeal.agent?.organisationName + ')'
						: ''
				}`,
				submissionDate: new Date(householdAppeal.createdAt).toISOString(),
				source: 'back-office'
			});
		});
		test('gets a back office linkable appeal summary when the appeal does not exists in back office but exists in Horizon', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValueOnce(null);
			got.post.mockReturnValueOnce({
				json: jest
					.fn()
					.mockResolvedValueOnce(parseHorizonGetCaseResponse(horizonGetCaseSuccessResponse))
			});
			const response = await request
				.get(`/appeals/linkable-appeal/1`)
				.set('azureAdUserId', azureAdUserId);
			expect(response.status).toEqual(200);
			expect(response.body).toEqual({
				appealId: '20486402',
				appealReference: '3171066',
				appealType: 'Planning Appeal (W)',
				appealStatus: 'Closed - Opened in Error',
				siteAddress: {
					siteAddressLine1: 'Planning Inspectorate',
					siteAddressLine2: 'Temple Quay House, 2 The Square, Temple Quay',
					siteAddressTown: 'BRISTOL',
					siteAddressPostcode: 'BS1 6PN'
				},
				localPlanningDepartment: 'System Test Borough Council',
				appellantName: 'Mrs Tammy Rogers',
				agentName: null,
				submissionDate: '2017-03-07T00:00:00.000Z',
				source: 'horizon'
			});
		});
		test('responds with a 404 if no cases are found', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValueOnce(null);
			got.post.mockReturnValueOnce({
				json: jest.fn().mockRejectedValueOnce({
					response: { body: parseHorizonGetCaseResponse(horizonGetCaseNotFoundResponse) }
				})
			});
			const response = await request
				.get(`/appeals/linkable-appeal/1`)
				.set('azureAdUserId', azureAdUserId);
			expect(response.status).toEqual(404);
		});
		test('responds with a 500 if the Horizon API is down', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValueOnce(null);
			const response = await request
				.get(`/appeals/linkable-appeal/1`)
				.set('azureAdUserId', azureAdUserId);
			expect(response.status).toEqual(500);
		});
	});
});
