import { parseHtml } from '@pins/platform';
import supertest from 'supertest';
import { createTestApplication } from '../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestApplication();
const request = supertest(app);

describe('applications create applicant', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	beforeEach(async () => {
		await request.get('/applications-service/case-officer');
	});

	describe('GET /applicant-information-types', () => {
		const baseUrl = '/applications-service/create-new-case/123/applicant-information-types';

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Save and continue');
		});
	});

	describe('GET /applicant-organisation-name', () => {
		const baseUrl = '/applications-service/create-new-case/123/applicant-organisation-name';

		it('should render the page if there is data in the session', async () => {
			await request
				.post('/applications-service/create-new-case/123/applicant-information-types')
				.send({
					selectedApplicantInfoTypes: ['applicant-organisation-name']
				});

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Save and continue');
		});

		it('should show not render the page if there is no session data', async () => {
			const response = await request.get(baseUrl);

			expect(response?.headers?.location).toMatch(
				'/applications-service/create-new-case/123/key-dates'
			);
		});
	});
});
