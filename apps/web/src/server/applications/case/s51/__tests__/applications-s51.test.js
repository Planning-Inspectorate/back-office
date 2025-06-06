import { jest } from '@jest/globals';
import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';
import {
	fixtureDocumentationFolderPath,
	fixtureS51Folder
} from '../../../../../../testing/applications/fixtures/options-item.js';
import { fixtureCases } from '../../../../../../testing/applications/applications.js';
import { fixturePaginatedS51Advice } from '../../../../../../testing/applications/fixtures/s51-advice.js';
import { createS51Advice } from '../../../../../../testing/applications/factory/s51-advice.js';
import { buildPageTitle, getPageTitle } from '../../../../../../testing/util/title.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications').reply(200, []);

	nock('http://test/').get('/applications/123').times(3).reply(200, fixtureCases[3]);
	nock('http://test/').get('/applications/123/folders/21').times(2).reply(200, fixtureS51Folder);
	nock('http://test/')
		.post('/applications/123/s51-advice')
		.reply(200, fixturePaginatedS51Advice(1, 50));
	nock('http://test/')
		.post('/applications/123/s51-advice/ready-to-publish')
		.reply(200, fixturePaginatedS51Advice(1, 50));

	nock('http://test/')
		.get('/applications/123/s51-advice/1')
		.reply(200, createS51Advice({ id: 1 }));

	nock('http://test/')
		.get('/applications/123/folders/21/parent-folders')
		.times(2)
		.reply(200, fixtureDocumentationFolderPath);
};

const projectName = 'Title CASE/04';

const mockDate = new Date('2023-11-01T00:00:00Z');

