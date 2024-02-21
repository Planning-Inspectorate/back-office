import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import {
	assignedAppealsPage1,
	assignedAppealsPage2,
	assignedAppealsPage3
} from '#testing/app/fixtures/referencedata.js';
import { createTestEnvironment } from '#testing/index.js';
import { mapAppealStatusToActionRequiredHtml } from '../personal-list.mapper.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/personal-list';

describe('personal-list', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /', () => {
		it('should render the first page of the personal list with the expected content and pagination', async () => {
			nock('http://test/')
				.get('/appeals/my-appeals?pageNumber=1&pageSize=5')
				.reply(200, assignedAppealsPage1);

			const response = await request.get(`${baseUrl}${'?pageNumber=1&pageSize=5'}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
		it('should render the second page of the personal list with the expected content and pagination', async () => {
			nock('http://test/')
				.get('/appeals/my-appeals?pageNumber=2&pageSize=5')
				.reply(200, assignedAppealsPage2);

			const response = await request.get(`${baseUrl}${'?pageNumber=2&pageSize=5'}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the second page of the personal list with applied filter, the expected content and pagination', async () => {
			nock('http://test/')
				.get('/appeals/my-appeals?pageNumber=2&pageSize=1&status=lpa_questionnaire_due')
				.reply(200, assignedAppealsPage3);

			const response = await request.get(
				`${baseUrl}${'?pageNumber=2&pageSize=1&appealStatusFilter=lpa_questionnaire_due'}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the header with navigation containing links to the personal list (with active modifier class), national list, and sign out route', async () => {
			nock('http://test/')
				.get('/appeals/my-appeals?pageNumber=1&pageSize=30')
				.reply(200, assignedAppealsPage1);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text, { rootElement: 'header' });

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a message when there are no cases assigned to the user', async () => {
			nock('http://test/')
				.get('/appeals/my-appeals?pageNumber=1&pageSize=5')
				.reply(200, { items: [], totalItems: 0, page: 1, totalPages: 1, pageSize: 5 });

			const response = await request.get(`${baseUrl}?pageNumber=1&pageSize=5`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});

describe('mapAppealStatusToActionRequiredHtml', () => {
	const appealId = 123;
	const lpaQuestionnaireId = 456;

	it('should return "Review appellant case" link for ready_to_start status with complete appellant case', () => {
		const result = mapAppealStatusToActionRequiredHtml(
			appealId,
			'ready_to_start',
			lpaQuestionnaireId,
			'Complete',
			'',
			'',
			false
		);
		expect(result).toEqual(
			`<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}/appellant-case">Review appellant case</a>`
		);
	});

	it('should return "Awaiting appellant update" link for review_appellant_case status with incomplete appellant case', () => {
		const result = mapAppealStatusToActionRequiredHtml(
			appealId,
			'review_appellant_case',
			lpaQuestionnaireId,
			'Incomplete',
			'',
			'',
			false
		);
		expect(result).toEqual(
			`<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}/appellant-case">Awaiting appellant update</a>`
		);
	});

	it('should return "Awaiting appellant update" text for review_appellant_case status with incomplete appellant case and isInspector true', () => {
		const result = mapAppealStatusToActionRequiredHtml(
			appealId,
			'review_appellant_case',
			lpaQuestionnaireId,
			'Incomplete',
			'',
			'',
			true
		);
		expect(result).toEqual('Awaiting appellant update');
	});

	it('should return "Awaiting LPA Questionnaire" for lpa_questionnaire_due status with no LPA Questionnaire ID', () => {
		const result = mapAppealStatusToActionRequiredHtml(
			appealId,
			'lpa_questionnaire_due',
			null,
			'',
			'',
			'',
			false
		);
		expect(result).toEqual('Awaiting LPA Questionnaire');
	});

	it('should return "Awaiting LPA update" link for lpa_questionnaire_due status with incomplete LPA Questionnaire', () => {
		const result = mapAppealStatusToActionRequiredHtml(
			appealId,
			'lpa_questionnaire_due',
			lpaQuestionnaireId,
			'',
			'Incomplete',
			'',
			false
		);
		expect(result).toEqual(
			`<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}">Awaiting LPA update</a>`
		);
	});

	it('should return "Awaiting LPA update" text for lpa_questionnaire_due status with incomplete LPA Questionnaire and isInspector true', () => {
		const result = mapAppealStatusToActionRequiredHtml(
			appealId,
			'lpa_questionnaire_due',
			lpaQuestionnaireId,
			'',
			'Incomplete',
			'',
			true
		);
		expect(result).toEqual('Awaiting LPA update');
	});

	it('should return "Review LPA Questionnaire" for lpa_questionnaire_due status with LPA Questionnaire', () => {
		const result = mapAppealStatusToActionRequiredHtml(
			appealId,
			'lpa_questionnaire_due',
			lpaQuestionnaireId,
			'',
			'',
			'',
			false
		);
		expect(result).toEqual(
			`<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}">Review LPA Questionnaire</a>`
		);
	});

	it('should return "Review LPA Questionnaire" for lpa_questionnaire_due status with LPA Questionnaire and isInspector true', () => {
		const result = mapAppealStatusToActionRequiredHtml(
			appealId,
			'lpa_questionnaire_due',
			lpaQuestionnaireId,
			'',
			'',
			'',
			true
		);
		expect(result).toEqual('Review LPA Questionnaire');
	});

	it('should return "LPA Questionnaire Overdue" for lpa_questionnaire_due status with LPA Questionnaire overdue', () => {
		const result = mapAppealStatusToActionRequiredHtml(
			appealId,
			'lpa_questionnaire_due',
			null,
			'',
			'',
			'2024-01-01',
			false
		);
		expect(result).toEqual('LPA Questionnaire Overdue');
	});

	it('should return "Submit decision" link for issue_determination status', () => {
		const result = mapAppealStatusToActionRequiredHtml(
			appealId,
			'issue_determination',
			null,
			'',
			'',
			'',
			false
		);
		expect(result).toEqual(
			`<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}/issue-decision/decision">Submit decision</a>`
		);
	});

	it('should return "Update Horizon reference" link for awaiting_transfer status', () => {
		const result = mapAppealStatusToActionRequiredHtml(
			appealId,
			'awaiting_transfer',
			null,
			'',
			'',
			'',
			false
		);
		expect(result).toEqual(
			`<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}/change-appeal-type/add-horizon-reference">Update Horizon reference</a>`
		);
	});

	it('should return "View appellant case" link for any other status', () => {
		const result = mapAppealStatusToActionRequiredHtml(
			appealId,
			'some_other_status',
			null,
			'',
			'',
			'',
			false
		);
		expect(result).toEqual(
			`<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}">View appellant case</a>`
		);
	});
});
