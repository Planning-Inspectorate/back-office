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

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications/case-team').reply(200, []);
	nock('http://test/').get('/applications/inspector').reply(200, []);

	nock('http://test/').get('/applications/123').times(2).reply(200, fixtureCases[3]);
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
			describe('If user is inspector', () => {
				it('should not render the page', async () => {
					await request.get('/applications-service/inspector');

					const response = await request.get(`${baseUrl}`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('problem with your login');
				});
			});

			describe('If user is not inspector', () => {
				it('should render the page', async () => {
					await request.get('/applications-service/case-team');

					const response = await request.get(`${baseUrl}`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('S51 advice folder');
				});
			});
		});
	});

	describe('S51 creation journey', () => {
		describe('Title', () => {
			describe('GET /case/123/project-documentation/21/s51-advice/create/title', () => {
				describe('If user is inspector', () => {
					it('should not render the page', async () => {
						await request.get('/applications-service/inspector');

						const response = await request.get(`${baseUrl}/create/title`);
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).toContain('problem with your login');
					});
				});

				describe('If user is not inspector', () => {
					it('should render the page', async () => {
						await request.get('/applications-service/case-team');

						const response = await request.get(`${baseUrl}/create/title`);
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).toContain('Enter the S51 advice title');
					});
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/create/title', () => {
				beforeEach(async () => {
					await request.get('/applications-service/case-team');
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

					const element = parseHtml(response.text);
					expect(element.innerHTML).toContain('Enter a new title');
				});

				it('Should go to next page if title is provided', async () => {
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
					expect(element.innerHTML).toContain('sent s51 title');
				});
			});
		});

		describe('Enquirer', () => {
			beforeEach(async () => {
				await request.get('/applications-service/case-team');
			});

			describe('GET /case/123/project-documentation/21/s51-advice/create/enquirer', () => {
				it('should render the page', async () => {
					const response = await request.get(`${baseUrl}/create/enquirer`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Enter who the enquiry was from');
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/create/enquirer', () => {
				it('Should return error if no data is provided', async () => {
					const response = await request.post(`${baseUrl}/create/enquirer`).send({});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('You must enter either a name, organisation or both');
				});

				it('Should return error if name is provided with no lastname', async () => {
					const response = await request
						.post(`${baseUrl}/create/enquirer`)
						.send({ enquirerFirstName: 'Joe' });
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('You must enter a last name');
				});

				it('Should return error if last name is provided with no name', async () => {
					const response = await request
						.post(`${baseUrl}/create/enquirer`)
						.send({ enquirerLastName: 'Joe' });
					const element = parseHtml(response.text);

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
					expect(element.innerHTML).toContain('Joe');
					expect(element.innerHTML).toContain('Doe');
					expect(element.innerHTML).toContain('Joes Organization');
				});
			});
		});

		describe('Method', () => {
			beforeEach(async () => {
				await request.get('/applications-service/case-team');
			});

			describe('GET /case/123/project-documentation/21/s51-advice/create/method', () => {
				it('should render the page', async () => {
					const response = await request.get(`${baseUrl}/create/method`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('How was the enquiry made?');
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/create/method', () => {
				it('Should return error if no data is provided', async () => {
					const response = await request.post(`${baseUrl}/create/method`).send({});
					const element = parseHtml(response.text);

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
					expect(element.innerHTML).toContain('value="email" checked');
				});
			});
		});

		describe('Enquiry details', () => {
			beforeEach(async () => {
				await request.get('/applications-service/case-team');
			});

			describe('GET /case/123/project-documentation/21/s51-advice/create/enquiry-details', () => {
				it('should render the page', async () => {
					const response = await request.get(`${baseUrl}/create/enquiry-details`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Enquiry details');
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/create/enquiry-details', () => {
				it('Should return error if no data is provided', async () => {
					const response = await request.post(`${baseUrl}/create/enquiry-details`).send({});
					const element = parseHtml(response.text);

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
					expect(element.innerHTML).toContain('01');
					expect(element.innerHTML).toContain('12');
					expect(element.innerHTML).toContain('2020');
					expect(element.innerHTML).toContain('Some details');
				});
			});
		});

		describe('Person', () => {
			beforeEach(async () => {
				await request.get('/applications-service/case-team');
			});

			describe('GET /case/123/project-documentation/21/s51-advice/create/person', () => {
				it('should render the page', async () => {
					const response = await request.get(`${baseUrl}/create/person`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Enter the name of the person who gave the advice');
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/create/person', () => {
				it('Should return error if no data is provided', async () => {
					const response = await request.post(`${baseUrl}/create/person`).send({});
					const element = parseHtml(response.text);

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
					expect(element.innerHTML).toContain('Joe Doe');
				});
			});
		});

		describe('Advice details', () => {
			beforeEach(async () => {
				await request.get('/applications-service/case-team');
			});

			describe('GET /case/123/project-documentation/21/s51-advice/create/advice-details', () => {
				it('should render the page', async () => {
					const response = await request.get(`${baseUrl}/create/advice-details`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Advice details');
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/create/advice-details', () => {
				it('Should return error if no data is provided', async () => {
					const response = await request.post(`${baseUrl}/create/advice-details`).send({});
					const element = parseHtml(response.text);

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
					expect(element.innerHTML).toContain('01');
					expect(element.innerHTML).toContain('12');
					expect(element.innerHTML).toContain('2020');
					expect(element.innerHTML).toContain('Some details');
				});
			});
		});

		describe('Check your answers', () => {
			beforeEach(async () => {
				await request.get('/applications-service/case-team');
			});

			describe('GET /case/123/project-documentation/21/s51-advice/create/check-your-answers', () => {
				it('should render the page', async () => {
					const response = await request.get(`${baseUrl}/create/check-your-answers`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Check your answers');
				});
			});

			describe('POST /case/123/project-documentation/21/s51-advice/create/check-your-answers', () => {
				it('should display an error if data is not complete', async () => {
					const response = await request.post(`${baseUrl}/create/check-your-answers`);
					const element = parseHtml(response.text);

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

					expect(element.innerHTML).toContain('New S51 advice item created');
				});
			});
		});
	});

	describe('S51 Properties', () => {
		beforeEach(async () => {
			await request.get('/applications-service/case-team');
		});

		describe('GET /case/123/project-documentation/21/s51-advice/1/properties', () => {
			it('should render the page', async () => {
				const response = await request.get(`${baseUrl}/1/properties`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('S51 advice properties');
			});

			it('should display the attachments list', async () => {
				const response = await request.get(`${baseUrl}/1/properties#s51-attachments`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('File name');
			});
		});
	});

	describe('S51 Attachment delete', () => {
		beforeEach(async () => {
			await request.get('/applications-service/case-team');
		});

		describe('GET /case/123/project-documentation/21/s51-advice/1/delete/:documentGuid', () => {
			it('should render the page', async () => {
				const documentGuid = createS51Advice({ id: 1 }).attachments[0].documentGuid;
				const response = await request.get(`${baseUrl}/1/delete/${documentGuid}`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Delete selected attachment');
			});
		});

		describe('POST /case/123/project-documentation/21/s51-advice/1/delete/:documentGuid', () => {
			it('should render error if delete is NOT successful', async () => {
				const attachment = createS51Advice({ id: 1 }).attachments[0];

				nock('http://test/')
					.post(`/applications/123/documents/${attachment.documentGuid}/delete`)
					.reply(500, {});

				const response = await request.post(`${baseUrl}/1/delete/${attachment.documentGuid}`).send({
					documentName: attachment.documentName,
					dateAdded: attachment.dateAdded
				});

				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Your item could not be deleted');
			});

			it('should render success banner if delete is successful', async () => {
				const attachment = createS51Advice({ id: 1 }).attachments[0];

				nock('http://test/')
					.post(`/applications/123/documents/${attachment.documentGuid}/delete`)
					.reply(200, {});

				const response = await request.post(`${baseUrl}/1/delete/${attachment.documentGuid}`).send({
					documentName: attachment.documentName,
					dateAdded: attachment.dateAdded
				});

				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Attachmment deleted successfully');
			});
		});
	});

	describe('S51 publishing queue', () => {
		beforeEach(async () => {
			await request.get('/applications-service/case-team');
		});

		describe('GET /case/123/project-documentation/21/s51-advice/s51-queue', () => {
			it('should render the page', async () => {
				const response = await request.get(`${baseUrl}/publishing-queue`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Select items for publishing');
			});
		});

		describe('GET /case/123/project-documentation/21/s51-advice/s51-queue/remove/:adviceId', () => {
			it('should display an error if the API returned an error', async () => {
				const response = await request.get(`${baseUrl}/publishing-queue/remove/1`);
				const element = parseHtml(response.text);

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
});
