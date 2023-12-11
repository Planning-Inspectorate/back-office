import isFPA from '#utils/is-fpa.js';
import formatValidationOutcomeResponse from '#utils/format-validation-outcome-response.js';
import formatNeighbouringSiteContacts from '#utils/format-neighbouring-site-contacts.js';
import { otherAppeals } from './mocks.js';

/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.SingleLPAQuestionnaireResponse} SingleLPAQuestionnaireResponse */
/** @typedef {import('@pins/appeals.api').Appeals.SingleAppellantCaseResponse} SingleAppellantCaseResponse */

/**
 * @param {RepositoryGetByIdResultItem} appeal
 * @returns {SingleLPAQuestionnaireResponse}
 */
export const baseExpectedLPAQuestionnaireResponse = (appeal) => ({
	affectsListedBuildingDetails: appeal.lpaQuestionnaire?.listedBuildingDetails
		? [
				{
					listEntry: appeal.lpaQuestionnaire?.listedBuildingDetails[1].listEntry
				}
		  ]
		: null,
	appealId: appeal.id,
	appealReference: appeal.reference,
	appealSite: {
		addressLine1: '96 The Avenue',
		addressLine2: 'Leftfield',
		county: 'Kent',
		postCode: 'MD21 5XY',
		town: 'Maidstone'
	},
	communityInfrastructureLevyAdoptionDate:
		appeal.lpaQuestionnaire?.communityInfrastructureLevyAdoptionDate,
	designatedSites: appeal.lpaQuestionnaire?.designatedSites?.map(
		({ designatedSite: { name, description } }) => ({ name, description })
	),
	developmentDescription: appeal.lpaQuestionnaire?.developmentDescription,
	documents: {
		communityInfrastructureLevy: {},
		conservationAreaMap: {},
		consultationResponses: {},
		definitiveMapAndStatement: {},
		emergingPlans: {},
		environmentalStatementResponses: {},
		issuedScreeningOption: {},
		lettersToNeighbours: {},
		notifyingParties: {},
		officersReport: {},
		otherRelevantPolicies: {},
		policiesFromStatutoryDevelopment: {},
		pressAdvert: {},
		representations: {},
		responsesOrAdvice: {},
		screeningDirection: {},
		siteNotices: {},
		supplementaryPlanningDocuments: {},
		treePreservationOrder: {},
		additionalDocuments: {}
	},
	doesAffectAListedBuilding: appeal.lpaQuestionnaire?.doesAffectAListedBuilding,
	doesAffectAScheduledMonument: appeal.lpaQuestionnaire?.doesAffectAScheduledMonument,
	doesSiteHaveHealthAndSafetyIssues: appeal.lpaQuestionnaire?.doesSiteHaveHealthAndSafetyIssues,
	doesSiteRequireInspectorAccess: appeal.lpaQuestionnaire?.doesSiteRequireInspectorAccess,
	extraConditions: appeal.lpaQuestionnaire?.extraConditions,
	hasCommunityInfrastructureLevy: appeal.lpaQuestionnaire?.hasCommunityInfrastructureLevy,
	hasCompletedAnEnvironmentalStatement:
		appeal.lpaQuestionnaire?.hasCompletedAnEnvironmentalStatement,
	hasEmergingPlan: appeal.lpaQuestionnaire?.hasEmergingPlan,
	hasExtraConditions: appeal.lpaQuestionnaire?.hasExtraConditions,
	hasProtectedSpecies: appeal.lpaQuestionnaire?.hasProtectedSpecies,
	hasRepresentationsFromOtherParties: appeal.lpaQuestionnaire?.hasRepresentationsFromOtherParties,
	hasResponsesOrStandingAdviceToUpload:
		appeal.lpaQuestionnaire?.hasResponsesOrStandingAdviceToUpload,
	hasStatementOfCase: appeal.lpaQuestionnaire?.hasStatementOfCase,
	hasStatutoryConsultees: appeal.lpaQuestionnaire?.hasStatutoryConsultees,
	hasSupplementaryPlanningDocuments: appeal.lpaQuestionnaire?.hasSupplementaryPlanningDocuments,
	hasTreePreservationOrder: appeal.lpaQuestionnaire?.hasTreePreservationOrder,
	healthAndSafetyDetails: appeal.lpaQuestionnaire?.healthAndSafetyDetails,
	inCAOrrelatesToCA: appeal.lpaQuestionnaire?.inCAOrrelatesToCA,
	includesScreeningOption: appeal.lpaQuestionnaire?.includesScreeningOption,
	inspectorAccessDetails: appeal.lpaQuestionnaire?.inspectorAccessDetails,
	isAffectingNeighbouringSites: appeal.lpaQuestionnaire?.isAffectingNeighbouringSites,
	isCommunityInfrastructureLevyFormallyAdopted:
		appeal.lpaQuestionnaire?.isCommunityInfrastructureLevyFormallyAdopted,
	isConservationArea: appeal.lpaQuestionnaire?.isConservationArea || null,
	isCorrectAppealType: appeal.lpaQuestionnaire?.isCorrectAppealType || null,
	isEnvironmentalStatementRequired: appeal.lpaQuestionnaire?.isEnvironmentalStatementRequired,
	isGypsyOrTravellerSite: appeal.lpaQuestionnaire?.isGypsyOrTravellerSite,
	isListedBuilding: appeal.lpaQuestionnaire?.isListedBuilding,
	isPublicRightOfWay: appeal.lpaQuestionnaire?.isPublicRightOfWay,
	isSensitiveArea: appeal.lpaQuestionnaire?.isSensitiveArea,
	isSiteVisible: appeal.lpaQuestionnaire?.isSiteVisible,
	isTheSiteWithinAnAONB: appeal.lpaQuestionnaire?.isTheSiteWithinAnAONB,
	listedBuildingDetails: appeal.lpaQuestionnaire?.listedBuildingDetails
		? [
				{
					listEntry: appeal.lpaQuestionnaire?.listedBuildingDetails[0].listEntry
				}
		  ]
		: null,
	localPlanningDepartment: appeal.lpa.name,
	lpaNotificationMethods: appeal.lpaQuestionnaire?.lpaNotificationMethods?.map(
		({ lpaNotificationMethod: { name } }) => ({ name })
	),
	lpaQuestionnaireId: appeal.lpaQuestionnaire?.id,
	meetsOrExceedsThresholdOrCriteriaInColumn2:
		appeal.lpaQuestionnaire?.meetsOrExceedsThresholdOrCriteriaInColumn2,
	neighbouringSiteContacts: formatNeighbouringSiteContacts(
		appeal.lpaQuestionnaire?.neighbouringSiteContact
	),
	otherAppeals: otherAppeals
		.filter((a) => a.id !== appeal.id)
		.map(({ id, reference }) => ({ appealId: id, appealReference: reference })),
	procedureType: appeal.lpaQuestionnaire?.procedureType?.name,
	scheduleType: appeal.lpaQuestionnaire?.scheduleType?.name,
	siteWithinGreenBelt: appeal.lpaQuestionnaire?.siteWithinGreenBelt,
	validation: formatValidationOutcomeResponse(
		appeal.lpaQuestionnaire?.lpaQuestionnaireValidationOutcome?.name,
		appeal.lpaQuestionnaire?.lpaQuestionnaireIncompleteReasonOnLPAQuestionnaire
	)
});

