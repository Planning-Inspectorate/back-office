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

const nocks = (inDraft = false) => {
	let representationDetails = representationDetailsFixture;

	if (inDraft)
		representationDetails = {
			...representationDetails,
			status: 'DRAFT'
		};

	nock('http://test/').get('/applications/1').reply(200, mockCaseReference);
	nock('http://test/').get('/applications/1/representations/1').reply(200, representationDetails);
	nock('http://test/').get('/applications/1/folders').reply(200, mockFolders);
};

describe('/applications-service/case/1/relevant-representations/1/representation-details', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/1/relevant-representations/1/representation-details';

	describe('GET /applications-service/case/1/relevant-representations/1/representation-details', () => {
		describe('and the representation is in DRAFT', () => {
			beforeEach(async () => {
				nocks(true);
			});
			it('should render the page with the check answers sections', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toContain('Contact details');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/contact-details?repId=1&amp;repType=represented&amp;repMode=check'
				);
				expect(element.innerHTML).toContain('Mrs Sue');
				expect(element.innerHTML).toContain('01234 567890');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/address-details?repId=1&amp;repType=represented&amp;repMode=check'
				);
				expect(element.innerHTML).toContain('44 Rivervale');
				expect(element.innerHTML).toContain('Bridport');
				expect(element.innerHTML).toContain('DT6 5RN');
				expect(element.innerHTML).toContain('Great Britain');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/contact-method?repId=1&amp;repType=represented&amp;repMode=check'
				);
				expect(element.innerHTML).toContain('Email');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/representation-type?repId=1&amp;repType=represented&amp;repMode=check'
				);
				expect(element.innerHTML).toContain('Local authorities');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/under-18?repId=1&amp;repType=represented&amp;repMode=check'
				);
				expect(element.innerHTML).toContain('No');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/representation-entity?repId=1&amp;repType=represented&amp;repMode=check'
				);
				expect(element.innerHTML).toContain(
					'A representative on behalf of another person, family group or organisation'
				);

				expect(element.innerHTML).toContain('Agent contact details');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/contact-details?repId=1&amp;repType=representative&amp;repMode=check'
				);
				expect(element.innerHTML).toContain('James Bond');
				expect(element.innerHTML).toContain('test-agent@example.com');
				expect(element.innerHTML).toContain('01234 567890');
				expect(element.innerHTML).toContain('8 The Chase');
				expect(element.innerHTML).toContain('Findon');
				expect(element.innerHTML).toContain('BN14 0TT');
				expect(element.innerHTML).toContain('Great Britain');
				expect(element.innerHTML).toContain('No');

				expect(element.innerHTML).toContain('Representation');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/add-representation?repId=1&amp;repType=represented&amp;repMode=check'
				);
				expect(element.innerHTML).toContain('27 April 2023');
				expect(element.innerHTML).toContain(
					'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
				);

				expect(element.innerHTML).toContain('Attachments');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/attachment-upload?repId=1&amp;repType=represented&amp;repMode=check'
				);
				expect(element.innerHTML).toContain('a doc');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/attachment-upload?repId=1&amp;repType=represented&amp;repMode=check'
				);

				expect(element.innerHTML).toContain('Submit for review');

				expect(element.innerHTML).not.toContain('Workflow');

				expect(element.innerHTML).toMatchSnapshot();
			});
		});

		describe('and the representation is NOT in DRAFT', () => {
			beforeEach(async () => {
				nocks();
			});
			it('should render the page with the change answers sections', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toContain('Contact details');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/contact-details?repId=1&amp;repType=represented&amp;repMode=change'
				);
				expect(element.innerHTML).toContain('Mrs Sue');
				expect(element.innerHTML).toContain('01234 567890');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/address-details?repId=1&amp;repType=represented&amp;repMode=change'
				);
				expect(element.innerHTML).toContain('44 Rivervale');
				expect(element.innerHTML).toContain('Bridport');
				expect(element.innerHTML).toContain('DT6 5RN');
				expect(element.innerHTML).toContain('Great Britain');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/contact-method?repId=1&amp;repType=represented&amp;repMode=change'
				);
				expect(element.innerHTML).toContain('Email');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/representation-type?repId=1&amp;repType=represented&amp;repMode=change'
				);
				expect(element.innerHTML).toContain('Local authorities');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/under-18?repId=1&amp;repType=represented&amp;repMode=change'
				);
				expect(element.innerHTML).toContain('No');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/representation-entity?repId=1&amp;repType=represented&amp;repMode=change'
				);
				expect(element.innerHTML).toContain(
					'A representative on behalf of another person, family group or organisation'
				);

				expect(element.innerHTML).toContain('Agent contact details');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/contact-details?repId=1&amp;repType=representative&amp;repMode=change'
				);
				expect(element.innerHTML).toContain('James Bond');
				expect(element.innerHTML).toContain('test-agent@example.com');
				expect(element.innerHTML).toContain('01234 567890');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/address-details?repId=1&amp;repType=representative&amp;repMode=change'
				);
				expect(element.innerHTML).toContain('8 The Chase');
				expect(element.innerHTML).toContain('Findon');
				expect(element.innerHTML).toContain('BN14 0TT');
				expect(element.innerHTML).toContain('Great Britain');
				expect(element.innerHTML).toContain('No');

				expect(element.innerHTML).toContain('Representation');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/1/representation-details/redact-representation'
				);
				expect(element.innerHTML).toContain('BC0110001-1');
				expect(element.innerHTML).toContain('BC0110001-1');
				expect(element.innerHTML).toContain('27 April 2023');
				expect(element.innerHTML).toContain(
					'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.'
				);
				expect(element.innerHTML).toContain('(Redacted) Aenean commodo ligula eget dolor.');
				expect(element.innerHTML).toContain(
					'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
				);
				expect(element.innerHTML).toContain('mock redacted by');

				expect(element.innerHTML).toContain('Workflow');
				expect(element.innerHTML).toContain('Redacted');
				expect(element.innerHTML).toContain('awaiting review');
				expect(element.innerHTML).toContain('representation-details/task-log');

				expect(element.innerHTML).toContain('Attachments');
				expect(element.innerHTML).toContain(
					'/applications-service/case/1/relevant-representations/attachment-upload?repId=1&amp;repType=represented&amp;repMode=change'
				);

				expect(element.innerHTML).not.toContain('Submit for review');

				expect(element.innerHTML).toMatchSnapshot();
			});
		});
	});

	describe('POST /applications-service/case/1/relevant-representations/1/representation-details', () => {
		describe('and there are errors', () => {
			beforeEach(async () => {
				nock('http://test/').get('/applications/1').reply(200, mockCaseReference);
				nock('http://test/')
					.get('/applications/1/representations/1')
					.reply(200, {
						...representationDetailsFixture,
						status: 'DRAFT',
						type: null
					});
				nock('http://test/').get('/applications/1/folders').reply(200, mockFolders);
			});
			it('should render the page with errors', async () => {
				const response = await request.post(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toContain('There is a problem');
				expect(element.innerHTML).toContain('Enter type');

				expect(element.innerHTML).toMatchSnapshot();
			});
		});

		describe('and there are no errors', () => {
			beforeEach(async () => {
				nocks();
				nock('http://test/')
					.patch(`/applications/1/representations/1`, {
						status: 'AWAITING_REVIEW'
					})
					.reply(200, { message: 'ok' });
			});

			it('should redirect to the next page', async () => {
				const response = await request.post(baseUrl);

				expect(response?.headers?.location).toEqual(
					'/applications-service/case/1/relevant-representations'
				);
			});
		});
	});
});
