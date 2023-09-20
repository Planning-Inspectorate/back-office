import { appealData } from '#testing/app/fixtures/referencedata.js';
import { createAccountInfo } from '#testing/app/app.js';
import { initialiseAndMapAppealData } from '../appeal.mapper.js';

/** @typedef {import('../../../app/auth/auth-session.service').SessionWithAuth} SessionWithAuth */

describe('appeal-mapper', () => {
	describe('Test 1: Basic functionality', () => {
		it('should return a valid MappedAppealInstructions object for valid inputs', async () => {
			const currentRoute = 'testroute/';
			/**
			 * @type {SessionWithAuth}
			 */
			// @ts-ignore
			const session = { account: createAccountInfo() };
			const mappedData = await initialiseAndMapAppealData(
				{ appeal: appealData },
				currentRoute,
				session
			);
			const expectedInstructions = [
				'appealType',
				'caseProcedure',
				'appellantName',
				'agentName',
				'linkedAppeals',
				'otherAppeals',
				'allocationDetails',
				'lpaReference',
				'decision',
				'siteAddress',
				'localPlanningAuthority',
				'appealStatus',
				'lpaInspectorAccess',
				'appellantInspectorAccess',
				'neighbouringSiteIsAffected',
				'neighbouringSite',
				'lpaHealthAndSafety',
				'appellantHealthAndSafety',
				'visitType',
				'startedAt',
				'lpaQuestionnaireDueDate',
				'statementReviewDueDate',
				'finalCommentReviewDueDate',
				'siteVisitDate',
				'caseOfficer',
				'inspector',
				'appellantCase',
				'lpaQuestionnaire',
				'issueDeterminationDate',
				'completeDate'
			];
			expect(mappedData).toBeDefined();
			expect(Object.keys(mappedData.appeal)).toEqual(expectedInstructions);
		});
		it('should throw an error when data is undefined', async () => {
			const currentRoute = 'testroute/';
			/**
			 * @type {SessionWithAuth}
			 */
			// @ts-ignore
			const session = { account: createAccountInfo() };
			await expect(initialiseAndMapAppealData(undefined, currentRoute, session)).rejects.toThrow();
		});
	});
	describe('Test 2: Value transformation', () => {
		it('should format dates using UK format', async () => {
			const currentRoute = 'testroute/';
			/**
			 * @type {SessionWithAuth}
			 */
			// @ts-ignore
			const session = { account: createAccountInfo() };
			const mappedData = await initialiseAndMapAppealData(
				{ appeal: appealData },
				currentRoute,
				session
			);
			const preFormattedDate = appealData.appealTimetable.lpaQuestionnaireDueDate;
			// @ts-ignore
			const mappedDateHtml =
				mappedData.appeal.lpaQuestionnaireDueDate.display.summaryListItem?.value.html;

			// Check date is the same after being formatted
			expect(new Date(mappedDateHtml).getDate()).toEqual(new Date(preFormattedDate).getDate());

			//Check date format is correct
			const expectedLongFormatRegex =
				/^\d{1,2} (?:(Jan|Febr)uary|March|April|May|Ju(ne|ly)|August|(Septem|Octo|Novem|Decem)ber) \d{4}$/;
			const expectedShortFormatRegex =
				/^\d{1,2} (?:Jan|Feb|Mar|Apr|May|Ju(n|l)|Aug|Sep|Oct|Nov|Dec) \d{4}$/;

			/**
			 * @param {string} dateString
			 */
			function isDateInCorrectFormat(dateString) {
				return (
					dateString.match(expectedLongFormatRegex) !== null ||
					dateString.match(expectedShortFormatRegex) !== null
				);
			}

			expect(isDateInCorrectFormat(mappedDateHtml)).toBe(true);
		});
	});
});