/**
 *
 * @param {RepositoryGetByIdResultItem} appeal
 * @returns
 */
export const baseExpectedAppellantCaseResponse = (appeal) => ({
	...(isFPA(appeal.appealType) && {
		agriculturalHolding: {
			isAgriculturalHolding: appeal.appellantCase?.isAgriculturalHolding,
			isTenant: appeal.appellantCase?.isAgriculturalHoldingTenant,
			hasToldTenants: appeal.appellantCase?.hasToldTenants,
			hasOtherTenants: appeal.appellantCase?.hasOtherTenants
		}
	}),
	appealId: appeal.id,
	appealReference: appeal.reference,
	appealSite: {
		addressId: appeal.address?.id,
		addressLine1: appeal.address?.addressLine1 || '',
		addressLine2: appeal.address?.addressLine2 || '',
		town: appeal.address?.addressTown || '',
		county: appeal.address?.addressCounty || '',
		postCode: appeal.address?.postcode
	},
	appellantCaseId: appeal.appellantCase?.id,
	appellant: {
		appellantId: appeal.appellant?.id,
		company: appeal.appellant?.customer?.organisationName || null,
		name: appeal.appellant?.name
	},
	applicant: {
		firstName: appeal.appellantCase?.applicantFirstName,
		surname: appeal.appellantCase?.applicantSurname
	},
	...(isFPA(appeal.appealType) && {
		developmentDescription: {
			details: appeal.appellantCase?.newDevelopmentDescription,
			isCorrect: appeal.appellantCase?.isDevelopmentDescriptionStillCorrect
		}
	}),
	documents: {
		appealStatement: {},
		applicationForm: {},
		designAndAccessStatement: {},
		decisionLetter: {},
		newPlansOrDrawings: {},
		newSupportingDocuments: {},
		planningObligation: {},
		plansDrawingsSupportingDocuments: {},
		separateOwnershipCertificate: {},
		additionalDocuments: {}
	},
	hasAdvertisedAppeal: appeal.appellantCase?.hasAdvertisedAppeal,
	...(isFPA(appeal.appealType) && {
		hasDesignAndAccessStatement: appeal.appellantCase?.hasDesignAndAccessStatement
	}),
	...(isFPA(appeal.appealType) && {
		hasNewPlansOrDrawings: appeal.appellantCase?.hasNewPlansOrDrawings
	}),
	hasNewSupportingDocuments: appeal.appellantCase?.hasNewSupportingDocuments,
	...(isFPA(appeal.appealType) && {
		hasSeparateOwnershipCertificate: appeal.appellantCase?.hasSeparateOwnershipCertificate
	}),
	healthAndSafety: {
		details: appeal.appellantCase?.healthAndSafetyIssues,
		hasIssues: appeal.appellantCase?.hasHealthAndSafetyIssues
	},
	isAppellantNamedOnApplication: appeal.appellantCase?.isAppellantNamedOnApplication,
	localPlanningDepartment: appeal.lpa.name,
	planningApplicationReference: '48269/APP/2021/1482',
	...(isFPA(appeal.appealType) && {
		planningObligation: {
			hasObligation: appeal.appellantCase?.hasPlanningObligation,
			status: appeal.appellantCase?.planningObligationStatus.name
		}
	}),
	procedureType: appeal.lpaQuestionnaire?.procedureType?.name,
	siteOwnership: {
		areAllOwnersKnown: appeal.appellantCase?.areAllOwnersKnown,
		hasAttemptedToIdentifyOwners: appeal.appellantCase?.hasAttemptedToIdentifyOwners,
		hasToldOwners: appeal.appellantCase?.hasToldOwners,
		isFullyOwned: appeal.appellantCase?.isSiteFullyOwned,
		isPartiallyOwned: appeal.appellantCase?.isSitePartiallyOwned,
		knowsOtherLandowners: appeal.appellantCase?.knowledgeOfOtherLandowners.name
	},
	validation: formatValidationOutcomeResponse(
		appeal.appellantCase?.appellantCaseValidationOutcome?.name,
		appeal.appellantCase?.appellantCaseIncompleteReasonsOnAppellantCases,
		appeal.appellantCase?.appellantCaseInvalidReasonsOnAppellantCases
	),
	visibility: {
		details: appeal.appellantCase?.visibilityRestrictions,
		isVisible: appeal.appellantCase?.isSiteVisibleFromPublicRoad
	}
});
