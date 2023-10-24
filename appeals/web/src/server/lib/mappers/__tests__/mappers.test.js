import { appealData, baseSession } from '#testing/app/fixtures/referencedata.js';
import { createAccountInfo } from '#testing/app/app.js';
import { initialiseAndMapAppealData } from '../appeal.mapper.js';
import {
	buildNotificationBanners,
	notificationBannerDefinitions
} from '../notification-banners.mapper.js';

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
			const mappedDateHtml =
				// @ts-ignore
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

describe('notification banners mapper', () => {
	it('should return an empty array if notificationBanners object is not present in the session', () => {
		expect(buildNotificationBanners(baseSession, 'appealDetails', 1)).toEqual([]);
	});

	it('should not return a notification banner page component object if the notification type is not configured to display on the provided servicePage', () => {
		expect(
			buildNotificationBanners(
				{
					...baseSession,
					notificationBanners: {
						siteVisitTypeSelected: {
							appealId: 1
						}
					}
				},
				'lpaQuestionnaire',
				1
			)
		).toEqual([]);
	});

	it('should not return a notification banner page component object if the notification does not belong to the provided appealId', () => {
		expect(
			buildNotificationBanners(
				{
					...baseSession,
					notificationBanners: {
						siteVisitTypeSelected: {
							appealId: 1
						}
					}
				},
				'appealDetails',
				2
			)
		).toEqual([]);
	});

	it('should return a notification banner page component object with the expected shape and property values if the notification type is configured to show on the provided servicePage and the notification belongs to the provided appealId and overriding values are not present in the session notification object', () => {
		expect(
			buildNotificationBanners(
				{
					...baseSession,
					notificationBanners: {
						siteVisitTypeSelected: {
							appealId: 1
						}
					}
				},
				'appealDetails',
				1
			)
		).toEqual([
			{
				type: 'notification-banner',
				bannerProperties: {
					titleText: 'Success',
					titleHeadingLevel: 3,
					type: notificationBannerDefinitions.siteVisitTypeSelected.type,
					text: notificationBannerDefinitions.siteVisitTypeSelected.text
				}
			}
		]);
	});

	it('should return a notification banner page component object with the expected shape and property values if the notification type is configured to show on the provided servicePage and the notification belongs to the provided appealId and overriding values are present in the session notification object', () => {
		expect(
			buildNotificationBanners(
				{
					...baseSession,
					notificationBanners: {
						siteVisitTypeSelected: {
							appealId: 1,
							titleText: 'overriding title text',
							type: 'important',
							text: 'overriding text',
							html: '<span>overriding html</span>'
						}
					}
				},
				'appealDetails',
				1
			)
		).toEqual([
			{
				type: 'notification-banner',
				bannerProperties: {
					titleText: 'overriding title text',
					titleHeadingLevel: 3,
					type: 'important',
					text: 'overriding text',
					html: '<span>overriding html</span>'
				}
			}
		]);
	});

	it('should delete the notification banner from the session if the notification type is configured to show on the provided servicePage and the notification belongs to the provided appealId and the notification type is configured to not persist', () => {
		const testSession = {
			...baseSession,
			notificationBanners: {
				siteVisitTypeSelected: {
					appealId: 1
				}
			}
		};

		buildNotificationBanners(testSession, 'appealDetails', 1);

		expect(testSession.notificationBanners).toEqual({});
	});

	it('should not delete the notification banner from the session if the notification type is configured to show on the provided servicePage and the notification belongs to the provided appealId and the notification type is configured to persist', () => {
		const testSession = {
			...baseSession,
			notificationBanners: {
				appellantCaseNotValid: {
					appealId: 1
				}
			}
		};

		buildNotificationBanners(testSession, 'appellantCase', 1);

		expect(testSession.notificationBanners).toEqual({
			appellantCaseNotValid: {
				appealId: 1
			}
		});
	});
});
