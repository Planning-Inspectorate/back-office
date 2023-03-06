import { parseHtml } from '@pins/platform';
import { fixtureDocumentationFiles } from '@pins/web/testing/applications/fixtures/documentation-files.js';
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
					expect(element.innerHTML).toContain(fixtureDocumentationFiles[0].documentName);
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
					documentName: null
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('There is a problem');
				expect(element.innerHTML).toContain('You must enter a file name');
			});

			it('should return an error if value length > 255', async () => {
				const response = await request.post(`${baseUrl}/name`).send({
					documentName: 'x'.repeat(256)
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('There is a limit of 255 characters');
			});

			it('should redirect to document properties page if there is no error', async () => {
				const response = await request.post(`${baseUrl}/name`).send({
					documentName: 'a valid name'
				});

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});

	describe('Edit description', () => {
		beforeEach(async () => {
			nocks();

			await request.get('/applications-service/case-team');
		});

		describe('GET /case/123/project-documentation/18/document/456/edit/description', () => {
			it('should render the page with values', async () => {
				const response = await request.get(`${baseUrl}/description`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Description of the document');
				expect(element.innerHTML).toContain(fixtureDocumentationFiles[0].description);
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/description', () => {
			it('should return an error if value is not defined', async () => {
				const response = await request.post(`${baseUrl}/description`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('There is a problem');
				expect(element.innerHTML).toContain('You must enter a description of the document');
			});

			it('should return an error if value length > 800', async () => {
				const response = await request.post(`${baseUrl}/description`).send({
					description: 'x'.repeat(801)
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('There is a limit of 800 characters');
			});

			// TODO: reaplace field names with the ones coming from the API
			it('should redirect to document properties page if there is no error', async () => {
				const response = await request.post(`${baseUrl}/description`).send({
					description: 'a valid description'
				});

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});

	describe('Edit redaction status', () => {
		beforeEach(async () => {
			nocks();

			await request.get('/applications-service/case-team');
		});

		describe('GET /case/123/project-documentation/18/document/456/edit/redaction', () => {
			it('should render the page with values', async () => {
				const response = await request.get(`${baseUrl}/redaction`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Select the redaction status');
				expect(element.innerHTML).toContain(`value="true" checked`);
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/redaction', () => {
			it('should return an error if value is not defined', async () => {
				const response = await request.post(`${baseUrl}/redaction`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('There is a problem');
				expect(element.innerHTML).toContain('You must select a redaction status');
			});

			it('should redirect to document properties page if there is no error', async () => {
				const response = await request.post(`${baseUrl}/redaction`).send({
					redacted: true
				});

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});

	describe('Edit document type', () => {
		beforeEach(async () => {
			nocks();

			await request.get('/applications-service/case-team');
		});
		describe('GET /case/123/project-documentation/18/document/456/edit/type', () => {
			it('should render the page with values', async () => {
				const response = await request.get(`${baseUrl}/type`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Select the document type');
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/type', () => {
			it('should redirect to document properties page if there is no error', async () => {
				const response = await request.post(`${baseUrl}/type`);

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});
});
