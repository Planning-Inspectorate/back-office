import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { jest } from '@jest/globals';
import { createTestEnvironment } from '#testing/index.js';
import {
	appellantCaseDataNotValidated,
	appellantCaseDataNotValidatedWithDocuments,
	appellantCaseDataIncompleteOutcome,
	appellantCaseDataValidOutcome,
	appellantCaseInvalidReasons,
	appellantCaseIncompleteReasons,
	documentFolderInfo,
	documentFolderInfoWithoutDraftDocuments,
	documentFileInfo,
	additionalDocumentsFolderInfo,
	documentRedactionStatuses,
	documentFileVersionsInfo,
	documentFileVersionsInfoNotChecked,
	documentFileVersionsInfoVirusFound,
	documentFileVersionsInfoChecked,
	documentFileMultipleVersionsInfoWithLatestAsLateEntry,
	activeDirectoryUsersData,
	notCheckedDocumentFolderInfoDocuments,
	appealData,
	scanFailedDocumentFolderInfoDocuments,
	appellantCaseDataInvalidOutcome
} from '#testing/app/fixtures/referencedata.js';
import { cloneDeep } from 'lodash-es';
import { textInputCharacterLimits } from '#appeals/appeal.constants.js';
import usersService from '#appeals/appeal-users/users-service.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';
const appellantCasePagePath = '/appellant-case';
const validOutcomePagePath = '/valid';
const invalidOutcomePagePath = '/invalid';
const incompleteOutcomePagePath = '/incomplete';
const updateDueDatePagePath = '/date';
const checkYourAnswersPagePath = '/check-your-answers';
const confirmationPagePath = '/confirmation';

const invalidReasonsWithoutText = appellantCaseInvalidReasons.filter(
	(reason) => reason.hasText === false
);
const invalidReasonsWithText = appellantCaseInvalidReasons.filter(
	(reason) => reason.hasText === true
);
const incompleteReasonsWithoutText = appellantCaseIncompleteReasons.filter(
	(reason) => reason.hasText === false
);
const incompleteReasonsWithText = appellantCaseIncompleteReasons.filter(
	(reason) => reason.hasText === true
);

const invalidReasonsWithoutTextIds = invalidReasonsWithoutText.map((reason) => reason.id);
const invalidReasonsWithTextIds = invalidReasonsWithText.map((reason) => reason.id);
const incompleteReasonsWithoutTextIds = incompleteReasonsWithoutText.map((reason) => reason.id);
const incompleteReasonsWithTextIds = incompleteReasonsWithText.map((reason) => reason.id);

