import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const mockCaseReference = { title: 'mock title', status: 'in test', reference: 'mock reference' };
const nocks = () => {
	nock('http://test/').get('/applications/1').reply(200, mockCaseReference);
};

describe('Representation details page', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/1/relevant-representations/contact-details';

	describe('GET /applications-service/case/1/relevant-representations/contact-details', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/case-team');
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should have required fields', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('Organisation name');
			expect(element.innerHTML).toContain('First name');
			expect(element.innerHTML).toContain('Last name');
			expect(element.innerHTML).toContain('Job title');
			expect(element.innerHTML).toContain('Email');
			expect(element.innerHTML).toContain('Telephone number');
		});
	});

	describe('POST /applications-service/case/1/relevant-representations/contact-details', () => {
		describe('Field validation:', () => {
			it('should show validation error if First name or Last name is not empty', async () => {
				const response = await request.post(baseUrl).send({
					firstName: '',
					lastName: ''
				});

				const element = parseHtml(response.text);

				expect(element.innerHTML).toContain('Enter first name');
				expect(element.innerHTML).toContain('Enter last name');
			});

			it('should show validation error if First name or Last name is too short', async () => {
				const response = await request.post(baseUrl).send({
					firstName: 'a',
					lastName: 'a'
				});

				const element = parseHtml(response.text);

				expect(element.innerHTML).toContain('First name must be between 3 and 64 characters');
				expect(element.innerHTML).toContain('Last name must be between 3 and 64 characters');
			});

			it('should show validation error if email address is malformed', async () => {
				const response = await request.post(baseUrl).send({
					email: 'notvalidemail.com'
				});

				const element = parseHtml(response.text);

				expect(element.innerHTML).toContain(
					'Enter an email address in the correct format, like name@example.com'
				);
			});
			// TODO: check the redirect completed and repId is present
			// it('should redirect to address-lookup page if there is no error', async () => {
			// 	const response = await request.post(baseUrl).send({
			//         firstName: 'John',
			// 		lastName: 'Doe'
			// 	});

			// 	expect(global.window.location.href).toContain('repId=')

			// 	expect(response?.headers?.location).toContain('repId=');
			// 	expect(response?.headers?.location).toContain('repType=');
			// });
		});
	});
});
