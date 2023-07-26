import { sample } from 'lodash-es';

export const localPlanningDepartments = [
	'Maidstone Borough Council',
	'Barnsley Metropolitan Borough Council',
	'Worthing Borough Council',
	'Dorset Council',
	'Basingstoke and Deane Borough Council',
	'Wiltshire Council',
	'Waveney District Council',
	'Bristol City Council'
];

export const appealsNationalList = {
	itemsCount: 2,
	items: [
		{
			appealId: 1,
			appealReference: 'APP/Q9999/D/21/943245',
			appealSite: {
				addressLine1: 'Copthalls',
				addressLine2: 'Clevedon Road',
				town: 'West Hill',
				postCode: 'BS48 1PN'
			},
			appealStatus: 'received_appeal',
			appealType: 'household',
			createdAt: '2023-04-17T09:49:22.021Z',
			localPlanningDepartment: 'Wiltshire Council'
		},
		{
			appealId: 2,
			appealReference: 'APP/Q9999/D/21/129285',
			appealSite: {
				addressLine1: '19 Beauchamp Road',
				town: 'Bristol',
				postCode: 'BS7 8LQ'
			},
			appealStatus: 'received_appeal',
			appealType: 'household',
			createdAt: '2023-04-17T09:49:22.057Z',
			localPlanningDepartment: 'Dorset Council'
		}
	],
	page: 1,
	pageCount: 1,
	pageSize: 30
};

export const appealData = {
	agentName: null,
	allocationDetails: 'F / General Allocation',
	appealId: 1,
	appealReference: 'APP/Q9999/D/21/351062',
	appealSite: {
		addressLine1: '21 The Pavement',
		county: 'Wandsworth',
		postCode: 'SW4 0HY'
	},
	appealStatus: 'received_appeal',
	appealType: 'household',
	appellantName: 'Eva Sharma',
	appellantCaseId: 0,
	procedureType: 'Written',
	developmentType: 'Minor Dwellings',
	eventType: 'Site Visit',
	linkedAppeals: [
		{
			appealId: 1,
			appealReference: 'APP/Q9999/D/21/725284'
		},
		{
			appealId: 2,
			appealReference: 'APP/Q9999/D/21/123456'
		}
	],
	localPlanningDepartment: 'Wiltshire Council',
	lpaQuestionnaireId: null,
	otherAppeals: [
		{
			appealId: 3,
			appealReference: 'APP/Q9999/D/21/765413'
		},
		{
			appealId: 4,
			appealReference: 'APP/Q9999/D/21/523467'
		}
	],
	planningApplicationReference: '48269/APP/2021/1482',
	appealTimetable: {
		finalEventsDueDate: null,
		questionnaireDueDate: null
	},
	siteVisit: {
		visitDate: null
	},
	startedAt: '2023-05-23T10:27:06.626Z',
	documentationSummary: {
		appellantCase: {
			status: 'received',
			dueDate: '2024-05-23T10:27:06.626Z'
		},
		lpaQuestionnaire: {
			status: 'not_received',
			dueDate: '2024-05-23T10:27:06.626Z'
		}
	}
};

export const appellantCaseData = {
	appealId: 170,
	appealReference: 'APP/Q9999/D/21/431220',
	appealSite: {
		addressLine1: '92 Huntsmoor Road',
		town: 'Tadley',
		postCode: 'RG26 4BX'
	},
	appellantCaseId: 1,
	appellant: {
		company: 'Eva Sharma Ltd',
		name: 'Eva Sharma'
	},
	applicant: {
		firstName: null,
		surname: null
	},
	documents: {
		appealStatement: {
			folderId: 1,
			path: 'appellantCase/appealStatement',
			documents: []
		},
		applicationForm: {
			folderId: 2,
			path: 'appellantCase/applicationForm',
			documents: []
		},
		decisionLetter: {
			folderId: 3,
			path: 'appellantCase/decisionLetter',
			documents: []
		},
		newSupportingDocuments: {
			folderId: 4,
			path: 'appellantCase/newSupportingDocuments',
			documents: []
		}
	},
	hasAdvertisedAppeal: null,
	hasNewSupportingDocuments: false,
	healthAndSafety: {
		details: null,
		hasIssues: false
	},
	isAppellantNamedOnApplication: true,
	localPlanningDepartment: 'Waveney District Council',
	siteOwnership: {
		areAllOwnersKnown: null,
		hasAttemptedToIdentifyOwners: null,
		hasToldOwners: null,
		isFullyOwned: true,
		isPartiallyOwned: null,
		knowsOtherLandowners: null
	},
	visibility: {
		details: null,
		isVisible: true
	}
};