describe('appellant-case', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /appellant-case', () => {
		beforeEach(() => {
			nock('http://test/')
				.get('/appeals/document-redaction-statuses')
				.reply(200, documentRedactionStatuses);
		});
		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the appellant case page', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataNotValidated);

			const response = await request.get(`${baseUrl}/1${appellantCasePagePath}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the appellant case page with draft documents notification banner with links to add metadata page for each folder containing draft documents, and no links for folders with only non-draft documents', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataNotValidatedWithDocuments);
			nock('http://test/').get('/appeals/1/document-folders/1').reply(200, documentFolderInfo);
			nock('http://test/')
				.get('/appeals/1/document-folders/2')
				.reply(200, documentFolderInfoWithoutDraftDocuments);

			const response = await request.get(`${baseUrl}/1${appellantCasePagePath}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /appellant-case with unchecked documents', () => {
		beforeEach(() => {
			nock.cleanAll();
			nock('http://test/').get(`/appeals/${appealData.appealId}`).reply(200, appealData).persist();
			nock('http://test/')
				.get('/appeals/document-redaction-statuses')
				.reply(200, documentRedactionStatuses);
		});

		it('should render a notification banner when a file is unscanned', async () => {
			//Create a document with virus scan still in progress
			let updatedAppellantCaseData = cloneDeep(appellantCaseDataIncompleteOutcome);
			updatedAppellantCaseData.documents.applicationForm.documents.push(
				// @ts-ignore
				notCheckedDocumentFolderInfoDocuments
			);
			nock('http://test/').get('/appeals/1/appellant-cases/0').reply(200, updatedAppellantCaseData);

			const response = await request.get(`${baseUrl}/1${appellantCasePagePath}`);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render an error when a file has a virus', async () => {
			//Create a document with virus scan still in progress
			let updatedAppellantCaseData = cloneDeep(appellantCaseDataIncompleteOutcome);
			updatedAppellantCaseData.documents.applicationForm.documents.push(
				// @ts-ignore
				scanFailedDocumentFolderInfoDocuments
			);
			nock('http://test/').get('/appeals/1/appellant-cases/0').reply(200, updatedAppellantCaseData);

			const response = await request.get(`${baseUrl}/1${appellantCasePagePath}`);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appellant-case', () => {
		beforeEach(() => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataIncompleteOutcome);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should re-render the appellant case page with the expected error message if no review outcome was selected', async () => {
			const response = await request.post(`${baseUrl}/1${appellantCasePagePath}`).send({
				reviewOutcome: ''
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should send a patch request to the appellant-cases API endpoint and redirect to the confirmation page if selected review outcome value is "valid"', async () => {
			nock('http://test/')
				.patch('/appeals/1/appellant-cases/0')
				.reply(200, { validationOutcome: 'valid' });

			const response = await request.post(`${baseUrl}/1${appellantCasePagePath}`).send({
				reviewOutcome: 'valid'
			});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the invalid reason page if selected review outcome value is "invalid"', async () => {
			nock('http://test/')
				.patch('/appeals/1/appellant-cases/0')
				.reply(200, { validationOutcome: 'invalid' });

			const response = await request.post(`${baseUrl}/1${appellantCasePagePath}`).send({
				reviewOutcome: 'invalid'
			});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the incomplete reason page if selected review outcome value is "incomplete"', async () => {
			nock('http://test/')
				.patch('/appeals/1/appellant-cases/0')
				.reply(200, { validationOutcome: 'incomplete' });

			const response = await request.post(`${baseUrl}/1${appellantCasePagePath}`).send({
				reviewOutcome: 'incomplete'
			});

			expect(response.statusCode).toBe(302);
		});
	});

	describe('GET /appellant-case/invalid', () => {
		beforeEach(() => {
			nock('http://test/')
				.get('/appeals/appellant-case-invalid-reasons')
				.reply(200, appellantCaseInvalidReasons);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the invalid reason page if required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'invalid'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appellant-case/invalid', () => {
		/**
		 * @type {import("superagent").Response}
		 */
		let appellantCasePostResponse;

		beforeEach(async () => {
			nock('http://test/')
				.get('/appeals/appellant-case-invalid-reasons')
				.reply(200, appellantCaseInvalidReasons);

			// post to appellant case page controller is necessary to set required data in the session
			appellantCasePostResponse = await request.post(`${baseUrl}/1${appellantCasePagePath}`).send({
				reviewOutcome: 'invalid'
			});
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should re-render the invalid reason page with the expected error message if no invalid reason was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the invalid reason page with the expected error message if a single invalid reason with text was provided but the matching text property is an empty string', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: invalidReasonsWithTextIds[0],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: ''
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the invalid reason page with the expected error message if a single invalid reason with text was provided but the matching text property is an empty array', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: invalidReasonsWithTextIds[0],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: []
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the invalid reason page with the expected error message if multiple invalid reasons with text were provided but any of the matching text properties are empty strings', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: [invalidReasonsWithTextIds[0], invalidReasonsWithTextIds[1]],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: 'test reason text 1',
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: ''
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the invalid reason page with the expected error message if multiple invalid reasons with text were provided but any of the matching text properties are empty arays', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: [invalidReasonsWithTextIds[0], invalidReasonsWithTextIds[1]],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: 'test reason text 1',
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: []
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the invalid reason page with the expected error message if a single invalid reason with text was provided but the matching text property exceeds the character limit', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: invalidReasonsWithTextIds[0],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: 'a'.repeat(
						textInputCharacterLimits.appellantCaseNotValidReason + 1
					)
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the invalid reason page with the expected error message if multiple invalid reasons with text were provided but any of the matching text properties exceed the character limit', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: [invalidReasonsWithTextIds[0], invalidReasonsWithTextIds[1]],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: 'test reason text 1',
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: 'a'.repeat(
						textInputCharacterLimits.appellantCaseNotValidReason + 1
					)
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the check and confirm page if a single invalid reason without text was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: invalidReasonsWithoutTextIds[0]
				});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page if a single invalid reason with text within the character limit was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: invalidReasonsWithTextIds[0],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: [
						'a'.repeat(textInputCharacterLimits.appellantCaseNotValidReason)
					]
				});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page if multiple invalid reasons without text were provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: invalidReasonsWithoutTextIds
				});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page if multiple invalid reasons with text within the character limit were provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: [invalidReasonsWithTextIds[0], invalidReasonsWithTextIds[1]],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: [
						'a'.repeat(textInputCharacterLimits.appellantCaseNotValidReason)
					],
					[`invalidReason-${invalidReasonsWithTextIds[1]}`]: [
						'a'.repeat(textInputCharacterLimits.appellantCaseNotValidReason),
						'a'.repeat(textInputCharacterLimits.appellantCaseNotValidReason)
					]
				});

			expect(response.statusCode).toBe(302);
		});
	});

	describe('GET /appellant-case/incomplete', () => {
		beforeEach(() => {
			nock('http://test/')
				.get('/appeals/appellant-case-incomplete-reasons')
				.reply(200, appellantCaseIncompleteReasons);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the incomplete reason page if required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'incomplete'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appellant-case/incomplete', () => {
		/**
		 * @type {import("superagent").Response}
		 */
		let appellantCasePostResponse;

		beforeEach(async () => {
			nock('http://test/')
				.get('/appeals/appellant-case-incomplete-reasons')
				.reply(200, appellantCaseIncompleteReasons);

			// post to appellant case page controller is necessary to set required data in the session
			appellantCasePostResponse = await request.post(`${baseUrl}/1${appellantCasePagePath}`).send({
				reviewOutcome: 'incomplete'
			});
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should re-render the incomplete reason page with the expected error message if no incomplete reason was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if a single incomplete reason with text was provided but the matching text property is an empty string', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithTextIds[0],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: ''
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if a single incomplete reason with text was provided but the matching text property is an empty array', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithTextIds[0],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: []
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if multiple incomplete reasons with text were provided but any of the matching text properties are empty strings', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: [incompleteReasonsWithTextIds[0], incompleteReasonsWithTextIds[1]],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: 'test reason text 1',
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: ''
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if multiple incomplete reasons with text were provided but any of the matching text properties are empty arrays', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: [incompleteReasonsWithTextIds[0], incompleteReasonsWithTextIds[1]],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: 'test reason text 1',
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: []
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if a single incomplete reason with text was provided but the matching text property exceeds the character limit', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithTextIds[0],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: 'a'.repeat(
						textInputCharacterLimits.appellantCaseNotValidReason + 1
					)
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if multiple incomplete reasons with text were provided but any of the matching text properties exceed the character limit', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: [incompleteReasonsWithTextIds[0], incompleteReasonsWithTextIds[1]],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: 'test reason text 1',
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: 'a'.repeat(
						textInputCharacterLimits.appellantCaseNotValidReason + 1
					)
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the check and confirm page if a single incomplete reason without text was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithoutTextIds[0]
				});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page a single incomplete reason with text within the character limit was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithTextIds[0],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: [
						'a'.repeat(textInputCharacterLimits.appellantCaseNotValidReason),
						'a'.repeat(textInputCharacterLimits.appellantCaseNotValidReason)
					]
				});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page if multiple incomplete reasons without text were provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithoutTextIds
				});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page if multiple incomplete reasons with text within the character limit were provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: [incompleteReasonsWithTextIds[0], incompleteReasonsWithTextIds[1]],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: [
						'a'.repeat(textInputCharacterLimits.appellantCaseNotValidReason)
					],
					[`incompleteReason-${incompleteReasonsWithTextIds[1]}`]: [
						'a'.repeat(textInputCharacterLimits.appellantCaseNotValidReason),
						'test reason text 3'
					]
				});

			expect(response.statusCode).toBe(302);
		});
	});

	describe('GET /appellant-case/incomplete/date', () => {
		beforeEach(() => {
			nock('http://test/')
				.get('/appeals/appellant-case-incomplete-reasons')
				.reply(200, appellantCaseIncompleteReasons);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the update due date page if required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'incomplete'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			// post to incomplete reason page controller is necessary to set required data in the session
			const incompleteReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithoutTextIds[0]
				});

			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appellant-case/incomplete/date', () => {
		/**
		 * @type {import("superagent").Response}
		 */
		let appellantCasePostResponse;
		/**
		 * @type {import("superagent").Response}
		 */
		let incompleteReasonPostResponse;

		beforeEach(async () => {
			nock('http://test/')
				.get('/appeals/appellant-case-incomplete-reasons')
				.reply(200, appellantCaseIncompleteReasons);

			// post to appellant case page controller is necessary to set required data in the session
			appellantCasePostResponse = await request.post(`${baseUrl}/1${appellantCasePagePath}`).send({
				reviewOutcome: 'incomplete'
			});

			// post to incomplete reason page controller is necessary to set required data in the session
			incompleteReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithoutTextIds[0]
				});
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should re-render the update date page with the expected error message if no date was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '',
					'due-date-month': '',
					'due-date-year': ''
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the update date page with the expected error message if provided date is not in the future', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '1',
					'due-date-year': '2000'
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the update date page with the expected error message if an invalid day was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			let response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '0',
					'due-date-month': '1',
					'due-date-year': '3000'
				});

			expect(response.statusCode).toBe(200);

			let element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '32',
					'due-date-month': '1',
					'due-date-year': '3000'
				});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': 'first',
					'due-date-month': '1',
					'due-date-year': '3000'
				});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the update date page with the expected error message if an invalid month was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			let response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '0',
					'due-date-year': '3000'
				});

			expect(response.statusCode).toBe(200);

			let element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '13',
					'due-date-year': '3000'
				});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': 'dec',
					'due-date-year': '3000'
				});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the update date page with the expected error message if an invalid year was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			let response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '1',
					'due-date-year': '23'
				});

			expect(response.statusCode).toBe(200);

			let element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '1',
					'due-date-year': 'abc'
				});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the update date page with the expected error message if an invalid date was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '29',
					'due-date-month': '2',
					'due-date-year': '3000'
				});

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the check and confirm page if a valid date was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '12',
					'due-date-year': '3000'
				});

			expect(response.statusCode).toBe(200);
		});
	});

	describe('GET /appellant-case/check-your-answers', () => {
		beforeEach(async () => {
			nock('http://test/')
				.get('/appeals/appellant-case-invalid-reasons')
				.reply(200, appellantCaseInvalidReasons);
			nock('http://test/')
				.get('/appeals/appellant-case-incomplete-reasons')
				.reply(200, appellantCaseIncompleteReasons);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${checkYourAnswersPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the check your answers page with the expected content if outcome is "invalid" and required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'invalid'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			// post to invalid reason page controller is necessary to set required data in the session
			const invalidReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${invalidOutcomePagePath}`)
				.send({
					invalidReason: [invalidReasonsWithTextIds[0], invalidReasonsWithTextIds[1]],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: 'test reason text 1',
					[`invalidReason-${invalidReasonsWithTextIds[1]}`]: [
						'test reason text 1',
						'test reason text 2'
					]
				});

			expect(invalidReasonPostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${checkYourAnswersPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the check your answers page with the expected content if outcome is "incomplete" and required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'incomplete'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			// post to incomplete reason page controller is necessary to set required data in the session
			const incompleteReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: [incompleteReasonsWithTextIds[0], incompleteReasonsWithTextIds[1]],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: [
						'test reason text 1',
						'test reason text 2'
					],
					[`incompleteReason-${incompleteReasonsWithTextIds[1]}`]: 'test reason text 1'
				});

			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			// post to update date page controller is necessary to set updated due date
			const updateDateResponse = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '12',
					'due-date-year': '3000'
				});

			expect(updateDateResponse.statusCode).toBe(200);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${checkYourAnswersPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appellant-case/check-your-answers', () => {
		beforeEach(async () => {
			nock('http://test/')
				.get('/appeals/appellant-case-invalid-reasons')
				.reply(200, appellantCaseInvalidReasons);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should send a patch request to the appellant-cases API endpoint and redirect to the decision invalid confirmation page, if posted outcome was "invalid"', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'invalid'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			// post to invalid reason page controller is necessary to set required data in the session
			const invalidReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${invalidOutcomePagePath}`)
				.send({
					invalidReason: invalidReasonsWithoutTextIds[0]
				});

			expect(invalidReasonPostResponse.statusCode).toBe(302);

			const mockedAppellantCasesEndpoint = nock('http://test/')
				.patch('/appeals/1/appellant-cases/0')
				.reply(200, { validationOutcome: 'invalid' });

			const response = await request.post(
				`${baseUrl}/1${appellantCasePagePath}${checkYourAnswersPagePath}`
			);

			expect(mockedAppellantCasesEndpoint.isDone()).toBe(true);
			expect(response.statusCode).toBe(302);
		});

		it('should send a patch request to the appellant-cases API endpoint and redirect to the decision incomplete confirmation page, if posted outcome was "incomplete"', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'incomplete'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			// post to incomplete reason page controller is necessary to set required data in the session
			const incompleteReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithoutTextIds[0]
				});

			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const mockedAppellantCasesEndpoint = nock('http://test/')
				.patch('/appeals/1/appellant-cases/0')
				.reply(200, { validationOutcome: 'incomplete' });

			const response = await request.post(
				`${baseUrl}/1${appellantCasePagePath}${checkYourAnswersPagePath}`
			);

			expect(mockedAppellantCasesEndpoint.isDone()).toBe(true);
			expect(response.statusCode).toBe(302);
		});
	});

	describe('GET /appellant-case/valid/confirmation', () => {
		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${validOutcomePagePath}${confirmationPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the outcome valid confirmation page if required data is present in the session', async () => {
			const mockedAppellantCasesEndpoint = nock('http://test/')
				.patch('/appeals/1/appellant-cases/0')
				.reply(200, { validationOutcome: 'incomplete' });

			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'valid'
				});

			expect(mockedAppellantCasesEndpoint.isDone()).toBe(true);
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${validOutcomePagePath}${confirmationPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /appellant-case/invalid/confirmation', () => {
		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}${confirmationPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the outcome invalid confirmation page if required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'invalid'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}${confirmationPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /appellant-case/incomplete/confirmation', () => {
		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${confirmationPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the outcome incomplete confirmation page if required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'incomplete'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${confirmationPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /appellant-case/add-documents/:folderId/', () => {
		beforeEach(() => {
			nock.cleanAll();
			nock('http://test/').get('/appeals/1').reply(200, appealData);
			nock('http://test/')
				.get('/appeals/document-redaction-statuses')
				.reply(200, documentRedactionStatuses);
		});
		afterEach(() => {
			nock.cleanAll();
		});

		it('should render a document upload page with a file upload component, and no late entry tag and associated details component, and no additional documents warning text and confirmation checkbox, if the folder is not additional documents', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataNotValidated);
			nock('http://test/').get('/appeals/1/document-folders/1').reply(200, documentFolderInfo);
			nock('http://test/').get('/appeals/1/documents/1').reply(200, documentFileInfo);

			const response = await request.get(`${baseUrl}/1${appellantCasePagePath}/add-documents/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render document upload page with additional documents warning text and confirmation checkbox, and without late entry status tag and associated details component, if the folder is additional documents, and the appellant case has no validation outcome', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataNotValidated);
			nock('http://test/')
				.get('/appeals/1/document-folders/1')
				.reply(200, additionalDocumentsFolderInfo);

			const response = await request.get(`${baseUrl}/1${appellantCasePagePath}/add-documents/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render document upload page with additional documents warning text and confirmation checkbox, and without late entry status tag and associated details component, if the folder is additional documents, and the appellant case has a validation outcome of invalid', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataInvalidOutcome);
			nock('http://test/')
				.get('/appeals/1/document-folders/1')
				.reply(200, additionalDocumentsFolderInfo);

			const response = await request.get(`${baseUrl}/1${appellantCasePagePath}/add-documents/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render document upload page with additional documents warning text and confirmation checkbox, and without late entry status tag and associated details component, if the folder is additional documents, and the appellant case has a validation outcome of incomplete', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataIncompleteOutcome);
			nock('http://test/')
				.get('/appeals/1/document-folders/1')
				.reply(200, additionalDocumentsFolderInfo);

			const response = await request.get(`${baseUrl}/1${appellantCasePagePath}/add-documents/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render document upload page with late entry status tag and associated details component, and without additional documents warning text and confirmation checkbox, if the folder is additional documents, and the appellant case validation outcome is valid', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataValidOutcome);
			nock('http://test/')
				.get('/appeals/1/document-folders/1')
				.reply(200, additionalDocumentsFolderInfo);

			const response = await request.get(`${baseUrl}/1${appellantCasePagePath}/add-documents/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /appellant-case/add-documents/:folderId/:documentId', () => {
		beforeEach(() => {
			nock.cleanAll();
			nock('http://test/').get('/appeals/1').reply(200, appealData);
			nock('http://test/').get('/appeals/1/documents/1').reply(200, documentFileInfo);
			nock('http://test/')
				.get('/appeals/document-redaction-statuses')
				.reply(200, documentRedactionStatuses);
		});
		afterEach(() => {
			nock.cleanAll();
		});

		it('should render a document upload page with a file upload component, and no late entry tag and associated details component, and no additional documents warning text and confirmation checkbox, if the folder is not additional documents', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataNotValidated);
			nock('http://test/').get('/appeals/1/document-folders/1').reply(200, documentFolderInfo);

			const response = await request.get(`${baseUrl}/1${appellantCasePagePath}/add-documents/1/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render document upload page with additional documents warning text and confirmation checkbox, and without late entry status tag and associated details component, if the folder is additional documents, and the appellant case has no validation outcome', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataNotValidated);
			nock('http://test/')
				.get('/appeals/1/document-folders/1')
				.reply(200, additionalDocumentsFolderInfo);

			const response = await request.get(`${baseUrl}/1${appellantCasePagePath}/add-documents/1/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render document upload page with additional documents warning text and confirmation checkbox, and without late entry status tag and associated details component, if the folder is additional documents, and the appellant case has a validation outcome of invalid', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataInvalidOutcome);
			nock('http://test/')
				.get('/appeals/1/document-folders/1')
				.reply(200, additionalDocumentsFolderInfo);

			const response = await request.get(`${baseUrl}/1${appellantCasePagePath}/add-documents/1/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render document upload page with additional documents warning text and confirmation checkbox, and without late entry status tag and associated details component, if the folder is additional documents, and the appellant case has a validation outcome of incomplete', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataIncompleteOutcome);
			nock('http://test/')
				.get('/appeals/1/document-folders/1')
				.reply(200, additionalDocumentsFolderInfo);

			const response = await request.get(`${baseUrl}/1${appellantCasePagePath}/add-documents/1/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render document upload page with late entry status tag and associated details component, and without additional documents warning text and confirmation checkbox, if the folder is additional documents, and the appellant case validation outcome is valid', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataValidOutcome);
			nock('http://test/')
				.get('/appeals/1/document-folders/1')
				.reply(200, additionalDocumentsFolderInfo);

			const response = await request.get(`${baseUrl}/1${appellantCasePagePath}/add-documents/1/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /appellant-case/add-document-details/:folderId/', () => {
		beforeEach(() => {
			nock.cleanAll();
			nock('http://test/').get('/appeals/1').reply(200, appealData);
			nock('http://test/').get('/appeals/1/documents/1').reply(200, documentFileInfo);
			nock('http://test/')
				.get('/appeals/document-redaction-statuses')
				.reply(200, documentRedactionStatuses);
		});
		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the add document details page with one item per unpublished document, and without a late entry status tag and associated details component, if the folder is not additional documents', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataNotValidated);
			nock('http://test/').get('/appeals/1/document-folders/1').reply(200, documentFolderInfo);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the add document details page with one item per unpublished document, and without a late entry status tag and associated details component, if the folder is additional documents, and the appellant case has no validation outcome', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataNotValidated);
			nock('http://test/')
				.get('/appeals/1/document-folders/1')
				.reply(200, additionalDocumentsFolderInfo);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the add document details page with one item per unpublished document, and without a late entry status tag and associated details component, if the folder is additional documents, and the appellant case has a validation outcome of invalid', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataInvalidOutcome);
			nock('http://test/')
				.get('/appeals/1/document-folders/1')
				.reply(200, additionalDocumentsFolderInfo);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the add document details page with one item per unpublished document, and without a late entry status tag and associated details component, if the folder is additional documents, and the appellant case has a validation outcome of incomplete', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataIncompleteOutcome);
			nock('http://test/')
				.get('/appeals/1/document-folders/1')
				.reply(200, additionalDocumentsFolderInfo);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the add document details page with one item per unpublished document, and with a late entry status tag and associated details component, if the folder is additional documents, and the appellant case has a validation outcome of valid', async () => {
			nock('http://test/')
				.get('/appeals/1/appellant-cases/0')
				.reply(200, appellantCaseDataValidOutcome);
			nock('http://test/')
				.get('/appeals/1/document-folders/1')
				.reply(200, additionalDocumentsFolderInfo);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appellant-case/add-document-details/:folderId/', () => {
		beforeEach(() => {
			nock('http://test/')
				.get('/appeals/document-redaction-statuses')
				.reply(200, documentRedactionStatuses);
			nock('http://test/')
				.get('/appeals/1/document-folders/1')
				.reply(200, {
					folderId: 23,
					path: 'appellant_case/appealStatement',
					caseId: '1',
					documents: [
						{
							id: '4541e025-00e1-4458-aac6-d1b51f6ae0a7',
							receivedDate: '2023-02-01',
							redactionStatus: 2
						}
					]
				});
			nock('http://test/')
				.patch('/appeals/1/documents')
				.reply(200, {
					documents: [
						{
							id: '4541e025-00e1-4458-aac6-d1b51f6ae0a7',
							receivedDate: '2023-02-01',
							redactionStatus: 2
						}
					]
				});
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should re-render the document details page with the expected error message if the request body is in an incorrect format', async () => {
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`)
				.send({});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate day is empty', async () => {
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`)
				.send({
					items: [
						{
							documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
							receivedDate: {
								day: '',
								month: '2',
								year: '2030'
							},
							redactionStatus: 'unredacted'
						}
					]
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate day is non-numeric', async () => {
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`)
				.send({
					items: [
						{
							documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
							receivedDate: {
								day: 'a',
								month: '2',
								year: '2030'
							},
							redactionStatus: 'unredacted'
						}
					]
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate day is less than 1', async () => {
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`)
				.send({
					items: [
						{
							documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
							receivedDate: {
								day: '0',
								month: '2',
								year: '2030'
							},
							redactionStatus: 'unredacted'
						}
					]
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate day is greater than 31', async () => {
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`)
				.send({
					items: [
						{
							documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
							receivedDate: {
								day: '32',
								month: '2',
								year: '2030'
							},
							redactionStatus: 'unredacted'
						}
					]
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate month is empty', async () => {
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`)
				.send({
					items: [
						{
							documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
							receivedDate: {
								day: '1',
								month: '',
								year: '2030'
							},
							redactionStatus: 'unredacted'
						}
					]
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate month is non-numeric', async () => {
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`)
				.send({
					items: [
						{
							documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
							receivedDate: {
								day: '1',
								month: 'a',
								year: '2030'
							},
							redactionStatus: 'unredacted'
						}
					]
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate month is less than 1', async () => {
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`)
				.send({
					items: [
						{
							documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
							receivedDate: {
								day: '1',
								month: '0',
								year: '2030'
							},
							redactionStatus: 'unredacted'
						}
					]
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate month is greater than 12', async () => {
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`)
				.send({
					items: [
						{
							documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
							receivedDate: {
								day: '1',
								month: '13',
								year: '2030'
							},
							redactionStatus: 'unredacted'
						}
					]
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate year is empty', async () => {
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`)
				.send({
					items: [
						{
							documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
							receivedDate: {
								day: '1',
								month: '2',
								year: ''
							},
							redactionStatus: 'unredacted'
						}
					]
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate year is non-numeric', async () => {
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`)
				.send({
					items: [
						{
							documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
							receivedDate: {
								day: '1',
								month: '2',
								year: 'a'
							},
							redactionStatus: 'unredacted'
						}
					]
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate is not a valid date', async () => {
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`)
				.send({
					items: [
						{
							documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
							receivedDate: {
								day: '29',
								month: '2',
								year: '2023'
							},
							redactionStatus: 'unredacted'
						}
					]
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should send a patch request to the appeal documents endpoint and redirect to the appellant case page, if complete and valid document details were provided', async () => {
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/add-document-details/1`)
				.send({
					items: [
						{
							documentId: '4541e025-00e1-4458-aac6-d1b51f6ae0a7',
							receivedDate: {
								day: '1',
								month: '2',
								year: '2023'
							},
							redactionStatus: 'unredacted'
						}
					]
				});

			expect(response.statusCode).toBe(302);
		});
	});

	describe('GET /appellant-case/manage-documents/:folderId/', () => {
		beforeEach(() => {
			nock.cleanAll();

			// @ts-ignore
			usersService.getUserByRoleAndId = jest.fn().mockResolvedValue(activeDirectoryUsersData[0]);

			nock('http://test/')
				.get('/appeals/document-redaction-statuses')
				.reply(200, documentRedactionStatuses);
		});
		afterEach(() => {
			nock.cleanAll();
		});

		it('should render a 404 error page if the folderId is not valid', async () => {
			nock('http://test/').get('/appeals/1/document-folders/1').reply(200, documentFolderInfo);
			nock('http://test/').get('/appeals/1/documents/1').reply(200, documentFileInfo);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/manage-documents/99/`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the manage documents listing page with one document item for each document present in the folder, with late entry status tags in the date received column for documents marked as late entry, if the folderId is valid', async () => {
			nock('http://test/').get('/appeals/1/document-folders/1').reply(200, documentFolderInfo);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/manage-documents/1/`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /appellant-case/manage-documents/:folderId/:documentId', () => {
		beforeEach(() => {
			// @ts-ignore
			usersService.getUsersByRole = jest.fn().mockResolvedValue(activeDirectoryUsersData);
			// @ts-ignore
			usersService.getUserByRoleAndId = jest.fn().mockResolvedValue(activeDirectoryUsersData[0]);
			// @ts-ignore
			usersService.getUserById = jest.fn().mockResolvedValue(activeDirectoryUsersData[0]);

			nock('http://test/')
				.get('/appeals/document-redaction-statuses')
				.reply(200, documentRedactionStatuses);
			nock('http://test/').get('/appeals/1/document-folders/1').reply(200, documentFolderInfo);
			nock('http://test/').get('/appeals/1/documents/1').reply(200, documentFileInfo);
		});

		it('should render a 404 error page if the folderId is not valid', async () => {
			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileVersionsInfo);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/manage-documents/99/1`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a 404 error page if the documentId is not valid', async () => {
			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileVersionsInfo);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/manage-documents/1/99`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the manage individual document page with the expected content if the folderId and documentId are both valid and the document virus check status is null', async () => {
			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileVersionsInfo);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/manage-documents/1/1`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the manage individual document page with the expected content if the folderId and documentId are both valid and the document virus check status is "not_checked"', async () => {
			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileVersionsInfoNotChecked);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/manage-documents/1/1`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the manage individual document page with the expected content if the folderId and documentId are both valid and the document virus check status is "failed_virus_check"', async () => {
			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileVersionsInfoVirusFound);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/manage-documents/1/1`
			);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the manage individual document page with the expected content if the folderId and documentId are both valid and the document virus check status is "checked"', async () => {
			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileVersionsInfoChecked);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/manage-documents/1/1`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the manage individual document page without late entry tag in the date received row if the latest version of the document is not marked as late entry', async () => {
			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileVersionsInfo);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/manage-documents/1/1`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the manage individual document page with late entry tag in the date received row if the latest version of the document is marked as late entry, and a document history item for each version, with late entry tag in the history item document name column for versions marked as late entry', async () => {
			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileMultipleVersionsInfoWithLatestAsLateEntry);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/manage-documents/1/1`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /appellant-case/manage-documents/:folderId/:documentId/:versionId/delete', () => {
		beforeEach(() => {
			nock('http://test/')
				.get('/appeals/document-redaction-statuses')
				.reply(200, documentRedactionStatuses);
			nock('http://test/').get('/appeals/1/document-folders/1').reply(200, documentFolderInfo);
			nock('http://test/').get('/appeals/1/documents/1').reply(200, documentFileInfo);
		});

		it('should render the delete document page with single document verson', async () => {
			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileVersionsInfoChecked);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/manage-documents/1/1/1/delete`
			);

			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the delete document page with multiple document versons', async () => {
			const multipleVersionsDocument = cloneDeep(documentFileVersionsInfoChecked);
			multipleVersionsDocument.documentVersion.push(multipleVersionsDocument.documentVersion[0]);

			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, multipleVersionsDocument);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}/manage-documents/1/1/1/delete`
			);

			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});

nock('http://test/').get(`/appeals/${appealData.appealId}`).reply(200, appealData).persist();
