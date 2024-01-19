import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '#testing/index.js';
import { appealData, appealTypesData } from '#testing/app/fixtures/referencedata.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';
const changeAppealTypePath = '/change-appeal-type';
const appealTypePath = '/appeal-type';
const resubmitPath = '/resubmit';
const changeAppealFinalDatePath = '/change-appeal-final-date';
const confirmationPath = '/confirm-resubmit';

/** @typedef {import('../../../../app/auth/auth-session.service').SessionWithAuth} SessionWithAuth */

describe('change-appeal-type', () => {
	beforeEach(() => {
		installMockApi();
		nock('http://test/').get('/appeals/1').reply(200, appealData);
		nock('http://test/').get('/appeals/1/appeal-types').reply(200, appealTypesData);
	});
	afterEach(teardown);

	describe('GET /change-appeal-type/appeal-type', () => {
		it('should render the appeal type page', async () => {
			const response = await request.get(`${baseUrl}/1${changeAppealTypePath}/${appealTypePath}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /change-appeal-type/appeal-type', () => {
		it('should redirect to the resubmit page if all required field is populated', async () => {
			const response = await request
				.post(`${baseUrl}/1${changeAppealTypePath}/${appealTypePath}`)
				.send({
					appealType: 1
				});

			expect(response.statusCode).toBe(302);
			expect(response.headers.location).toContain(resubmitPath);
		});

		it('should re-render the appeal type page with an error message if required field is missing', async () => {
			const response = await request
				.post(`${baseUrl}/1${changeAppealTypePath}/${appealTypePath}`)
				.send({
					appealTypeId: ''
				});

			expect(response.statusCode).toBe(200);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /change-appeal-type/resubmit', () => {
		it('should render the resubmit page', async () => {
			const response = await request.get(`${baseUrl}/1${changeAppealTypePath}/${resubmitPath}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /change-appeal-type/resubmit', () => {
		it('should redirect to the final date page the required field is equal to yes', async () => {
			const response = await request
				.post(`${baseUrl}/1${changeAppealTypePath}/${resubmitPath}`)
				.send({
					appealResubmit: true
				});

			expect(response.statusCode).toBe(302);
			expect(response.headers.location).toContain(changeAppealFinalDatePath);
		});

		it('should re-render the resubmit page with an error message if required field is missing', async () => {
			const response = await request
				.post(`${baseUrl}/1${changeAppealTypePath}/${resubmitPath}`)
				.send({
					appealResubmit: ''
				});

			expect(response.statusCode).toBe(200);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /change-appeal-type/change-appeal-final-date', () => {
		it('should render the final date page', async () => {
			const response = await request.get(
				`${baseUrl}/1${changeAppealTypePath}/${changeAppealFinalDatePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /change-appeal-type/change-appeal-final-date', () => {
		beforeEach(() => {
			nock('http://test/').post('/appeals/1/appeal-change-request').reply(200, { success: true });
			nock('http://test/').post('/appeals/validate-business-date').reply(200, { success: true });
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should redirect to the confirmation page when the required dates fields are populated and valid', async () => {
			await request
				.post(`${baseUrl}/1${changeAppealTypePath}/${appealTypePath}`)
				.send({ appealType: 1 });
			await request
				.post(`${baseUrl}/1${changeAppealTypePath}/${resubmitPath}`)
				.send({ appealResubmit: true });

			const response = await request
				.post(`${baseUrl}/1${changeAppealTypePath}/${changeAppealFinalDatePath}`)
				.send({
					'change-appeal-final-date-day': 11,
					'change-appeal-final-date-month': 11,
					'change-appeal-final-date-year': 3000
				});

			expect(response.statusCode).toBe(302);
			expect(response.headers.location).toContain(confirmationPath);
		});
	});

	it('should re-render the final date page with an error message if required field is missing', async () => {
		const response = await request
			.post(`${baseUrl}/1${changeAppealTypePath}/${changeAppealFinalDatePath}`)
			.send({});

		expect(response.statusCode).toBe(200);
		const element = parseHtml(response.text);
		expect(element.innerHTML).toMatchSnapshot();
	});

	it('should re-render the final date page with an error message if the provided date day is invalid', async () => {
		const response = await request
			.post(`${baseUrl}/1${changeAppealTypePath}/${changeAppealFinalDatePath}`)
			.send({
				'change-appeal-final-date-day': 0,
				'change-appeal-final-date-month': 11,
				'change-appeal-final-date-year': 2024
			});

		expect(response.statusCode).toBe(200);
		const element = parseHtml(response.text);
		expect(element.innerHTML).toMatchSnapshot();
	});

	it('should re-render the final date page with an error message if the provided date month is invalid', async () => {
		const response = await request
			.post(`${baseUrl}/1${changeAppealTypePath}/${changeAppealFinalDatePath}`)
			.send({
				'change-appeal-final-date-day': 1,
				'change-appeal-final-date-month': 0,
				'change-appeal-final-date-year': 2024
			});

		expect(response.statusCode).toBe(200);
		const element = parseHtml(response.text);
		expect(element.innerHTML).toMatchSnapshot();
	});

	it('should re-render the final date page with an error message if the provided date year is invalid', async () => {
		const response = await request
			.post(`${baseUrl}/1${changeAppealTypePath}/${changeAppealFinalDatePath}`)
			.send({
				'change-appeal-final-date-day': 11,
				'change-appeal-final-date-month': 11,
				'change-appeal-final-date-year': 'x'
			});

		expect(response.statusCode).toBe(200);
		const element = parseHtml(response.text);
		expect(element.innerHTML).toMatchSnapshot();
	});

	it('should re-render the final date page with an error message if an invalid date was provided', async () => {
		const response = await request
			.post(`${baseUrl}/1${changeAppealTypePath}/${changeAppealFinalDatePath}`)
			.send({
				'change-appeal-final-date-day': 29,
				'change-appeal-final-date-month': 2,
				'change-appeal-final-date-year': 3000
			});

		expect(response.statusCode).toBe(200);
		const element = parseHtml(response.text);
		expect(element.innerHTML).toMatchSnapshot();
	});

	it('should re-render the final date page with an error message if the provided date is not in the past', async () => {
		const response = await request
			.post(`${baseUrl}/1${changeAppealTypePath}/${changeAppealFinalDatePath}`)
			.send({
				'change-appeal-final-date-day': 29,
				'change-appeal-final-date-month': 2,
				'change-appeal-final-date-year': 2023
			});

		expect(response.statusCode).toBe(200);
		const element = parseHtml(response.text);
		expect(element.innerHTML).toMatchSnapshot();
	});

	it('should re-render the final date page with an error message if the provided date is not a business day', async () => {
		const response = await request
			.post(`${baseUrl}/1${changeAppealTypePath}/${changeAppealFinalDatePath}`)
			.send({
				'change-appeal-final-date-day': 1,
				'change-appeal-final-date-month': 1,
				'change-appeal-final-date-year': 3000
			});

		expect(response.statusCode).toBe(200);
		const element = parseHtml(response.text);
		expect(element.innerHTML).toMatchSnapshot();
	});

	describe('POST /change-appeal-type/confirm-resubmit', () => {
		it('should re-render the confirm page', async () => {
			const response = await request.get(`${baseUrl}/1${changeAppealTypePath}/${confirmationPath}`);

			expect(response.statusCode).toBe(200);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});
