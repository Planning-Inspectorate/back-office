/**
 * Test data used for development and testing
 */

import {
	addressesList,
	appellantCaseList,
	appellantsList,
	completeValidationDecisionSample,
	incompleteReviewQuestionnaireSample,
	incompleteValidationDecisionSample,
	invalidValidationDecisionSample,
	localPlanningDepartmentList,
	lpaQuestionnaireList
} from './data-samples.js';
import { calculateTimetable, isFPA } from '../../server/appeals/appeals/appeals.service.js';
import {
	APPEAL_TYPE_SHORTCODE_FPA,
	APPEAL_TYPE_SHORTCODE_HAS
} from '../../server/appeals/constants.js';

/**
 * @returns {Date} date two weeks ago
 */
function getDateTwoWeeksAgo() {
	const date = new Date();

	date.setDate(date.getDate() - 14);
	date.setHours(23);
	return date;
}

/**
 * @returns {string}
 */
function generateAppealReference() {
	const number = Math.floor(Math.random() * 999_999 + 1);

	return `APP/Q9999/D/21/${number}`;
}

/**
 *
 * @param {object[] | string[]} list
 * @returns {object | string}
 */
function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)];
}

/**
 *
 * @param {string} lpaQuestionnaireAndInspectorPickupState
 * @param {string} statementsAndFinalCommentsState
 * @param {Date} createdAt
 * @returns {{status: string, createdAt: Date, subStateMachineName: string, compoundStateName: string}[]}
 */
const buildCompoundState = (
	lpaQuestionnaireAndInspectorPickupState,
	statementsAndFinalCommentsState,
	createdAt = new Date()
) => {
	return [
		{
			status: lpaQuestionnaireAndInspectorPickupState,
			createdAt,
			subStateMachineName: 'lpaQuestionnaireAndInspectorPickup',
			compoundStateName: 'awaiting_lpa_questionnaire_and_statements'
		},
		{
			status: statementsAndFinalCommentsState,
			createdAt,
			subStateMachineName: 'statementsAndFinalComments',
			compoundStateName: 'awaiting_lpa_questionnaire_and_statements'
		}
	];
};

/**
 *
 * @param {{
 * 	typeShorthand: string,
 * 	statuses?: object,
 * 	incompleteValidationDecision?: boolean,
 *  invalidValidationDecision?: boolean,
 *  completeValidationDecision?: boolean,
 *  lpaQuestionnaire?: boolean,
 *  startedAt?: Date | null,
 *  incompleteReviewQuestionnaire?: boolean,
 *  completeReviewQuestionnaire?: boolean,
 *  connectToUser?: boolean,
 *  siteVisitBooked?: boolean}} param0
 * @returns {object}
 */
const appealFactory = ({
	typeShorthand,
	statuses = {},
	incompleteValidationDecision = false,
	invalidValidationDecision = false,
	completeValidationDecision = false,
	lpaQuestionnaire = false,
	startedAt = null,
	incompleteReviewQuestionnaire = false,
	completeReviewQuestionnaire = false,
	connectToUser = false,
	siteVisitBooked = false
}) => {
	return {
		appealType: { connect: { shorthand: typeShorthand } },
		reference: generateAppealReference(),
		startedAt,
		appealStatus: { create: statuses },
		appellant: { create: pickRandom(appellantsList) },
		localPlanningDepartment: pickRandom(localPlanningDepartmentList),
		planningApplicationReference: '48269/APP/2021/1482',
		address: { create: pickRandom(addressesList) },
		...(incompleteValidationDecision && {
			validationDecision: { create: incompleteValidationDecisionSample }
		}),
		...(invalidValidationDecision && {
			validationDecision: { create: invalidValidationDecisionSample }
		}),
		...(completeValidationDecision && {
			validationDecision: { create: completeValidationDecisionSample }
		}),
		...(lpaQuestionnaire && { lpaQuestionnaire: { create: lpaQuestionnaireList[typeShorthand] } }),
		...(incompleteReviewQuestionnaire && {
			reviewQuestionnaire: { create: incompleteReviewQuestionnaireSample }
		}),
		...(completeReviewQuestionnaire && { reviewQuestionnaire: { create: { complete: true } } }),
		appellantCase: { create: appellantCaseList[typeShorthand] },
		...(connectToUser && {
			user: {
				connectOrCreate: {
					create: {
						azureReference: 1
					},
					where: {
						azureReference: 1
					}
				}
			}
		}),
		...(siteVisitBooked && {
			siteVisit: {
				create: {
					visitDate: new Date(2022, 3, 1),
					visitSlot: '1pm - 2pm',
					visitType: 'unaccompanied'
				}
			}
		})
	};
};

