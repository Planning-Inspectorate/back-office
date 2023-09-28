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
	allocationDetails: {
		level: 'A',
		band: 3,
		specialisms: ['Historic heritage', 'Architecture design']
	},
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
	neighbouringSite: {
		contacts: [
			{
				address: {
					addressLine1: '21 The Pavement',
					county: 'Wandsworth',
					postCode: 'SW4 0HY'
				},
				contactId: 1016,
				email: 'appellant@example.com',
				firstName: 'Haley',
				lastName: 'Eland',
				telephone: '01234567891'
			},
			{
				address: {
					addressLine1: '92 Huntsmoor Road',
					town: 'Tadley',
					postCode: 'RG26 4BX'
				},
				contactId: 1017,
				email: 'appellant@example.com',
				firstName: 'Fiona',
				lastName: 'Burgess',
				telephone: '01234567891'
			}
		],
		isAffected: true
	},
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
		appealTimetableId: 1053,
		lpaQuestionnaireDueDate: '2023-10-11T01:00:00.000Z'
	},
	siteVisit: {
		visitDate: '2023-09-18T13:18:01.673Z',
		visitType: 'Access required'
	},
	startedAt: '2023-05-23T10:27:06.626Z',
	documentationSummary: {
		appellantCase: {
			status: 'received',
			dueDate: '2024-10-02T10:27:06.626Z'
		},
		lpaQuestionnaire: {
			status: 'not_received',
			dueDate: '2024-10-11T10:27:06.626Z'
		}
	},
	healthAndSafety: {
		appellantCase: {
			details: 'Dogs on site',
			hasIssues: true
		},
		lpaQuestionnaire: {
			details: null,
			hasIssues: null
		}
	},
	inspectorAccess: {
		appellantCase: {
			details: null,
			isRequired: false
		},
		lpaQuestionnaire: {
			details: null,
			isRequired: null
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
	},
	siteVisit: {
		siteVisitId: 0
	}
};

export const lpaQuestionnaireData = {
	affectsListedBuildingDetails: [
		{
			listEntry: '123456'
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
		conservationAreaMap: {
			folderId: 1,
			path: 'lpa_questionnaire/conservationAreaMap',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56a',
					name: 'conservationAreaMap.docx',
					folderId: 1,
					caseId: 1
				}
			]
		},
		notifyingParties: {
			folderId: 2,
			path: 'lpa_questionnaire/notifyingParties',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56b',
					name: 'notifyingParties.docx',
					folderId: 2,
					caseId: 1
				}
			]
		},
		siteNotices: {
			folderId: 3,
			path: 'lpa_questionnaire/siteNotices',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56c',
					name: 'siteNotices.docx',
					folderId: 3,
					caseId: 1
				}
			]
		},
		lettersToNeighbours: {
			folderId: 4,
			path: 'lpa_questionnaire/lettersToNeighbours',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56d',
					name: 'lettersToNeighbours.docx',
					folderId: 4,
					caseId: 1
				}
			]
		},
		pressAdvert: {
			folderId: 5,
			path: 'lpa_questionnaire/pressAdvert',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56e',
					name: 'pressAdvert.docx',
					folderId: 5,
					caseId: 1
				}
			]
		},
		representations: {
			folderId: 6,
			path: 'lpa_questionnaire/representations',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56f',
					name: 'representations.docx',
					folderId: 6,
					caseId: 1
				}
			]
		},
		officersReport: {
			folderId: 7,
			path: 'lpa_questionnaire/officersReport',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56g',
					name: 'officersReport.docx',
					folderId: 7,
					caseId: 1
				}
			]
		}
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
			listEntry: '123456'
		},
		{
			listEntry: '123457'
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

export const lpaQuestionnaireIncompleteReasons = [
	{
		id: 1,
		name: 'Documents or information are missing'
	},
	{
		id: 2,
		name: 'Policies are missing'
	},
	{
		id: 3,
		name: 'Other'
	}
];

export const siteVisitData = {
	appealId: 1,
	visitDate: '2023-10-09T01:00:00.000Z',
	siteVisitId: 0,
	visitEndTime: '10:44',
	visitStartTime: '09:38',
	visitType: 'Accompanied'
};

export const activeDirectoryUsersData = [
	{
		'@odata.type': '#microsoft.graph.user',
		id: '1',
		name: 'Smith, John',
		email: 'John.Smith@planninginspectorate.gov.uk'
	},
	{
		'@odata.type': '#microsoft.graph.user',
		id: '2',
		name: 'Doe, Jane',
		email: 'Jane.Doe@planninginspectorate.gov.uk'
	},
	{
		'@odata.type': '#microsoft.graph.user',
		id: '3',
		name: 'Bloggs, Joe',
		email: 'Joe.Bloggs@planninginspectorate.gov.uk'
	},
	{
		'@odata.type': '#microsoft.graph.user',
		id: '4',
		name: 'Jenkins, Leeroy',
		email: 'Leeroy.Jenkins@planninginspectorate.gov.uk'
	}
];

export const allocationDetailsData = {
	levels: [
		{
			level: 'A',
			band: 3
		},
		{
			level: 'B',
			band: 3
		}
	],
	specialisms: [
		{
			id: 1,
			name: 'Specialism 1'
		},
		{
			id: 2,
			name: 'Specialism 2'
		},
		{
			id: 3,
			name: 'Specialism 3'
		}
	]
};
