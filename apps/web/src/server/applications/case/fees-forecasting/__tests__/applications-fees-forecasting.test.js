import { jest } from '@jest/globals';
import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';
import { fixtureCases } from '../../../../../../testing/applications/applications.js';
import { featureFlagClient } from '../../../../../common/feature-flags.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications').reply(200, []);
	nock('http://test/').get('/applications/123').reply(200, fixtureCases[3]);
	nock('http://test/').get('/applications-service/').reply(200, {});
};

describe('Fees and Forecasting', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	beforeEach(async () => {
		nocks();
	});

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/123/fees-forecasting';

	describe('GET /case/123/fees-forecasting/', () => {
		it('should render the page when feature flag is ON', async () => {
			jest.spyOn(featureFlagClient, 'isFeatureActive').mockImplementation(() => true);

			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot('fees-forecasting-on');
			expect(element.querySelector('a.pins-selected-item')?.textContent).toContain(
				'Fees and forecasting'
			);
		});

		it('should NOT render the page when feature flag is OFF', async () => {
			jest.spyOn(featureFlagClient, 'isFeatureActive').mockImplementation(() => false);

			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot('fees-forecasting-off');
			expect(response.status).toBe(404);
		});
	});
});
