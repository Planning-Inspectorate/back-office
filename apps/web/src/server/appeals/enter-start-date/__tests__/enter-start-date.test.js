import { parseHtml } from '@pins/platform';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';
const pageUrl = '/enter-start-date';
const appealIdThatExists = 1;
const appealIdThatDoesNotExist = 0;

describe('appeal-details', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /enter-start-date', () => {
		it('should render the enter start date page if an appeal with a matching appealId exists', async () => {
			const response = await request.get(`${baseUrl}/${appealIdThatExists}${pageUrl}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
		it('should render the 404 error page if an appeal with a matching appealId does not exist', async () => {
			const response = await request.get(`${baseUrl}/${appealIdThatDoesNotExist}${pageUrl}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /enter-start-date', () => {
		// TODO: BOAT-105 - update once service is wired up
		// it('should call the service method to set the appeal start date if no errors are present', async () => {
		//
		// });

		it('should re-render the enter start date page with the expected error message if the entered day is empty', async () => {
			const response = await request.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`).send({
				'start-date-day': '',
				'start-date-month': '1',
				'start-date-year': '2023'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered day is not an integer', async () => {
			const response = await request.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`).send({
				'start-date-day': 'a',
				'start-date-month': '1',
				'start-date-year': '2023'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered day is longer than 2 characters', async () => {
			const response = await request.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`).send({
				'start-date-day': '111',
				'start-date-month': '1',
				'start-date-year': '2023'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered day is less than 1', async () => {
			const response = await request.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`).send({
				'start-date-day': '0',
				'start-date-month': '1',
				'start-date-year': '2023'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered day is greater than 31', async () => {
			const response = await request.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`).send({
				'start-date-day': '32',
				'start-date-month': '1',
				'start-date-year': '2023'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered month is empty', async () => {
			const response = await request.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`).send({
				'start-date-day': '1',
				'start-date-month': '',
				'start-date-year': '2023'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered month is not an integer', async () => {
			const response = await request.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`).send({
				'start-date-day': '1',
				'start-date-month': 'a',
				'start-date-year': '2023'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered month is longer than 2 characters', async () => {
			const response = await request.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`).send({
				'start-date-day': '1',
				'start-date-month': '111',
				'start-date-year': '2023'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered month is less than 1', async () => {
			const response = await request.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`).send({
				'start-date-day': '1',
				'start-date-month': '0',
				'start-date-year': '2023'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered month is greater than 12', async () => {
			const response = await request.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`).send({
				'start-date-day': '1',
				'start-date-month': '13',
				'start-date-year': '2023'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered year is not an integer', async () => {
			const response = await request.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`).send({
				'start-date-day': '1',
				'start-date-month': '1',
				'start-date-year': 'aaaa'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered year is empty', async () => {
			const response = await request.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`).send({
				'start-date-day': '1',
				'start-date-month': '1',
				'start-date-year': ''
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered year is shorter than 4 characters', async () => {
			const response = await request.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`).send({
				'start-date-day': '1',
				'start-date-month': '1',
				'start-date-year': '202'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered year is longer than 4 characters', async () => {
			const response = await request.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`).send({
				'start-date-day': '1',
				'start-date-month': '1',
				'start-date-year': '20233'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the start-date-entered page if no errors are present and an appeal with a matching appealId exists and the service method to set the appeal start date was called successfully', async () => {
			const response = await request.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`).send({
				'start-date-day': '1',
				'start-date-month': '1',
				'start-date-year': '2023'
			});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/start-date-entered'
			);
		});
	});
});