export const lpaQuestionnaireData = {
	affectsListedBuildingDetails: [
		{
			grade: 'Grade III',
			description: 'http://localhost:8080/document-2.pdf'
		},
		{
			grade: 'Grade IV',
			description: 'http://localhost:8080/document-3.pdf'
		}
	],
	appealId: 1,
	appealReference: 'APP/Q9999/D/21/30498',
	appealSite: {
		addressLine1: '92 Huntsmoor Road',
		town: 'Tadley',
		postCode: 'RG26 4BX'
	},
	communityInfrastructureLevyAdoptionDate: '2023-05-09T01:00:00.000Z',
	designatedSites: [
		{
			name: 'pSPA',
			description: 'potential special protection area'
		},
		{
			name: 'SAC',
			description: 'special area of conservation'
		}
	],
	developmentDescription: '',
	documents: {
		definitiveMapAndStatement: { href: 'right-of-way.pdf', title: 'filename' },
		treePreservationOrder: { href: 'tree-preservation-order.pdf', title: 'filename' },
		communityInfrastructureLevy: { href: 'community-infrastructure-levy.pdf', title: 'filename' },
		conservationAreaMapAndGuidance: {
			href: 'conservation-area-map-and-guidance.pdf',
			title: 'filename'
		},
		consultationResponses: { href: 'consultation-responses.pdf', title: 'filename' },
		emergingPlans: [{ href: 'emerging-plan-1.pdf', title: 'filename' }],
		environmentalStatementResponses: {
			href: 'environment-statement-responses.pdf',
			title: 'filename'
		},
		issuedScreeningOption: { href: 'issued-screening-opinion.pdf', title: 'filename' },
		lettersToNeighbours: { href: 'letters-to-neighbours.pdf', title: 'filename' },
		otherRelevantPolicies: [{ href: 'policy-1.pdf', title: 'filename' }],
		planningOfficersReport: { href: 'planning-officers-report.pdf', title: 'filename' },
		policiesFromStatutoryDevelopment: [{ href: 'policy-a.pdf', title: 'filename' }],
		pressAdvert: { href: 'press-advert.pdf', title: 'filename' },
		representationsFromOtherParties: [
			{ href: 'representations-from-other-parties-1.pdf', title: 'filename' }
		],
		responsesOrAdvice: [{ href: 'responses-or-advice.pdf', title: 'filename' }],
		screeningDirection: { href: 'screening-direction.pdf', title: 'filename' },
		siteNotice: { href: 'site-notice.pdf', title: 'filename' },
		supplementaryPlanningDocuments: [{ href: 'supplementary-1.pdf', title: 'filename' }]
	},
	doesAffectAListedBuilding: true,
	doesAffectAScheduledMonument: true,
	doesSiteHaveHealthAndSafetyIssues: true,
	doesSiteRequireInspectorAccess: true,
	extraConditions: 'Some extra conditions',
	hasCommunityInfrastructureLevy: true,
	hasCompletedAnEnvironmentalStatement: true,
	hasEmergingPlan: true,
	hasExtraConditions: true,
	hasOtherAppeals: null,
	hasProtectedSpecies: true,
	hasRepresentationsFromOtherParties: true,
	hasResponsesOrStandingAdviceToUpload: true,
	hasStatementOfCase: true,
	hasStatutoryConsultees: true,
	hasSupplementaryPlanningDocuments: true,
	hasTreePreservationOrder: true,
	healthAndSafetyDetails: 'There is no mobile signal at the property',
	inCAOrrelatesToCA: true,
	includesScreeningOption: true,
	inquiryDays: 2,
	inspectorAccessDetails: 'The entrance is at the back of the property',
	isCommunityInfrastructureLevyFormallyAdopted: true,
	isEnvironmentalStatementRequired: true,
	isGypsyOrTravellerSite: true,
	isListedBuilding: true,
	isPublicRightOfWay: true,
	isSensitiveArea: true,
	isSiteVisible: true,
	isTheSiteWithinAnAONB: true,
	listedBuildingDetails: [
		{
			grade: 'Grade I',
			description: 'http://localhost:8080/document-0.pdf'
		},
		{
			grade: 'Grade II',
			description: 'http://localhost:8080/document-1.pdf'
		}
	],
	localPlanningDepartment: 'Dorset Council',
	lpaNotificationMethods: [
		{
			name: 'A site notice'
		},
		{
			name: 'Letter/email to interested parties'
		}
	],
	lpaQuestionnaireId: 2,
	meetsOrExceedsThresholdOrCriteriaInColumn2: true,
	otherAppeals: [
		{
			appealId: 2,
			appealReference: 'APP/Q9999/D/21/725284'
		}
	],
	procedureType: 'Written',
	scheduleType: 'Schedule 2',
	sensitiveAreaDetails: 'The area is prone to flooding',
	siteWithinGreenBelt: true,
	statutoryConsulteesDetails: 'Some other people need to be consulted'
};

export const getRandomLocalPlanningDepartment = () =>
	/** @type {string} */ (sample(localPlanningDepartments));

export const appellantCaseInvalidReasons = [
	{
		id: 21,
		name: 'Appeal has not been submitted on time'
	},
	{
		id: 22,
		name: 'Documents have not been submitted on time'
	},
	{
		id: 23,
		name: "The appellant doesn't have the right to appeal"
	},
	{
		id: 24,
		name: 'Other'
	}
];

export const appellantCaseIncompleteReasons = [
	{
		id: 2025,
		name: 'Appellant name is not the same on the application form and appeal form'
	},
	{
		id: 2026,
		name: 'Attachments and/or appendices have not been included to the full statement of case'
	},
	{
		id: 2027,
		name: "LPA's decision notice is incorrect or incomplete"
	},
	{
		id: 2028,
		name: 'Documents and plans referred in the application form, decision notice and appeal covering letter are missing'
	},
	{
		id: 2029,
		name: 'Site ownership certificate, agricultural holding certificate and declaration have not been completed on the appeal form'
	},
	{
		id: 2030,
		name: 'The original application form is incomplete or missing'
	},
	{
		id: 2031,
		name: 'Statement of case and ground of appeal are missing'
	},
	{
		id: 2032,
		name: 'Other'
	}
];
