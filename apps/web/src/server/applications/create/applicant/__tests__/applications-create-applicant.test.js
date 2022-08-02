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

	describe('GET /applicant-full-name', () => {
		const baseUrl = '/applications-service/create-new-case/123/applicant-full-name';

		it('should render the page if there is data in the session', async () => {
			await request
				.post('/applications-service/create-new-case/123/applicant-information-types')
				.send({
					selectedApplicantInfoTypes: ['applicant-full-name']
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

	describe('GET /applicant-website', () => {
		const baseUrl = '/applications-service/create-new-case/123/applicant-website';

		it('should render the page if there is data in the session', async () => {
			await request
				.post('/applications-service/create-new-case/123/applicant-information-types')
				.send({
					selectedApplicantInfoTypes: ['applicant-website']
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

	describe('POST /application-website', () => {
		const baseUrl = '/applications-service/create-new-case/123/applicant-website';

		beforeEach(async () => {
			await request.get('/applications-service/case-officer');
		});

		describe('Web-side validation:', () => {
			it('should show validation errors if an invalid URL is input', async () => {
				const response = await request.post(baseUrl).send({
					'applicant.website': 'bad_url'
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('error-summary-title');
				expect(element.innerHTML).toContain('applicant.website-error');
			});
		});
	});

	describe('GET /applicant-email', () => {
		const baseUrl = '/applications-service/create-new-case/123/applicant-email';

		it('should render the page if there is data in the session', async () => {
			await request
				.post('/applications-service/create-new-case/123/applicant-information-types')
				.send({
					selectedApplicantInfoTypes: ['applicant-email']
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

	describe('POST /application-email', () => {
		const baseUrl = '/applications-service/create-new-case/123/applicant-email';

		beforeEach(async () => {
			await request.get('/applications-service/case-officer');
		});

		describe('Web-side validation:', () => {
			it('should show validation errors if an invalid email is input', async () => {
				const response = await request.post(baseUrl).send({
					'applicant.email': 'bad_email_address'
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('error-summary-title');
				expect(element.innerHTML).toContain('applicant.email-error');
			});
		});
	});
});
