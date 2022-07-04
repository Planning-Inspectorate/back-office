import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureSectors } from '../../../../../testing/applications/fixtures/sectors.js';
import { createTestApplication } from '../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestApplication();
const request = supertest(app);

describe('applications create', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /create-new-case', () => {
		const baseUrl = '/applications-service/create-new-case';

		describe('When role is:', () => {
			describe('Inspector', () => {
				it('should NOT render the form', async () => {
					await request.get('/applications-service/inspector');

					const response = await request.get(baseUrl);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).not.toContain('Save and continue');
				});
			});
			describe('Case officer', () => {
				it('should render form', async () => {
					await request.get('/applications-service/case-officer');

					const response = await request.get(baseUrl);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Save and continue');
				});
			});
			describe('Case admin officer', () => {
				it('should render form', async () => {
					await request.get('/applications-service/case-admin-officer');

					const response = await request.get(baseUrl);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Save and continue');
				});
			});
		});
	});

	describe('GET /create-new-case/:applicationId/sector', () => {
		const baseUrl = (/** @type {string} */ id) =>
			`/applications-service/create-new-case/${id}/sector`;

		beforeEach(async () => {
			await request.get('/applications-service/case-officer');
		});

		describe('When applicationId is:', () => {
			describe('Provided', () => {
				it('should render the page', async () => {
					nock('http://test/').get('/applications/sector').reply(200, fixtureSectors);

					const response = await request.get(baseUrl('123'));
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('govuk-radios__item');
				});
			});
			describe('Not provided', () => {
				it('should NOT render the page', async () => {
					nock('http://test/').get('/applications/sector').reply(200, fixtureSectors);

					const response = await request.get(baseUrl(''));
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).not.toContain('govuk-radios__item');
				});
			});
		});
	});

	describe('POST /create-new-case/:applicationId/sector', () => {
		// TODO: actually test page once API exists
	});
});
