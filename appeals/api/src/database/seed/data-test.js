/**
 * Test data used for development and testing
 */
import { AUDIT_TRAIL_SYSTEM_UUID } from '#endpoints/constants.js';
import {
	addressesList,
	addressListForTrainers,
	appellantCaseList,
	appellantsList,
	agentsList,
	completeValidationDecisionSample,
	incompleteReviewQuestionnaireSample,
	incompleteValidationDecisionSample,
	invalidValidationDecisionSample,
	localPlanningDepartmentList,
	lpaQuestionnaireList,
	neighbouringSiteContactsList
} from './data-samples.js';
import isFPA from '#utils/is-fpa.js';
import { calculateTimetable } from '#utils/business-days.js';
import {
	APPEAL_TYPE_SHORTHAND_HAS,
	STATE_TARGET_COMPLETE,
	STATE_TARGET_ISSUE_DETERMINATION,
	STATE_TARGET_READY_TO_START,
	STATE_TARGET_ASSIGN_CASE_OFFICER,
	CASE_RELATIONSHIP_LINKED,
	CASE_RELATIONSHIP_RELATED
} from '#endpoints/constants.js';

import neighbouringSitesRepository from '#repositories/neighbouring-sites.repository.js';
import { mapDefaultCaseFolders } from '#endpoints/documents/documents.mapper.js';

/** @typedef {import('@pins/appeals.api').Appeals.AppealSite} AppealSite */

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

	return `TEST-${number}`;
}

/**
 *
 * @param {object[] | string[]} list
 * @returns {number}
 */
const pickRandom = (list) => Math.floor(Math.random() * list.length);

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
 *  siteAddressList?: AppealSite[],
 *  assignCaseOfficer: boolean,
 *  agent?: boolean
 * }} param0
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
	siteAddressList = addressesList,
	assignCaseOfficer = false,
	agent = true
}) => {
	const appellantInput = appellantsList[pickRandom(appellantsList)];
	const agentInput = agentsList[pickRandom(agentsList)];
	const lpaInput = localPlanningDepartmentList[pickRandom(localPlanningDepartmentList)];

	const appeal = {
		appealType: { connect: { shorthand: typeShorthand } },
		reference: generateAppealReference(),
		startedAt,
		appealStatus: { create: statuses },
		appellantCase: { create: appellantCaseList[typeShorthand] },
		appellant: {
			create: appellantInput
		},
		...(agent && {
			agent: {
				create: agentInput
			}
		}),
		lpa: {
			connectOrCreate: {
				where: { lpaCode: lpaInput.lpaCode },
				create: lpaInput
			}
		},
		planningApplicationReference: '48269/APP/2021/1482',
		address: { create: siteAddressList[pickRandom(siteAddressList)] },
		...(assignCaseOfficer && {
			caseOfficer: {
				connectOrCreate: {
					where: { azureAdUserId: AUDIT_TRAIL_SYSTEM_UUID },
					create: { azureAdUserId: AUDIT_TRAIL_SYSTEM_UUID }
				}
			}
		}),
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
		...(completeReviewQuestionnaire && { reviewQuestionnaire: { create: { complete: true } } })
	};

	if (Math.random() < 0.5) {
		delete appeal.agent;
	}

	return appeal;
};

const newAppeals = [
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_HAS, assignCaseOfficer: false }),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_HAS, assignCaseOfficer: false }),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_HAS, assignCaseOfficer: false }),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_HAS, assignCaseOfficer: false }),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true,
		agent: false
	})
];

const appealsLpaQuestionnaireDue = [
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	})
];

const appealsData = [...newAppeals, ...appealsLpaQuestionnaireDue];

/**
 * @param {import('#db-client').PrismaClient} databaseConnector
 */
