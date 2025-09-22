import { parseHtml } from '@pins/platform';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../testing/index.js';
import nock from 'nock';
import { fixtureCases } from '../../../../../../../testing/applications/fixtures/cases.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const baseUrl = '/applications-service/case/1/relevant-representations/unpublishing-error';

const nocks = () => {
	nock('http://test/').get('/applications/1').reply(200, fixtureCases[3]);
};

describe('unpublish-representations-error.controller', () => {
	describe('GET /applications-service/:caseId/relevant-representations/unpublishing-error', () => {
		beforeEach(installMockApi);
		afterEach(teardown);

		afterAll(() => {
			nock.cleanAll();
		});

		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Sorry, there is a problem');
			expect(element.innerHTML).toContain(
				'None of your representations have been unpublished. Please try again later.'
			);
		});
	});
});
