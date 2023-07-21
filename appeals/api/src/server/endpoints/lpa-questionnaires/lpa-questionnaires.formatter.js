import formatAddress from '#utils/format-address.js';
import createValidationOutcomeResponse from '#utils/create-validation-outcome-response.js';
import formatLinkedAppeals from '#utils/format-linked-appeals.js';
import formatNeighbouringSiteContacts from '#utils/format-neighbouring-site-contacts.js';

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
			.map(({ grade, description }) => ({ grade, description }))) ||
	null;

/**
 * @param {RepositoryGetByIdResultItem} appeal
 * @returns {SingleLPAQuestionnaireResponse}
 */
const formatLpaQuestionnaire = (appeal) => {
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
		isAffectingNeighbouringSites: lpaQuestionnaire?.isAffectingNeighbouringSites,
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
		neighbouringSiteContacts:
			formatNeighbouringSiteContacts(lpaQuestionnaire?.neighbouringSiteContact) || null,
		otherAppeals: formatLinkedAppeals(appeal.otherAppeals, appeal.id),
		procedureType: lpaQuestionnaire?.procedureType?.name,
		scheduleType: lpaQuestionnaire?.scheduleType?.name,
		sensitiveAreaDetails: lpaQuestionnaire?.sensitiveAreaDetails,
		siteWithinGreenBelt: lpaQuestionnaire?.siteWithinGreenBelt,
		statutoryConsulteesDetails: lpaQuestionnaire?.statutoryConsulteesDetails,
		validation: createValidationOutcomeResponse(
			lpaQuestionnaire?.lpaQuestionnaireValidationOutcome?.name,
			lpaQuestionnaire?.otherNotValidReasons,
			lpaQuestionnaire?.lpaQuestionnaireIncompleteReasonOnLPAQuestionnaire
		)
	};
};

export { formatLpaQuestionnaire };
