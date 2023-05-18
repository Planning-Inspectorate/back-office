// @ts-nocheck
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
		const postDataWithoutErrors = {
			body: {
				'start-date-day': '31',
				'start-date-month': '01',
				'start-date-year': '2023'
			}
		};
		const postDataWithErrors = {
			...postDataWithoutErrors,
			errors: {
				'start-date-day': {
					value: '32',
					msg: 'Please enter a valid day',
					param: 'start-date-day',
					location: 'body'
				}
			}
		};

		it('should render the 500 error page if errors are present and an appeal with a matching appealId does not exist', async () => {
			const response = await request
				.post(`${baseUrl}/${appealIdThatDoesNotExist}${pageUrl}`)
				.send(postDataWithErrors);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
		it('should re-render the enter start date page in an error state if errors are present and an appeal with a matching appealId exists', async () => {
			const response = await request
				.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`)
				.send(postDataWithErrors);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
		// TODO: BOAT-105 - update once service is wired up
		// it('should call the service method to set the appeal start date if no errors are present', async () => {
			// const response = await request
			// 	.post(`${baseUrl}/1${pageUrl}`)
			// 	.send(postDataWithoutErrors);
		// });

		it('should re-render the enter start date page with the expected error message if the entered day is not an integer', async () => {
			const testData = {...postDataWithoutErrors};

			testData.body['start-date-day'] = 'a';

			const response = await request
				.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`)
				.send(testData);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered day is shorter than 1 character', async () => {
			const testData = {...postDataWithoutErrors};

			testData.body['start-date-day'] = '';

			const response = await request
				.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`)
				.send(testData);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered day is longer than 2 characters', async () => {
			const testData = {...postDataWithoutErrors};

			testData.body['start-date-day'] = '111';

			const response = await request
				.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`)
				.send(testData);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered day is less than 1', async () => {
			const testData = {...postDataWithoutErrors};

			testData.body['start-date-day'] = '0';

			const response = await request
				.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`)
				.send(testData);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the enter start date page with the expected error message if the entered day is greater than 31', async () => {
			const testData = {...postDataWithoutErrors};

			testData.body['start-date-day'] = '32';

			const response = await request
				.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`)
				.send(testData);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		// TODO: tests for month validation error messages
		// TODO: tests for year validation error messages

		it('should redirect to the start-date-entered page if no errors are present and an appeal with a matching appealId exists and the service method to set the appeal start date was called successfully', async () => {
			const response = await request
				.post(`${baseUrl}/${appealIdThatExists}${pageUrl}`)
				.send(postDataWithoutErrors);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});
