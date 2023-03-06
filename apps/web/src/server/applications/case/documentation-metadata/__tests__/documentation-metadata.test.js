import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications/case-team').reply(200, {});
};

describe('Edit applications documentation metadata', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/123/project-documentation/18/document/456/edit';

	describe('Edit name', () => {
		describe('GET /case/123/project-documentation/18/document/456/edit/name', () => {
			describe('If user is inspector', () => {
				beforeEach(async () => {
					nock('http://test/').get('/applications/inspector').reply(200, {});

					await request.get('/applications-service/inspector');
				});

				it('should not render the page', async () => {
					const response = await request.get(`${baseUrl}/name`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('problem with your login');
				});
			});

			describe('If user is not inspector', () => {
				beforeEach(async () => {
					nocks();

					await request.get('/applications-service/case-team');
				});

				it('should render the page with values', async () => {
					const response = await request.get(`${baseUrl}/name`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Enter file name');
				});
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/name', () => {
			beforeEach(async () => {
				nocks();

				await request.get('/applications-service/case-team');
			});

			it('should return an error if value is not defined', async () => {
				const response = await request.post(`${baseUrl}/name`).send({
					name: null
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('There is a problem');
				expect(element.innerHTML).toContain('Enter the file name');
			});

			it('should return an error if value length > 255', async () => {
				const response = await request.post(`${baseUrl}/name`).send({
					name: 'x'.repeat(256)
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('There is a limit of 255 characters');
			});

			it('should redirect to document properties page if there is no error', async () => {
				const response = await request.post(`${baseUrl}/name`).send({
					name: 'a valid name'
				});

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});

	describe('Edit description', () => {
		describe('GET /case/123/project-documentation/18/document/456/edit/description', () => {
			beforeEach(async () => {
				nocks();

				await request.get('/applications-service/case-team');
			});

			it('should render the page with values', async () => {
				const response = await request.get(`${baseUrl}/description`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Description of the document');
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/description', () => {
			beforeEach(async () => {
				nocks();

				await request.get('/applications-service/case-team');
			});

			it('should return an error if value is not defined', async () => {
				const response = await request.post(`${baseUrl}/description`).send({
					description: null
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('There is a problem');
				expect(element.innerHTML).toContain('Enter the document description');
			});

			it('should return an error if value length > 800', async () => {
				const response = await request.post(`${baseUrl}/description`).send({
					name: 'x'.repeat(801)
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('There is a limit of 800 characters');
			});

			it('should redirect to document properties page if there is no error', async () => {
				const response = await request.post(`${baseUrl}/name`).send({
					name: 'a valid description'
				});

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});
});