export async function seedTestData(databaseConnector) {
	const appeals = [];

	for (const appealData of appealsData) {
		// @ts-ignore
		const appeal = await databaseConnector.appeal.create({ data: appealData });
		await databaseConnector.folder.createMany({ data: mapDefaultCaseFolders(appeal.id) });
		appeals.push(appeal);
	}

	const lpaQuestionnaires = await databaseConnector.lPAQuestionnaire.findMany();
	const designatedSites = await databaseConnector.designatedSite.findMany();
	const lpaNotificationMethods = await databaseConnector.lPANotificationMethods.findMany();
	const addresses = await databaseConnector.address.findMany();

	for (const lpaQuestionnaire of lpaQuestionnaires) {
		await databaseConnector.designatedSitesOnLPAQuestionnaires.createMany({
			data: [1, 2].map((item) => ({
				designatedSiteId: designatedSites[item].id,
				lpaQuestionnaireId: lpaQuestionnaire.id
			}))
		});

		await databaseConnector.listedBuildingDetails.createMany({
			data: ['123456', '654321', '789012', '210987'].map((listEntry, index) => ({
				lpaQuestionnaireId: lpaQuestionnaire.id,
				listEntry,
				affectsListedBuilding: index > 1
			}))
		});

		await databaseConnector.lPANotificationMethodsOnLPAQuestionnaires.createMany({
			data: [1, 2].map((item) => ({
				lpaQuestionnaireId: lpaQuestionnaire.id,
				notificationMethodId: lpaNotificationMethods[item].id
			}))
		});

		if (lpaQuestionnaire.isAffectingNeighbouringSites) {
			await databaseConnector.neighbouringSiteContact.createMany({
				data: [1, 2].map(() => ({
					...neighbouringSiteContactsList[pickRandom(neighbouringSiteContactsList)],
					addressId: addresses[pickRandom(addresses)].id,
					lpaQuestionnaireId: lpaQuestionnaire.id
				}))
			});
		}
	}

	const appealWithNeighbouringSitesId = appeals[10].id;
	await neighbouringSitesRepository.addSite(
		appealWithNeighbouringSitesId,
		addressesList[pickRandom(addressesList)]
	);
	await neighbouringSitesRepository.addSite(
		appealWithNeighbouringSitesId,
		addressesList[pickRandom(addressesList)]
	);

	const linkedAppeals = [
		{
			parentRef: appeals[0].reference,
			parentId: appeals[0].id,
			childRef: appeals[1].reference,
			childId: appeals[1].id,
			type: CASE_RELATIONSHIP_LINKED
		},
		{
			parentRef: appeals[0].reference,
			parentId: appeals[0].id,
			childRef: appeals[2].reference,
			childId: appeals[2].id,
			type: CASE_RELATIONSHIP_LINKED
		},
		{
			parentRef: appeals[0].reference,
			parentId: appeals[0].id,
			childRef: appeals[16].reference,
			childId: appeals[16].id,
			type: CASE_RELATIONSHIP_LINKED
		},
		{
			parentRef: appeals[0].reference,
			parentId: appeals[0].id,
			childRef: '76215416',
			externalSource: true,
			type: CASE_RELATIONSHIP_LINKED
		},
		{
			parentRef: appeals[4].reference,
			parentId: appeals[4].id,
			childRef: appeals[19].reference,
			childId: appeals[19].id,
			type: CASE_RELATIONSHIP_LINKED
		},
		{
			parentRef: appeals[4].reference,
			parentId: appeals[4].id,
			childRef: appeals[20].reference,
			childId: appeals[20].id,
			type: CASE_RELATIONSHIP_LINKED
		},
		{
			parentRef: '96215416',
			childRef: appeals[21].reference,
			childId: appeals[21].id,
			externalSource: true,
			type: CASE_RELATIONSHIP_LINKED
		}
	];

	const relatedAppeals = [
		{
			parentRef: appeals[11].reference,
			parentId: appeals[11].id,
			childRef: appeals[12].reference,
			childId: appeals[12].id,
			type: CASE_RELATIONSHIP_RELATED
		},
		{
			parentRef: appeals[12].reference,
			parentId: appeals[12].id,
			childRef: appeals[13].reference,
			childId: appeals[13].id,
			type: CASE_RELATIONSHIP_RELATED
		},
		{
			parentRef: appeals[0].reference,
			parentId: appeals[0].id,
			childRef: '76215416',
			externalSource: true,
			type: CASE_RELATIONSHIP_RELATED
		},
		{
			parentRef: '96215416',
			childRef: appeals[21].reference,
			childId: appeals[21].id,
			externalSource: true,
			type: CASE_RELATIONSHIP_RELATED
		}
	];

	await databaseConnector.appealRelationship.createMany({
		data: [...linkedAppeals, ...relatedAppeals]
	});

	const appealTypes = await databaseConnector.appealType.findMany();
	const appealStatus = await databaseConnector.appealStatus.findMany();
	const siteVisitType = await databaseConnector.siteVisitType.findMany();

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

		const statusWithSiteVisitSet = appealStatus.find(
			({ appealId, status, valid }) =>
				appealId === id &&
				valid &&
				[STATE_TARGET_ISSUE_DETERMINATION, STATE_TARGET_COMPLETE].includes(status)
		);

		if (statusWithSiteVisitSet) {
			await databaseConnector.siteVisit.create({
				data: {
					appealId: id,
					visitDate: new Date(),
					visitEndTime: '16:00',
					visitStartTime: '14:00',
					siteVisitTypeId: siteVisitType[pickRandom(siteVisitType)].id
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
	const validationOutcomes = await databaseConnector.appellantCaseValidationOutcome.findMany({
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
			incompleteReasons: appellantCaseIncompleteReasons.map(({ id }) => id)
		},
		{
			validationOutcomeId: validationOutcomes[1].id,
			invalidReasons: appellantCaseInvalidReasons.map(({ id }) => id)
		},
		{
			validationOutcomeId: validationOutcomes[2].id
		}
	];

	for (const appellantCase of appellantCases) {
		const appeal = appeals.find(({ id }) => id === appellantCase.appealId);
		const status = appealStatus.find(({ appealId }) => appealId === appellantCase.appealId);
		const appealType = appealTypes.find(({ id }) => id === appeal?.appealTypeId);
		const validationOutcome =
			status?.status !== STATE_TARGET_READY_TO_START &&
			status?.status !== STATE_TARGET_ASSIGN_CASE_OFFICER
				? appellantCaseValidationOutcomes[2]
				: null;

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
				...(validationOutcome && {
					appellantCaseValidationOutcomeId: validationOutcome.validationOutcomeId
				})
			}
		});

		if (validationOutcome?.incompleteReasons) {
			await databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.createMany({
				data: validationOutcome?.incompleteReasons.map((item) => ({
					appellantCaseIncompleteReasonId: item,
					appellantCaseId: appellantCase.id
				}))
			});
			await databaseConnector.appeal.update({
				where: { id: appellantCase.appealId },
				data: { dueDate: new Date() }
			});
		}

		if (validationOutcome?.invalidReasons) {
			await databaseConnector.appellantCaseInvalidReasonOnAppellantCase.createMany({
				data: validationOutcome?.invalidReasons.map((item) => ({
					appellantCaseInvalidReasonId: item,
					appellantCaseId: appellantCase.id
				}))
			});
		}
	}
}
