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
			appealType: 'Householder',
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
			appealType: 'Householder',
			createdAt: '2023-04-17T09:49:22.057Z',
			localPlanningDepartment: 'Dorset Council'
		}
	],
	page: 1,
	pageCount: 1,
	pageSize: 30
};

// /**
//  * @type {import('@pins/appeals.api').Appeals.SingleAppealDetailsResponse}
//  */
/**
 * @type {import('../../../src/server/appeals/appeal-details/appeal-details.types.d').WebAppeal}
 */
export const appealData = {
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
	appealTimetable: {
		appealTimetableId: 1053,
		lpaQuestionnaireDueDate: '2023-10-11T01:00:00.000Z'
	},
	appealType: 'Householder',
	appellantCaseId: 0,
	agent: {
		firstName: 'Fiona',
		lastName: 'Shell',
		email: 'test2@example.com'
	},
	appellant: {
		firstName: 'Roger',
		lastName: 'Simmons',
		email: 'test3@example.com'
	},
	caseOfficer: null,
	decision: {
		folderId: 123,
		outcome: 'dismissed',
		documentId: 'e1e90a49-fab3-44b8-a21a-bb73af089f6b',
		letterDate: '2023-12-25T00:00:00.000Z'
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
	inspector: null,
	inspectorAccess: {
		appellantCase: {
			details: null,
			isRequired: false
		},
		lpaQuestionnaire: {
			details: null,
			isRequired: null
		}
	},
	isParentAppeal: false,
	isChildAppeal: false,
	linkedAppeals: [],
	localPlanningDepartment: 'Wiltshire Council',
	lpaQuestionnaireId: 1,
	neighbouringSite: {
		contacts: [
			{
				address: {
					addressLine1: '21 The Pavement',
					county: 'Wandsworth',
					postCode: 'SW4 0HY'
				},
				firstName: 'Haley',
				lastName: 'Eland'
			},
			{
				address: {
					addressLine1: 'FOR TRAINERS ONLY',
					addressLine2: '96 The Avenue',
					county: 'Kent',
					postCode: 'MD21 5XY'
				},
				firstName: 'Fiona',
				lastName: 'Burgess'
			}
		],
		isAffected: true
	},
	otherAppeals: [],
	planningApplicationReference: '48269/APP/2021/1482',
	procedureType: 'Written',
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
	}
};

export const appellantCaseDataNotValidated = {
	appealId: 1,
	appealReference: 'TEST/919276',
	appealSite: {
		addressId: 1,
		addressLine1: '96 The Avenue',
		addressLine2: 'Maidstone',
		county: 'Kent',
		postCode: 'MD21 5XY'
	},
	appellantCaseId: 1,
	appellant: {
		firstName: 'Fiona',
		surname: 'Burgess'
	},
	applicant: {
		firstName: null,
		surname: null
	},
	planningApplicationReference: '48269/APP/2021/1482',
	documents: {
		applicationForm: {
			folderId: 1,
			path: 'appellant_case/applicationForm',
			documents: []
		},
		decisionLetter: {
			folderId: 2,
			path: 'appellant_case/decisionLetter',
			documents: []
		},
		designAndAccessStatement: {
			folderId: 3,
			path: 'appellant_case/designAndAccessStatement',
			documents: []
		},
		planningObligation: {
			folderId: 4,
			path: 'appellant_case/planningObligation',
			documents: []
		},
		plansDrawingsSupportingDocuments: {
			folderId: 5,
			path: 'appellant_case/plansDrawingsSupportingDocuments',
			documents: []
		},
		separateOwnershipCertificate: {
			folderId: 6,
			path: 'appellant_case/separateOwnershipCertificate',
			documents: []
		},
		newPlansOrDrawings: {
			folderId: 7,
			path: 'appellant_case/newPlansOrDrawings',
			documents: []
		},
		newSupportingDocuments: {
			folderId: 8,
			path: 'appellant_case/newSupportingDocuments',
			documents: []
		},
		appealStatement: {
			folderId: 9,
			path: 'appellant_case/appealStatement',
			documents: []
		},
		additionalDocuments: {
			folderId: 10,
			path: 'appellant_case/additionalDocuments',
			documents: [
				{
					id: '00c43c8c-829a-4aa8-883a-fd6fc1f52c3d',
					name: 'ph1.jpeg',
					folderId: 3420,
					caseId: 111,
					isLateEntry: true,
					virusCheckStatus: 'checked'
				},
				{
					id: 'a78446aa-167a-4bef-89b7-18bcb0da11c1',
					name: 'ph0.jpeg',
					folderId: 3420,
					caseId: 111,
					isLateEntry: false,
					virusCheckStatus: 'checked'
				},
				{
					id: 'a78446aa-167a-4bef-89b7-18bcb0da11c2',
					name: 'test-doc.jpeg',
					folderId: 3420,
					caseId: 111,
					isLateEntry: false,
					virusCheckStatus: 'not_checked'
				}
			]
		}
	},
	hasAdvertisedAppeal: null,
	hasNewSupportingDocuments: false,
	healthAndSafety: {
		details: null,
		hasIssues: false
	},
	isAppellantNamedOnApplication: true,
	localPlanningDepartment: 'Worthing Borough Council',
	siteOwnership: {
		areAllOwnersKnown: null,
		hasAttemptedToIdentifyOwners: null,
		hasToldOwners: null,
		isFullyOwned: true,
		isPartiallyOwned: null,
		knowsOtherLandowners: null
	},
	validation: null,
	visibility: {
		details: null,
		isVisible: true
	}
};

