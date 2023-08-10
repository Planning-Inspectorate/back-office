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
			displayName: 'My files',
			path: 'appellantCase/appealStatement',
			caseId: 34,
			documents: []
		},
		DocumentDetails: {
			documentId: '123',
			version: 1,
			sourceSystem: 'ABC',
			documentGuid: '456',
			fileName: 'document.pdf',
			datePublished: 1_646_822_400,
			documentURI: '/documents/123.pdf',
			blobStorageContainer: 'my-blob-storage',
			author: 'John Smith',
			dateCreated: 1_646_822_400,
			publishedStatus: 'published',
			redactedStatus: 'not redacted',
			size: 1024,
			mime: 'application/pdf',
			description: 'This is a sample document.',
			representative: 'Jane Doe',
			stage: 'draft',
			filter1: 'some filter value',
			filter2: 'some filter value',
			documentType: 'contract',
			caseRef: 'ABC-123',
			examinationRefNo: 'EXM-456'
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
						},
						contactId: 1,
						email: 'appellant@example.com',
						firstName: 'Lee',
						lastName: 'Thornton',
						telephone: '01234567891'
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
				addressLine1: '21 The Pavement',
				county: 'Wandsworth',
				postCode: 'SW4 0HY'
			},
			appellantCaseId: 1,
			appellant: {
				name: 'Roger Simmons',
				company: 'Roger Simmons Ltd'
			},
			applicant: {
				firstName: 'Fiona',
				surname: 'Burgess'
			},
			developmentDescription: {
				isCorrect: false,
				details: 'A new extension has been added at the back'
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
				],
				otherNotValidReasons: 'The site address is missing'
			},
			visibility: {
				details: 'The site is behind a tall hedge',
				isVisible: false
			}
		},
		UpdateAppealRequest: {
			startedAt: '2023-05-09'
		},
		UpdateAppealResponse: {
			startedAt: '2023-05-09T01:00:00.000Z'
		},
		SingleLPAQuestionnaireResponse: {
			affectsListedBuildingDetails: [
				{
					grade: 'Grade I',
					description: 'http://localhost:8080/affects-listed-building.pdf'
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
				definitiveMapAndStatement: 'right-of-way.pdf',
				treePreservationOrder: 'tree-preservation-order.pdf',
				communityInfrastructureLevy: 'community-infrastructure-levy.pdf',
				conservationAreaMapAndGuidance: 'conservation-area-map-and-guidance.pdf',
				consultationResponses: 'consultation-responses.pdf',
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
				supplementaryPlanningDocuments: ['supplementary-1.pdf']
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
					description: 'http://localhost:8080/listed-building.pdf'
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
				incompleteReasons: [
					'Documents or information are missing',
					'Policies are missing',
					'Other'
				],
				otherNotValidReasons: 'The site address is missing'
			}
		},
		UpdateAppellantCaseRequest: {
			appealDueDate: '2023-12-13',
			incompleteReasons: [1, 2, 3],
			invalidReasons: [1, 2, 3],
			otherNotValidReasons: 'Another invalid reason',
			validationOutcome: 'valid'
		},
		UpdateAppellantCaseResponse: {},
		UpdateLPAQuestionnaireRequest: {
			incompleteReasons: [1, 2, 3],
			lpaQuestionnaireDueDate: '2023-06-21',
			otherNotValidReasons: 'Another incomplete reason',
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
				name: 'Incomplete reason'
			}
		],
		AllAppellantCaseInvalidReasonsResponse: [
			{
				id: 1,
				name: 'Invalid reason'
			}
		],
		AllLPAQuestionnaireIncompleteReasonsResponse: [
			{
				id: 1,
				name: 'Incomplete reason'
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
		]
	},
	components: {}
};

const outputFile = './src/server/openapi.json';
const endpointsFiles = ['./src/server/endpoints/**/*.routes.js'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, document);
