import formatAddress from '#utils/format-address.js';
import formatValidationOutcomeResponse from '#utils/format-validation-outcome-response.js';
import formatLinkedAppeals from '#utils/format-linked-appeals.js';
import formatNeighbouringSiteContacts from '#utils/format-neighbouring-site-contacts.js';
import { document } from '#tests/data.js';

/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.SingleLPAQuestionnaireResponse} SingleLPAQuestionnaireResponse */
/** @typedef {import('@pins/appeals.api').Appeals.ListedBuildingDetailsResponse} ListedBuildingDetailsResponse */
/** @typedef {import('@pins/appeals.api').Schema.ListedBuildingDetails} ListedBuildingDetails */
/**
 * @param {boolean} affectsListedBuilding
 * @param {ListedBuildingDetails[] | null | undefined} values
 * @returns {ListedBuildingDetailsResponse | null}
 */
const formatListedBuildingDetails = (affectsListedBuilding, values) =>
	(values &&
		values
			.filter((value) => value.affectsListedBuilding === affectsListedBuilding)
			.map(({ listEntry }) => ({ listEntry }))) ||
	null;

/**
 * @param {RepositoryGetByIdResultItem} appeal
 * @returns {SingleLPAQuestionnaireResponse | {}}
 */
const formatLpaQuestionnaire = (appeal) => {
	const { address, id, localPlanningDepartment, lpaQuestionnaire, reference } = appeal;

	return lpaQuestionnaire
		? {
				affectsListedBuildingDetails: formatListedBuildingDetails(
					true,
					lpaQuestionnaire.listedBuildingDetails
				),
				appealId: id,
				appealReference: reference,
				appealSite: formatAddress(address),
				communityInfrastructureLevyAdoptionDate:
					lpaQuestionnaire.communityInfrastructureLevyAdoptionDate,
				designatedSites: lpaQuestionnaire.designatedSites?.map(
					({ designatedSite: { name, description } }) => ({ name, description })
				),
				developmentDescription: lpaQuestionnaire.developmentDescription,
				documents: {
					communityInfrastructureLevy: document,
					conservationAreaMap: document,
					consultationResponses: document,
					definitiveMapAndStatement: document,
					emergingPlans: document,
					environmentalStatementResponses: document,
					issuedScreeningOption: document,
					lettersToNeighbours: document,
					otherRelevantPolicies: document,
					officersReport: document,
					policiesFromStatutoryDevelopment: document,
					pressAdvert: document,
					notifyingParties: document,
					representations: document,
					responsesOrAdvice: document,
					screeningDirection: document,
					siteNotices: document,
					supplementaryPlanningDocuments: document,
					treePreservationOrder: document
				},
				doesAffectAListedBuilding: lpaQuestionnaire.doesAffectAListedBuilding,
				doesAffectAScheduledMonument: lpaQuestionnaire.doesAffectAScheduledMonument,
				doesSiteHaveHealthAndSafetyIssues: lpaQuestionnaire.doesSiteHaveHealthAndSafetyIssues,
				doesSiteRequireInspectorAccess: lpaQuestionnaire.doesSiteRequireInspectorAccess,
				extraConditions: lpaQuestionnaire.extraConditions,
				hasCommunityInfrastructureLevy: lpaQuestionnaire.hasCommunityInfrastructureLevy,
				hasCompletedAnEnvironmentalStatement: lpaQuestionnaire.hasCompletedAnEnvironmentalStatement,
				hasEmergingPlan: lpaQuestionnaire.hasEmergingPlan,
				hasExtraConditions: lpaQuestionnaire.hasExtraConditions,
				hasOtherAppeals: lpaQuestionnaire.hasOtherAppeals,
				hasProtectedSpecies: lpaQuestionnaire.hasProtectedSpecies,
				hasRepresentationsFromOtherParties: lpaQuestionnaire.hasRepresentationsFromOtherParties,
				hasResponsesOrStandingAdviceToUpload: lpaQuestionnaire.hasResponsesOrStandingAdviceToUpload,
				hasStatementOfCase: lpaQuestionnaire.hasStatementOfCase,
				hasStatutoryConsultees: lpaQuestionnaire.hasStatutoryConsultees,
				hasSupplementaryPlanningDocuments: lpaQuestionnaire.hasSupplementaryPlanningDocuments,
				hasTreePreservationOrder: lpaQuestionnaire.hasTreePreservationOrder,
				healthAndSafetyDetails: lpaQuestionnaire.healthAndSafetyDetails,
				inCAOrrelatesToCA: lpaQuestionnaire.inCAOrrelatesToCA,
				includesScreeningOption: lpaQuestionnaire.includesScreeningOption,
				inquiryDays: lpaQuestionnaire.inquiryDays,
				inspectorAccessDetails: lpaQuestionnaire.inspectorAccessDetails,
				isAffectingNeighbouringSites: lpaQuestionnaire.isAffectingNeighbouringSites,
				isCommunityInfrastructureLevyFormallyAdopted:
					lpaQuestionnaire.isCommunityInfrastructureLevyFormallyAdopted,
				isConservationArea: lpaQuestionnaire.isConservationArea,
				isCorrectAppealType: lpaQuestionnaire.isCorrectAppealType,
				isEnvironmentalStatementRequired: lpaQuestionnaire.isEnvironmentalStatementRequired,
				isGypsyOrTravellerSite: lpaQuestionnaire.isGypsyOrTravellerSite,
				isListedBuilding: lpaQuestionnaire.isListedBuilding,
				isPublicRightOfWay: lpaQuestionnaire.isPublicRightOfWay,
				isSensitiveArea: lpaQuestionnaire.isSensitiveArea,
				isSiteVisible: lpaQuestionnaire.isSiteVisible,
				isTheSiteWithinAnAONB: lpaQuestionnaire.isTheSiteWithinAnAONB,
				listedBuildingDetails: formatListedBuildingDetails(
					false,
					lpaQuestionnaire.listedBuildingDetails
				),
				localPlanningDepartment,
				lpaNotificationMethods: lpaQuestionnaire.lpaNotificationMethods?.map(
					({ lpaNotificationMethod: { name } }) => ({ name })
				),
				lpaQuestionnaireId: lpaQuestionnaire.id,
				meetsOrExceedsThresholdOrCriteriaInColumn2:
					lpaQuestionnaire.meetsOrExceedsThresholdOrCriteriaInColumn2,
				neighbouringSiteContacts: formatNeighbouringSiteContacts(
					lpaQuestionnaire.neighbouringSiteContact
				),
				otherAppeals: formatLinkedAppeals(appeal.otherAppeals, appeal.id),
				procedureType: lpaQuestionnaire.procedureType?.name,
				scheduleType: lpaQuestionnaire.scheduleType?.name,
				sensitiveAreaDetails: lpaQuestionnaire.sensitiveAreaDetails,
				siteWithinGreenBelt: lpaQuestionnaire.siteWithinGreenBelt,
				statutoryConsulteesDetails: lpaQuestionnaire.statutoryConsulteesDetails,
				validation: formatValidationOutcomeResponse(
					lpaQuestionnaire.lpaQuestionnaireValidationOutcome?.name,
					lpaQuestionnaire.lpaQuestionnaireIncompleteReasonOnLPAQuestionnaire
				)
		  }
		: {};
};

export { formatLpaQuestionnaire };