export const appellantCaseDataInvalidOutcome = {
	...appellantCaseDataNotValidated,
	validation: {
		outcome: 'Invalid',
		invalidReasons: [
			{
				name: {
					id: 1,
					name: 'Appellant name is not the same on the application form and appeal form',
					hasText: false
				},
				text: []
			},
			{
				name: {
					id: 2,
					name: 'Attachments and/or appendices have not been included to the full statement of case',
					hasText: true
				},
				text: ['test reason 1']
			},
			{
				name: {
					id: 10,
					name: 'Other',
					hasText: true
				},
				text: ['test reason 2', 'test reason 3']
			}
		]
	}
};

export const appellantCaseDataIncompleteOutcome = {
	...appellantCaseDataNotValidated,
	validation: {
		outcome: 'Incomplete',
		incompleteReasons: [
			{
				name: {
					id: 1,
					name: 'Appellant name is not the same on the application form and appeal form',
					hasText: false
				},
				text: []
			},
			{
				name: {
					id: 2,
					name: 'Attachments and/or appendices have not been included to the full statement of case',
					hasText: true
				},
				text: ['test reason 1']
			},
			{
				name: {
					id: 10,
					name: 'Other',
					hasText: true
				},
				text: ['test reason 2', 'test reason 3']
			}
		]
	}
};

export const appellantCaseDataValidOutcome = {
	...appellantCaseDataNotValidated,
	validation: {
		outcome: 'Valid'
	}
};

