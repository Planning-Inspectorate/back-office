import {
	appealData,
	baseSession,
	lpaQuestionnaireData
} from '#testing/app/fixtures/referencedata.js';
import { createAccountInfo } from '#testing/app/app.js';
import { initialiseAndMapAppealData } from '../appeal.mapper.js';
import { initialiseAndMapLPAQData } from '../lpaQuestionnaire.mapper.js';
import { areIdsDefinedAndUnique } from '#testing/lib/testMappers.js';
import {
	buildNotificationBanners,
	notificationBannerDefinitions
} from '../notification-banners.mapper.js';

/** @typedef {import('../../../app/auth/auth-session.service').SessionWithAuth} SessionWithAuth */

describe('appeal-mapper', () => {
	/**
	 * @type {string}
	 */
	let currentRoute;
	/**
	 * @type {SessionWithAuth}
	 */
	let session;
	/**
	 * @type {MappedAppealInstructions}
	 */
	let validMappedData;

	describe('Test 1: Basic functionality', () => {
		beforeAll(async () => {
			currentRoute = 'testroute/';
			// @ts-ignore
			session = { account: createAccountInfo() };
			validMappedData = await initialiseAndMapAppealData(appealData, currentRoute, session);
		});

		it('should return a valid MappedAppealInstructions object for valid inputs', async () => {
			expect(validMappedData).toBeDefined();
		});
		it('should have an id that is unique', async () => {
			const idsAreUnique = areIdsDefinedAndUnique(validMappedData.appeal);
			expect(idsAreUnique).toBe(true);
		});
	});
	describe('Test 2: Value transformation', () => {
		it('should format dates using UK format', async () => {
			const preFormattedDate = '2023-10-11T01:00:00.000Z';
			const mappedDateHtml =
				// @ts-ignore
				validMappedData.appeal.lpaQuestionnaireDueDate.display.summaryListItem?.value.html;

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
		it('should create as many neighbouringSiteAddress objects as there are in the appealData', async () => {
			const neighbouringSitesSummaryListsKeys = Object.keys(validMappedData.appeal).filter(
				(key) => key.indexOf('neighbouringSiteAddress') >= 0
			);

			expect(neighbouringSitesSummaryListsKeys.length).toEqual(
				appealData.neighbouringSite.contacts?.length
			);
		});
	});
});

describe('lpaQuestionnaire-mapper', () => {
	/**
	 * @type {string}
	 */
	let currentRoute;
	/**
	 * @type {MappedLPAQInstructions}
	 */
	let validMappedData;
	beforeAll(async () => {
		currentRoute = 'testroute/';
		validMappedData = await initialiseAndMapLPAQData(lpaQuestionnaireData, currentRoute);
	});
	describe('Test 1: Basic functionality', () => {
		it('should return a valid MappedLPAQInstructions object for valid inputs', async () => {
			expect(validMappedData).toBeDefined();
		});
		it('should have an id that is unique', async () => {
			expect(areIdsDefinedAndUnique(validMappedData.lpaq)).toBe(true);
		});
	});
	describe('Test 2: Value transformation', () => {
		it('should create as many neighbouringSiteAddress objects as there are in the appealData', async () => {
			const neighbouringSitesSummaryListsKeys = Object.keys(validMappedData.lpaq).filter(
				(key) => key.indexOf('neighbouringSiteAddress') >= 0
			);

			expect(neighbouringSitesSummaryListsKeys.length).toEqual(
				lpaQuestionnaireData.neighbouringSiteContacts.length
			);
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
				parameters: {
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
				parameters: {
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
