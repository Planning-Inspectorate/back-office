import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';

import { fixtureCases } from '../../../../../../testing/applications/applications.js';
import fixtureKeyDates from '../../../../../../testing/applications/fixtures/key-dates.js';
import { keyDatesProperty } from '../../../../../../src/server/lib/nunjucks-filters/key-dates-property.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications/case-team').reply(200, []);
	nock('http://test/').get('/applications/inspector').reply(200, []);

	nock('http://test/').get('/applications/123').times(2).reply(200, fixtureCases[3]);
	nock('http://test/').get('/applications/123/key-dates').times(2).reply(200, fixtureKeyDates);
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

	const baseUrl = '/applications-service/case/123/key-dates';

	describe('Key dates page', () => {
		describe('GET /case/123/key-dates/', () => {
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
					expect(element.innerHTML).toContain('Provide details on dates');
				});
			});
		});

		describe('Sections', () => {
			describe('GET /case/123/key-dates/:sectionName', () => {
				it('should render the page with the correct fields', async () => {
					for (let i = 0; i < Object.keys(fixtureKeyDates).length - 1; i++) {
						nocks();
						await request.get('/applications-service/case-team');

						const sectionName = Object.keys(fixtureKeyDates)[i];
						const firstFieldName = Object.keys(Object.values(fixtureKeyDates)[i])[0];

						const response = await request.get(`${baseUrl}/${sectionName}`);
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						const label = keyDatesProperty(firstFieldName).slice(0, 10);

						expect(element.innerHTML).toContain(label);
					}
				});
			});

			describe('POST /case/123/key-dates/:sectionName', () => {
				it('should show a validation error when updating a date in the wrong format', async () => {
					for (let i = 0; i < Object.keys(fixtureKeyDates).length - 1; i++) {
						nocks();
						await request.get('/applications-service/case-team');

						const sectionName = Object.keys(fixtureKeyDates)[i];
						const firstFieldName = Object.keys(Object.values(fixtureKeyDates)[i])[0];

						const response = await request.post(`${baseUrl}/${sectionName}`).send({
							[firstFieldName + '.year']: '1'
						});

						const element = parseHtml(response.text);

						expect(element.innerHTML).toContain('Enter a valid year');
					}
				});

				it('should show a api error if updating didnt work', async () => {
					for (let i = 0; i < Object.keys(fixtureKeyDates).length - 1; i++) {
						nocks();
						await request.get('/applications-service/case-team');

						const sectionName = Object.keys(fixtureKeyDates)[i];
						const firstFieldName = Object.keys(Object.values(fixtureKeyDates)[i])[0];
						nock('http://test/').patch('/applications/123/key-dates').reply(500, {});

						const response = await request.post(`${baseUrl}/${sectionName}`).send({
							[firstFieldName + '.day']: '01',
							[firstFieldName + '.month']: '02',
							[firstFieldName + '.year']: '2000'
						});
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).toContain('An error occurred, please try again later');
					}
				});

				it('should redirect to index page if updated did work', async () => {
					for (let i = 0; i < Object.keys(fixtureKeyDates).length - 1; i++) {
						nocks();
						await request.get('/applications-service/case-team');

						const sectionName = Object.keys(fixtureKeyDates)[i];
						const firstFieldName = Object.keys(Object.values(fixtureKeyDates)[i])[0];
						nock('http://test/').patch('/applications/123/key-dates').reply(200, {});

						const response = await request.post(`${baseUrl}/${sectionName}`).send({
							[firstFieldName + '.day']: '01',
							[firstFieldName + '.month']: '02',
							[firstFieldName + '.year']: '2000'
						});

						expect(response?.headers?.location).toEqual('../key-dates');
					}
				});
			});
		});
	});
});
