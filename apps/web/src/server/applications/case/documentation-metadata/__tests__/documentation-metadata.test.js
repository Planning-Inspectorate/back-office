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

const examinationLibraryCategories = [
	{
		id: 3,
		caseId: 123,
		categoryCode: 'APP',
		categoryName: 'Application form',
		publishedStatus: 'in progress',
		source: 'STATIC',
		examinationTimetableItemId: null
	},
	{
		id: 4,
		caseId: 123,
		categoryCode: 'APP',
		categoryName: 'Plans',
		publishedStatus: 'in progress',
		source: 'STATIC',
		examinationTimetableItemId: null
	},
	{
		id: 7,
		caseId: 123,
		categoryCode: 'APP',
		categoryName: 'Reports',
		publishedStatus: 'in progress',
		source: 'STATIC',
		examinationTimetableItemId: null
	},
	{
		id: 10,
		caseId: 123,
		categoryCode: 'AoC',
		categoryName: 'Adequacy of consultation responses',
		publishedStatus: 'in progress',
		source: 'STATIC',
		examinationTimetableItemId: null
	},
	{
		id: 11,
		caseId: 123,
		categoryCode: 'PD',
		categoryName: 'Procedural decisions and notifications from Examining Authority',
		publishedStatus: 'in progress',
		source: 'STATIC',
		examinationTimetableItemId: null
	},
	{
		id: 12,
		caseId: 123,
		categoryCode: 'AS',
		categoryName: 'Additional submissions',
		publishedStatus: 'in progress',
		source: 'STATIC',
		examinationTimetableItemId: null
	},
	{
		id: 13,
		caseId: 123,
		categoryCode: 'OD',
		categoryName: 'Other documents',
		publishedStatus: 'in progress',
		source: 'STATIC',
		examinationTimetableItemId: null
	},
	{
		id: 14,
		caseId: 123,
		categoryCode: 'RR',
		categoryName: 'Relevant representations',
		publishedStatus: 'in progress',
		source: 'STATIC',
		examinationTimetableItemId: null
	},
	{
		id: 15,
		caseId: 123,
		categoryCode: 'NELC',
		categoryName: 'No examination library category',
		publishedStatus: 'in progress',
		source: 'STATIC',
		examinationTimetableItemId: null
	},
	{
		id: 20,
		caseId: 123,
		categoryCode: 'REPX',
		categoryName: 'Deadline 1',
		publishedStatus: 'in progress',
		source: 'TIMETABLE',
		examinationTimetableItemId: 1
	}
];

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
	nock('http://test/')
		.get('/applications/123/examination-library')
		.reply(200, examinationLibraryCategories);
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

	describe('Edit type of party', () => {
		describe('GET /case/123/project-documentation/18/document/456/edit/party-type', () => {
			it('should render the page with the party type options', async () => {
				const response = await request.get(`${baseUrl}/party-type`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Type of party');
				expect(element.innerHTML).toContain('Applicant');
				expect(element.innerHTML).toContain('Local authority');
				expect(element.innerHTML).toContain('Other council');
				expect(element.innerHTML).toContain('Statutory body');
				expect(element.innerHTML).toContain('Interested organisation');
				expect(element.innerHTML).toContain('Individual');
				expect(element.innerHTML).toContain('Planning Inspectorate');
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/party-type', () => {
			it('should return an error if no party type is selected', async () => {
				const response = await request.post(`${baseUrl}/party-type`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('There is a problem');
				expect(element.innerHTML).toContain('Select the type of party');
			});

			it('should redirect to document properties page if there is no error', async () => {
				const response = await request.post(`${baseUrl}/party-type`).send({
					typeOfParty: 'Applicant'
				});

				expect(response?.headers?.location).toEqual('../properties');
			});
		});
	});

	describe('Edit examination library category', () => {
		describe('GET /case/123/project-documentation/18/document/456/edit/examination-library-category', () => {
			it('should render the examination library category options', async () => {
				const response = await request.get(`${baseUrl}/examination-library-category`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();

				expect(element.innerHTML).toContain('Examination library category');

				expect(element.innerHTML).toContain('No examination library category');
				expect(element.innerHTML).toContain('Application documents (APP)');
				expect(element.innerHTML).toContain('Adequacy of consultation responses (AoC)');
				expect(element.innerHTML).toContain(
					'Procedural decisions and notifications from Examining Authority (PD)'
				);
				expect(element.innerHTML).toContain('Additional submissions (AS)');
				expect(element.innerHTML).toContain('Other documents (OD)');

				expect(element.innerHTML).toContain(
					'Updating the category will change the draft examination library reference.'
				);
			});

			it('should render APP categories in the select', async () => {
				const response = await request.get(`${baseUrl}/examination-library-category`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toContain('Application form');
				expect(element.innerHTML).toContain('Plans');
				expect(element.innerHTML).toContain('Reports');
			});

			it('should not render relevant representations or timetable categories', async () => {
				const response = await request.get(`${baseUrl}/examination-library-category`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).not.toContain('Relevant representations');
				expect(element.innerHTML).not.toContain('Deadline 1');
			});
		});

		describe('POST /case/123/project-documentation/18/document/456/edit/examination-library-category', () => {
			it('should return an error if no category is selected', async () => {
				const response = await request.post(`${baseUrl}/examination-library-category`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('There is a problem');
				expect(element.innerHTML).toContain('Select an examination library category');
			});

			it('should redirect to document properties page when a standard category is selected', async () => {
				const response = await request.post(`${baseUrl}/examination-library-category`).send({
					examinationLibraryCategoryId: '10'
				});

				expect(response.headers.location).toEqual('../properties');
			});

			it('should redirect to document properties page when an application document sub-category is selected', async () => {
				const response = await request.post(`${baseUrl}/examination-library-category`).send({
					examinationLibraryCategoryId: 'APP',
					examinationLibraryCategoryChild: '7'
				});

				expect(response.headers.location).toEqual('../properties');
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
