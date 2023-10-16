import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureCases } from '../../../../../../testing/applications/fixtures/cases.js';
import { createTestEnvironment } from '../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const successPatchPostResponse = { id: 1, applicantId: 1 };

const nocks = () => {
	nock('http://test/').get('/applications/case-team').reply(200, []);
	nock('http://test/').post('/applications').reply(200, successPatchPostResponse);
	nock('http://test/').patch('/applications/123').reply(200, successPatchPostResponse);
	nock('http://test/')
		.get(/\/applications\/123(.*)/g)
		.times(2)
		.reply(200, fixtureCases[0]);
};

describe('applications create applicant', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	beforeEach(async () => {
		await request.get('/applications-service/case-team');
	});

	describe('GET /applicant-information-types', () => {
		const baseUrl = '/applications-service/create-new-case/123/applicant-information-types';

		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Save and continue');
		});
	});

	describe('GET /applicant-organisation-name', () => {
		const baseUrl = '/applications-service/create-new-case/123/applicant-organisation-name';

		beforeEach(async () => {
			nocks();
		});

		it('should render the page when resumed or when there is session data', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Save and continue');
		});

		it('should not render the page if there is no session data', async () => {
			await request.post('/applications-service/create-new-case').send({
				title: 'title',
				description: 'description'
			});

			const response = await request.get(baseUrl);

			expect(response?.headers?.location).toMatch(
				'/applications-service/create-new-case/123/key-dates'
			);
		});
	});

	describe('GET /applicant-full-name', () => {
		const baseUrl = '/applications-service/create-new-case/123/applicant-full-name';

		beforeEach(async () => {
			nocks();
		});

		it('should render the page when resumed or if there is data in the session', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Save and continue');
		});

		it('should not render the page if there is no session data', async () => {
			await request.post('/applications-service/create-new-case').send({
				title: 'title',
				description: 'description'
			});

			const response = await request.get(baseUrl);

			expect(response?.headers?.location).toMatch(
				'/applications-service/create-new-case/123/key-dates'
			);
		});
	});

	describe('Applicant website', () => {
		const baseUrl = '/applications-service/create-new-case/123/applicant-website';

		beforeEach(async () => {
			nocks();
		});

		describe('GET /applicant-website', () => {
			it('should render the page when resumed or if there is data in the session', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Save and continue');
			});

			it('should not render the page if there is no session data', async () => {
				await request.post('/applications-service/create-new-case').send({
					title: 'title',
					description: 'description'
				});

				const response = await request.get(baseUrl);

				expect(response?.headers?.location).toMatch(
					'/applications-service/create-new-case/123/key-dates'
				);
			});
		});

		describe('POST /application-website', () => {
			beforeEach(async () => {
				await request.get('/applications-service/case-team');
			});

			describe('Web-side validation:', () => {
				it('should show validation errors if an invalid URL is input', async () => {
					const response = await request.post(baseUrl).send({
						'applicant.website': 'bad_url'
					});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('govuk-error-summary');
					expect(element.innerHTML).toContain('applicant.website-error');
				});
			});
		});
	});

	describe('Applicant email', () => {
		const baseUrl = '/applications-service/create-new-case/123/applicant-email';

		beforeEach(async () => {
			nocks();
		});

		describe('GET /applicant-email', () => {
			it('should render the page when resumed or if there is data in the session', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Save and continue');
			});

			it('should not render the page if there is no session data', async () => {
				await request.post('/applications-service/create-new-case').send({
					title: 'title',
					description: 'description'
				});

				const response = await request.get(baseUrl);

				expect(response?.headers?.location).toMatch(
					'/applications-service/create-new-case/123/key-dates'
				);
			});
		});

		describe('POST /application-email', () => {
			beforeEach(async () => {
				await request.get('/applications-service/case-team');
			});

			describe('Web-side validation:', () => {
				it('should show validation errors if an invalid email is input', async () => {
					const response = await request.post(baseUrl).send({
						'applicant.email': 'bad_email_address'
					});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('govuk-error-summary');
					expect(element.innerHTML).toContain('applicant.email-error');
				});
			});
		});
	});

	describe('Applicant telephone number', () => {
		const baseUrl = '/applications-service/create-new-case/123/applicant-telephone-number';

		beforeEach(async () => {
			nocks();
		});

		describe('GET /applicant-telephone-number', () => {
			it('should render the page when resumed or if there is data in the session', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Save and continue');
			});

			it('should not render the page if there is no session data', async () => {
				await request.post('/applications-service/create-new-case').send({
					title: 'title',
					description: 'description'
				});

				const response = await request.get(baseUrl);

				expect(response?.headers?.location).toMatch(
					'/applications-service/create-new-case/123/key-dates'
				);
			});
		});

		describe('POST /application-telephone-number', () => {
			beforeEach(async () => {
				await request.get('/applications-service/case-team');
			});

			describe('Web-side validation:', () => {
				it('should show validation errors if an invalid telephone number is input', async () => {
					const response = await request.post(baseUrl).send({
						'applicant.phoneNumber': 'bad_phone_number'
					});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('govuk-error-summary');
					expect(element.innerHTML).toContain('applicant.phoneNumber-error');
				});
			});
		});
	});

	describe('Applicant address', () => {
		const baseUrl = '/applications-service/create-new-case/123/applicant-address';

		beforeEach(async () => {
			nocks();
		});

		describe('GET /applicant-address', () => {
			it('should render the page when resumed or if there is data in the session', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Find address');
				expect(element.innerHTML).toContain('Save and continue');
			});

			it('should render the page with the manual inputs for address', async () => {
				const response = await request.get(`${baseUrl}?postcode=aa1xx2`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Save and continue');
			});

			it('should not render the page if there is no session data', async () => {
				await request.post('/applications-service/create-new-case').send({
					title: 'title',
					description: 'description'
				});

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
					expect(element.innerHTML).toContain('govuk-error-summary');
					expect(element.innerHTML).toContain('Enter a valid postcode');
					expect(element.innerHTML).toContain('Save and continue');
				});
			});
		});
	});
});
