import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '#testing/index.js';
import {
	siteVisitData,
	appealData,
	appellantCaseData
} from '#testing/app/fixtures/referencedata.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';
const siteVisitPath = '/site-visit';
const scheduleVisitPath = '/schedule-visit';
const visitScheduledPath = '/visit-scheduled';
const setVisitTypePath = '/set-visit-type';

describe('site-visit', () => {
	beforeEach(() => {
		installMockApi();
	});
	afterEach(teardown);

	describe('GET /site-visit/schedule-visit', () => {
		it('should render the schedule visit page', async () => {
			const response = await request.get(`${baseUrl}/1${siteVisitPath}${scheduleVisitPath}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /site-visit/schedule-visit', () => {
		beforeEach(() => {
			nock('http://test/').get('/appeals/1').reply(200, appealData);
			nock('http://test/').get('/appeals/1/appellant-cases/0').reply(200, appellantCaseData);
			nock('http://test/').get('/appeals/1/site-visits/0').reply(200, siteVisitData);
			nock('http://test/').post('/appeals/1/site-visits').reply(200, siteVisitData);
			nock('http://test/').post('/appeals/1/site-visits/0').reply(200, siteVisitData);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should re-render the schedule visit page with the expected error messages if required fields are not populated', async () => {
			const response = await request.post(`${baseUrl}/1${siteVisitPath}${scheduleVisitPath}`).send({
				'visit-date-day': '',
				'visit-date-month': '',
				'visit-date-year': '',
				'visit-start-time-hour': '',
				'visit-start-time-minute': '',
				'visit-end-time-hour': '',
				'visit-end-time-minute': ''
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the schedule visit page with the expected error message if visit date day is invalid', async () => {
			let response = await request.post(`${baseUrl}/1${siteVisitPath}${scheduleVisitPath}`).send({
				'visit-type': 'unaccompanied',
				'visit-date-day': '0',
				'visit-date-month': '1',
				'visit-date-year': '2023',
				'visit-start-time-hour': '10',
				'visit-start-time-minute': '00',
				'visit-end-time-hour': '11',
				'visit-end-time-minute': '30'
			});

			let element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request.post(`${baseUrl}/1${siteVisitPath}${scheduleVisitPath}`).send({
				'visit-type': 'unaccompanied',
				'visit-date-day': '32',
				'visit-date-month': '1',
				'visit-date-year': '2023',
				'visit-start-time-hour': '10',
				'visit-start-time-minute': '00',
				'visit-end-time-hour': '11',
				'visit-end-time-minute': '30'
			});

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the schedule visit page with the expected error message if visit date month is invalid', async () => {
			let response = await request.post(`${baseUrl}/1${siteVisitPath}${scheduleVisitPath}`).send({
				'visit-type': 'unaccompanied',
				'visit-date-day': '1',
				'visit-date-month': '0',
				'visit-date-year': '2023',
				'visit-start-time-hour': '10',
				'visit-start-time-minute': '00',
				'visit-end-time-hour': '11',
				'visit-end-time-minute': '30'
			});

			let element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request.post(`${baseUrl}/1${siteVisitPath}${scheduleVisitPath}`).send({
				'visit-type': 'unaccompanied',
				'visit-date-day': '1',
				'visit-date-month': '13',
				'visit-date-year': '2023',
				'visit-start-time-hour': '10',
				'visit-start-time-minute': '00',
				'visit-end-time-hour': '11',
				'visit-end-time-minute': '30'
			});

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the schedule visit page with the expected error message if visit date year is invalid', async () => {
			let response = await request.post(`${baseUrl}/1${siteVisitPath}${scheduleVisitPath}`).send({
				'visit-type': 'unaccompanied',
				'visit-date-day': '1',
				'visit-date-month': '1',
				'visit-date-year': '202',
				'visit-start-time-hour': '10',
				'visit-start-time-minute': '00',
				'visit-end-time-hour': '11',
				'visit-end-time-minute': '30'
			});

			let element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request.post(`${baseUrl}/1${siteVisitPath}${scheduleVisitPath}`).send({
				'visit-type': 'unaccompanied',
				'visit-date-day': '1',
				'visit-date-month': '1',
				'visit-date-year': '20233',
				'visit-start-time-hour': '10',
				'visit-start-time-minute': '00',
				'visit-end-time-hour': '11',
				'visit-end-time-minute': '30'
			});

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the schedule visit page with the expected error message if an invalid visit date was provided', async () => {
			const response = await request.post(`${baseUrl}/1${siteVisitPath}${scheduleVisitPath}`).send({
				'visit-type': 'unaccompanied',
				'visit-date-day': '29',
				'visit-date-month': '2',
				'visit-date-year': '2023',
				'visit-start-time-hour': '10',
				'visit-start-time-minute': '00',
				'visit-end-time-hour': '11',
				'visit-end-time-minute': '30'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the schedule visit page with the expected error message if visit start time hour is invalid', async () => {
			const response = await request.post(`${baseUrl}/1${siteVisitPath}${scheduleVisitPath}`).send({
				'visit-type': 'accompanied',
				'visit-date-day': '1',
				'visit-date-month': '1',
				'visit-date-year': '2023',
				'visit-start-time-hour': '24',
				'visit-start-time-minute': '00',
				'visit-end-time-hour': '11',
				'visit-end-time-minute': '30'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the schedule visit page with the expected error message if visit start time minute is invalid', async () => {
			const response = await request.post(`${baseUrl}/1${siteVisitPath}${scheduleVisitPath}`).send({
				'visit-type': 'accompanied',
				'visit-date-day': '1',
				'visit-date-month': '1',
				'visit-date-year': '2023',
				'visit-start-time-hour': '10',
				'visit-start-time-minute': '60',
				'visit-end-time-hour': '11',
				'visit-end-time-minute': '30'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the schedule visit page with the expected error message if visit end time hour is invalid', async () => {
			const response = await request.post(`${baseUrl}/1${siteVisitPath}${scheduleVisitPath}`).send({
				'visit-type': 'accompanied',
				'visit-date-day': '1',
				'visit-date-month': '1',
				'visit-date-year': '2023',
				'visit-start-time-hour': '10',
				'visit-start-time-minute': '00',
				'visit-end-time-hour': '24',
				'visit-end-time-minute': '30'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the schedule visit page with the expected error message if visit end time minute is invalid', async () => {
			const response = await request.post(`${baseUrl}/1${siteVisitPath}${scheduleVisitPath}`).send({
				'visit-type': 'accompanied',
				'visit-date-day': '1',
				'visit-date-month': '1',
				'visit-date-year': '2023',
				'visit-start-time-hour': '10',
				'visit-start-time-minute': '00',
				'visit-end-time-hour': '11',
				'visit-end-time-minute': '60'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the site visit scheduled confirmation page if all required fields are populated and valid', async () => {
			const response = await request.post(`${baseUrl}/1${siteVisitPath}${scheduleVisitPath}`).send({
				'visit-type': 'accompanied',
				'visit-date-day': '1',
				'visit-date-month': '1',
				'visit-date-year': '2023',
				'visit-start-time-hour': '10',
				'visit-start-time-minute': '00',
				'visit-end-time-hour': '11',
				'visit-end-time-minute': '30'
			});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the site visit scheduled confirmation page if visit type is unaccompanied and start and end times are not populated but all other required fields are populated and valid', async () => {
			const response = await request.post(`${baseUrl}/1${siteVisitPath}${scheduleVisitPath}`).send({
				'visit-type': 'unaccompanied',
				'visit-date-day': '1',
				'visit-date-month': '1',
				'visit-date-year': '2023',
				'visit-start-time-hour': '',
				'visit-start-time-minute': '',
				'visit-end-time-hour': '',
				'visit-end-time-minute': ''
			});

			expect(response.statusCode).toBe(302);
		});
	});

	describe('GET /site-visit/visit-scheduled', () => {
		beforeEach(() => {
			nock('http://test/').get('/appeals/1').reply(200, appealData);
			nock('http://test/').get('/appeals/1/appellant-cases/0').reply(200, appellantCaseData);
			nock('http://test/').get('/appeals/1/site-visits/0').reply(200, siteVisitData);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the visit scheduled confirmation page', async () => {
			const response = await request.get(`${baseUrl}/1${siteVisitPath}${visitScheduledPath}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /site-visit/set-visit-type', () => {
		beforeEach(() => {
			nock('http://test/').get('/appeals/1').reply(200, appealData);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the select site visit type page', async () => {
			const response = await request.get(`${baseUrl}/1${siteVisitPath}${setVisitTypePath}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /site-visit/set-visit-type', () => {
		beforeEach(() => {
			nock('http://test/').get('/appeals/1').reply(200, appealData);
			nock('http://test/').get('/appeals/1/site-visits/0').reply(200, siteVisitData);
			nock('http://test/').post('/appeals/1/site-visits').reply(200, siteVisitData);
			nock('http://test/').patch('/appeals/1/site-visits/0').reply(200, siteVisitData);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should re-render the select site visit type page with the expected error message if the site visit type was not selected', async () => {
			const response = await request.post(`${baseUrl}/1${siteVisitPath}${setVisitTypePath}`).send({
				'visit-type': ''
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the case details page if the site visit type was selected', async () => {
			const response = await request.post(`${baseUrl}/1${siteVisitPath}${setVisitTypePath}`).send({
				'visit-type': 'unaccompanied'
			});

			expect(response.statusCode).toBe(302);
		});

		it('should render the case details page displaying the success notification banner with the expected content if the site visit type was updated', async () => {
			await request.post(`${baseUrl}/1${siteVisitPath}${setVisitTypePath}`).send({
				'visit-type': 'accompanied'
			});

			nock('http://test/').get(`/appeals/1`).reply(200, appealData);

			const caseDetailsResponse = await request.get(`${baseUrl}/1`);
			const element = parseHtml(caseDetailsResponse.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});
