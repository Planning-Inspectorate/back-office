import formatAddress from '../../utils/address-block-formtter.js';
import {
	APPEAL_TYPE_SHORTCODE_FPA,
	DOCUMENT_STATUS_NOT_RECEIVED,
	DOCUMENT_STATUS_RECEIVED
} from '../constants.js';

/** @typedef {import('@pins/api').Appeals.AppealListResponse} AppealListResponse */
/** @typedef {import('@pins/api').Appeals.RepositoryGetAllResultItem} RepositoryGetAllResultItem */
/** @typedef {import('@pins/api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */
/** @typedef {import('@pins/api').Appeals.SingleAppealDetailsResponse} SingleAppealDetailsResponse */
/** @typedef {import('@pins/api').Appeals.SingleLPAQuestionnaireResponse} SingleLPAQuestionnaireResponse */
/** @typedef {import('@pins/api').Appeals.ListedBuildingDetailsResponse} ListedBuildingDetailsResponse */
/** @typedef {import('@pins/api').Appeals.LinkedAppeal} LinkedAppeal */
/** @typedef {import('@pins/api').Schema.Appeal} Appeal */
/** @typedef {import('@pins/api').Schema.ListedBuildingDetails} ListedBuildingDetails */

/**
 * @param {boolean} affectsListedBuilding
 * @param {ListedBuildingDetails[] | null | undefined} values
 * @returns {ListedBuildingDetailsResponse | null}
 */
const formatListedBuildingDetails = (affectsListedBuilding, values) =>
	(values &&
		values
			.filter((value) => value.affectsListedBuilding === affectsListedBuilding)
			.map(({ grade, description }) => ({ grade, description }))) ||
	null;

/**
 * @param {Appeal[]} linkedAppeals
 * @param {number} appealId
 * @returns {LinkedAppeal[]}
 */
const formatLinkedAppeals = (linkedAppeals, appealId) =>
	linkedAppeals
		.filter((appeal) => appeal.id !== appealId)
		.map(({ id, reference }) => ({ appealId: id, appealReference: reference }));