const newAppeals = [
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTCODE_HAS }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTCODE_HAS }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTCODE_HAS }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTCODE_HAS }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTCODE_HAS }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTCODE_HAS }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTCODE_FPA }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTCODE_FPA }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTCODE_FPA }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTCODE_FPA }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTCODE_FPA }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTCODE_FPA })
];

const appealsLpaQuestionnaireDue = [
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTCODE_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTCODE_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTCODE_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTCODE_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTCODE_FPA,
		statuses: buildCompoundState(
			'lpa_questionnaire_due',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTCODE_FPA,
		statuses: buildCompoundState(
			'lpa_questionnaire_due',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTCODE_FPA,
		statuses: buildCompoundState(
			'lpa_questionnaire_due',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	})
];

const appealsStatementReview = [
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTCODE_HAS,
		statuses: { status: 'statement_review' },
		invalidValidationDecision: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTCODE_FPA,
		statuses: { status: 'statement_review' },
		invalidValidationDecision: true
	})
];

const appealsFinalCommentReview = [
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTCODE_HAS,
		statuses: { status: 'final_comment_review' },
		incompleteValidationDecision: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTCODE_FPA,
		statuses: { status: 'final_comment_review' },
		incompleteValidationDecision: true
	})
];

const appealsArrangeSiteVisit = [
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTCODE_HAS,
		statuses: { status: 'arrange_site_visit' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		completeReviewQuestionnaire: true,
		connectToUser: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTCODE_HAS,
		statuses: { status: 'arrange_site_visit' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 4, 1, 11),
		completeReviewQuestionnaire: true,
		connectToUser: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTCODE_FPA,
		statuses: { status: 'arrange_site_visit' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 4, 1, 11),
		completeReviewQuestionnaire: true,
		connectToUser: true
	})
];

const appealsIssueDetermination = [
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTCODE_HAS,
		statuses: { status: 'issue_determination' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 4, 1, 11),
		completeReviewQuestionnaire: true,
		connectToUser: true,
		siteVisitBooked: true
	})
];

const appealsComplete = [
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTCODE_HAS,
		statuses: { status: 'complete' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 4, 1, 11),
		completeReviewQuestionnaire: true,
		connectToUser: true,
		siteVisitBooked: true
	})
];

const appealsData = [
	...newAppeals,
	...appealsLpaQuestionnaireDue,
	...appealsStatementReview,
	...appealsFinalCommentReview,
	...appealsArrangeSiteVisit,
	...appealsIssueDetermination,
	...appealsComplete
];

/**
 * @param {import('#db-client').PrismaClient} databaseConnector
 */
