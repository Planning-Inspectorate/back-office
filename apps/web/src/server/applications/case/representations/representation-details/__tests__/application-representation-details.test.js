import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

// Arrange
const mockAPIResponse = {
	id: 1,
	reference: 'BC0110001-3',
	status: 'VALID',
	redacted: true,
	received: '2023-04-14T15:52:56.507Z',
	originalRepresentation:
		'The proposals size, loss of food producing land, battery storage size and technology, joined up thinking between DCO applications',
	redactedRepresentation:
		'The proposals size, loss of food producing land, battery storage size and technology, joined up thinking between DCO applications',
	user: {
		azureReference: 1
	},
	contacts: [
		{
			type: 'PERSON',
			firstName: 'Arthur',
			lastName: 'Test',
			organisationName: null,
			jobTitle: null,
			under18: false,
			email: 'test@example.com',
			phoneNumber: '01234 567890',
			address: {
				addressLine1: '21 The Pavement',
				addressLine2: null,
				town: null,
				county: 'Wandsworth',
				postcode: 'SW4 0HY'
			}
		},
		{
			type: 'AGENT',
			firstName: 'James',
			lastName: 'Bond',
			organisationName: '',
			jobTitle: null,
			under18: false,
			email: 'test-agent@example.com',
			phoneNumber: '01234 567890',
			address: {
				addressLine1: '96 The Avenue',
				addressLine2: 'Maidstone',
				town: null,
				county: 'Kent',
				postcode: 'MD21 5XY'
			}
		}
	],
	attachments: [],
	redactedBy: {
		azureReference: 1
	}
};
// import { representationsFixture } from '../../__fixtures__/representations.fixture.js';
const mockCaseReference = { title: 'mock title', status: 'in test', reference: 'mock reference' };
const nocks = () => {
	nock('http://test/').get('/applications/1').reply(200, mockCaseReference);
	nock('http://test/')
		.get(`/applications/1/representations/1`)
		.reply(200, mockAPIResponse)
		.persist();
};

describe('Representation details page', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/1/relevant-representations/1/representation-details';

	describe('GET /applications-service/case/1/relevant-representations/1/representations-details', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/case-team');
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});