const appealFormatter = {
	/**
	 * @param {RepositoryGetAllResultItem} appeal
	 * @returns {AppealListResponse}}
	 */
	formatAppeals: (appeal) => ({
		appealId: appeal.id,
		appealReference: appeal.reference,
		appealSite: formatAddress(appeal.address),
		appealStatus: appeal.appealStatus[0].status,
		appealType: appeal.appealType?.type,
		createdAt: appeal.createdAt,
		localPlanningDepartment: appeal.localPlanningDepartment
	}),
	/**
	 * @param {RepositoryGetByIdResultItem} appeal
	 * @returns {SingleAppealDetailsResponse | void}}
	 */
	formatAppeal(appeal) {
		if (appeal) {
			return {
				agentName: appeal.appellant?.agentName,
				allocationDetails: 'F / General Allocation',
				appealId: appeal.id,
				appealReference: appeal.reference,
				appealSite: formatAddress(appeal.address),
				appealStatus: appeal.appealStatus[0].status,
				appealTimetable: {
					...(appeal.appealType?.shorthand === APPEAL_TYPE_SHORTCODE_FPA && {
						finalCommentReviewDate: appeal.appealTimetable?.finalCommentReviewDate || null
					}),
					lpaQuestionnaireDueDate: appeal.appealTimetable?.lpaQuestionnaireDueDate || null,
					...(appeal.appealType?.shorthand === APPEAL_TYPE_SHORTCODE_FPA && {
						statementReviewDate: appeal.appealTimetable?.statementReviewDate || null
					})
				},
				appealType: appeal.appealType?.type,
				appellantName: appeal.appellant?.name,
				decision: appeal.inspectorDecision?.outcome,
				isParentAppeal: appeal.linkedAppealId ? appeal.id === appeal.linkedAppealId : null,
				linkedAppeals: formatLinkedAppeals(appeal.linkedAppeals, appeal.id),
				localPlanningDepartment: appeal.localPlanningDepartment,
				lpaQuestionnaireId: appeal.lpaQuestionnaire?.id || null,
				otherAppeals: formatLinkedAppeals(appeal.otherAppeals, appeal.id),
				planningApplicationReference: appeal.planningApplicationReference,
				procedureType: appeal.lpaQuestionnaire?.procedureType?.name || null,
				siteVisit: {
					visitDate: appeal.siteVisit?.visitDate || null
				},
				startedAt: appeal.startedAt,
				documentationSummary: {
					appellantCase: {
						status: appeal.appealDetailsFromAppellant
							? DOCUMENT_STATUS_RECEIVED
							: DOCUMENT_STATUS_NOT_RECEIVED,
						dueDate: null
					},
					lpaQuestionnaire: {
						status: appeal.lpaQuestionnaire
							? DOCUMENT_STATUS_RECEIVED
							: DOCUMENT_STATUS_NOT_RECEIVED,
						dueDate: appeal.appealTimetable?.lpaQuestionnaireDueDate || null
					}
				}
			};
		}
	},
	/**
	 * @param {RepositoryGetByIdResultItem} appeal
	 * @returns {SingleLPAQuestionnaireResponse}}
	 */
	formatLpaQuestionnaire(appeal) {
		const { address, id, localPlanningDepartment, lpaQuestionnaire, reference } = appeal;

		return {
			affectsListedBuildingDetails: formatListedBuildingDetails(
				true,
				lpaQuestionnaire?.listedBuildingDetails
			),
			appealId: id,
			appealReference: reference,
			appealSite: formatAddress(address),
			communityInfrastructureLevyAdoptionDate:
				lpaQuestionnaire?.communityInfrastructureLevyAdoptionDate,
			designatedSites: lpaQuestionnaire?.designatedSites?.map(
				({ designatedSite: { name, description } }) => ({ name, description })
			),
			developmentDescription: lpaQuestionnaire?.developmentDescription,
			documents: {
				definitiveMapAndStatement: 'right-of-way.pdf',
				treePreservationOrder: 'tree-preservation-order.pdf',
				communityInfrastructureLevy: 'community-infrastructure-levy.pdf',
				conservationAreaMapAndGuidance: 'conservation-area-map-and-guidance.pdf',
				consultationResponses: 'consultation-responses.pdf',
				emergingPlans: ['emerging-plan-1.pdf'],
				environmentalStatementResponses: 'environment-statement-responses.pdf',
				issuedScreeningOption: 'issued-screening-opinion.pdf',
				lettersToNeighbours: 'letters-to-neighbours.pdf',
				otherRelevantPolicies: ['policy-1.pdf'],
				planningOfficersReport: 'planning-officers-report.pdf',
				policiesFromStatutoryDevelopment: ['policy-a.pdf'],
				pressAdvert: 'press-advert.pdf',
				representationsFromOtherParties: ['representations-from-other-parties-1.pdf'],
				responsesOrAdvice: ['responses-or-advice.pdf'],
				screeningDirection: 'screening-direction.pdf',
				siteNotice: 'site-notice.pdf',
				supplementaryPlanningDocuments: ['supplementary-1.pdf']
			},
			doesAffectAListedBuilding: lpaQuestionnaire?.doesAffectAListedBuilding,
			doesAffectAScheduledMonument: lpaQuestionnaire?.doesAffectAScheduledMonument,
			doesSiteHaveHealthAndSafetyIssues: lpaQuestionnaire?.doesSiteHaveHealthAndSafetyIssues,
			doesSiteRequireInspectorAccess: lpaQuestionnaire?.doesSiteRequireInspectorAccess,
			extraConditions: lpaQuestionnaire?.extraConditions,
			hasCommunityInfrastructureLevy: lpaQuestionnaire?.hasCommunityInfrastructureLevy,
			hasCompletedAnEnvironmentalStatement: lpaQuestionnaire?.hasCompletedAnEnvironmentalStatement,
			hasEmergingPlan: lpaQuestionnaire?.hasEmergingPlan,
			hasExtraConditions: lpaQuestionnaire?.hasExtraConditions,
			hasOtherAppeals: lpaQuestionnaire?.hasOtherAppeals,
			hasProtectedSpecies: lpaQuestionnaire?.hasProtectedSpecies,
			hasRepresentationsFromOtherParties: lpaQuestionnaire?.hasRepresentationsFromOtherParties,
			hasResponsesOrStandingAdviceToUpload: lpaQuestionnaire?.hasResponsesOrStandingAdviceToUpload,
			hasStatementOfCase: lpaQuestionnaire?.hasStatementOfCase,
			hasStatutoryConsultees: lpaQuestionnaire?.hasStatutoryConsultees,
			hasSupplementaryPlanningDocuments: lpaQuestionnaire?.hasSupplementaryPlanningDocuments,
			hasTreePreservationOrder: lpaQuestionnaire?.hasTreePreservationOrder,
			healthAndSafetyDetails: lpaQuestionnaire?.healthAndSafetyDetails,
			inCAOrrelatesToCA: lpaQuestionnaire?.inCAOrrelatesToCA,
			includesScreeningOption: lpaQuestionnaire?.includesScreeningOption,
			inquiryDays: lpaQuestionnaire?.inquiryDays,
			inspectorAccessDetails: lpaQuestionnaire?.inspectorAccessDetails,
			isCommunityInfrastructureLevyFormallyAdopted:
				lpaQuestionnaire?.isCommunityInfrastructureLevyFormallyAdopted,
			isEnvironmentalStatementRequired: lpaQuestionnaire?.isEnvironmentalStatementRequired,
			isGypsyOrTravellerSite: lpaQuestionnaire?.isGypsyOrTravellerSite,
			isListedBuilding: lpaQuestionnaire?.isListedBuilding,
			isPublicRightOfWay: lpaQuestionnaire?.isPublicRightOfWay,
			isSensitiveArea: lpaQuestionnaire?.isSensitiveArea,
			isSiteVisible: lpaQuestionnaire?.isSiteVisible,
			isTheSiteWithinAnAONB: lpaQuestionnaire?.isTheSiteWithinAnAONB,
			listedBuildingDetails: formatListedBuildingDetails(
				false,
				lpaQuestionnaire?.listedBuildingDetails
			),
			localPlanningDepartment,
			lpaNotificationMethods: lpaQuestionnaire?.lpaNotificationMethods?.map(
				({ lpaNotificationMethod: { name } }) => ({ name })
			),
			lpaQuestionnaireId: lpaQuestionnaire?.id,
			meetsOrExceedsThresholdOrCriteriaInColumn2:
				lpaQuestionnaire?.meetsOrExceedsThresholdOrCriteriaInColumn2,
			otherAppeals: [
				{
					appealId: 1,
					appealReference: 'APP/Q9999/D/21/725284'
				}
			],
			procedureType: lpaQuestionnaire?.procedureType?.name,
			scheduleType: lpaQuestionnaire?.scheduleType?.name,
			sensitiveAreaDetails: lpaQuestionnaire?.sensitiveAreaDetails,
			siteWithinGreenBelt: lpaQuestionnaire?.siteWithinGreenBelt,
			statutoryConsulteesDetails: lpaQuestionnaire?.statutoryConsulteesDetails
		};
	}
};

export default appealFormatter;
