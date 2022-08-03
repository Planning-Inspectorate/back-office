import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureApplications } from '../../../../../../testing/applications/fixtures/applications.js';
import { createTestApplication } from '../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestApplication();
const request = supertest(app);

describe('applications create applicant', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	beforeEach(async () => {
		await request.get('/applications-service/case-officer');
		nock('http://test/').get('/applications/case-officer').reply(200, fixtureApplications);
	});

	afterAll(() => {
		nock.cleanAll();
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
			nock('http://test/').get('/applications/case-officer').reply(200, fixtureApplications);

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
			nock('http://test/').get('/applications/case-officer').reply(200, fixtureApplications);

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

	describe('Applicant address', () => {
		const baseUrl = '/applications-service/create-new-case/123/applicant-address';

		describe('GET /applicant-address', () => {
			it('should render the page if there is data in the session', async () => {
				nock('http://test/').get('/applications/case-officer').reply(200, fixtureApplications);

				await request
					.post('/applications-service/create-new-case/123/applicant-information-types')
					.send({
						selectedApplicantInfoTypes: ['applicant-address']
					});

				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Find address');
			});

			it('should render the page with the manual inputs for address', async () => {
				nock('http://test/').get('/applications/case-officer').reply(200, fixtureApplications);

				await request
					.post('/applications-service/create-new-case/123/applicant-information-types')
					.send({
						selectedApplicantInfoTypes: ['applicant-address']
					});

				const response = await request.get(`${baseUrl}?postcode=aa1xx2`);
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
		describe('POST /applicant-address', () => {
			describe('Web-side validation:', () => {
				it('should show validation errors if an invalid postcode is input', async () => {
					process.env.OS_API_KEY = 'something';

					const response = await request.post(baseUrl).send({
						postcode: 'abc',
						currentFormStage: 'searchPostcode'
					});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('error-summary-title');
					expect(element.innerHTML).toContain('Enter a valid postcode');
				});
			});
		});
	});
});
