import { parseHtml } from '@pins/platform';
import {
	fixturePublishedDocumentationFile,
	fixtureReadyToPublishDocumentationFile,
	fixtureNotCheckedDocumentationFile
} from '@pins/applications.web/testing/applications/fixtures/documentation-files.js';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';
import { fixtureCases } from '../../../../../../testing/applications/fixtures/cases.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications').reply(200, {});
	nock('http://test/').get('/applications/123').reply(200, fixtureCases[3]);
	nock('http://test/')
		.get('/applications/123/documents/456/properties')
		.reply(200, fixturePublishedDocumentationFile);
	nock('http://test/')
		.get('/applications/123/documents/90/properties')
		.reply(200, fixtureReadyToPublishDocumentationFile);
	nock('http://test/')
		.get('/applications/123/documents/110/properties')
		.reply(200, fixtureNotCheckedDocumentationFile);
	nock('http://test/').post('/applications/123/documents/456/metadata').reply(200, {});
	nock('http://test/').post('/applications/123/documents/90/metadata').reply(200, {});
	nock('http://test/').post('/applications/123/documents/110/metadata').reply(200, {});
};

describe('Edit applications documentation metadata', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	beforeEach(async () => {
		nocks();

		await request.get('/applications-service/');
	});

	const baseUrl = '/applications-service/case/123/project-documentation/18/document/456/edit';
	const baseUrlReadyToPublish =
		'/applications-service/case/123/project-documentation/18/document/90/edit';
	const baseUrlNotChecked =
		'/applications-service/case/123/project-documentation/18/document/110/edit';

	describe('Edit name', () => {
		describe('GET /case/123/project-documentation/18/document/456/edit/name', () => {
			it('should render the page with values', async () => {
				const response = await request.get(`${baseUrl}/name`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Document file name');
				expect(element.innerHTML).toContain(fixturePublishedDocumentationFile.fileName);
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/name', () => {
			it('should return an error if value is not defined', async () => {
				const response = await request.post(`${baseUrl}/name`).send({
					fileName: null
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter file name');
			});

			it('should return an error if value length > 255', async () => {
				const response = await request.post(`${baseUrl}/name`).send({
					fileName: 'x'.repeat(256)
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('File name must be 255 characters or less');
			});

			it('should redirect to document properties page if there is no error', async () => {
				const response = await request.post(`${baseUrl}/name`).send({
					fileName: 'a valid name'
				});

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});

	describe('Edit description', () => {
		describe('GET /case/123/project-documentation/18/document/456/edit/description', () => {
			it('should render the page with values', async () => {
				const response = await request.get(`${baseUrl}/description`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Document description');
				expect(element.innerHTML).toContain(fixturePublishedDocumentationFile.description);
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/description', () => {
			it('should return an error if value is not defined', async () => {
				const response = await request.post(`${baseUrl}/description`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter document description');
			});

			it('should return an error if value length > 800', async () => {
				const response = await request.post(`${baseUrl}/description`).send({
					description: 'x'.repeat(801)
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Document description must be 800 characters or less');
			});

			it('should redirect to document properties page if there is no error', async () => {
				const response = await request.post(`${baseUrl}/description`).send({
					description: 'a valid description'
				});

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});

	describe('Edit description in Welsh', () => {
		describe('GET /case/123/project-documentation/18/document/456/edit/descriptionWelsh', () => {
			it('should render the page with values', async () => {
				const response = await request.get(`${baseUrl}/descriptionWelsh`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Document description in Welsh');
				expect(element.innerHTML).toContain(fixturePublishedDocumentationFile.description);
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/descriptionWelsh', () => {
			it('should return an error if value is not defined', async () => {
				const response = await request.post(`${baseUrl}/descriptionWelsh`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter document description in Welsh');
			});

			it('should return an error if value length > 800', async () => {
				const response = await request.post(`${baseUrl}/descriptionWelsh`).send({
					descriptionWelsh: 'x'.repeat(801)
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain(
					'Document description in Welsh must be 800 characters or less'
				);
			});

			it('should redirect to document properties page if there is no error', async () => {
				const response = await request.post(`${baseUrl}/descriptionWelsh`).send({
					descriptionWelsh: 'a valid description'
				});

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});

	describe('Edit agent (representative)', () => {
		describe('GET /case/123/project-documentation/18/document/456/edit/agent', () => {
			it('should render the page with values', async () => {
				const response = await request.get(`${baseUrl}/agent`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Agent name (optional)');
				expect(element.innerHTML).toContain(fixturePublishedDocumentationFile.representative);
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/agent', () => {
			it('should return an error if value length > 150', async () => {
				const response = await request.post(`${baseUrl}/agent`).send({
					representative: 'x'.repeat(151)
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Agent name must be 150 characters or less');
			});

			it('should redirect to document properties page if there is no error', async () => {
				const response = await request.post(`${baseUrl}/agent`).send({
					representative: 'a valid agent'
				});

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});

	describe('Transcript', () => {
		describe('GET /case/123/project-documentation/18/document/456/edit/transcript', () => {
			it('should render the page with values', async () => {
				const response = await request.get(`${baseUrl}/transcript`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Transcript (optional)');
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/transcript', () => {
			it('should redirect to document properties page if there is no error', async () => {
				const response = await request.post(`${baseUrl}/transcript`).send({
					transcript: 'abc'
				});

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});

	describe('Edit webfilter (filter1)', () => {
		describe('GET /case/123/project-documentation/18/document/456/edit/webfilter', () => {
			it('should render the page with values', async () => {
				const response = await request.get(`${baseUrl}/webfilter`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Webfilter');
				expect(element.innerHTML).toContain(fixturePublishedDocumentationFile.filter1);
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/webfilter', () => {
			it('should return an error if value is not defined', async () => {
				const response = await request.post(`${baseUrl}/webfilter`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter webfilter');
			});

			it('should return an error if value length > 100', async () => {
				const response = await request.post(`${baseUrl}/webfilter`).send({
					filter1: 'x'.repeat(101)
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Webfilter must be 100 characters or less');
			});

			it('should redirect to document properties page if there is no error', async () => {
				const response = await request.post(`${baseUrl}/webfilter`).send({
					filter1: 'a valid filter'
				});

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});

	describe('Edit Welsh webfilter (filter1Welsh)', () => {
		describe('GET /case/123/project-documentation/18/document/456/edit/webfilterWelsh', () => {
			it('should render the page with values', async () => {
				const response = await request.get(`${baseUrl}/webfilterWelsh`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Webfilter in Welsh');
				expect(element.innerHTML).toContain(fixturePublishedDocumentationFile.filter1Welsh);
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/webfilterWelsh', () => {
			it('should return an error if value is not defined', async () => {
				const response = await request.post(`${baseUrl}/webfilterWelsh`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter webfilter in Welsh');
			});

			it('should return an error if value length > 100', async () => {
				const response = await request.post(`${baseUrl}/webfilterWelsh`).send({
					filter1Welsh: 'x'.repeat(101)
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Webfilter must be 100 characters or less');
			});

			it('should redirect to document properties page if there is no error', async () => {
				const response = await request.post(`${baseUrl}/webfilterWelsh`).send({
					filter1Welsh: 'a valid filter'
				});

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});

	describe('Edit author', () => {
		describe('GET /case/123/project-documentation/18/document/456/edit/author', () => {
			it('should render the page with values', async () => {
				const response = await request.get(`${baseUrl}/author`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Who the document is from');
				expect(element.innerHTML).toContain(fixturePublishedDocumentationFile.author);
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/author', () => {
			it('should return an error if value is not defined', async () => {
				const response = await request.post(`${baseUrl}/author`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter who the document is from');
			});

			it('should return an error if value length > 100', async () => {
				const response = await request.post(`${baseUrl}/author`).send({
					author: 'x'.repeat(151)
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain(
					'Who the document is from must be 150 characters or less'
				);
			});

			it('should redirect to document properties page if there is no error', async () => {
				const response = await request.post(`${baseUrl}/author`).send({
					author: 'a valid author'
				});

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});

	describe('Edit redaction status', () => {
		describe('GET /case/123/project-documentation/18/document/456/edit/redaction', () => {
			it('should render the page with values', async () => {
				const response = await request.get(`${baseUrl}/redaction`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Select the redaction status');
				expect(element.innerHTML).toContain(
					`value="${fixturePublishedDocumentationFile.redactedStatus}" checked`
				);
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
					redactedStatus: 'redacted'
				});

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});

	describe('Edit document type', () => {
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

	describe('Edit receipt date', () => {
		describe('GET /case/123/project-documentation/18/document/456/edit/receipt-date', () => {
			it('should render the page with values', async () => {
				const response = await request.get(`${baseUrl}/receipt-date`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter date received');
				expect(element.innerHTML).toContain('value="01"');
				expect(element.innerHTML).toContain('value="12"');
				expect(element.innerHTML).toContain('value="2022"');
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/receipt-date', () => {
			it('should return an error if the date fields are empty', async () => {
				const response = await request.post(`${baseUrl}/receipt-date`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('You must enter the receipt date');
			});

			it('should return an error if the day is not valid', async () => {
				const response = await request.post(`${baseUrl}/receipt-date`).send({
					'dateCreated.day': '99',
					'dateCreated.month': '01',
					'dateCreated.year': '2000'
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter a valid day for the receipt date');
			});

			it('should return an error if the month is not valid', async () => {
				const response = await request.post(`${baseUrl}/receipt-date`).send({
					'dateCreated.day': '01',
					'dateCreated.month': '99',
					'dateCreated.year': '2000'
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter a valid month for the receipt date');
			});

			it('should return an error if the year is not valid', async () => {
				const response = await request.post(`${baseUrl}/receipt-date`).send({
					'dateCreated.day': '01',
					'dateCreated.month': '01',
					'dateCreated.year': '200'
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter a valid year for the receipt date');
			});

			it('should return an error if the date is in the future', async () => {
				const response = await request.post(`${baseUrl}/receipt-date`).send({
					'dateCreated.day': '01',
					'dateCreated.month': '01',
					'dateCreated.year': '2100'
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('The receipt date cannot be in the future');
			});

			it('should redirect to document properties page if there is no error', async () => {
				const response = await request
					.post(`${baseUrl}/receipt-date`)
					.send({ 'dateCreated.day': '01', 'dateCreated.month': '01', 'dateCreated.year': '2000' });

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});

	describe('Edit published date', () => {
		describe('GET /case/123/project-documentation/18/document/456/edit/published-date', () => {
			it('should render the page with values', async () => {
				const response = await request.get(`${baseUrl}/published-date`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter the document published date');
				expect(element.innerHTML).toContain('value="07"');
				expect(element.innerHTML).toContain('value="03"');
				expect(element.innerHTML).toContain('value="2023"');
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/published-date', () => {
			it('should return an error if the date fields are empty', async () => {
				const response = await request.post(`${baseUrl}/published-date`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('You must enter the published date');
			});

			it('should return an error if the day is not valid', async () => {
				const response = await request.post(`${baseUrl}/published-date`).send({
					'datePublished.day': '99',
					'datePublished.month': '01',
					'datePublished.year': '2000'
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter a valid day for the published date');
			});

			it('should return an error if the month is not valid', async () => {
				const response = await request.post(`${baseUrl}/published-date`).send({
					'datePublished.day': '01',
					'datePublished.month': '99',
					'datePublished.year': '2000'
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter a valid month for the published date');
			});

			it('should return an error if the year is not valid', async () => {
				const response = await request.post(`${baseUrl}/published-date`).send({
					'datePublished.day': '01',
					'datePublished.month': '01',
					'datePublished.year': '200'
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter a valid year for the published date');
			});

			it('should return an error if the date is in the future', async () => {
				const response = await request.post(`${baseUrl}/published-date`).send({
					'datePublished.day': '01',
					'datePublished.month': '01',
					'datePublished.year': '2100'
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('The published date cannot be in the future');
			});

			it('should redirect to document properties page if there is no error', async () => {
				const response = await request.post(`${baseUrl}/published-date`).send({
					'datePublished.day': '01',
					'datePublished.month': '01',
					'datePublished.year': '2000'
				});

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});

	describe('Edit publish status', () => {
		describe('GET /case/123/project-documentation/18/document/90/edit/published-status', () => {
			it('should render the page with values', async () => {
				const response = await request.get(`${baseUrlReadyToPublish}/published-status`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Select the document status');
				expect(element.innerHTML).toContain(
					`value="${fixtureReadyToPublishDocumentationFile.publishedStatus}" checked`
				);
			});
		});

		describe('POST /case/123/project-documentation/18/document/90/edit/published-status', () => {
			it('should return an error if one is returned', async () => {
				const expectedErrorMsg = 'There is an error.';
				nock('http://test/')
					.patch('/applications/123/documents')
					.reply(400, {
						errors: [
							{
								msg: expectedErrorMsg,
								type: 'missing-properties'
							}
						]
					});
				const response = await request
					.post(`${baseUrlNotChecked}/published-status`)
					.send({ publishedStatus: 'ready_to_publish' });
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('There is a problem');
				expect(element.innerHTML).toContain(expectedErrorMsg);
			});
		});

		describe('POST /case/123/project-documentation/18/document/110/edit/published-status', () => {
			it('should redirect to document properties page if there is no error', async () => {
				nock('http://test/')
					.patch('/applications/123/documents')
					.reply(200, [
						{
							guid: '110',
							status: 'checked',
							redactedStatus: 'redacted'
						}
					]);
				const response = await request
					.post(`${baseUrlNotChecked}/published-status`)
					.send({ publishedStatus: 'checked' });
				expect(response?.headers?.location).toEqual('../properties');
			});
		});

		describe('POST /case/123/project-documentation/18/document/110/edit/published-status Ready To Publish Success', () => {
			it('should redirect to document properties page if there is no error for ready_to_publish', async () => {
				nock('http://test/')
					.patch('/applications/123/documents')
					.reply(200, [
						{
							guid: '110',
							status: 'ready_to_publish',
							redactedStatus: 'redacted'
						}
					]);
				const response = await request
					.post(`${baseUrlNotChecked}/published-status`)
					.send({ publishedStatus: 'ready_to_publish' });
				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});
});

const {
	app: appUnauth,
	installMockApi: installMockApiUnauth,
	teardown: teardownUnauth
} = createTestEnvironment({ authenticated: true, groups: ['not_valid_group'] });

const requestUnauth = supertest(appUnauth);

describe('Project documentation metadata pages when user belongs to wrong group', () => {
	beforeEach(installMockApiUnauth);
	afterEach(teardownUnauth);

	describe('GET /applications-service/case/123/project-documentation/18/document/456/edit', () => {
		it('should not render the page due to an authentication error', async () => {
			const response = await requestUnauth.get(
				'/applications-service/case/123/project-documentation/18/document/456/edit'
			);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('You are not permitted to access this URL');
		});
	});
});