describe('S51 Advice', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	beforeEach(async () => {
		nocks();
	});

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/123/project-documentation/21/s51-advice';

	describe('S51 folder page', () => {
		describe('GET /case/123/project-documentation/21/s51-advice/', () => {
			it('should render the page', async () => {
				await request.get('/applications-service/');
				const response = await request.get(`${baseUrl}`);
				const element = parseHtml(response.text);

				expect(getPageTitle(response)).toEqual(buildPageTitle(['S51 advice folder', projectName]));
				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('S51 advice folder');
			});

			describe('Published dates', () => {
				it('should display Not published status', async () => {
					const mockS51s = fixturePaginatedS51Advice(1, 50);
					mockS51s.items = [createS51Advice({ id: 123, publishedStatus: 'checked' })];

					nock('http://test/')
						.get('/applications/123/s51-advice?page=1&pageSize=50')
						.reply(200, mockS51s);

					const response = await request.get(
						'/applications-service/case/123/project-documentation/21/s51-advice'
					);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toContain('Not published');
				});

				it('should display Published status and date if both available', async () => {
					const mockS51s = fixturePaginatedS51Advice(1, 50);
					mockS51s.items = [createS51Advice({ id: 123 })];
					mockS51s.items[0].datePublished = 1711445797;
					mockS51s.items[0].publishedStatus = 'published';
					nock('http://test/')
						.get('/applications/123/s51-advice?page=1&pageSize=50')
						.reply(200, mockS51s);

					const response = await request.get(
						'/applications-service/case/123/project-documentation/21/s51-advice'
					);
					const element = parseHtml(response.text);

					expect(element.innerHTML).not.toContain('Not published');
					expect(element.innerHTML).toContain('26 Mar 2024');
				});

				it('should display Published status and Updated date if pub date not available', async () => {
					const mockS51s = fixturePaginatedS51Advice(1, 50);
					mockS51s.items = [createS51Advice({ id: 123 })];
					mockS51s.items[0].datePublished = null;
					mockS51s.items[0].dateUpdated = 1708940197;
					mockS51s.items[0].publishedStatus = 'published';
					nock('http://test/')
						.get('/applications/123/s51-advice?page=1&pageSize=50')
						.reply(200, mockS51s);

					const response = await request.get(
						'/applications-service/case/123/project-documentation/21/s51-advice'
					);
					const element = parseHtml(response.text);

					expect(element.innerHTML).not.toContain('Not published');
					expect(element.innerHTML).toContain('26 Feb 2024');
				});
			});
		});
	});

	describe('S51 creation journey', () => {
		describe('Title', () => {
			describe('GET /case/123/project-documentation/21/s51-advice/create/title', () => {
				it('should render the page', async () => {
					await request.get('/applications-service/');

					const response = await request.get(`${baseUrl}/create/title`);
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Enter the S51 advice title', 'Title CASE/04'])
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Enter the S51 advice title');

					const backElement = parseHtml(response.text, { rootElement: '.govuk-back-link' });
					expect(backElement.innerHTML).toContain(baseUrl);
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/create/title', () => {
				beforeEach(async () => {
					await request.get('/applications-service/');
				});

				it('Should return error if title is not provided', async () => {
					const response = await request.post(`${baseUrl}/create/title`).send({});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('You must enter a S51 advice title');
				});

				it('Should display error if s51 with the same title already exists', async () => {
					nock('http://test/').head('/applications/123/title/').reply(200, []);
					const title = 'existing title';
					const urlTitle = title.trim().replace(/\s/g, '%20');

					nock('http://test/')
						.head(`/applications/123/s51-advice/title-unique/${urlTitle}`)
						.reply(500, []);

					const response = await request
						.post(`${baseUrl}/create/title`)
						.send({ title: 'existing title' });

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Enter the S51 advice title', 'Title CASE/04'], { error: true })
					);

					const element = parseHtml(response.text);
					expect(element.innerHTML).toContain('Enter a new title');
				});

				it('Should go to next page if title is provided', async () => {
					nock('http://test/').head('/applications/123/title/').reply(200, []);
					const title = 'sent s51 title';
					const urlTitle = title.trim().replace(/\s/g, '%20');

					nock('http://test/')
						.head(`/applications/123/s51-advice/title-unique/${urlTitle}`)
						.reply(200, []);

					const response = await request.post(`${baseUrl}/create/title`).send({ title });

					expect(response?.headers?.location).toEqual('../create/enquirer');

					// test value is saved in the session
					const response2 = await request.get(`${baseUrl}/create/title`);
					const element = parseHtml(response2.text);

					expect(getPageTitle(response2)).toEqual(
						buildPageTitle(['Enter the S51 advice title', 'Title CASE/04'])
					);
					expect(element.innerHTML).toContain('sent s51 title');
				});
			});
		});

		describe('Enquirer', () => {
			beforeEach(async () => {
				await request.get('/applications-service/');
			});

			describe('GET /case/123/project-documentation/21/s51-advice/create/enquirer', () => {
				it('should render the page', async () => {
					const response = await request.get(`${baseUrl}/create/enquirer`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Enter who the enquiry was from');

					const backElement = parseHtml(response.text, { rootElement: '.govuk-back-link' });

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Enter who the enquiry was from', 'Title CASE/04'])
					);
					expect(backElement.innerHTML).toContain(`"${baseUrl}/create/title"`);
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/create/enquirer', () => {
				it('Should return error if no data is provided', async () => {
					const response = await request.post(`${baseUrl}/create/enquirer`).send({});
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Enter who the enquiry was from', 'Title CASE/04'], { error: true })
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('You must enter either a name, organisation or both');
				});

				it('Should return error if name is provided with no lastname', async () => {
					const response = await request
						.post(`${baseUrl}/create/enquirer`)
						.send({ enquirerFirstName: 'Joe' });
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Enter who the enquiry was from', 'Title CASE/04'], { error: true })
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('You must enter a last name');
				});

				it('Should return error if last name is provided with no name', async () => {
					const response = await request
						.post(`${baseUrl}/create/enquirer`)
						.send({ enquirerLastName: 'Joe' });
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Enter who the enquiry was from', 'Title CASE/04'], { error: true })
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('You must enter a first name');
				});

				it('Should go to next page if data is provided', async () => {
					const response = await request.post(`${baseUrl}/create/enquirer`).send({
						enquirerFirstName: 'Joe',
						enquirerLastName: 'Doe',
						enquirerOrganisation: 'Joes Organization'
					});

					expect(response?.headers?.location).toEqual('../create/method');

					// test data is saved in the session
					const response2 = await request.get(`${baseUrl}/create/enquirer`);
					const element = parseHtml(response2.text);
					expect(getPageTitle(response2)).toEqual(
						buildPageTitle(['Enter who the enquiry was from', 'Title CASE/04'])
					);
					expect(element.innerHTML).toContain('Joe');
					expect(element.innerHTML).toContain('Doe');
					expect(element.innerHTML).toContain('Joes Organization');
				});
			});
		});

		describe('Method', () => {
			beforeEach(async () => {
				await request.get('/applications-service/');
			});

			describe('GET /case/123/project-documentation/21/s51-advice/create/method', () => {
				it('should render the page', async () => {
					const response = await request.get(`${baseUrl}/create/method`);
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Select the method of enquiry', 'Title CASE/04'])
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Select the method of enquiry');

					const backElement = parseHtml(response.text, { rootElement: '.govuk-back-link' });
					expect(backElement.innerHTML).toContain(`"${baseUrl}/create/enquirer"`);
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/create/method', () => {
				it('Should return error if no data is provided', async () => {
					const response = await request.post(`${baseUrl}/create/method`).send({});
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Select the method of enquiry', 'Title CASE/04'], { error: true })
					);
					expect(element.innerHTML).toContain('You must select a method of enquiry');
				});

				it('Should go to next page if data is provided', async () => {
					const response = await request.post(`${baseUrl}/create/method`).send({
						enquiryMethod: 'email'
					});
					expect(response?.headers?.location).toEqual('../create/enquiry-details');

					// test data is saved in the session
					const response2 = await request.get(`${baseUrl}/create/method`);
					const element = parseHtml(response2.text);
					expect(getPageTitle(response2)).toEqual(
						buildPageTitle(['Select the method of enquiry', 'Title CASE/04'])
					);
					expect(element.innerHTML).toContain('value="email" checked');
				});
			});
		});

		describe('Enquiry details', () => {
			beforeEach(async () => {
				await request.get('/applications-service/');
			});

			describe('GET /case/123/project-documentation/21/s51-advice/create/enquiry-details', () => {
				it('should render the page', async () => {
					const response = await request.get(`${baseUrl}/create/enquiry-details`);
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Enquiry details', 'Title CASE/04'])
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Enquiry details');

					const backElement = parseHtml(response.text, { rootElement: '.govuk-back-link' });
					expect(backElement.innerHTML).toContain(`"${baseUrl}/create/method"`);
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/create/enquiry-details', () => {
				it('Should return error if no data is provided', async () => {
					const response = await request.post(`${baseUrl}/create/enquiry-details`).send({});
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Enquiry details', 'Title CASE/04'], { error: true })
					);
					expect(element.innerHTML).toContain('You must enter the date');
					expect(element.innerHTML).toContain('You must enter the enquiry details');
				});

				it('Should return error if date is not correct', async () => {
					const response = await request.post(`${baseUrl}/create/enquiry-details`).send({
						'enquiryDate.day': '1',
						'enquiryDate.month': '13',
						'enquiryDate.year': '201',
						enquiryDetails: 'Some details'
					});

					const element = parseHtml(response.text);

					expect(element.innerHTML).toContain('Enter a valid');
				});

				it('Should return error if date is in the future', async () => {
					const response = await request.post(`${baseUrl}/create/enquiry-details`).send({
						'enquiryDate.day': '01',
						'enquiryDate.month': '12',
						'enquiryDate.year': '2030',
						enquiryDetails: 'Some details'
					});
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Enquiry details', 'Title CASE/04'], { error: true })
					);
					expect(element.innerHTML).toContain('The date cannot be in the future');
				});

				it('Should go to next page if data is provided', async () => {
					const response = await request.post(`${baseUrl}/create/enquiry-details`).send({
						'enquiryDate.day': '01',
						'enquiryDate.month': '12',
						'enquiryDate.year': '2020',
						enquiryDetails: 'Some details'
					});
					expect(response?.headers?.location).toEqual('../create/person');

					// test data is saved in the session
					const response2 = await request.get(`${baseUrl}/create/enquiry-details`);
					const element = parseHtml(response2.text);
					expect(getPageTitle(response2)).toEqual(
						buildPageTitle(['Enquiry details', 'Title CASE/04'])
					);
					expect(element.innerHTML).toContain('01');
					expect(element.innerHTML).toContain('12');
					expect(element.innerHTML).toContain('2020');
					expect(element.innerHTML).toContain('Some details');
				});
			});
		});

		describe('Person', () => {
			beforeEach(async () => {
				await request.get('/applications-service/');
			});

			describe('GET /case/123/project-documentation/21/s51-advice/create/person', () => {
				it('should render the page', async () => {
					const response = await request.get(`${baseUrl}/create/person`);
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Enter who gave the advice', 'Title CASE/04'])
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Enter the name of the person who gave the advice');

					const backElement = parseHtml(response.text, { rootElement: '.govuk-back-link' });
					expect(backElement.innerHTML).toContain(`"${baseUrl}/create/enquiry-details"`);
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/create/person', () => {
				it('Should return error if no data is provided', async () => {
					const response = await request.post(`${baseUrl}/create/person`).send({});
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Enter who gave the advice', 'Title CASE/04'], { error: true })
					);
					expect(element.innerHTML).toContain('You must enter a name');
				});

				it('Should go to next page if data is provided', async () => {
					const response = await request.post(`${baseUrl}/create/person`).send({
						adviser: 'Joe Doe'
					});
					expect(response?.headers?.location).toEqual('../create/advice-details');

					// test data is saved in the session
					const response2 = await request.get(`${baseUrl}/create/person`);
					const element = parseHtml(response2.text);
					expect(getPageTitle(response2)).toEqual(
						buildPageTitle(['Enter who gave the advice', 'Title CASE/04'])
					);
					expect(element.innerHTML).toContain('Joe Doe');
				});
			});
		});

		describe('Advice details', () => {
			beforeEach(async () => {
				await request.get('/applications-service/');
			});

			describe('GET /case/123/project-documentation/21/s51-advice/create/advice-details', () => {
				it('should render the page', async () => {
					const response = await request.get(`${baseUrl}/create/advice-details`);

					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(buildPageTitle(['Advice details', projectName]));
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Advice details');

					const backElement = parseHtml(response.text, { rootElement: '.govuk-back-link' });
					expect(backElement.innerHTML).toContain(`"${baseUrl}/create/person"`);
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/create/advice-details', () => {
				it('Should return error if no data is provided', async () => {
					const response = await request.post(`${baseUrl}/create/advice-details`).send({});
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Advice details', projectName], { error: true })
					);
					expect(element.innerHTML).toContain('You must enter the date');
					expect(element.innerHTML).toContain('You must enter the advice given');
				});

				it('Should return error if date is not correct', async () => {
					const response = await request.post(`${baseUrl}/create/advice-details`).send({
						'adviceDate.day': '1',
						'adviceDate.month': '13',
						'adviceDate.year': '201',
						enquiryDetails: 'Some details'
					});

					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Advice details', projectName], { error: true })
					);
					expect(element.innerHTML).toContain('Enter a valid');
				});

				it('Should return error if date is in the future', async () => {
					const response = await request.post(`${baseUrl}/create/advice-details`).send({
						'adviceDate.day': '01',
						'adviceDate.month': '12',
						'adviceDate.year': '2030',
						enquiryDetails: 'Some details'
					});
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Advice details', projectName], { error: true })
					);
					expect(element.innerHTML).toContain('The date cannot be in the future');
				});

				it('Should go to next page if data is provided', async () => {
					const response = await request.post(`${baseUrl}/create/advice-details`).send({
						'adviceDate.day': '01',
						'adviceDate.month': '12',
						'adviceDate.year': '2020',
						adviceDetails: 'Some details'
					});
					expect(response?.headers?.location).toEqual('../create/check-your-answers');

					// test data is saved in the session
					const response2 = await request.get(`${baseUrl}/create/advice-details`);
					const element = parseHtml(response2.text);

					expect(getPageTitle(response2)).toEqual(buildPageTitle(['Advice details', projectName]));
					expect(element.innerHTML).toContain('01');
					expect(element.innerHTML).toContain('12');
					expect(element.innerHTML).toContain('2020');
					expect(element.innerHTML).toContain('Some details');
				});
			});
		});

		describe('Check your answers', () => {
			beforeEach(async () => {
				await request.get('/applications-service/');
			});

			describe('GET /case/123/project-documentation/21/s51-advice/create/check-your-answers', () => {
				it('should render the page', async () => {
					const response = await request.get(`${baseUrl}/create/check-your-answers`);
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Check your answers before creating a new item', 'Title CASE/04'])
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Check your answers');
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/create/check-your-answers', () => {
				it('should display an error if data is not complete', async () => {
					const response = await request.post(`${baseUrl}/create/check-your-answers`);
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Check your answers before creating a new item', 'Title CASE/04'], {
							error: true
						})
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('An error occurred, please try again later');
				});

				it('should go to properties page showing a display banner if data is complete', async () => {
					nock('http://test/').post('/applications/s51-advice').reply(200, { id: 1 });

					const response = await request.post(`${baseUrl}/create/check-your-answers`).send({
						title: 'S51 title',
						enquirer: 's51 enquirer',
						firstName: 's51 first name',
						lastName: 's51 lastname',
						enquiryMethod: 'email',
						enquiryDate: '2020-01-01',
						enquiryDetails: 's51 enquiry details',
						adviser: 's51 adviser',
						adviceDate: '2021-01-01',
						adviceDetails: 's51 advice details'
					});

					expect(response?.headers?.location).toEqual('../../s51-advice/1/properties');

					const response2 = await request.get(`${baseUrl}/1/properties`);
					const element = parseHtml(response2.text);

					expect(getPageTitle(response2)).toEqual(
						buildPageTitle(['S51 advice properties', 'Title CASE/04'])
					);
					expect(element.innerHTML).toContain('New S51 advice item created');
				});
			});
		});
	});

	describe('S51 Properties', () => {
		beforeEach(async () => {
			await request.get('/applications-service/');
		});

		describe('GET /case/123/project-documentation/21/s51-advice/1/properties', () => {
			it('should render the page', async () => {
				const response = await request.get(`${baseUrl}/1/properties`);
				const element = parseHtml(response.text);

				expect(getPageTitle(response)).toEqual(
					buildPageTitle(['S51 advice properties', 'Title CASE/04'])
				);
				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('S51 advice properties');

				const backElement = parseHtml(response.text, { rootElement: '.govuk-back-link' });
				expect(backElement.innerHTML).toContain(baseUrl);
			});

			it('should display the attachments list', async () => {
				const response = await request.get(`${baseUrl}/1/properties#s51-attachments`);
				const element = parseHtml(response.text);

				expect(getPageTitle(response)).toEqual(
					buildPageTitle(['S51 advice properties', 'Title CASE/04'])
				);
				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('File name');
			});
		});
	});

	describe('S51 delete', () => {
		beforeEach(async () => {
			await request.get('/applications-service/');
		});

		describe('GET /case/123/project-documentation/21/s51-advice/1/delete', () => {
			it('should render the page', async () => {
				const response = await request.get(`${baseUrl}/1/delete`);
				const element = parseHtml(response.text);

				expect(getPageTitle(response)).toEqual(
					buildPageTitle(['Delete selected S51 advice', 'Title CASE/04'])
				);
				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Delete selected S51 advice');

				const backElement = parseHtml(response.text, { rootElement: '.govuk-back-link' });
				expect(backElement.innerHTML).toContain(`"${baseUrl}/1/properties"`);
			});
		});
	});

	describe('S51 Attachment delete', () => {
		beforeEach(async () => {
			await request.get('/applications-service/');
		});

		describe('GET /case/123/project-documentation/21/s51-advice/1/attachments/:documentGuid/delete', () => {
			beforeAll(() => {
				jest.useFakeTimers({ advanceTimers: true }).setSystemTime(mockDate);
			});

			afterAll(() => {
				jest.runOnlyPendingTimers();
				jest.useRealTimers();
			});

			it('should render the page', async () => {
				const documentGuid = createS51Advice({ id: 1 }).attachments[0].documentGuid;
				const response = await request.get(`${baseUrl}/1/attachments/${documentGuid}/delete`);
				const element = parseHtml(response.text);

				expect(getPageTitle(response)).toEqual(
					buildPageTitle(['Delete selected attachment', 'Title CASE/04'])
				);
				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Delete selected attachment');

				const backElement = parseHtml(response.text, { rootElement: '.govuk-back-link' });
				expect(backElement.innerHTML).toContain(`"${baseUrl}/1/properties#s51-attachments"`);
			});
		});

		describe('POST /case/123/project-documentation/21/s51-advice/1/attachments/:documentGuid/delete', () => {
			it('should render error if delete is NOT successful', async () => {
				const attachment = createS51Advice({ id: 1 }).attachments[0];

				nock('http://test/')
					.post(`/applications/123/documents/${attachment.documentGuid}/delete`)
					.reply(500, {});

				const response = await request
					.post(`${baseUrl}/1/attachments/${attachment.documentGuid}/delete`)
					.send({
						documentName: attachment.documentName,
						dateAdded: attachment.dateAdded
					});

				const element = parseHtml(response.text);

				expect(getPageTitle(response)).toEqual(
					buildPageTitle(['Delete selected S51 advice', 'Title CASE/04'], { error: true })
				);
				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Your item could not be deleted');
			});

			it('should render success banner if delete is successful', async () => {
				const attachment = createS51Advice({ id: 1 }).attachments[0];

				nock('http://test/')
					.post(`/applications/123/documents/${attachment.documentGuid}/delete`)
					.reply(200, {});

				const response = await request
					.post(`${baseUrl}/1/attachments/${attachment.documentGuid}/delete`)
					.send({
						documentName: attachment.documentName,
						dateAdded: attachment.dateAdded
					});

				const element = parseHtml(response.text);

				expect(getPageTitle(response)).toEqual(
					buildPageTitle(['Attachment deleted successfully', projectName])
				);
				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Attachment deleted successfully');
			});
		});
	});

	describe('S51 publishing queue', () => {
		beforeEach(async () => {
			await request.get('/applications-service/');
		});

		describe('GET /case/123/project-documentation/21/s51-advice/s51-queue', () => {
			it('should render the page', async () => {
				const response = await request.get(`${baseUrl}/publishing-queue`);
				const element = parseHtml(response.text);

				expect(getPageTitle(response)).toEqual(
					buildPageTitle(['S51 advice publishing queue', 'Title CASE/04'])
				);
				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Select items for publishing');

				const backElement = parseHtml(response.text, { rootElement: '.govuk-back-link' });
				expect(backElement.innerHTML).toContain(baseUrl);
			});
		});

		describe('GET /case/123/project-documentation/21/s51-advice/s51-queue/remove/:adviceId', () => {
			it('should display an error if the API returned an error', async () => {
				const response = await request.get(`${baseUrl}/publishing-queue/remove/1`);
				const element = parseHtml(response.text);

				expect(getPageTitle(response)).toEqual(
					buildPageTitle(['S51 advice publishing queue', 'Title CASE/04'], { error: true })
				);
				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Select items for publishing');
				expect(element.innerHTML).toContain('An error occurred, please try again later');
			});

			it('should go to s51 page if API did not return an error', async () => {
				nock('http://test/').post('/applications/123/s51-advice/remove-queue-item').reply(200, {});
				const response = await request.get(`${baseUrl}/publishing-queue/remove/1`);

				expect(response?.headers?.location).toEqual('../../');
			});
		});
	});

	describe('S51 edit Welsh properties', () => {
		describe('S51 title in Welsh', () => {
			describe('GET /case/123/project-documentation/21/s51-advice/222/edit/title-in-welsh', () => {
				it('should render the page', async () => {
					await request.get('/applications-service/');

					const response = await request.get(`${baseUrl}/222/edit/title-in-welsh`);
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['S51 title in Welsh', 'Title CASE/04'])
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('S51 title in Welsh');

					const backElement = parseHtml(response.text, { rootElement: '.govuk-back-link' });
					expect(backElement.innerHTML).toContain(baseUrl);
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/edit/title-in-welsh', () => {
				beforeEach(async () => {
					await request.get('/applications-service/');
				});

				it('Should return error if title in Welsh is not provided', async () => {
					const response = await request.post(`${baseUrl}/222/edit/title-in-welsh`).send({});
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['S51 title in Welsh', 'Title CASE/04'], { error: true })
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Enter the S51 title in Welsh');
				});

				it('Should return error if title in Welsh has more than 250 characters', async () => {
					const response = await request.post(`${baseUrl}/222/edit/title-in-welsh`).send({
						titleWelsh: 'X'.repeat(300)
					});
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['S51 title in Welsh', 'Title CASE/04'], { error: true })
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain(
						'The S51 title in Welsh must be 255 characters or fewer'
					);
				});
			});
		});

		describe('S51 enquiry details in Welsh', () => {
			describe('GET /case/123/project-documentation/21/s51-advice/222/edit/enquiry-detail-in-welsh', () => {
				it('should render the page', async () => {
					await request.get('/applications-service/');

					const response = await request.get(`${baseUrl}/222/edit/enquiry-detail-in-welsh`);
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Enquiry details in Welsh', 'Title CASE/04'])
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Enquiry details in Welsh');

					const backElement = parseHtml(response.text, { rootElement: '.govuk-back-link' });
					expect(backElement.innerHTML).toContain(baseUrl);
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/edit/enquiry-detail-in-welsh', () => {
				beforeEach(async () => {
					await request.get('/applications-service/');
				});

				it('Should return error if enquiry details in Welsh is not provided', async () => {
					const response = await request
						.post(`${baseUrl}/222/edit/enquiry-detail-in-welsh`)
						.send({});
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Enquiry details in Welsh', 'Title CASE/04'], { error: true })
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Enter the S51 Enquiry details in Welsh');
				});

				it('Should return error if enquiry details in Welsh has more than 250 characters', async () => {
					const response = await request.post(`${baseUrl}/222/edit/enquiry-detail-in-welsh`).send({
						enquiryDetailsWelsh: 'X'.repeat(300)
					});
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Enquiry details in Welsh', 'Title CASE/04'], { error: true })
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain(
						'The S51 Enquiry details in Welsh must be 255 characters or fewer'
					);
				});
			});
		});

		describe('S51 advice given in Welsh', () => {
			describe('GET /case/123/project-documentation/21/s51-advice/222/edit/advice-detail-in-welsh', () => {
				it('should render the page', async () => {
					await request.get('/applications-service/');

					const response = await request.get(`${baseUrl}/222/edit/advice-detail-in-welsh`);
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Advice given in Welsh', 'Title CASE/04'])
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Advice given in Welsh');

					const backElement = parseHtml(response.text, { rootElement: '.govuk-back-link' });
					expect(backElement.innerHTML).toContain(baseUrl);
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/edit/advice-detail-in-welsh', () => {
				beforeEach(async () => {
					await request.get('/applications-service/');
				});

				it('Should return error if advice given in Welsh is not provided', async () => {
					const response = await request
						.post(`${baseUrl}/222/edit/advice-detail-in-welsh`)
						.send({});
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Advice given in Welsh', 'Title CASE/04'], { error: true })
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Enter the S51 Advice given in Welsh');
				});

				it('Should return error if advice given in Welsh has more than 250 characters', async () => {
					const response = await request.post(`${baseUrl}/222/edit/advice-detail-in-welsh`).send({
						adviceDetailsWelsh: 'X'.repeat(300)
					});
					const element = parseHtml(response.text);

					expect(getPageTitle(response)).toEqual(
						buildPageTitle(['Advice given in Welsh', 'Title CASE/04'], { error: true })
					);
					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain(
						'The S51 Advice given in Welsh must be 255 characters or fewer'
					);
				});
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

describe('S51 pages when user belongs to wrong group', () => {
	beforeEach(installMockApiUnauth);
	afterEach(teardownUnauth);

	describe('GET /applications-service/case/123/project-documentation/21/s51-advice', () => {
		it('should not render the page due to an authentication error', async () => {
			const response = await requestUnauth.get(
				'/applications-service/case/123/project-documentation/21/s51-advice'
			);

			const element = parseHtml(response.text);

			expect(getPageTitle(response)).toEqual(
				buildPageTitle(['Sorry, there is a problem with your login'])
			);
			expect(element.innerHTML).toContain('You are not permitted to access this URL');
		});
	});
});
