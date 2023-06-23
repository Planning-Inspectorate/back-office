/** @typedef {import('@pins/appeals.api').Appeals.SingleLPAQuestionnaireResponse} SingleLPAQuestionnaireResponse */

import {
	APPEAL_TYPE_SHORTCODE_FPA,
	APPEAL_TYPE_SHORTCODE_HAS,
	VALIDATION_OUTCOME_COMPLETE,
	VALIDATION_OUTCOME_INCOMPLETE,
	VALIDATION_OUTCOME_INVALID,
	VALIDATION_OUTCOME_VALID
} from '../constants';

const householdAppeal = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	appealStatus: [
		{
			status: 'awaiting_lpa_questionnaire',
			valid: true
		}
	],
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellant: {
		agentName: 'Mr Agent',
		company: 'Lee Thornton Ltd',
		name: 'Lee Thornton'
	},
	startedAt: new Date(2022, 4, 18),
	address: {
		addressLine1: '96 The Avenue',
		county: 'Kent',
		postcode: 'MD21 5XY',
		town: 'Maidstone'
	},
	appealTimetable: {
		appealId: 1,
		finalCommentReviewDate: null,
		id: 1,
		issueDeterminationDate: null,
		lpaQuestionnaireDueDate: '2023-05-16T01:00:00.000Z',
		statementReviewDate: null
	},
	appealType: {
		id: 2,
		shorthand: APPEAL_TYPE_SHORTCODE_HAS,
		type: 'household'
	},
	appellantCase: {
		applicantFirstName: 'Fiona',
		applicantSurname: 'Burgess',
		areAllOwnersKnown: true,
		hasAdvertisedAppeal: true,
		hasAttemptedToIdentifyOwners: true,
		hasHealthAndSafetyIssues: true,
		hasNewSupportingDocuments: false,
		hasOtherTenants: null,
		hasToldOwners: true,
		hasToldTenants: null,
		healthAndSafetyIssues: 'There is no mobile reception at the site',
		id: 1,
		isAgriculturalHolding: null,
		isAgriculturalHoldingTenant: null,
		isAppellantNamedOnApplication: false,
		isSiteFullyOwned: false,
		isSitePartiallyOwned: true,
		isSiteVisibleFromPublicRoad: false,
		knowledgeOfOtherLandowners: {
			name: 'Some'
		},
		visibilityRestrictions: 'The site is behind a tall hedge'
	},
	inspectorDecision: {
		outcome: 'Not issued yet'
	},
	siteVisit: {
		id: 1,
		appealId: 1,
		visitDate: '2022-03-31T12:00:00.000Z',
		visitSlot: '1pm - 2pm',
		visitType: 'unaccompanied'
	},
	lpaQuestionnaire: {
		id: 1,
		appealId: 1,
		communityInfrastructureLevyAdoptionDate: null,
		designatedSites: [
			{
				designatedSite: {
					name: 'cSAC',
					description: 'candidate special area of conservation'
				}
			}
		],
		developmentDescription: null,
		doesAffectAListedBuilding: null,
		doesAffectAScheduledMonument: null,
		doesSiteHaveHealthAndSafetyIssues: null,
		doesSiteRequireInspectorAccess: null,
		extraConditions: null,
		hasCommunityInfrastructureLevy: null,
		hasCompletedAnEnvironmentalStatement: null,
		hasEmergingPlan: null,
		hasExtraConditions: null,
		hasProtectedSpecies: null,
		hasRepresentationsFromOtherParties: null,
		hasResponsesOrStandingAdviceToUpload: null,
		hasStatementOfCase: null,
		hasStatutoryConsultees: null,
		hasSupplementaryPlanningDocuments: null,
		hasTreePreservationOrder: null,
		inCAOrrelatesToCA: null,
		includesScreeningOption: null,
		isCommunityInfrastructureLevyFormallyAdopted: null,
		isDevelopmentInOrNearDesignatedSites: null,
		isEnvironmentalStatementRequired: null,
		isGypsyOrTravellerSite: null,
		isListedBuilding: null,
		isPublicRightOfWay: null,
		isSensitiveArea: null,
		isSiteVisible: null,
		isTheSiteWithinAnAONB: null,
		listedBuildingDetails: [
			{
				grade: 'Grade I',
				description: 'http://localhost:8080',
				affectsListedBuilding: false
			},
			{
				grade: 'Grade II',
				description: 'http://localhost:8081',
				affectsListedBuilding: true
			}
		],
		lpaNotificationMethods: [
			{
				lpaNotificationMethod: {
					name: 'A site notice'
				}
			}
		],
		meetsOrExceedsThresholdOrCriteriaInColumn2: null,
		procedureType: {
			name: 'Written'
		},
		procedureTypeId: 3,
		receivedAt: null,
		scheduleType: {
			name: 'Schedule 1'
		},
		scheduleTypeId: 1,
		sentAt: '2023-05-24T10:34:09.286Z',
		siteWithinGreenBelt: null
	},
	linkedAppealId: 1,
	otherAppealId: 3
};
const fullPlanningAppeal = {
	...householdAppeal,
	id: 2,
	appealTimetable: {
		id: 2,
		appealId: 2,
		finalCommentReviewDate: '2023-06-28T01:00:00.000Z',
		issueDeterminationDate: null,
		lpaQuestionnaireDueDate: '2023-05-16T01:00:00.000Z',
		statementReviewDate: '2023-06-14T01:00:00.000Z'
	},
	appealType: {
		id: 1,
		type: 'full planning',
		shorthand: APPEAL_TYPE_SHORTCODE_FPA
	},
	appellantCase: {
		...householdAppeal.appellantCase,
		hasDesignAndAccessStatement: true,
		hasNewPlansOrDrawings: true,
		hasOtherTenants: true,
		hasPlanningObligation: true,
		hasSeparateOwnershipCertificate: true,
		hasToldTenants: false,
		isAgriculturalHolding: true,
		isAgriculturalHoldingTenant: true,
		isDevelopmentDescriptionStillCorrect: false,
		newDevelopmentDescription: 'A new extension has been added at the back',
		planningObligationStatus: {
			name: 'Finalised'
		}
	},
	otherAppealId: null
};

