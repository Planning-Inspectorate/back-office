import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../testing/index.js';
import { representationDetailsFixture } from '../__fixtures__/representation-details.fixture.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const mockCaseReference = {
	title: 'mock case title',
	status: 'mock case status',
	reference: 'mock case reference'
};
const mockFolders = [
	{
		id: 1,
		displayNameEn: 'mock folder display name',
		displayOrder: 1
	}
];

const nocks = () => {
	nock('http://test/').get('/applications/1').reply(200, mockCaseReference);
	nock('http://test/')
		.get('/applications/1/representations/1')
		.reply(200, representationDetailsFixture);
	nock('http://test/').get('/applications/1').reply(200, mockCaseReference);
	nock('http://test/')
		.get('/applications/1/representations/1')
		.reply(200, representationDetailsFixture);
	nock('http://test/').get('/applications/1/folders').reply(200, mockFolders);
};

describe('Representation details page', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/1/relevant-representations/1/representation-details';

	describe('GET /applications-service/case/1/relevant-representations/1/representation-details', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			expect(element.innerHTML).toContain('mock case title');
			expect(element.innerHTML).toContain('Contact details');
			expect(element.innerHTML).toContain('Mrs Sue');
			expect(element.innerHTML).toContain('44 Rivervale Bridport DT6 5RN Great Britain');
			expect(element.innerHTML).toContain('Email');
			expect(element.innerHTML).toContain('mock type');
			expect(element.innerHTML).toContain('Agent contact details');
			expect(element.innerHTML).toContain('Representation');
			expect(element.innerHTML).toContain('Workflow');
			expect(element.innerHTML).toContain('Attachments');
		});
	});
});
