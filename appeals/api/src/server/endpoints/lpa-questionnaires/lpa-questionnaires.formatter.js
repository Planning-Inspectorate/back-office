import formatAddress from '#utils/format-address.js';
import formatValidationOutcomeResponse from '#utils/format-validation-outcome-response.js';
import formatLinkedAppeals from '#utils/format-linked-appeals.js';
import formatNeighbouringSiteContacts from '#utils/format-neighbouring-site-contacts.js';
import { mapFoldersLayoutForAppealSection } from '../documents/documents.mapper.js';
import { CONFIG_APPEAL_STAGES } from '#endpoints/constants.js';

/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.SingleLPAQuestionnaireResponse} SingleLPAQuestionnaireResponse */
/** @typedef {import('@pins/appeals.api').Appeals.ListedBuildingDetailsResponse} ListedBuildingDetailsResponse */
/** @typedef {import('@pins/appeals.api').Schema.ListedBuildingDetails} ListedBuildingDetails */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
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
 * @param {Folder[] | null} folders
 * @returns {SingleLPAQuestionnaireResponse | {}}
 */
const formatLpaQuestionnaire = (appeal, folders = null) => {
	const { address, id, lpa, lpaQuestionnaire, reference } = appeal;

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
				...formatFoldersAndDocuments(folders),
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
				localPlanningDepartment: lpa.name,
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

/**
 * @param {Folder[] | null} folders
 */
const formatFoldersAndDocuments = (folders) => {
	if (folders) {
		return {
			documents: mapFoldersLayoutForAppealSection(CONFIG_APPEAL_STAGES.lpaQuestionnaire, folders)
		};
	}

	return null;
};

export { formatLpaQuestionnaire };
