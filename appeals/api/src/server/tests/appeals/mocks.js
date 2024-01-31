import { APPEAL_TYPE_SHORTHAND_FPA, APPEAL_TYPE_SHORTHAND_HAS } from '#endpoints/constants.js';

import {
	azureAdUserId,
	validAppellantCaseOutcome,
	incompleteAppellantCaseOutcome,
	invalidAppellantCaseOutcome,
	completeLPAQuestionnaireOutcome,
	incompleteLPAQuestionnaireOutcome
} from '#tests/shared/mocks.js';

export const householdAppeal = {
	id: 1,
	reference: '1345264',
	appealStatus: [
		{
			status: 'ready_to_start',
			valid: true
		}
	],
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	lpa: {
		name: 'Maidstone Borough Council',
		lpaCode: 'MAID',
		id: 1
	},
	planningApplicationReference: '48269/APP/2021/1482',
	appellant: {
		id: 1,
		firstName: 'Lee',
		lastName: 'Thornton',
		email: 'test@1367.com'
	},
	agent: {
		id: 1,
		firstName: 'John',
		lastName: 'Smith',
		email: 'test@136s7.com'
	},
	startedAt: new Date(2022, 4, 18),
	address: {
		addressLine1: '96 The Avenue',
		addressLine2: 'Leftfield',
		addressCountry: 'United Kingdom',
		addressCounty: 'Kent',
		id: 1,
		postcode: 'MD21 5XY',
		addressTown: 'Maidstone'
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
		visibilityRestrictions: 'The site is behind a tall hedge'
	},
	auditTrail: [
		{
			details: 'The case officer 13de469c-8de6-4908-97cd-330ea73df618 was added to the team',
			loggedAt: new Date().toISOString(),
			user: {
				azureAdUserId
			}
		}
	],
	caseOfficer: {
		id: 1,
		azureAdUserId: 'a8973f33-4d2e-486b-87b0-d068343ad9eb'
	},
	dueDate: '2023-08-10T01:00:00.000Z',
	inspector: {
		id: 2,
		azureAdUserId: 'e8f89175-d02c-4a60-870e-dc954d5b530a'
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
	linkedAppeals: [],
	otherAppeals: [],
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
		isConservationArea: true,
		isCorrectAppealType: true,
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
				listEntry: '1',
				affectsListedBuilding: false
			},
			{
				listEntry: '2',
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
					addressTown: 'Bridport',
					postcode: 'DT6 5RN',
					addressCounty: null,
					addressCountry: null
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
	}
};

export const fullPlanningAppeal = {
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
	}
};

export const householdAppealAppellantCaseValid = {
	...householdAppeal,
	appellantCase: {
		...householdAppeal.appellantCase,
		...validAppellantCaseOutcome
	},
	id: 3
};

export const householdAppealAppellantCaseIncomplete = {
	...householdAppeal,
	appellantCase: {
		...householdAppeal.appellantCase,
		...incompleteAppellantCaseOutcome
	},
	id: 3
};

export const householdAppealAppellantCaseInvalid = {
	...householdAppeal,
	appellantCase: {
		...householdAppeal.appellantCase,
		...invalidAppellantCaseOutcome
	},
	id: 4
};

export const householdAppealLPAQuestionnaireComplete = {
	...householdAppeal,
	lpaQuestionnaire: {
		...householdAppeal.lpaQuestionnaire,
		...completeLPAQuestionnaireOutcome
	},
	id: 3
};

export const householdAppealLPAQuestionnaireIncomplete = {
	...householdAppeal,
	lpaQuestionnaire: {
		...householdAppeal.lpaQuestionnaire,
		...incompleteLPAQuestionnaireOutcome
	},
	id: 3
};

export const fullPlanningAppealAppellantCaseIncomplete = {
	...fullPlanningAppeal,
	appellantCase: {
		...fullPlanningAppeal.appellantCase,
		...incompleteAppellantCaseOutcome
	},
	id: 5
};

export const fullPlanningAppealAppellantCaseInvalid = {
	...fullPlanningAppeal,
	appellantCase: {
		...fullPlanningAppeal.appellantCase,
		...invalidAppellantCaseOutcome
	},
	id: 6
};

export const fullPlanningAppealLPAQuestionnaireIncomplete = {
	...fullPlanningAppeal,
	lpaQuestionnaire: {
		...fullPlanningAppeal.lpaQuestionnaire,
		...incompleteLPAQuestionnaireOutcome
	},
	id: 5
};

export const linkedAppeals = [
	{
		parentId: householdAppeal.id,
		parentRef: householdAppeal.reference,
		childRef: 'HORIZON/12345',
		linkingDate: '2024-01-01'
	}
];
