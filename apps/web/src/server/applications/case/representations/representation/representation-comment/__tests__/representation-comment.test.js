import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../../testing/index.js';
import { representationFixture } from '../../../__fixtures__/representations.fixture.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const mockCaseReference = { title: 'mock title', status: 'in test', reference: 'mock reference' };

const nocks = () => {
	nock('http://test/').get('/applications/1').reply(200, mockCaseReference);
	nock('http://test/').get('/applications/1/representations/1').reply(200, representationFixture);
	nock('http://test/')
		.patch(`/applications/1/representations/1`, {
			originalRepresentation: 'test',
			received: '2023-01-01T00:00:00.000Z'
		})
		.reply(200, { message: 'ok' });
};

describe('Representation comment page', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl =
		'/applications-service/case/1/relevant-representations/add-representation?repId=1';

	describe('GET /applications-service/case/1/relevant-representations/add-representation', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl + '&repType=represented');
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /applications-service/case/1/relevant-representations/add-representation', () => {
		beforeEach(async () => {
			nocks();
		});

		describe('Represented', () => {
			it('should redirect to the next page', async () => {
				const response = await request.post(baseUrl + '&repType=represented').send({
					originalRepresentation: 'test',
					'received-date-year': '2023',
					'received-date-month': '1',
					'received-date-day': '1'
				});

				expect(response?.headers?.location).toEqual(
					'/applications-service/case/1/relevant-representations/attachment-upload?repId=1&repType=represented'
				);
			});
		});

		describe('Representative', () => {
			it('should redirect to the next page', async () => {
				const response = await request.post(baseUrl + '&repType=represented').send({
					originalRepresentation: 'test',
					'received-date-year': '2023',
					'received-date-month': '1',
					'received-date-day': '1'
				});

				expect(response?.headers?.location).toEqual(
					'/applications-service/case/1/relevant-representations/attachment-upload?repId=1&repType=represented'
				);
			});
		});

		describe('Field validation:', () => {
			beforeEach(async () => {
				nocks();
			});

			it('should show validation error if received date is empty', async () => {
				const response = await request.post(baseUrl).send({
					originalRepresentation: 'test',
					'received-date-year': '',
					'received-date-month': '',
					'received-date-day': ''
				});

				const element = parseHtml(response.text);
				const dayInput = element.querySelector('#received-date-day');
				const monthInput = element.querySelector('#received-date-month');
				const yearInput = element.querySelector('#received-date-year');

				expect(element.innerHTML).toContain('Enter the date');
				expect(dayInput?.outerHTML).toContain('govuk-input--error');
				expect(monthInput?.outerHTML).toContain('govuk-input--error');
				expect(yearInput?.outerHTML).toContain('govuk-input--error');
			});

			it('should show validation error if received date is in the future', async () => {
				const response = await request.post(baseUrl).send({
					originalRepresentation: 'test',
					'received-date-year': '2099',
					'received-date-month': '1',
					'received-date-day': '1'
				});

				const element = parseHtml(response.text);
				const dayInput = element.querySelector('#received-date-day');
				const monthInput = element.querySelector('#received-date-month');
				const yearInput = element.querySelector('#received-date-year');

				expect(element.innerHTML).toContain('Date received must be today or in the past');
				expect(dayInput?.outerHTML).toContain('govuk-input--error');
				expect(monthInput?.outerHTML).toContain('govuk-input--error');
				expect(yearInput?.outerHTML).toContain('govuk-input--error');
			});

			it('should show validation error if day value is not within range for given month', async () => {
				const response = await request.post(baseUrl).send({
					originalRepresentation: 'test',
					'received-date-day': '35',
					'received-date-month': '12',
					'received-date-year': '2000'
				});

				const element = parseHtml(response.text);
				const dayInput = element.querySelector('#received-date-day');

				expect(element.innerHTML).toContain('must be a real date');
				expect(dayInput?.outerHTML).toContain('govuk-input--error');
			});

			it('should show validation error if month value is not within 1-12 range', async () => {
				const response = await request.post(baseUrl).send({
					originalRepresentation: 'test',
					'received-date-day': '1',
					'received-date-month': '14',
					'received-date-year': '2000'
				});

				const element = parseHtml(response.text);
				const monthInput = element.querySelector('#received-date-month');

				expect(element.innerHTML).toContain('must be a real date');
				expect(monthInput?.outerHTML).toContain('govuk-input--error');
			});

			it('should show validation error if year value is not within 1000-9999 range', async () => {
				const response = await request.post(baseUrl).send({
					originalRepresentation: 'test',
					'received-date-day': '1',
					'received-date-month': '1',
					'received-date-year': '1'
				});

				const element = parseHtml(response.text);
				const yearInput = element.querySelector('#received-date-year');

				expect(element.innerHTML).toContain('must be a real date');
				expect(yearInput?.outerHTML).toContain('govuk-input--error');
			});

			it('should show validation error if day value is not entered', async () => {
				const response = await request.post(baseUrl).send({
					originalRepresentation: 'test',
					'received-date-day': '',
					'received-date-month': '12',
					'received-date-year': '2000'
				});

				const element = parseHtml(response.text);
				const dayInput = element.querySelector('#received-date-day');

				expect(element.innerHTML).toContain('must include a day');
				expect(dayInput?.outerHTML).toContain('govuk-input--error');
			});

			it('should show validation error if day and month values are not entered', async () => {
				const response = await request.post(baseUrl).send({
					originalRepresentation: 'test',
					'received-date-day': '',
					'received-date-month': '',
					'received-date-year': '2000'
				});

				const element = parseHtml(response.text);
				const dayInput = element.querySelector('#received-date-day');
				const monthInput = element.querySelector('#received-date-month');

				expect(element.innerHTML).toContain('must include a day and month');
				expect(dayInput?.outerHTML).toContain('govuk-input--error');
				expect(monthInput?.outerHTML).toContain('govuk-input--error');
			});

			it('should show validation error if day and year values are not entered', async () => {
				const response = await request.post(baseUrl).send({
					originalRepresentation: 'test',
					'received-date-day': '',
					'received-date-month': '1',
					'received-date-year': ''
				});

				const element = parseHtml(response.text);
				const dayInput = element.querySelector('#received-date-day');
				const yearInput = element.querySelector('#received-date-year');

				expect(element.innerHTML).toContain('must include a day and year');
				expect(dayInput?.outerHTML).toContain('govuk-input--error');
				expect(yearInput?.outerHTML).toContain('govuk-input--error');
			});

			it('should show validation error if month value is not entered', async () => {
				const response = await request.post(baseUrl).send({
					originalRepresentation: 'test',
					'received-date-day': '1',
					'received-date-month': '',
					'received-date-year': '2000'
				});

				const element = parseHtml(response.text);
				const monthInput = element.querySelector('#received-date-month');

				expect(element.innerHTML).toContain('must include a month');
				expect(monthInput?.outerHTML).toContain('govuk-input--error');
			});

			it('should show validation error if month and year values are not entered', async () => {
				const response = await request.post(baseUrl).send({
					originalRepresentation: 'test',
					'received-date-day': '1',
					'received-date-month': '',
					'received-date-year': ''
				});

				const element = parseHtml(response.text);
				const monthInput = element.querySelector('#received-date-month');
				const yearInput = element.querySelector('#received-date-year');

				expect(element.innerHTML).toContain('must include a month and year');
				expect(monthInput?.outerHTML).toContain('govuk-input--error');
				expect(yearInput?.outerHTML).toContain('govuk-input--error');
			});

			it('should show validation error if year value is not entered', async () => {
				const response = await request.post(baseUrl).send({
					originalRepresentation: 'test',
					'received-date-day': '1',
					'received-date-month': '1',
					'received-date-year': ''
				});

				const element = parseHtml(response.text);
				const yearInput = element.querySelector('#received-date-year');

				expect(element.innerHTML).toContain('must include a year');
				expect(yearInput?.outerHTML).toContain('govuk-input--error');
			});

			it('should show validation error if representation comment is empty', async () => {
				const response = await request.post(baseUrl).send({
					originalRepresentation: '',
					'received-date-year': '2000',
					'received-date-month': '1',
					'received-date-day': '1'
				});

				const element = parseHtml(response.text);

				expect(element.innerHTML).toContain('Enter a comment');
			});
		});
	});
});