export async function seedTestData(databaseConnector) {
	const appeals = [];

	for (const appealData of appealsData) {
		const appeal = await databaseConnector.appeal.create({ data: appealData });
		appeals.push(appeal);
	}

	const lpaQuestionnaires = await databaseConnector.lPAQuestionnaire.findMany();
	const designatedSites = await databaseConnector.designatedSite.findMany();
	const lpaNotificationMethods = await databaseConnector.lPANotificationMethods.findMany();

	for (const lpaQuestionnaire of lpaQuestionnaires) {
		await databaseConnector.designatedSitesOnLPAQuestionnaires.createMany({
			data: [1, 2].map((item) => ({
				designatedSiteId: designatedSites[item].id,
				lpaQuestionnaireId: lpaQuestionnaire.id
			}))
		});

		await databaseConnector.listedBuildingDetails.createMany({
			data: ['Grade I', 'Grade II', 'Grade III', 'Grade IV'].map((grade, index) => ({
				lpaQuestionnaireId: lpaQuestionnaire.id,
				grade,
				description: `http://localhost:8080/document-${index}.pdf`,
				affectsListedBuilding: index > 1
			}))
		});

		await databaseConnector.lPANotificationMethodsOnLPAQuestionnaires.createMany({
			data: [1, 2].map((item) => ({
				lpaQuestionnaireId: lpaQuestionnaire.id,
				notificationMethodId: lpaNotificationMethods[item].id
			}))
		});
	}

	const linkedAppealGroups = [
		[appeals[0].id, appeals[1].id, appeals[2].id],
		[appeals[3].id, appeals[4].id, appeals[5].id],
		[appeals[6].id, appeals[7].id, appeals[8].id],
		[appeals[9].id, appeals[10].id, appeals[11].id],
		[appeals[12].id, appeals[13].id],
		[appeals[14].id, appeals[15].id],
		[appeals[16].id, appeals[17].id],
		[appeals[18].id, appeals[19].id],
		[appeals[20].id, appeals[21].id]
	];

	await Promise.all(
		linkedAppealGroups
			.map((linkedAppealGroup) =>
				linkedAppealGroup.map((linkedAppeal) =>
					databaseConnector.appeal.update({
						where: { id: linkedAppeal },
						data: { linkedAppealId: linkedAppealGroup[0], otherAppealId: linkedAppealGroup[0] }
					})
				)
			)
			.flat()
	);

	const appealTypes = await databaseConnector.appealType.findMany();

	for (const { appealTypeId, id, startedAt } of appeals) {
		if (startedAt) {
			const appealType = appealTypes.filter(({ id }) => id === appealTypeId)[0].shorthand;
			const appealTimetable = await calculateTimetable(appealType, startedAt);

			await databaseConnector.appealTimetable.create({
				data: {
					appealId: id,
					...appealTimetable
				}
			});
		}
	}

	const appellantCases = await databaseConnector.appellantCase.findMany();
	const planningObligationStatus = await databaseConnector.planningObligationStatus.findFirst();
	const knowledgeOfOtherLandowners = await databaseConnector.knowledgeOfOtherLandowners.findMany({
		where: {
			name: 'Some'
		}
	});
	const validationOutcomes = await databaseConnector.validationOutcome.findMany({
		orderBy: {
			name: 'asc'
		}
	});
	const appellantCaseIncompleteReasons =
		await databaseConnector.appellantCaseIncompleteReason.findMany();
	const appellantCaseInvalidReasons = await databaseConnector.appellantCaseInvalidReason.findMany();

	const appellantCaseValidationOutcomes = [
		{
			validationOutcomeId: validationOutcomes[0].id,
			incompleteReasons: appellantCaseIncompleteReasons.map(({ id }) => id),
			otherNotValidReasons: 'Another incomplete reason'
		},
		{
			validationOutcomeId: validationOutcomes[1].id,
			invalidReasons: appellantCaseInvalidReasons.map(({ id }) => id),
			otherNotValidReasons: 'Another invalid reason'
		},
		{
			validationOutcomeId: validationOutcomes[2].id
		}
	];

	for (const appellantCase of appellantCases) {
		const appeal = appeals.find(({ id }) => id === appellantCase.appealId);
		const appealType = appealTypes.find(({ id }) => id === appeal?.appealTypeId);
		const validationOutcome = appellantCaseValidationOutcomes[Math.floor(Math.random() * 3)];

		await databaseConnector.appellantCase.update({
			where: { id: appellantCase.id },
			data: {
				hasAdvertisedAppeal: null,
				...(appealType &&
					isFPA(appealType) && { planningObligationStatusId: planningObligationStatus?.id }),
				...(!appellantCase.isSiteFullyOwned && {
					hasAdvertisedAppeal: true,
					knowledgeOfOtherLandownersId: knowledgeOfOtherLandowners[0].id
				}),
				validationOutcomeId: validationOutcome.validationOutcomeId,
				otherNotValidReasons:
					(validationOutcome.incompleteReasons || validationOutcome.invalidReasons) &&
					validationOutcome.otherNotValidReasons
			}
		});

		if (validationOutcome.incompleteReasons) {
			await databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.createMany({
				data: validationOutcome.incompleteReasons.map((item) => ({
					appellantCaseIncompleteReasonId: item,
					appellantCaseId: appellantCase.id
				}))
			});
		}

		if (validationOutcome.invalidReasons) {
			await databaseConnector.appellantCaseInvalidReasonOnAppellantCase.createMany({
				data: validationOutcome.invalidReasons.map((item) => ({
					appellantCaseInvalidReasonId: item,
					appellantCaseId: appellantCase.id
				}))
			});
		}
	}
}
