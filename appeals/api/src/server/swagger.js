import { document as testDocument } from '#tests/data.js';
import swaggerAutogen from 'swagger-autogen';

const document = {
	info: {
		// by default: '1.0.0'
		version: '2.0',
		// by default: 'REST API'
		title: 'PINS Back Office Appeals API',
		// by default: ''
		description: 'PINS Back Office Appeals API documentation from Swagger'
	},
	// by default: 'localhost:3000'
	host: '',
	// by default: '/'
	basePath: '',
	// by default: ['http']
	schemes: [],
	// by default: ['application/json']
	consumes: [],
	// by default: ['application/json']
	produces: [],
	// by default: empty Array
	tags: [
		{
			// Tag name
			name: '',
			// Tag description
			description: ''
		}
		// { ... }
	],
	// by default: empty object (Swagger 2.0)
	securityDefinitions: {},
	definitions: {
		Folder: {
			id: 23,
			path: 'appellantCase/appealStatement',
			caseId: 34,
			documents: []
		},
		DocumentDetails: {
			guid: 'c957e9d0-1a02-4650-acdc-f9fdd689c210',
			name: 'appeal-statement.pdf',
			folderId: 3779,
			createdAt: '2023-08-17T15:22:20.827Z',
			isDeleted: false,
			latestVersionId: 1,
			caseId: 492,
			latestDocumentVersion: {
				documentGuid: 'c957e9d0-1a02-4650-acdc-f9fdd689c210',
				version: 1,
				lastModified: null,
				documentType: 'applicationForm',
				published: false,
				sourceSystem: 'back-office',
				origin: null,
				originalFilename: 'appeal-statement.pdf',
				fileName: 'appeal-statement.pdf',
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
				size: 146995,
				stage: 'appellant_case',
				filter1: null,
				blobStorageContainer: 'document-service-uploads',
				blobStoragePath: 'appeal/APPREF-123/v1/appeal-statement.pdf',
				dateCreated: '2023-08-17T15:22:20.827Z',
				datePublished: null,
				isDeleted: false,
				examinationRefNo: null,
				filter2: null,
				publishedStatus: 'awaiting_upload',
				publishedStatusPrev: null,
				redactedStatus: null,
				redacted: false,
				documentURI:
					'https://127.0.0.1:10000/devstoreaccount1/document-service-uploads/document-service-uploads/appeal/APPREF-123/c957e9d0-1a02-4650-acdc-f9fdd689c210/v1/appeal-statement.pdf',
				dateReceived: null
			}
		},
		AllAppeals: {
			itemCount: 57,
			items: [
				{
					appealId: 1,
					appealReference: 'APP/Q9999/D/21/235348',
					appealSite: {
						addressLine1: '19 Beauchamp Road',
						town: 'Bristol',
						postCode: 'BS7 8LQ'
					},
					appealStatus: 'awaiting_lpa_questionnaire',
					appealType: 'household',
					createdAt: '2023-02-16T11:43:27.096Z',
					localPlanningDepartment: 'Wiltshire Council'
				}
			],
			page: 1,
			pageCount: 27,
			pageSize: 30
		},
		SingleAppealResponse: {
			agentName: null,
			allocationDetails: {
				level: 'A',
				band: 3,
				specialisms: ['Historic heritage', 'Architecture design']
			},
			appealId: 1,
			appealReference: 'APP/Q9999/D/21/235348',
			appealSite: {
				addressLine1: '19 Beauchamp Road',
				town: 'Bristol',
				postCode: 'BS7 8LQ'
			},
			appealStatus: 'awaiting_lpa_questionnaire',
			appealTimetable: {
				finalCommentReviewDate: '2023-06-28T01:00:00.000Z',
				lpaQuestionnaireDueDate: '2023-05-16T01:00:00.000Z',
				statementReviewDate: '2023-06-14T01:00:00.000Z'
			},
			appealType: 'household',
			appellantCaseId: 1,
			appellantName: 'Fiona Burgess',
			appellantOwnsWholeSite: true,
			caseOfficer: '13de469c-8de6-4908-97cd-330ea73df618',
			decision: 'Not issued yet',
			healthAndSafety: {
				appellantCase: {
					details: 'There is no mobile reception at the site',
					hasIssues: true
				},
				lpaQuestionnaire: {
					details: 'There may be no mobile reception at the site',
					hasIssues: true
				}
			},
			inspector: 'f7ea429b-65d8-4c44-8fc2-7f1a34069855',
			inspectorAccess: {
				appellantCase: {
					details: 'There is a tall hedge around the site which obstructs the view of the site',
					isRequired: true
				},
				lpaQuestionnaire: {
					details: 'There may be a tall hedge around the site',
					isRequired: true
				}
			},
			isParentAppeal: true,
			linkedAppeals: [
				{
					appealId: 1,
					appealReference: 'APP/Q9999/D/21/725284'
				}
			],
			localPlanningDepartment: 'Wiltshire Council',
			lpaQuestionnaireId: 1,
			neighbouringSite: {
				contacts: [
					{
						address: {
							addressLine1: '1 Grove Cottage',
							addressLine2: 'Shotesham Road',
							postCode: 'NR35 2ND',
							town: 'Woodton'
						}
					}
				],
				isAffected: true
			},
			otherAppeals: [
				{
					appealId: 1,
					appealReference: 'APP/Q9999/D/21/725284'
				}
			],
			planningApplicationReference: '48269/APP/2021/1482',
			procedureType: 'Written',
			siteVisit: {
				visitDate: '2022-03-31T12:00:00.000Z',
				visitType: 'Accompanied'
			},
			startedAt: '2022-05-17T23:00:00.000Z',
			documentationSummary: {
				appellantCase: {
					status: 'received',
					dueDate: null
				},
				lpaQuestionnaire: {
					status: 'not_received',
					dueDate: '2023-06-18T00:00:00.000Z'
				}
			}
		},
		SingleAppellantCaseResponse: {
			agriculturalHolding: {
				isAgriculturalHolding: true,
				isTenant: true,
				hasToldTenants: false,
				hasOtherTenants: true
			},
			appealId: 1,
			appealReference: 'APP/Q9999/D/21/965625',
			appealSite: {
				addressId: 1,
				addressLine1: '21 The Pavement',
				county: 'Wandsworth',
				postCode: 'SW4 0HY'
			},
			appellantCaseId: 1,
			appellant: {
				appellantId: 1,
				company: 'Roger Simmons Ltd',
				name: 'Roger Simmons'
			},
			applicant: {
				firstName: 'Fiona',
				surname: 'Burgess'
			},
			developmentDescription: {
				details: 'A new extension has been added at the back',
				isCorrect: false
			},
			documents: {
				appealStatement: {
					folderId: 4562,
					documents: []
				},
				applicationForm: {
					folderId: 4563,
					documents: []
				},
				decisionLetter: {
					folderId: 4564,
					documents: []
				},
				newSupportingDocuments: {
					folderId: 4569,
					documents: []
				}
			},
			hasAdvertisedAppeal: true,
			hasDesignAndAccessStatement: true,
			hasNewPlansOrDrawings: true,
			hasNewSupportingDocuments: true,
			hasSeparateOwnershipCertificate: true,
			healthAndSafety: {
				details: 'There is no mobile reception at the site',
				hasIssues: true
			},
			isAppellantNamedOnApplication: false,
			localPlanningDepartment: 'Wiltshire Council',
			planningObligation: {
				hasObligation: true,
				status: 'Finalised'
			},
			procedureType: 'written',
			siteOwnership: {
				areAllOwnersKnown: true,
				hasAttemptedToIdentifyOwners: true,
				hasToldOwners: true,
				isFullyOwned: false,
				isPartiallyOwned: true,
				knowsOtherLandowners: 'Some'
			},
			siteVisit: {
				siteVisitId: 1,
				visitType: 'Accompanied'
			},
			validation: {
				outcome: 'Incomplete',
				incompleteReasons: [
					'Appellant name is not the same on the application form and appeal form',
					'Attachments and/or appendices have not been included to the full statement of case',
					'Other'
				]
			},
			visibility: {
				details: 'The site is behind a tall hedge',
				isVisible: false
			}
		},
		UpdateAppealRequest: {
			startedAt: '2023-05-09',
			caseOfficer: '13de469c-8de6-4908-97cd-330ea73df618',
			inspector: 'f7ea429b-65d8-4c44-8fc2-7f1a34069855'
		},
		UpdateAppealResponse: {
			startedAt: '2023-05-09T01:00:00.000Z',
			caseOfficer: '13de469c-8de6-4908-97cd-330ea73df618',
			inspector: 'f7ea429b-65d8-4c44-8fc2-7f1a34069855'
		},
		SingleLPAQuestionnaireResponse: {
			affectsListedBuildingDetails: [
				{
					listEntry: '654321'
				}
			],
			appealId: 1,
			appealReference: 'APP/Q9999/D/21/526184',
			appealSite: {
				addressLine1: '92 Huntsmoor Road',
				county: 'Tadley',
				postCode: 'RG26 4BX'
			},
			communityInfrastructureLevyAdoptionDate: '2023-05-09T01:00:00.000Z',
			designatedSites: [
				{
					name: 'cSAC',
					description: 'candidate special area of conservation'
				}
			],
			developmentDescription: '',
			documents: {
				communityInfrastructureLevy: testDocument,
				conservationAreaMapAndGuidance: testDocument,
				consultationResponses: testDocument,
				definitiveMapAndStatement: testDocument,
				emergingPlans: testDocument,
				environmentalStatementResponses: testDocument,
				issuedScreeningOption: testDocument,
				lettersToNeighbours: testDocument,
				otherRelevantPolicies: testDocument,
				planningOfficersReport: testDocument,
				policiesFromStatutoryDevelopment: testDocument,
				pressAdvert: testDocument,
				relevantPartiesNotification: testDocument,
				representationsFromOtherParties: testDocument,
				responsesOrAdvice: testDocument,
				screeningDirection: testDocument,
				siteNotice: testDocument,
				supplementaryPlanningtestDocuments: testDocument,
				treePreservationOrder: testDocument
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
			isConservationArea: true,
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
				}
			],
			localPlanningDepartment: 'Wiltshire Council',
			lpaNotificationMethods: [
				{
					name: 'A site notice'
				}
			],
			lpaQuestionnaireId: 1,
			meetsOrExceedsThresholdOrCriteriaInColumn2: true,
			neighbouringSiteContacts: [
				{
					address: {
						addressLine1: '44 Rivervale',
						town: 'Bridport',
						postCode: 'DT6 5RN'
					},
					email: 'eva.sharma@example.com',
					firstName: 'Eva',
					lastName: 'Sharma',
					telephone: '01234567891'
				}
			],
			otherAppeals: [
				{
					appealId: 1,
					appealReference: 'APP/Q9999/D/21/725284'
				}
			],
			procedureType: 'Written',
			scheduleType: 'Schedule 1',
			sensitiveAreaDetails: 'The area is prone to flooding',
			siteWithinGreenBelt: true,
			statutoryConsulteesDetails: 'Some other people need to be consulted',
			validation: {
				outcome: 'Incomplete',
				incompleteReasons: ['Documents or information are missing', 'Policies are missing', 'Other']
			}
		},
		UpdateAppellantCaseRequest: {
			appealDueDate: '2023-12-13',
			applicantFirstName: 'Fiona',
			applicantSurname: 'Burgess',
			areAllOwnersKnown: true,
			hasAdvertisedAppeal: true,
			hasAttemptedToIdentifyOwners: true,
			hasHealthAndSafetyIssues: true,
			healthAndSafetyIssues: 'There is no mobile reception at the site',
			incompleteReasons: [
				{
					id: 1,
					text: ['Incomplete reason 1', 'Incomplete reason 2', 'Incomplete reason 3']
				}
			],
			invalidReasons: [
				{
					id: 1,
					text: ['Invalid reason 1', 'Invalid reason 2', 'Invalid reason 3']
				}
			],
			isSiteFullyOwned: false,
			isSitePartiallyOwned: true,
			isSiteVisibleFromPublicRoad: false,
			validationOutcome: 'valid',
			visibilityRestrictions: 'The site is behind a tall hedge'
		},
		UpdateAppellantCaseResponse: {},
		UpdateLPAQuestionnaireRequest: {
			designatedSites: [1, 2, 3],
			doesAffectAListedBuilding: true,
			doesAffectAScheduledMonument: true,
			hasCompletedAnEnvironmentalStatement: true,
			hasProtectedSpecies: true,
			hasTreePreservationOrder: true,
			includesScreeningOption: true,
			incompleteReasons: [
				{
					id: 1,
					text: ['Incomplete reason 1', 'Incomplete reason 2', 'Incomplete reason 3']
				}
			],
			isConservationArea: true,
			isEnvironmentalStatementRequired: true,
			isGypsyOrTravellerSite: true,
			isListedBuilding: true,
			isPublicRightOfWay: true,
			isSensitiveArea: true,
			isTheSiteWithinAnAONB: true,
			lpaQuestionnaireDueDate: '2023-06-21',
			meetsOrExceedsThresholdOrCriteriaInColumn2: true,
			scheduleType: 1,
			sensitiveAreaDetails: 'The area is liable to flooding',
			validationOutcome: 'incomplete'
		},
		UpdateLPAQuestionnaireResponse: {},
		CreateSiteVisitRequest: {
			visitDate: '2023-07-07',
			visitEndTime: '18:00',
			visitStartTime: '16:00',
			visitType: 'access required'
		},
		CreateSiteVisitResponse: {
			visitDate: '2023-07-07T01:00:00.000Z',
			visitEndTime: '18:00',
			visitStartTime: '16:00',
			visitType: 'access required'
		},
		UpdateSiteVisitRequest: {
			visitDate: '2023-07-09',
			visitEndTime: '12:00',
			visitStartTime: '10:00',
			visitType: 'Accompanied'
		},
		UpdateSiteVisitResponse: {
			visitDate: '2023-07-09T01:00:00.000Z',
			visitEndTime: '12:00',
			visitStartTime: '10:00',
			visitType: 'Accompanied'
		},
		SingleSiteVisitResponse: {
			appealId: 2,
			siteVisitId: 1,
			visitType: 'Access required',
			visitDate: '2023-07-07',
			visitEndTime: '18:00',
			visitStartTime: '16:00'
		},
		AllAppellantCaseIncompleteReasonsResponse: [
			{
				id: 1,
				name: 'Incomplete reason',
				hasText: true
			}
		],
		AllAppellantCaseInvalidReasonsResponse: [
			{
				id: 1,
				name: 'Invalid reason',
				hasText: true
			}
		],
		AllLPAQuestionnaireIncompleteReasonsResponse: [
			{
				id: 1,
				name: 'Incomplete reason',
				hasText: true
			}
		],
		AllocationSpecialismsResponse: [
			{
				id: 1,
				name: 'Specialism'
			}
		],
		AllocationLevelsResponse: [
			{
				level: 'B',
				band: 3
			}
		],
		AppealAllocation: {
			level: 'A',
			specialisms: [70, 71, 72]
		},
		AllDesignatedSitesResponse: [
			{
				name: 'cSAC',
				description: 'candidate special area of conservation',
				id: 1
			}
		],
		AllKnowledgeOfOtherLandownersResponse: [
			{
				name: 'Yes',
				id: 1
			}
		],
		AllLPANotificationMethodsResponse: [
			{
				name: 'A site notice',
				id: 1
			}
		],
		AllLPAQuestionnaireValidationOutcomesResponse: [
			{
				name: 'Complete',
				id: 1
			}
		],
		AllPlanningObligationStatusesResponse: [
			{
				name: 'Finalised',
				id: 1
			}
		],
		AllProcedureTypesResponse: [
			{
				name: 'Hearing',
				id: 1
			}
		],
		AllScheduleTypesResponse: [
			{
				name: 'Schedule 1',
				id: 1
			}
		],
		AllSiteVisitTypesResponse: [
			{
				name: 'Access required',
				id: 1
			}
		],
		AllAppellantCaseValidationOutcomesResponse: [
			{
				name: 'Valid',
				id: 1
			}
		],
		SingleAppellantResponse: {
			agentName: 'Fiona Burgess',
			appellantId: 1,
			company: 'Sophie Skinner Ltd',
			email: 'sophie.skinner@example.com',
			name: 'Sophie Skinner'
		},
		UpdateAppellantRequest: {
			name: 'Eva Sharma'
		},
		UpdateAppellantResponse: {
			name: 'Eva Sharma'
		},
		SingleAddressResponse: {
			addressId: 1,
			addressLine1: '1 Grove Cottage',
			addressLine2: 'Shotesham Road',
			country: 'United Kingdom',
			county: 'Devon',
			postcode: 'NR35 2ND',
			town: 'Woodton'
		},
		UpdateAddressRequest: {
			addressLine1: '1 Grove Cottage',
			addressLine2: 'Shotesham Road',
			country: 'United Kingdom',
			county: 'Devon',
			postcode: 'NR35 2ND',
			town: 'Woodton'
		},
		UpdateAddressResponse: {
			addressLine1: '1 Grove Cottage',
			addressLine2: 'Shotesham Road',
			country: 'United Kingdom',
			county: 'Devon',
			postcode: 'NR35 2ND',
			town: 'Woodton'
		},
		UpdateAppealTimetableRequest: {
			finalCommentReviewDate: '2023-08-09',
			issueDeterminationDate: '2023-08-10',
			lpaQuestionnaireDueDate: '2023-08-11',
			statementReviewDate: '2023-08-12'
		},
		UpdateAppealTimetableResponse: {
			finalCommentReviewDate: '2023-08-09T01:00:00.000Z',
			issueDeterminationDate: '2023-08-10T01:00:00.000Z',
			lpaQuestionnaireDueDate: '2023-08-11T01:00:00.000Z',
			statementReviewDate: '2023-08-12T01:00:00.000Z'
		}
	},
	components: {}
};

const outputFile = './src/server/openapi.json';
const endpointsFiles = ['./src/server/endpoints/**/*.routes.js'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, document);