const householdAppealTwo = {
	...householdAppeal,
	id: 3
};

const linkedAppeals = [
	{
		id: householdAppeal.id,
		reference: householdAppeal.reference
	},
	{
		id: fullPlanningAppeal.id,
		reference: fullPlanningAppeal.reference
	}
];

const otherAppeals = [
	{
		id: householdAppeal.id,
		reference: householdAppeal.reference
	},
	{
		id: householdAppealTwo.id,
		reference: householdAppealTwo.reference
	}
];

const appellantCaseIncompleteReasons = [
	{
		id: 1,
		name: 'Reason 1'
	},
	{
		id: 2,
		name: 'Reason 2'
	},
	{
		id: 3,
		name: 'Other'
	}
];

const appellantCaseInvalidReasons = [
	{
		id: 1,
		name: 'Reason 1'
	},
	{
		id: 2,
		name: 'Reason 2'
	},
	{
		id: 3,
		name: 'Other'
	}
];

const appellantCaseValidationOutcomes = [
	{
		id: 1,
		name: VALIDATION_OUTCOME_INCOMPLETE
	},
	{
		id: 2,
		name: VALIDATION_OUTCOME_INVALID
	},
	{
		id: 3,
		name: VALIDATION_OUTCOME_VALID
	}
];

const lpaQuestionnaireValidationOutcomes = [
	{
		id: 1,
		name: VALIDATION_OUTCOME_COMPLETE
	},
	{
		id: 2,
		name: VALIDATION_OUTCOME_INCOMPLETE
	}
];

const lpaQuestionnaireIncompleteReasons = [
	{
		id: 1,
		name: 'Reason 1'
	},
	{
		id: 2,
		name: 'Reason 2'
	},
	{
		id: 3,
		name: 'Other'
	}
];

const householdappealWithCompleteLPAQuestionnaire = {
	...householdAppeal,
	lpaQuestionnaire: {
		...householdAppeal.lpaQuestionnaire,
		lpaQuestionnaireValidationOutcome: lpaQuestionnaireValidationOutcomes[0]
	}
};

const householdappealWithIncompleteLPAQuestionnaire = {
	...householdAppeal,
	lpaQuestionnaire: {
		...householdAppeal.lpaQuestionnaire,
		lpaQuestionnaireIncompleteReasonOnLPAQuestionnaire: lpaQuestionnaireIncompleteReasons.map(
			(reason) => ({
				lpaQuestionnaireIncompleteReason: reason
			})
		),
		lpaQuestionnaireValidationOutcome: lpaQuestionnaireValidationOutcomes[1],
		otherNotValidReasons: 'Another reason for the appeal being incomplete'
	}
};

/**
 * @param {typeof householdAppeal.lpaQuestionnaire} lpaQuestionnaire
 * @returns {SingleLPAQuestionnaireResponse}
 */
