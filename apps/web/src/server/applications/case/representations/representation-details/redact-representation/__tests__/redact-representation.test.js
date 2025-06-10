import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../../testing/index.js';
import { representationDetailsFixture } from '../../__fixtures__/representation-details.fixture.js';
import staticFlags from '@pins/feature-flags/src/static-feature-flags.js';
import { getAzureTextAnalyticsClient } from '../../../../../../lib/azure-ai-language.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const mockCaseReference = { title: 'mock title', status: 'in test', reference: 'mock reference' };
const nocks = () => {
	nock('http://test/').get('/applications/1').times(2).reply(200, mockCaseReference);
	nock('http://test/')
		.get(`/applications/1/representations/1`)
		.reply(200, representationDetailsFixture)
		.persist();

	nock('http://test/')
		.patch(`/applications/1/representations/1/redact`)
		.reply(200, { message: 'it okay' })
		.persist();
};

describe('Representation redact page', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl =
		'/applications-service/case/1/relevant-representations/1/representation-details/redact-representation';

	describe('GET /applications-service/case/1/relevant-representations/1/representations-details/redact-representation', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the new page if feature flag is enabled', async () => {
			const flags = staticFlags;
			flags['azure-ai-language-redaction'] = true;
			// @ts-ignore
			getAzureTextAnalyticsClient().recognizePiiEntities.mockResolvedValue([
				{
					entities: [
						{ text: 'John Doe', offset: 0, length: 8, category: 'Person', confidenceScore: 0.95 },
						{
							text: '123 Main St',
							offset: 20,
							length: 12,
							category: 'Address',
							confidenceScore: 0.9
						}
					]
				}
			]);
			const response = await request.get(baseUrl);
			// should include the suggestions table
			expect(response.text).toContain('Redaction suggestions');
			expect(response.text).toMatch(
				/<td class="govuk-table__cell">John Doe<\/td>\s*<td class="govuk-table__cell">Person<\/td>/
			);
			expect(response.text).toMatch(
				/<td class="govuk-table__cell">123 Main St<\/td>\s*<td class="govuk-table__cell">Address<\/td>/
			);

			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();

			// restore
			flags['azure-ai-language-redaction'] = false;
		});
	});

	describe('POST /applications-service/case/1/relevant-representations/1/representations-details/redact-representation', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should patch the representation and redirect to the next page', async () => {
			const response = await request.post(baseUrl);

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/1/relevant-representations/1/representation-details'
			);
		});
	});
});
