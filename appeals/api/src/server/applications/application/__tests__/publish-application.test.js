import { jest } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../../app-test.js';
const { eventClient } = await import('../../../infrastructure/event-client.js');
const { databaseConnector } = await import('../../../utils/database-connector.js');

import logger from '../../../utils/logger.js';

const request = supertest(app);

const now = 1_649_319_144_000;
const mockDate = new Date(now);

const loggerInfo = jest.spyOn(logger, 'info');

jest.useFakeTimers({ now });

describe('Publish application', () => {
	test('publish an application and return published Date as a timestamp', async () => {
		// GIVEN
		const caseId = 1;

		databaseConnector.case.findUnique.mockResolvedValue({ id: 1, publishedAt: mockDate });
		databaseConnector.case.update.mockResolvedValue({ publishedAt: mockDate });

		// WHEN
		const response = await request.patch(`/applications/${caseId}/publish`);

		// THEN
		expect(response.status).toEqual(200);

		const publishedDate = 1_649_319_144;

		expect(loggerInfo).toHaveBeenCalledTimes(3);

		expect(loggerInfo).toHaveBeenNthCalledWith(1, `attempting to publish a case with id ${caseId}`);
		expect(loggerInfo).toHaveBeenNthCalledWith(2, `case was published at ${mockDate}`);
		expect(loggerInfo).toHaveBeenNthCalledWith(3, `successfully published case with id ${caseId}`);

		expect(response.body).toEqual({
			publishedDate
		});

		expect(databaseConnector.case.update).toHaveBeenCalledWith({
			where: { id: caseId },
			data: {
				publishedAt: mockDate
			}
		});

		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'nsip-project',
			[
				{
					caseId: 1,
					sourceSystem: 'ODT',
					publishStatus: 'published',
					applicantIds: [],
					nsipOfficerIds: [],
					nsipAdministrationOfficerIds: [],
					inspectorIds: [],
					interestedPartyIds: []
				}
			],
			'Publish'
		);
	});

	test('returns 404 error if a caseId does not exist', async () => {
		// GIVEN
		const caseId = 134;

		databaseConnector.case.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request.patch(`/applications/${caseId}/publish`);

		// THEN
		expect(response.status).toEqual(404);

		expect(response.body).toEqual({
			errors: {
				id: 'Must be an existing application'
			}
		});
	});
});
