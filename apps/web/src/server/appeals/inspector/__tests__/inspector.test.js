import { getPathToAsset, parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import {
	appealDetailsForBookedSiteVisit,
	appealDetailsForDecisionDue,
	appealDetailsForPendingStatements,
	appealDetailsForUnbookedSiteVisit,
	appealSummaryForBookedSiteVisit,
	appealSummaryForDecisionDue,
	appealSummaryForUnbookedSiteVisit
} from '../../../../../testing/appeals/appeals.js';
import { createTestApplication } from '../../../../../testing/index.js';

const { app, installFixedDate, installMockApi, teardown } = createTestApplication();
const request = supertest(app);
const baseUrl = '/appeals-service/inspector';

describe('inspector', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /', () => {
		it('should render placeholders for empty appeals', async () => {
			nock('http://test/').get(`/appeals/inspector`).reply(200, []);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render appeals according to their status', async () => {
			nock('http://test/')
				.get('/appeals/inspector')
				.reply(200, [
					appealSummaryForDecisionDue,
					appealSummaryForBookedSiteVisit,
					appealSummaryForUnbookedSiteVisit
				]);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should show the "NEW" status for an unbooked appeal that was assigned to the user this session', async () => {
			await installAssignedAppealIds([appealSummaryForUnbookedSiteVisit.appealId]);

			nock('http://test/')
				.get(`/appeals/inspector`)
				.reply(200, [appealSummaryForUnbookedSiteVisit]);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.querySelector('tbody tr')?.outerHTML).toMatchSnapshot();
		});
	});

	describe('GET /available-appeals', () => {
		it('should render a page for assigning appeals to the user', async () => {
			nock('http://test/')
				.get('/appeals/inspector/more-appeals')
				.reply(200, [appealSummaryForUnbookedSiteVisit]);

			const response = await request.get('/appeals-service/inspector/available-appeals');
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /available-appeals', () => {
		const { appealId } = appealSummaryForUnbookedSiteVisit;

		it('should validate that at least one appeal was selected', async () => {
			nock('http://test/').get('/appeals/inspector/more-appeals').reply(200, []);

			const response = await request.post('/appeals-service/inspector/available-appeals');
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should handle a successful assignment and display a success page', async () => {
			nock('http://test/')
				.post('/appeals/inspector/assign', [appealId])
				.reply(200, {
					successfullyAssigned: [appealSummaryForUnbookedSiteVisit],
					unsuccessfullyAssigned: []
				});

			const response = await request
				.post('/appeals-service/inspector/available-appeals')
				.send({ appealIds: [String(appealId)] });
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should handle an unsuccessful assignment and display a notification page', async () => {
			nock('http://test/')
				.post('/appeals/inspector/assign', [appealId])
				.reply(200, {
					successfullyAssigned: [],
					unsuccessfullyAssigned: [appealSummaryForUnbookedSiteVisit]
				});

			const response = await request
				.post('/appeals-service/inspector/available-appeals')
				.send({ appealIds: [String(appealId)] });
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /appeals/:appealId', () => {
		it('should render the appeal details', async () => {
			const { appealId } = appealDetailsForPendingStatements;
			const response = await request.get(`${baseUrl}/appeals/${appealId}`);
			const element = parseHtml(response.text);

			// Remove page actions so that appeal details snapshot is unaffected by dynamic content
			element.querySelector('[data-test-id="pageRight"]')?.remove();

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the appeal details for a full planning appeal awaiting final comments or statements', async () => {
			const { appealId } = appealDetailsForPendingStatements;
			const response = await request.get(`${baseUrl}/appeals/${appealId}`);
			const element = parseHtml(response.text, { rootElement: '[data-test-id="pageRight"]' });

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the appeal details for an unbooked site visit', async () => {
			const { appealId } = appealDetailsForUnbookedSiteVisit;
			const response = await request.get(`${baseUrl}/appeals/${appealId}`);
			const element = parseHtml(response.text, { rootElement: '[data-test-id="pageRight"]' });

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the appeal details with a pending site visit', async () => {
			const { appealId } = appealDetailsForBookedSiteVisit;
			const response = await request.get(`${baseUrl}/appeals/${appealId}`);
			const element = parseHtml(response.text, { rootElement: '[data-test-id="pageRight"]' });

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the appeal details for a site visit awaiting a decision', async () => {
			const { appealId } = appealDetailsForDecisionDue;
			const response = await request.get(`${baseUrl}/appeals/${appealId}`);
			const element = parseHtml(response.text, { rootElement: '[data-test-id="pageRight"]' });

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /appeals/:appealId/book-site-visit', () => {
		it('should render a page for booking a site visit', async () => {
			const { appealId } = appealDetailsForUnbookedSiteVisit;
			const response = await request.get(`${baseUrl}/appeals/${appealId}/book-site-visit`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the appeal page when booking a site visit is not eligible', async () => {
			const { appealId } = appealDetailsForPendingStatements;
			const response = await request
				.get(`${baseUrl}/appeals/${appealId}/book-site-visit`)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Appeal details');
		});
	});

	describe('POST /appeals/:appealId/book-site-visit', () => {
		const { appealId } = appealDetailsForUnbookedSiteVisit;

		it('should validate that the site visit details are provided', async () => {
			const response = await request.post(`${baseUrl}/appeals/${appealId}/book-site-visit`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should validate the required fields', async () => {
			const response = await request.post(`${baseUrl}/appeals/${appealId}/book-site-visit`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should validate that the site visit date is in the future', async () => {
			const response = await request.post(`${baseUrl}/appeals/${appealId}/book-site-visit`).send({
				'siteVisitDate-day': '1',
				'siteVisitDate-month': '5',
				'siteVisitDate-year': '2022',
				siteVisitTimeSlot: '1pm to 3pm',
				siteVisitType: 'unaccompanied'
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should display a confirmation page upon valid submission', async () => {
			const response = await request
				.post(`${baseUrl}/appeals/${appealId}/book-site-visit`)
				.send({
					'siteVisitDate-day': '1',
					'siteVisitDate-month': '5',
					'siteVisitDate-year': '2030',
					siteVisitTimeSlot: '1pm to 3pm',
					siteVisitType: 'unaccompanied'
				})
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Check and confirm');
		});
	});

	describe('GET /appeals/:appealId/confirm-site-visit', () => {
		const { appealId } = appealDetailsForUnbookedSiteVisit;

		beforeEach(async () => {
			await installSiteVisit(appealId);
		});

		it('should render a page for confirming a site visit', async () => {
			const response = await request.get(`${baseUrl}/appeals/${appealId}/confirm-site-visit`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appeals/:appealId/confirm-site-visit', () => {
		const { appealId } = appealDetailsForUnbookedSiteVisit;

		beforeEach(async () => {
			await installSiteVisit(appealId);
		});

		it('should confirm a site visit and render a success page', async () => {
			nock('http://test/')
				.post(`/appeals/inspector/${appealId}/book`, {
					siteVisitDate: '2030-01-01',
					siteVisitTimeSlot: '1pm to 3pm',
					siteVisitType: 'unaccompanied'
				})
				.reply(200, {
					...appealDetailsForUnbookedSiteVisit,
					bookedSiteVisit: {
						visitDate: '01 Jan 2030',
						visitSlot: '1pm to 3pm',
						visitType: 'unaccompanied'
					}
				});

			const response = await request.post(`${baseUrl}/appeals/${appealId}/confirm-site-visit`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /appeals/:appealId/issue-decision', () => {
		beforeEach(() => {
			// Used to handle today's date being printed in the page
			installFixedDate(new Date(2023, 0, 1));
		});

		it('should render a page for issuing a decision', async () => {
			const { appealId } = appealDetailsForDecisionDue;
			const response = await request.get(`${baseUrl}/appeals/${appealId}/issue-decision`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the appeal page when issuing a decision is not eligible', async () => {
			const { appealId } = appealDetailsForUnbookedSiteVisit;
			const response = await request
				.get(`${baseUrl}/appeals/${appealId}/issue-decision`)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Appeal details');
		});
	});

	describe('POST /appeals/:appealId/issue-decision', () => {
		beforeEach(() => {
			// Used to handle today's date being printed in the page
			installFixedDate(new Date(2023, 0, 1));
		});

		const { appealId } = appealDetailsForDecisionDue;

		it('should validate that the decision details are provided', async () => {
			const response = await request.post(`${baseUrl}/appeals/${appealId}/issue-decision`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should validate that a file is not in excess of 15mb', async () => {
			const response = await request
				.post(`${baseUrl}/appeals/${appealId}/issue-decision`)
				.field('outcome', 'allowed')
				.attach('decisionLetter', getPathToAsset('anthropods.pdf'));
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should display a confirmation page upon valid submission', async () => {
			const response = await request
				.post(`${baseUrl}/appeals/${appealId}/issue-decision`)
				.field('outcome', 'allowed')
				.attach('decisionLetter', getPathToAsset('simple.pdf'))
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Check and confirm');
		});
	});

	describe('GET /appeals/:appealId/confirm-decision', () => {
		beforeEach(async () => {
			// Used to handle today's date being printed in the page
			installFixedDate(new Date(2023, 0, 1));
			await installDecision(appealId);
		});

		const { appealId } = appealDetailsForDecisionDue;

		it('should render a page for confirming a site visit', async () => {
			const response = await request.get(`${baseUrl}/appeals/${appealId}/confirm-decision`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /appeals/:appealId/confirm-decision/download-decision-letter', () => {
		const { appealId } = appealDetailsForDecisionDue;

		beforeEach(async () => {
			await installDecision(appealId);
		});

		it('should download the temporarily uploaded decision letter', async () => {
			const response = await request
				.get(`${baseUrl}/appeals/${appealId}/confirm-decision/download-decision-letter`)
				.responseType('blob');

			expect(response.get('content-disposition')).toEqual('attachment; filename="simple.pdf"');
		});
	});

	describe('POST /appeals/:appealId/confirm-decision', () => {
		const { appealId } = appealDetailsForDecisionDue;

		beforeEach(async () => {
			await installDecision(appealId);
		});

		it('should confirm a decision and render a success page', async () => {
			nock('http://test/')
				.post(`/appeals/inspector/${appealId}/issue-decision`)
				.reply(200, {
					...appealDetailsForDecisionDue,
					inspectorDecision: { outcome: 'allowed' }
				});

			const response = await request.post(`${baseUrl}/appeals/${appealId}/confirm-decision`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});

/**
 * @param {number[]} appealIds
 * @returns {Promise<void>}
 */
async function installAssignedAppealIds(appealIds) {
	nock('http://test/').post('/appeals/inspector/assign', appealIds).reply(200, {
		successfullyAssigned: appealIds,
		unsuccessfullyAssigned: []
	});
	await request.post('/appeals-service/inspector/available-appeals').send({ appealIds });
	// reset http / api subsequent to test setup
	installMockApi();
}

/**
 * @param {number} appealId
 * @returns {Promise<void>}
 */
async function installDecision(appealId) {
	await request
		.post(`${baseUrl}/appeals/${appealId}/issue-decision`)
		.field('outcome', 'allowed')
		.attach('decisionLetter', getPathToAsset('simple.pdf'));
	// reset http / api subsequent to test setup
	installMockApi();
}

/**
 * @param {number} appealId
 * @returns {Promise<void>}
 */
async function installSiteVisit(appealId) {
	await request.post(`${baseUrl}/appeals/${appealId}/book-site-visit`).send({
		siteVisitTimeSlot: '1pm to 3pm',
		siteVisitType: 'unaccompanied',
		'siteVisitDate-day': '1',
		'siteVisitDate-month': '1',
		'siteVisitDate-year': '2030'
	});
	// reset http / api subsequent to test setup
	installMockApi();
}
