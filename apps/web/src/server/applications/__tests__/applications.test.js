import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureCases } from '../../../../testing/applications/fixtures/cases.js';
import { createTestEnvironment } from '../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

describe('applications', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /', () => {
		const baseUrl = '/applications-service/';

		it('should render a placeholder when there are no open applications', async () => {
			nock('http://test/').get('/applications/').reply(200, []);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the open applications belonging to the user', async () => {
			nock('http://test/').get('/applications').reply(200, fixtureCases);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the `create case` button', async () => {
			nock('http://test/').get('/applications').reply(200, fixtureCases);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text, {
				rootElement: '.govuk-button.govuk-button--secondary.pins-dashboard-box--btn'
			});

			expect(element.innerHTML).toContain('Create case');
		});

		it('should render there is a problem with the service', async () => {
			nock('http://test/').get('/applications').reply(500, fixtureCases);

			const response = await request.get(baseUrl);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			expect(element.innerHTML).toContain('Sorry, there is a problem with the service');

			expect(element.innerHTML).toContain(
				'https://intranet.planninginspectorate.gov.uk/task/report-it-problem/'
			);
		});
	});
});

const {
	app: appUnauth,
	installMockApi: installMockApiUnauth,
	teardown: teardownUnauth
} = createTestEnvironment({ authenticated: true, groups: ['not_valid_group'] });

const requestUnauth = supertest(appUnauth);

describe('Applications homepage when user belongs to wrong group', () => {
	beforeEach(installMockApiUnauth);
	afterEach(teardownUnauth);

	describe('GET /applications-service', () => {
		it('should not render the page due to an authentication error', async () => {
			const response = await requestUnauth.get('/applications-service');

			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('You are not permitted to access this URL');

			expect(element.innerHTML).toContain(
				'https://intranet.planninginspectorate.gov.uk/task/report-it-problem/'
			);
		});
	});
});
