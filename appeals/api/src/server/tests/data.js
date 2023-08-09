import isFPA from '#utils/is-fpa.js';
import {
	APPEAL_TYPE_SHORTHAND_FPA,
	APPEAL_TYPE_SHORTHAND_HAS,
	VALIDATION_OUTCOME_COMPLETE,
	VALIDATION_OUTCOME_INCOMPLETE,
	VALIDATION_OUTCOME_INVALID,
	VALIDATION_OUTCOME_VALID
} from '#endpoints/constants.js';
import { folder } from '#tests/documents/mocks.js';
import createValidationOutcomeResponse from '#utils/create-validation-outcome-response.js';

/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.SingleLPAQuestionnaireResponse} SingleLPAQuestionnaireResponse */
import formatNeighbouringSiteContacts from '#utils/format-neighbouring-site-contacts.js';

const householdAppeal = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	appealStatus: [
		{
			status: 'ready_to_start',
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
		email: 'l.thornton@example.com',
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
		shorthand: APPEAL_TYPE_SHORTHAND_HAS,
		type: 'household'
	},
	appellantCase: {
		appellantCaseIncompleteReasonsOnAppellantCases: [],
		appellantCaseValidationOutcome: null,
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
		otherNotValidReasons: null,
		visibilityRestrictions: 'The site is behind a tall hedge'
	},
	inspectorDecision: {
		outcome: 'Not issued yet'
	},
	siteVisit: {
		id: 1,
		appealId: 1,
		visitDate: '2022-03-31T01:00:00.000Z',
		visitEndTime: '03:00',
		visitStartTime: '01:00',
		siteVisitType: {
			id: 1,
			name: 'Access required'
		}
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
		doesSiteHaveHealthAndSafetyIssues: true,
		doesSiteRequireInspectorAccess: true,
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
		healthAndSafetyDetails: 'There may be no mobile reception at the site',
		inCAOrrelatesToCA: null,
		includesScreeningOption: null,
		inspectorAccessDetails:
			'There is a tall hedge around the site which obstructs the view of the site',
		isAffectingNeighbouringSites: true,
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
		neighbouringSiteContact: [
			{
				addressId: 1,
				firstName: 'Eva',
				id: 1,
				lastName: 'Sharma',
				lpaQuestionnaireId: 1,
				telephone: '01234567891',
				email: 'eva.sharma@example.com',
				address: {
					id: 1,
					addressLine1: '44 Rivervale',
					addressLine2: null,
					town: 'Bridport',
					postcode: 'DT6 5RN',
					county: null,
					country: null
				}
			}
		],
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
		shorthand: APPEAL_TYPE_SHORTHAND_FPA
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

const validAppellantCaseOutcome = {
	appellantCaseValidationOutcome: {
		name: 'Valid'
	}
};

const incompleteAppellantCaseOutcome = {
	appellantCaseIncompleteReasonsOnAppellantCases: [
		{
			appellantCaseIncompleteReason: {
				name: 'The original application form is incomplete or missing'
			}
		},
		{
			appellantCaseIncompleteReason: {
				name: 'Other'
			}
		}
	],
	appellantCaseValidationOutcome: {
		name: 'Incomplete'
	},
	otherNotValidReasons: 'The site address is missing'
};

const invalidAppellantCaseOutcome = {
	appellantCaseIvalidReasonsOnAppellantCases: [
		{
			appellantCaseInvalidReason: {
				name: 'Appeal has not been submitted on time'
			}
		},
		{
			appellantCaseInvalidReason: {
				name: 'Other'
			}
		}
	],
	appellantCaseValidationOutcome: {
		name: 'Invalid'
	},
	otherNotValidReasons: 'The site address does not exist'
};

const completeLPAQuestionnaireOutcome = {
	lpaQuestionnaireValidationOutcome: {
		name: 'Complete'
	}
};

const incompleteLPAQuestionnaireOutcome = {
	lpaQuestionnaireIncompleteReasonsOnLpaQuestionnaire: [
		{
			lpaQuestionnaireIncompleteReason: {
				name: 'Documents or information are missing'
			}
		},
		{
			lpaQuestionnaireIncompleteReason: {
				name: 'Other'
			}
		}
	],
	lpaQuestionnaireValidationOutcome: {
		name: 'Incomplete'
	},
	otherNotValidReasons: 'The site address is missing'
};

const householdAppealAppellantCaseValid = {
	...householdAppeal,
	appellantCase: {
		...householdAppeal.appellantCase,
		...validAppellantCaseOutcome
	},
	id: 3
};

const householdAppealAppellantCaseIncomplete = {
	...householdAppeal,
	appellantCase: {
		...householdAppeal.appellantCase,
		...incompleteAppellantCaseOutcome
	},
	id: 3
};

const householdAppealAppellantCaseInvalid = {
	...householdAppeal,
	appellantCase: {
		...householdAppeal.appellantCase,
		...invalidAppellantCaseOutcome
	},
	id: 4
};

const householdAppealLPAQuestionnaireComplete = {
	...householdAppeal,
	lpaQuestionnaire: {
		...householdAppeal.lpaQuestionnaire,
		...completeLPAQuestionnaireOutcome
	},
	id: 3
};

const householdAppealLPAQuestionnaireIncomplete = {
	...householdAppeal,
	lpaQuestionnaire: {
		...householdAppeal.lpaQuestionnaire,
		...incompleteLPAQuestionnaireOutcome
	},
	id: 3
};

const fullPlanningAppealAppellantCaseIncomplete = {
	...fullPlanningAppeal,
	appellantCase: {
		...fullPlanningAppeal.appellantCase,
		...incompleteAppellantCaseOutcome
	},
	id: 5
};

const fullPlanningAppealAppellantCaseInvalid = {
	...fullPlanningAppeal,
	appellantCase: {
		...fullPlanningAppeal.appellantCase,
		...invalidAppellantCaseOutcome
	},
	id: 6
};

const fullPlanningAppealLPAQuestionnaireIncomplete = {
	...fullPlanningAppeal,
	lpaQuestionnaire: {
		...fullPlanningAppeal.lpaQuestionnaire,
		...incompleteLPAQuestionnaireOutcome
	},
	id: 5
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
		id: householdAppealAppellantCaseIncomplete.id,
		reference: householdAppealAppellantCaseIncomplete.reference
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

const designatedSites = [
	{
		description: 'Site 1',
		id: 1,
		name: 'Site 1'
	},
	{
		description: 'Site 2',
		id: 2,
		name: 'Site 2'
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

const knowledgeOfOtherLandowners = [
	{
		id: 1,
		name: 'Value 1'
	},
	{
		id: 2,
		name: 'Value 2'
	}
];

/**
 * @param {RepositoryGetByIdResultItem} appeal
 * @returns {SingleLPAQuestionnaireResponse}
 */
const baseExpectedLPAQuestionnaireResponse = (appeal) => ({
	affectsListedBuildingDetails: appeal.lpaQuestionnaire?.listedBuildingDetails
		? [
				{
					grade: appeal.lpaQuestionnaire?.listedBuildingDetails[1].grade,
					description: appeal.lpaQuestionnaire?.listedBuildingDetails[1].description
				}
		  ]
		: null,
	appealId: appeal.id,
	appealReference: appeal.reference,
	appealSite: {
		addressLine1: '96 The Avenue',
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
					grade: appeal.lpaQuestionnaire?.listedBuildingDetails[0].grade,
					description: appeal.lpaQuestionnaire?.listedBuildingDetails[0].description
				}
		  ]
		: null,
	localPlanningDepartment: appeal.localPlanningDepartment,
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
	validation: createValidationOutcomeResponse(
		appeal.lpaQuestionnaire?.lpaQuestionnaireValidationOutcome?.name,
		appeal.lpaQuestionnaire?.otherNotValidReasons,
		appeal.lpaQuestionnaire?.lpaQuestionnaireIncompleteReasonOnLPAQuestionnaire
	)
});

/**
 *
 * @param {RepositoryGetByIdResultItem} appeal
 * @returns
 */
const baseExpectedAppellantCaseResponse = (appeal) => ({
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
		addressLine1: appeal.address?.addressLine1,
		town: appeal.address?.town,
		county: appeal.address?.county,
		postCode: appeal.address?.postcode
	},
	appellantCaseId: appeal.appellantCase?.id,
	appellant: {
		name: appeal.appellant?.name,
		company: appeal.appellant?.company
	},
	applicant: {
		firstName: appeal.appellantCase?.applicantFirstName,
		surname: appeal.appellantCase?.applicantSurname
	},
	...(isFPA(appeal.appealType) && {
		developmentDescription: {
			isCorrect: appeal.appellantCase?.isDevelopmentDescriptionStillCorrect,
			details: appeal.appellantCase?.newDevelopmentDescription
		}
	}),
	documents: {
		appealStatement: {
			documents: [],
			path: folder.path
		},
		applicationForm: {},
		...(isFPA(appeal.appealType) && {
			designAndAccessStatement: {}
		}),
		decisionLetter: {},
		...(isFPA(appeal.appealType) && {
			newPlansOrDrawings: {}
		}),
		newSupportingDocuments: {},
		...(isFPA(appeal.appealType) && {
			planningObligation: {}
		}),
		...(isFPA(appeal.appealType) && {
			plansDrawingsSupportingDocuments: {}
		}),
		...(isFPA(appeal.appealType) && {
			separateOwnershipCertificate: {}
		})
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
	localPlanningDepartment: appeal.localPlanningDepartment,
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
	siteVisit: {
		siteVisitId: appeal.siteVisit?.id,
		visitType: appeal.siteVisit?.siteVisitType.name
	},
	validation: createValidationOutcomeResponse(
		appeal.appellantCase?.appellantCaseValidationOutcome?.name,
		appeal.appellantCase?.otherNotValidReasons,
		appeal.appellantCase?.appellantCaseIncompleteReasonsOnAppellantCases,
		appeal.appellantCase?.appellantCaseInvalidReasonsOnAppellantCases
	),
	visibility: {
		details: appeal.appellantCase?.visibilityRestrictions,
		isVisible: appeal.appellantCase?.isSiteVisibleFromPublicRoad
	}
});

export {
	appellantCaseIncompleteReasons,
	appellantCaseInvalidReasons,
	appellantCaseValidationOutcomes,
	baseExpectedAppellantCaseResponse,
	baseExpectedLPAQuestionnaireResponse,
	designatedSites,
	fullPlanningAppeal,
	fullPlanningAppealAppellantCaseIncomplete,
	fullPlanningAppealAppellantCaseInvalid,
	fullPlanningAppealLPAQuestionnaireIncomplete,
	householdAppealLPAQuestionnaireComplete,
	householdAppeal,
	householdAppealAppellantCaseIncomplete,
	householdAppealAppellantCaseInvalid,
	householdAppealAppellantCaseValid,
	householdAppealLPAQuestionnaireIncomplete,
	knowledgeOfOtherLandowners,
	linkedAppeals,
	lpaQuestionnaireIncompleteReasons,
	lpaQuestionnaireValidationOutcomes,
	otherAppeals
};