export const lpaQuestionnaireDataNotValidated = {
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
		},
		communityInfrastructureLevy: {
			folderId: 8,
			path: 'lpa_questionnaire/communityInfrastructureLevy',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56h',
					name: 'communityInfrastructureLevy.docx',
					folderId: 8,
					caseId: 1
				}
			]
		},
		consultationResponses: {
			folderId: 9,
			path: 'lpa_questionnaire/consultationResponses',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56i',
					name: 'consultationResponses.docx',
					folderId: 9,
					caseId: 1
				}
			]
		},
		definitiveMapAndStatement: {
			folderId: 10,
			path: 'lpa_questionnaire/definitiveMapAndStatement',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56j',
					name: 'definitiveMapAndStatement.docx',
					folderId: 10,
					caseId: 1
				}
			]
		},
		emergingPlans: {
			folderId: 11,
			path: 'lpa_questionnaire/emergingPlans',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56k',
					name: 'emergingPlans.docx',
					folderId: 11,
					caseId: 1
				}
			]
		},
		environmentalStatementResponses: {
			folderId: 12,
			path: 'lpa_questionnaire/environmentalStatementResponses',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56l',
					name: 'environmentalStatementResponses.docx',
					folderId: 12,
					caseId: 1
				}
			]
		},
		issuedScreeningOption: {
			folderId: 13,
			path: 'lpa_questionnaire/issuedScreeningOption',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56m',
					name: 'issuedScreeningOption.docx',
					folderId: 13,
					caseId: 1
				}
			]
		},
		otherRelevantPolicies: {
			folderId: 14,
			path: 'lpa_questionnaire/otherRelevantPolicies',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56n',
					name: 'otherRelevantPolicies.docx',
					folderId: 14,
					caseId: 1
				}
			]
		},
		policiesFromStatutoryDevelopment: {
			folderId: 15,
			path: 'lpa_questionnaire/policiesFromStatutoryDevelopment',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56o',
					name: 'policiesFromStatutoryDevelopment.docx',
					folderId: 15,
					caseId: 1
				}
			]
		},
		relevantPartiesNotification: {
			folderId: 16,
			path: 'lpa_questionnaire/relevantPartiesNotification',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56p',
					name: 'relevantPartiesNotification.docx',
					folderId: 16,
					caseId: 1
				}
			]
		},
		responsesOrAdvice: {
			folderId: 17,
			path: 'lpa_questionnaire/responsesOrAdvice',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56q',
					name: 'responsesOrAdvice.docx',
					folderId: 17,
					caseId: 1
				}
			]
		},
		screeningDirection: {
			folderId: 18,
			path: 'lpa_questionnaire/screeningDirection',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56r',
					name: 'screeningDirection.docx',
					folderId: 18,
					caseId: 1
				}
			]
		},
		supplementaryPlanningDocuments: {
			folderId: 19,
			path: 'lpa_questionnaire/supplementaryPlanningDocuments',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56s',
					name: 'supplementaryPlanningDocuments.docx',
					folderId: 19,
					caseId: 1
				}
			]
		},
		treePreservationOrder: {
			folderId: 20,
			path: 'lpa_questionnaire/treePreservationOrder',
			documents: [
				{
					id: '9635631c-507c-4af2-98a1-da007e8bb56t',
					name: 'treePreservationOrder.docx',
					folderId: 20,
					caseId: 1
				}
			]
		},
		additionalDocuments: {
			folderId: 21,
			path: 'lpa_questionnaire/additionalDocuments',
			documents: [
				{
					id: '00c43c8c-829a-4aa8-883a-fd6fc1f52c3d',
					name: 'ph1.jpeg',
					folderId: 3420,
					caseId: 111,
					isLateEntry: true,
					virusCheckStatus: 'checked'
				},
				{
					id: 'a78446aa-167a-4bef-89b7-18bcb0da11c1',
					name: 'ph0.jpeg',
					folderId: 3420,
					caseId: 111,
					isLateEntry: false,
					virusCheckStatus: 'checked'
				},
				{
					id: 'a78446aa-167a-4bef-89b7-18bcb0da11c2',
					name: 'test-doc.jpeg',
					folderId: 3420,
					caseId: 111,
					isLateEntry: false,
					virusCheckStatus: 'not_checked'
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
	isAffectingNeighbouringSites: true,
	isCommunityInfrastructureLevyFormallyAdopted: true,
	isCorrectAppealType: true,
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
	statutoryConsulteesDetails: 'Some other people need to be consulted',
	validation: null
};

export const lpaQuestionnaireDataIncompleteOutcome = {
	...lpaQuestionnaireDataNotValidated,
	validation: {
		outcome: 'Incomplete',
		incompleteReasons: [
			{
				name: {
					id: 1,
					name: 'Policies are missing',
					hasText: true
				},
				text: ['test reason 1']
			},
			{
				name: {
					id: 2,
					name: 'Other documents or information are missing',
					hasText: true
				},
				text: ['test reason 2', 'test reason 3']
			},
			{
				name: {
					id: 3,
					name: 'Other',
					hasText: true
				},
				text: ['test reason 4', 'test reason 5', 'test reason 6']
			}
		]
	}
};

export const lpaQuestionnaireDataCompleteOutcome = {
	...lpaQuestionnaireDataNotValidated,
	validation: {
		outcome: 'Complete'
	}
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

export const appealTypesData = [
	{
		id: 75,
		type: 'Planning appeal',
		shorthand: 'FPA',
		code: 'A',
		enabled: false
	},
	{
		id: 76,
		type: 'Enforcement notice appeal',
		shorthand: 'X1',
		code: 'C',
		enabled: false
	}
];

export const inspectorDecisionData = {
	outcome: 'dismissed',
	documentId: 'e1e90a49-fab3-44b8-a21a-bb73af089f6b',
	letterDate: '2023-12-25T00:00:00.000Z'
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
	name: 'ph0-documentFileInfo.jpeg',
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
		originalFilename: 'ph0-documentFileInfo.jpeg',
		fileName: 'ph0-documentFileInfo.jpeg',
		representative: null,
		description: null,
		owner: null,
		author: null,
		securityClassification: null,
		mime: 'image/jpeg',
		horizonDataID: null,
		fileMD5: null,
		path: null,
		virusCheckStatus: 'checked',
		size: 58861,
		stage: 'lpa_questionnaire',
		filter1: null,
		blobStorageContainer: 'document-service-uploads',
		blobStoragePath:
			'appeal/APP-Q9999-D-21-655112/d51f408c-7c6f-4f49-bcc0-abbb5bea3be6/v1/ph0.jpeg',
		dateCreated: '2023-10-11T13:57:41.592Z',
		datePublished: null,
		isDeleted: false,
		isLateEntry: false,
		examinationRefNo: null,
		filter2: null,
		publishedStatus: 'awaiting_upload',
		publishedStatusPrev: null,
		redactedStatus: null,
		redacted: false,
		documentURI:
			'https://127.0.0.1:10000/devstoreaccount1/document-service-uploads/document-service-uploads/appeal/APP-Q9999-D-21-655112/d51f408c-7c6f-4f49-bcc0-abbb5bea3be6/v1/ph0.jpeg',
		dateReceived: '2023-10-11T13:57:41.592Z'
	}
};

export const documentFileInfoPublished = {
	guid: 'd51f408c-7c6f-4f49-bcc0-abbb5bea3be7',
	name: 'test-document-documentFileInfoPublished.pdf',
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
		published: true,
		sourceSystem: 'back-office',
		origin: null,
		originalFilename: 'test-document-documentFileInfoPublished.pdf',
		fileName: 'test-document-documentFileInfoPublished.pdf',
		representative: null,
		description: null,
		owner: null,
		author: null,
		securityClassification: null,
		mime: 'application/pdf',
		horizonDataID: null,
		fileMD5: null,
		path: null,
		virusCheckStatus: 'checked',
		size: 58861,
		stage: 'lpa_questionnaire',
		filter1: null,
		blobStorageContainer: 'document-service-uploads',
		blobStoragePath:
			'appeal/APP-Q9999-D-21-655112/d51f408c-7c6f-4f49-bcc0-abbb5bea3be7/v1/test-document.pdf',
		dateCreated: '2023-10-11T13:57:41.592Z',
		datePublished: null,
		isDeleted: false,
		isLateEntry: false,
		examinationRefNo: null,
		filter2: null,
		publishedStatus: 'published',
		publishedStatusPrev: null,
		redactedStatus: null,
		redacted: false,
		documentURI:
			'https://127.0.0.1:10000/devstoreaccount1/document-service-uploads/document-service-uploads/appeal/APP-Q9999-D-21-655112/d51f408c-7c6f-4f49-bcc0-abbb5bea3be7/v1/test-document.pdf',
		dateReceived: '2023-10-11T13:57:41.592Z'
	}
};

export const documentFileInfoLateEntry = {
	...documentFileInfo,
	folderId: 2865,
	latestDocumentVersion: {
		isLateEntry: true
	}
};

export const documentFolderInfo = {
	caseId: 103,
	documents: [
		{
			id: '15d19184-155b-4b6c-bba6-2bd2a61ca9a3',
			name: 'test-pdf-documentFolderInfo.pdf',
			latestDocumentVersion: {
				draft: false,
				dateReceived: '2023-02-01T01:00:00.000Z',
				redactionStatus: 1,
				size: 129363,
				mime: 'application/pdf',
				isLateEntry: false
			}
		},
		{
			id: '47d8f073-c837-4f07-9161-c1a5626eba56',
			name: 'sample-20s-documentFolderInfo.mp4',
			latestDocumentVersion: {
				draft: false,
				dateReceived: '2024-03-02T01:00:00.000Z',
				redactionStatus: 2,
				size: 11815175,
				mime: 'video/mp4',
				virusCheckStatus: 'not_checked',
				isLateEntry: true
			}
		},
		{
			id: '97260151-4334-407f-a76a-0b5666cbcfa6',
			name: 'ph0-documentFolderInfo.jpeg',
			latestDocumentVersion: {
				draft: true,
				dateReceived: '2025-04-03T01:00:00.000Z',
				redactionStatus: 3,
				size: 58861,
				mime: 'image/jpeg',
				virusCheckStatus: 'failed_virus_check',
				isLateEntry: false
			}
		},
		{
			id: '97260151-4334-407f-a76a-0b5666cbcfa7',
			name: 'ph1-documentFolderInfo.jpeg',
			latestDocumentVersion: {
				draft: true,
				dateReceived: '2025-04-03T01:00:00.000Z',
				redactionStatus: 2,
				size: 58987,
				mime: 'image/jpeg',
				virusCheckStatus: 'checked',
				isLateEntry: true
			}
		}
	],
	id: 2864,
	path: 'appellant_case/newSupportingDocuments'
};

export const additionalDocumentsFolderInfo = {
	...documentFolderInfo,
	id: 2865,
	path: 'appellant_case/additionalDocuments'
};

export const notCheckedDocumentFolderInfoDocuments = {
	id: '9635631c-507c-4af2-98a1-da007e8bb56a',
	name: 'applicationForm.docx',
	folderId: 1,
	caseId: 1,
	virusCheckStatus: 'not_checked'
};

export const scanFailedDocumentFolderInfoDocuments = {
	id: '9635631c-507c-4af2-98a1-da007e8bb56a',
	name: 'applicationForm.docx',
	folderId: 1,
	caseId: 1,
	virusCheckStatus: 'failed_virus_check'
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

export const documentFileVersionsInfo = {
	guid: '15d19184-155b-4b6c-bba6-2bd2a61ca9a3',
	name: 'test-pdf-documentFileVersionsInfo.pdf',
	folderId: 2864,
	createdAt: '2023-10-31T13:14:14.474Z',
	isDeleted: false,
	latestVersionId: 1,
	caseId: 103,
	documentVersion: [
		{
			documentGuid: '15d19184-155b-4b6c-bba6-2bd2a61ca9a3',
			version: 1,
			lastModified: null,
			documentType: 'newSupportingDocuments',
			published: true,
			sourceSystem: 'back-office-appeals',
			origin: null,
			originalFilename: 'test-pdf-documentFileVersionsInfo.pdf',
			fileName: 'test-pdf-documentFileVersionsInfo.pdf',
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
			size: 129363,
			stage: 'appellant_case',
			filter1: null,
			blobStorageContainer: 'document-service-uploads',
			blobStoragePath:
				'appeal/APP-Q9999-D-21-254218/15d19184-155b-4b6c-bba6-2bd2a61ca9a3/v1/test-pdf.pdf',
			dateCreated: '2023-10-31T13:14:14.474Z',
			datePublished: null,
			isDeleted: false,
			isLateEntry: false,
			examinationRefNo: null,
			filter2: null,
			publishedStatus: 'awaiting_upload',
			publishedStatusPrev: null,
			redactionStatusId: 1,
			redacted: false,
			documentURI:
				'https://127.0.0.1:10000/devstoreaccount1/document-service-uploads/document-service-uploads/appeal/APP-Q9999-D-21-254218/15d19184-155b-4b6c-bba6-2bd2a61ca9a3/v1/test-pdf.pdf',
			dateReceived: '2023-02-01T01:00:00.000Z'
		}
	],
	versionAudit: [
		{
			id: 2008,
			documentGuid: '15d19184-155b-4b6c-bba6-2bd2a61ca9a3',
			version: 1,
			auditTrailId: 2008,
			action: 'Create',
			auditTrail: {
				id: 2008,
				appealId: 103,
				userId: 1007,
				loggedAt: '2023-10-31T13:14:14.534Z',
				details: 'The document test-pdf.pdf was uploaded (v1)',
				user: {
					id: 1007,
					azureAdUserId: '923ac03b-9031-4cf4-8b17-348c274321f9',
					sapId: null
				}
			}
		}
	]
};

export const documentFileVersionsInfoNotChecked = {
	...documentFileVersionsInfo,
	documentVersion: [
		{
			...documentFileVersionsInfo.documentVersion[0],
			virusCheckStatus: 'not_checked'
		}
	]
};

export const documentFileVersionsInfoVirusFound = {
	...documentFileVersionsInfo,
	documentVersion: [
		{
			...documentFileVersionsInfo.documentVersion[0],
			virusCheckStatus: 'failed_virus_check'
		}
	]
};

export const documentFileVersionsInfoChecked = {
	...documentFileVersionsInfo,
	documentVersion: [
		{
			...documentFileVersionsInfo.documentVersion[0],
			virusCheckStatus: 'checked'
		}
	]
};

export const documentFileMultipleVersionsInfoWithLatestAsLateEntry = {
	...documentFileVersionsInfo,
	latestVersionId: 2,
	documentVersion: [
		{
			...documentFileVersionsInfo.documentVersion[0],
			version: 2,
			isLateEntry: true
		},
		{
			...documentFileVersionsInfo.documentVersion[0],
			version: 1,
			isLateEntry: false
		}
	]
};

export const assignedAppealsPage1 = {
	itemCount: 9,
	items: [
		{
			appealId: 189,
			appealReference: 'TEST/458673',
			appealSite: {
				addressLine1: '72 Clapham High St',
				county: 'Wandsworth',
				postCode: 'SW4 7UL'
			},
			appealStatus: 'lpa_questionnaire_due',
			appealType: 'Householder',
			createdAt: '2024-01-02T11:43:21.830Z',
			localPlanningDepartment: 'Maidstone Borough Council',
			lpaQuestionnaireId: 82,
			appealTimetable: {
				appealTimetableId: 83,
				lpaQuestionnaireDueDate: '2022-04-08T09:00:00.000Z'
			},
			dueDate: '2022-04-08T09:00:00.000Z'
		},
		{
			appealId: 161,
			appealReference: 'TEST/685020',
			appealSite: {
				addressLine1: '44 Rivervale',
				town: 'Bridport',
				postCode: 'DT6 5RN'
			},
			appealStatus: 'ready_to_start',
			appealType: 'Householder',
			createdAt: '2024-01-02T11:43:21.081Z',
			localPlanningDepartment: 'Wiltshire Council',
			lpaQuestionnaireId: null,
			dueDate: '2024-01-07T11:43:21.081Z'
		},
		{
			appealId: 162,
			appealReference: 'TEST/424942',
			appealSite: {
				addressLine1: '44 Rivervale',
				town: 'Bridport',
				postCode: 'DT6 5RN'
			},
			appealStatus: 'ready_to_start',
			appealType: 'Householder',
			createdAt: '2024-01-02T11:43:21.142Z',
			localPlanningDepartment: 'Dorset Council',
			lpaQuestionnaireId: null,
			dueDate: '2024-01-07T11:43:21.142Z'
		},
		{
			appealId: 163,
			appealReference: 'TEST/769207',
			appealSite: {
				addressLine1: 'Copthalls',
				addressLine2: 'Clevedon Road',
				town: 'West Hill',
				postCode: 'BS48 1PN'
			},
			appealStatus: 'ready_to_start',
			appealType: 'Householder',
			createdAt: '2024-01-02T11:43:21.169Z',
			localPlanningDepartment: 'Wiltshire Council',
			lpaQuestionnaireId: null,
			dueDate: '2024-01-07T11:43:21.169Z'
		},
		{
			appealId: 164,
			appealReference: 'TEST/83896',
			appealSite: {
				addressLine1: '92 Huntsmoor Road',
				town: 'Tadley',
				postCode: 'RG26 4BX'
			},
			appealStatus: 'ready_to_start',
			appealType: 'Householder',
			createdAt: '2024-01-02T11:43:21.199Z',
			localPlanningDepartment: 'Dorset Council',
			lpaQuestionnaireId: null,
			dueDate: '2024-01-07T11:43:21.199Z'
		}
	],
	statuses: ['lpa_questionnaire_due', 'ready_to_start', 'issue_determination'],
	page: 1,
	pageCount: 2,
	pageSize: 5
};

export const assignedAppealsPage2 = {
	itemCount: 9,
	items: [
		{
			appealId: 165,
			appealReference: 'TEST/333600',
			appealSite: {
				addressLine1: '21 The Pavement',
				county: 'Wandsworth',
				postCode: 'SW4 0HY'
			},
			appealStatus: 'ready_to_start',
			appealType: 'Householder',
			createdAt: '2024-01-02T11:43:21.226Z',
			localPlanningDepartment: 'Bristol City Council',
			lpaQuestionnaireId: null,
			dueDate: '2024-01-07T11:43:21.226Z'
		},
		{
			appealId: 166,
			appealReference: 'TEST/216911',
			appealSite: {
				addressLine1: 'FOR TRAINERS ONLY',
				addressLine2: '92 Huntsmoor Road',
				town: 'Tadley',
				postCode: 'RG26 4BX'
			},
			appealStatus: 'ready_to_start',
			appealType: 'Householder',
			createdAt: '2024-01-02T11:43:21.255Z',
			localPlanningDepartment: 'Waveney District Council',
			lpaQuestionnaireId: null,
			dueDate: '2024-01-07T11:43:21.255Z'
		},
		{
			appealId: 167,
			appealReference: 'TEST/600715',
			appealSite: {
				addressLine1: 'FOR TRAINERS ONLY',
				addressLine2: '55 Butcher Street',
				town: 'Thurnscoe',
				postCode: 'S63 0RB'
			},
			appealStatus: 'ready_to_start',
			appealType: 'Householder',
			createdAt: '2024-01-02T11:43:21.279Z',
			localPlanningDepartment: 'Dorset Council',
			lpaQuestionnaireId: null,
			dueDate: '2024-01-07T11:43:21.279Z'
		},
		{
			appealId: 168,
			appealReference: 'TEST/700910',
			appealSite: {
				addressLine1: 'FOR TRAINERS ONLY',
				addressLine2: '21 The Pavement',
				county: 'Wandsworth',
				postCode: 'SW4 0HY'
			},
			appealStatus: 'issue_determination',
			appealType: 'Householder',
			createdAt: '2024-01-02T11:43:21.298Z',
			localPlanningDepartment: 'Wiltshire Council',
			lpaQuestionnaireId: null,
			dueDate: '2024-01-07T11:43:21.298Z'
		}
	],
	statuses: ['lpa_questionnaire_due', 'ready_to_start', 'issue_determination'],
	page: 2,
	pageCount: 2,
	pageSize: 5
};

export const assignedAppealsPage3 = {
	itemCount: 9,
	items: [
		{
			appealId: 165,
			appealReference: 'TEST/333600',
			appealSite: {
				addressLine1: '21 The Pavement',
				county: 'Wandsworth',
				postCode: 'SW4 0HY'
			},
			appealStatus: 'ready_to_start',
			appealType: 'Householder',
			createdAt: '2024-01-02T11:43:21.226Z',
			localPlanningDepartment: 'Bristol City Council',
			lpaQuestionnaireId: null,
			dueDate: '2024-01-07T11:43:21.226Z'
		}
	],
	statuses: ['lpa_questionnaire_due', 'ready_to_start', 'issue_determination'],
	page: 2,
	pageCount: 2,
	pageSize: 1
};

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
