// @ts-nocheck
import { parseHtml } from '@pins/platform';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';
const pageUrl = '/enter-start-date';

describe('appeal-details', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /enter-start-date', () => {
		it('should render the enter start date page if an appeal with a matching appealId exists', async () => {
			const response = await request.get(`${baseUrl}/1${pageUrl}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
		it('should render the 404 error page if an appeal with a matching appealId does not exist', async () => {
			const response = await request.get(`${baseUrl}/0${pageUrl}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /enter-start-date', () => {
		const postDataWithoutErrors = {
			'start-date-day': '31',
			'start-date-month': '01',
			'start-date-year': '2023'
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
				.post(`${baseUrl}/0${pageUrl}`)
				.send(postDataWithErrors);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
		it('should re-render the enter start date page in an error state if errors are present and an appeal with a matching appealId exists', async () => {
			const response = await request
				.post(`${baseUrl}/1${pageUrl}`)
				.send(postDataWithErrors);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
		// TODO: BOAT-105 (update once service is wired up)
		// it('should call the service method to set the appeal start date if no errors are present', async () => {
			// const response = await request
			// 	.post(`${baseUrl}/1${pageUrl}`)
			// 	.send(postDataWithoutErrors);
		// });
		it('should redirect to the start-date-entered page if no errors are present and an appeal with a matching appealId exists and the service method to set the appeal start date was called successfully', async () => {
			const response = await request
				.post(`${baseUrl}/1${pageUrl}`)
				.send(postDataWithoutErrors);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});