const baseExpectedLPAQuestionnaireResponse = (lpaQuestionnaire) => ({
	affectsListedBuildingDetails: [
		{
			grade: lpaQuestionnaire.listedBuildingDetails[1].grade,
			description: lpaQuestionnaire.listedBuildingDetails[1].description
		}
	],
	appealId: householdAppeal.id,
	appealReference: householdAppeal.reference,
	appealSite: {
		addressLine1: householdAppeal.address.addressLine1,
		town: householdAppeal.address.town,
		county: householdAppeal.address.county,
		postCode: householdAppeal.address.postcode
	},
	communityInfrastructureLevyAdoptionDate: lpaQuestionnaire.communityInfrastructureLevyAdoptionDate,
	designatedSites: lpaQuestionnaire.designatedSites.map(
		({ designatedSite: { name, description } }) => ({ name, description })
	),
	developmentDescription: lpaQuestionnaire.developmentDescription,
	documents: {
		communityInfrastructureLevy: 'community-infrastructure-levy.pdf',
		conservationAreaMapAndGuidance: 'conservation-area-map-and-guidance.pdf',
		consultationResponses: 'consultation-responses.pdf',
		definitiveMapAndStatement: 'right-of-way.pdf',
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
		supplementaryPlanningDocuments: ['supplementary-1.pdf'],
		treePreservationOrder: 'tree-preservation-order.pdf'
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
	hasProtectedSpecies: lpaQuestionnaire.hasProtectedSpecies,
	hasRepresentationsFromOtherParties: lpaQuestionnaire.hasRepresentationsFromOtherParties,
	hasResponsesOrStandingAdviceToUpload: lpaQuestionnaire.hasResponsesOrStandingAdviceToUpload,
	hasStatementOfCase: lpaQuestionnaire.hasStatementOfCase,
	hasStatutoryConsultees: lpaQuestionnaire.hasStatutoryConsultees,
	hasSupplementaryPlanningDocuments: lpaQuestionnaire.hasSupplementaryPlanningDocuments,
	hasTreePreservationOrder: lpaQuestionnaire.hasTreePreservationOrder,
	inCAOrrelatesToCA: lpaQuestionnaire.inCAOrrelatesToCA,
	includesScreeningOption: lpaQuestionnaire.includesScreeningOption,
	isCommunityInfrastructureLevyFormallyAdopted:
		lpaQuestionnaire.isCommunityInfrastructureLevyFormallyAdopted,
	isEnvironmentalStatementRequired: lpaQuestionnaire.isEnvironmentalStatementRequired,
	isGypsyOrTravellerSite: lpaQuestionnaire.isGypsyOrTravellerSite,
	isListedBuilding: lpaQuestionnaire.isListedBuilding,
	isPublicRightOfWay: lpaQuestionnaire.isPublicRightOfWay,
	isSensitiveArea: lpaQuestionnaire.isSensitiveArea,
	isSiteVisible: lpaQuestionnaire.isSiteVisible,
	isTheSiteWithinAnAONB: lpaQuestionnaire.isTheSiteWithinAnAONB,
	listedBuildingDetails: [
		{
			grade: lpaQuestionnaire.listedBuildingDetails[0].grade,
			description: lpaQuestionnaire.listedBuildingDetails[0].description
		}
	],
	localPlanningDepartment: householdAppeal.localPlanningDepartment,
	lpaNotificationMethods: lpaQuestionnaire.lpaNotificationMethods.map(
		({ lpaNotificationMethod: { name } }) => ({ name })
	),
	lpaQuestionnaireId: lpaQuestionnaire.id,
	meetsOrExceedsThresholdOrCriteriaInColumn2:
		lpaQuestionnaire.meetsOrExceedsThresholdOrCriteriaInColumn2,
	otherAppeals: [
		{
			appealId: otherAppeals[1].id,
			appealReference: otherAppeals[1].reference
		}
	],
	procedureType: lpaQuestionnaire.procedureType.name,
	scheduleType: lpaQuestionnaire.scheduleType.name,
	siteWithinGreenBelt: lpaQuestionnaire.siteWithinGreenBelt,
	validationOutcome: null
});

export {
	appellantCaseIncompleteReasons,
	appellantCaseInvalidReasons,
	appellantCaseValidationOutcomes,
	baseExpectedLPAQuestionnaireResponse,
	fullPlanningAppeal,
	householdAppeal,
	householdAppealTwo,
	householdappealWithCompleteLPAQuestionnaire,
	householdappealWithIncompleteLPAQuestionnaire,
	linkedAppeals,
	lpaQuestionnaireIncompleteReasons,
	lpaQuestionnaireValidationOutcomes,
	otherAppeals
};
