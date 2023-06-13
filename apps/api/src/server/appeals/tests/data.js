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
		shorthand: 'HAS',
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
		shorthand: 'FPA'
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

export { fullPlanningAppeal, householdAppeal, householdAppealTwo, linkedAppeals, otherAppeals };
