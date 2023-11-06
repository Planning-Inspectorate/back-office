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
		siteVisitId: 0,
		visitDate: '2023-10-09T01:00:00.000Z',
		visitEndTime: '10:44',
		visitStartTime: '09:38',
		visitType: 'Accompanied'
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
	neighbouringSiteContacts: [
		{
			address: {
				addressLine1: '19 Beauchamp Road',
				town: 'Bristol',
				postCode: 'BS7 8LQ'
			},
			contactId: 103,
			email: 'test5@example.com',
			firstName: 'Ryan',
			lastName: 'Marshall',
			telephone: '01234567891'
		},
		{
			address: {
				addressLine1: '96 The Avenue',
				addressLine2: 'Maidstone',
				county: 'Kent',
				postCode: 'MD21 5XY'
			},
			contactId: 104,
			email: 'test9@example.com',
			firstName: 'Eva',
			lastName: 'Sharma',
			telephone: '01234567891'
		}
	],
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
		name: 'Appeal has not been submitted on time',
		hasText: false
	},
	{
		id: 22,
		name: 'Documents have not been submitted on time',
		hasText: true
	},
	{
		id: 23,
		name: "The appellant doesn't have the right to appeal",
		hasText: false
	},
	{
		id: 24,
		name: 'Other',
		hasText: true
	}
];

export const appellantCaseIncompleteReasons = [
	{
		id: 2025,
		name: 'Appellant name is not the same on the application form and appeal form',
		hasText: false
	},
	{
		id: 2026,
		name: 'Attachments and/or appendices have not been included to the full statement of case',
		hasText: true
	},
	{
		id: 2027,
		name: "LPA's decision notice is incorrect or incomplete",
		hasText: true
	},
	{
		id: 2028,
		name: 'Documents and plans referred in the application form, decision notice and appeal covering letter are missing',
		hasText: true
	},
	{
		id: 2029,
		name: 'Site ownership certificate, agricultural holding certificate and declaration have not been completed on the appeal form',
		hasText: false
	},
	{
		id: 2030,
		name: 'The original application form is incomplete or missing',
		hasText: false
	},
	{
		id: 2031,
		name: 'Statement of case and ground of appeal are missing',
		hasText: false
	},
	{
		id: 2032,
		name: 'Other',
		hasText: true
	}
];

