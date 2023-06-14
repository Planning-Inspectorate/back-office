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
};

describe('Representation address details page', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl =
		'/applications-service/case/1/relevant-representations/address-details?repId=1&repType=represented';
	const lookupUrl = `${baseUrl}&stage=lookup`;
	const findUrl = `${baseUrl}&stage=find`;
	const enterUrl = `${baseUrl}&stage=enter`;

	describe('GET /applications-service/case/1/relevant-representations/address-details', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/case-team');
		});

		it('should render the page and have the lookup fields', async () => {
			const response = await request.get(lookupUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Postcode');
		});

		it('should render the page and have the find fields', async () => {
			const response = await request.get(findUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Address');
		});

		it('should render the page and have the enter fields', async () => {
			const response = await request.get(enterUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Address line 1');
			expect(element.innerHTML).toContain('Address line 2');
			expect(element.innerHTML).toContain('Town or city');
			expect(element.innerHTML).toContain('Postcode');
			expect(element.innerHTML).toContain('Country');
		});
	});

	describe('POST /applications-service/case/1/relevant-representations/address-details', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/case-team');
		});
		describe('Field validation:', () => {
			it('should show the lookup page validation errors', async () => {
				const response = await request.post(baseUrl).send({ stage: 'lookup' });
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter your postcode');
			});

			it('should show the find page validation errors', async () => {
				const response = await request.post(baseUrl).send({ stage: 'find' });
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Chose an address from the list');
			});

			it('should show the enter page validation errors', async () => {
				const response = await request.post(baseUrl).send({ stage: 'enter' });
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter address line 1');
				expect(element.innerHTML).toContain('Enter a postcode');
				expect(element.innerHTML).toContain('Enter a country');
			});
		});
	});
});