export const lpaQuestionnaireIncompleteReasons = [
	{
		id: 1,
		name: 'Documents or information are missing',
		hasText: true
	},
	{
		id: 2,
		name: 'Policies are missing',
		hasText: true
	},
	{
		id: 3,
		name: 'Other',
		hasText: true
	},
	{
		id: 4,
		name: 'Test incomplete reason without text 1',
		hasText: false
	},
	{
		id: 5,
		name: 'Test incomplete reason without text 2',
		hasText: false
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

export const documentFileInfo = {
	guid: 'd51f408c-7c6f-4f49-bcc0-abbb5bea3be6',
	name: 'ph0.jpeg',
	folderId: 1269,
	createdAt: '2023-10-11T13:57:41.592Z',
	isDeleted: false,
	latestVersionId: 1,
	caseId: 1,
	receivedAt: null,
	documentRedactionStatusId: null,
	documentRedactionStatus: null,
	latestDocumentVersion: {
		documentGuid: 'd51f408c-7c6f-4f49-bcc0-abbb5bea3be6',
		version: 1,
		lastModified: null,
		documentType: 'conservationAreaMap',
		published: false,
		sourceSystem: 'back-office',
		origin: null,
		originalFilename: 'ph0.jpeg',
		fileName: 'ph0.jpeg',
		representative: null,
		description: null,
		owner: null,
		author: null,
		securityClassification: null,
		mime: 'image/jpeg',
		horizonDataID: null,
		fileMD5: null,
		path: null,
		virusCheckStatus: null,
		size: 58861,
		stage: 'lpa_questionnaire',
		filter1: null,
		blobStorageContainer: 'document-service-uploads',
		blobStoragePath:
			'appeal/APP-Q9999-D-21-655112/d51f408c-7c6f-4f49-bcc0-abbb5bea3be6/v1/ph0.jpeg',
		dateCreated: '2023-10-11T13:57:41.592Z',
		datePublished: null,
		isDeleted: false,
		examinationRefNo: null,
		filter2: null,
		publishedStatus: 'awaiting_upload',
		publishedStatusPrev: null,
		redactedStatus: null,
		redacted: false,
		documentURI:
			'https://127.0.0.1:10000/devstoreaccount1/document-service-uploads/document-service-uploads/appeal/APP-Q9999-D-21-655112/d51f408c-7c6f-4f49-bcc0-abbb5bea3be6/v1/ph0.jpeg',
		dateReceived: null
	}
};

export const documentFileInfoPublished = {
	guid: 'd51f408c-7c6f-4f49-bcc0-abbb5bea3be7',
	name: 'test-document.pdf',
	folderId: 1269,
	createdAt: '2023-10-11T13:57:41.592Z',
	isDeleted: false,
	latestVersionId: 1,
	caseId: 1,
	receivedAt: null,
	documentRedactionStatusId: null,
	documentRedactionStatus: null,
	latestDocumentVersion: {
		documentGuid: 'd51f408c-7c6f-4f49-bcc0-abbb5bea3be7',
		version: 1,
		lastModified: null,
		documentType: 'conservationAreaMap',
		published: false,
		sourceSystem: 'back-office',
		origin: null,
		originalFilename: 'test-document.pdf',
		fileName: 'test-document.pdf',
		representative: null,
		description: null,
		owner: null,
		author: null,
		securityClassification: null,
		mime: 'application/pdf',
		horizonDataID: null,
		fileMD5: null,
		path: null,
		virusCheckStatus: null,
		size: 58861,
		stage: 'lpa_questionnaire',
		filter1: null,
		blobStorageContainer: 'document-service-uploads',
		blobStoragePath:
			'appeal/APP-Q9999-D-21-655112/d51f408c-7c6f-4f49-bcc0-abbb5bea3be7/v1/test-document.pdf',
		dateCreated: '2023-10-11T13:57:41.592Z',
		datePublished: null,
		isDeleted: false,
		examinationRefNo: null,
		filter2: null,
		publishedStatus: 'published',
		publishedStatusPrev: null,
		redactedStatus: null,
		redacted: false,
		documentURI:
			'https://127.0.0.1:10000/devstoreaccount1/document-service-uploads/document-service-uploads/appeal/APP-Q9999-D-21-655112/d51f408c-7c6f-4f49-bcc0-abbb5bea3be7/v1/test-document.pdf',
		dateReceived: null
	}
};

export const documentFolderInfo = {
	id: 23,
	folderId: 23,
	path: 'appellant_case/appealStatement',
	caseId: 'APP/Q9999/D/21/941501',
	documents: []
};

export const documentFolderInfoWithDocuments = {
	folderId: 23,
	path: 'appellant_case/appealStatement',
	caseId: 'APP/Q9999/D/21/941501',
	documents: [documentFileInfo, documentFileInfoPublished]
};

export const documentRedactionStatuses = [
	{
		id: 1,
		name: 'Redacted'
	},
	{
		id: 2,
		name: 'Unredacted'
	},
	{
		id: 3,
		name: 'No redaction required'
	}
];

export const baseSession = {
	id: '',
	cookie: { originalMaxAge: 1 },
	regenerate: function () {
		throw new Error('Function not implemented.');
	},
	destroy: function () {
		throw new Error('Function not implemented.');
	},
	reload: function () {
		throw new Error('Function not implemented.');
	},
	resetMaxAge: function () {
		throw new Error('Function not implemented.');
	},
	save: function () {
		throw new Error('Function not implemented.');
	},
	touch: function () {
		throw new Error('Function not implemented.');
	}
};
