import swaggerAutogen from 'swagger-autogen';

/**
 * Return the properties for a paged response, with an array of items
 *
 * @param {string} itemTypeRef
 * @returns {Object<string,any>}
 */
function pagedResponseProperties(itemTypeRef) {
	return {
		page: { type: 'integer', minimum: 0 },
		pageCount: { type: 'integer', minimum: 0 },
		pageSize: { type: 'integer', minimum: 0 },
		itemCount: { type: 'integer', minimum: 0 },
		items: {
			type: 'array',
			items: { $ref: itemTypeRef }
		}
	};
}

const paginationErrors = {
	page: {
		type: 'string',
		example: 'page must be a number'
	},
	pageSize: {
		type: 'string',
		example: 'pageSize must be a number'
	}
};

const document = {
	info: {
		// by default: '1.0.0'
		version: '2.0',
		// by default: 'REST API'
		title: 'PINS Back Office API',
		// by default: ''
		description: 'PINS Back Office API documentation from Swagger'
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
		documentsToSave: [
			{
				documentName: 'document.pdf',
				folderId: 123,
				documentType: 'application/pdf',
				documentSize: 1024,
				username: 'test-user@email.com',
				fromFrontOffice: false
			}
		],
		documentToSave: {
			documentName: 'document.pdf',
			folderId: 123,
			documentType: 'application/pdf',
			documentSize: 1024,
			username: 'test-user@email.com'
		},
		documentsToUpdateRequestBody: {
			status: 'not_checked',
			redacted: true,
			documents: [{ guid: '0084b156-006b-48b1-a47f-e7176414db29' }]
		},
		documentsToPublishRequestBody: {
			documents: [{ guid: '0084b156-006b-48b1-a47f-e7176414db29' }],
			username: 'test-user@email.com'
		},
		documentsAndBlobStorageURLs: {
			blobStorageHost: 'blob-storage-host',
			privateBlobContainer: 'blob-storage-container',
			documents: [
				{
					documentName: 'document.pdf',
					documentReference: 'docRef',
					blobStoreUrl: '/some/path/document.pdf'
				}
			]
		},
		partialDocumentsAndBlobStorageURLs: {
			blobStorageHost: 'blob-storage-host',
			privateBlobContainer: 'blob-storage-container',
			documents: [
				{
					documentName: 'document.pdf',
					documentReference: 'docRef',
					blobStoreUrl: '/some/path/document.pdf'
				}
			],
			failedDocuments: ['example.pdf'],
			duplicates: ['example2.pdf']
		},
		documentsUploadFailed: {
			failedDocuments: ['example.pdf'],
			duplicates: ['example2.pdf']
		},
		documentsPublished: [
			{
				guid: '0084b156-006b-48b1-a47f-e7176414db29',
				publishedStatus: 'published'
			}
		],
		UpdateApplication: {
			title: '',
			description: '',
			subSectorName: '',
			caseEmail: '',
			geographicalInformation: {
				mapZoomLevelName: '',
				locationDescription: '',
				regionNames: [''],
				gridReference: {
					easting: '123456',
					northing: '098765'
				}
			},
			applicants: [
				{
					id: 1,
					organisationName: '',
					firstName: '',
					middleName: '',
					lastName: '',
					email: '',
					website: '',
					phoneNumber: '',
					address: {
						addressLine1: '',
						addressLine2: '',
						town: '',
						county: '',
						postcode: ''
					}
				}
			],
			keyDates: {
				submissionDatePublished: 'Q1 2023',
				submissionDateInternal: 123
			}
		},
		CreateApplication: {
			title: '',
			description: '',
			subSectorName: '',
			caseEmail: '',
			geographicalInformation: {
				mapZoomLevelName: '',
				locationDescription: '',
				regionNames: [''],
				gridReference: {
					easting: '123456',
					northing: '098765'
				}
			},
			applicants: [
				{
					organisationName: '',
					firstName: '',
					middleName: '',
					lastName: '',
					email: '',
					address: {
						addressLine1: '',
						addressLine2: '',
						town: '',
						county: '',
						postcode: ''
					},
					website: '',
					phoneNumber: ''
				}
			],
			keyDates: {
				submissionDatePublished: 'Q1 2023',
				submissionDateInternal: 123
			}
		},
		Sectors: [
			{
				abbreviation: 'BB',
				displayNameCy: 'Sector Name Cy',
				displayNameEn: 'Sector Name En',
				name: 'sector'
			}
		],
		RegionsForApplications: [
			{
				id: 1,
				name: 'Region Name',
				displayNameEn: 'Region Name En',
				displayNameCy: 'Region Name Cy'
			}
		],
		MapZoomLevelForApplications: [
			{
				id: 1,
				name: 'Region Name',
				displayOrder: 100,
				displayNameEn: 'Region Name En',
				displayNameCy: 'Region Name Cy'
			}
		],
		ExaminationTimetableTypes: [
			{
				id: 1,
				templateType: 'starttime-mandatory',
				name: 'Accompanied Site Inspection',
				displayNameEn: 'Accompanied site inspection',
				displayNameCy: 'Accompanied site inspection Cy'
			}
		],
		ExaminationTimetableItems: [
			{
				id: 1,
				caseId: 1,
				examinationTypeId: 1,
				name: 'Examination Timetable Item',
				description:
					'{"preText":"Examination Timetable Item Description\\r\\n","bulletPoints":[" Line item 1\\r\\n"," Line item 2"]}',
				date: '2023-02-27T10:00:00Z',
				startDate: '2023-02-27T10:00:00Z',
				published: false,
				folderId: 134,
				startTime: '10:20',
				endTime: '12:20',
				submissions: true
			}
		],
		ExaminationTimetableItemRequestBody: {
			caseId: 1,
			examinationTypeId: 1,
			name: 'Examination Timetable Item',
			description:
				'{"preText":"Examination Timetable Item Description\\r\\n","bulletPoints":[" Line item 1\\r\\n"," Line item 2"]}',
			date: '2023-02-27T10:00:00Z',
			published: false,
			folderId: 134,
			startDate: '2023-02-27T10:00:00Z',
			startTime: '10:20',
			endTime: '12:20'
		},
		ExaminationTimetableItemResponseBody: {
			id: 1,
			caseId: 1,
			examinationTypeId: 1,
			name: 'Examination Timetable Item',
			description:
				'{"preText":"Examination Timetable Item Description\\r\\n","bulletPoints":[" Line item 1\\r\\n"," Line item 2"]}',
			date: '2023-02-27T10:00:00Z',
			published: false,
			folderId: 134,
			startDate: '2023-02-27T10:00:00Z',
			startTime: '10:20',
			endTime: '12:20',
			submissions: true
		},
		S51AdviceRequestBody: {
			caseId: 29,
			title: 'title',
			firstName: 'first name',
			lastName: 'last name',
			enquirer: 'organisation',
			enquiryMethod: 'meeting',
			enquiryDate: '2023-01-11T00:00:00.000Z',
			enquiryDetails: 'title',
			adviser: 'person',
			adviceDate: '2023-02-11T00:00:00.000Z',
			adviceDetails: 'title',
			referenceNumber: 1,
			redactedStatus: 'redacted',
			publishedStatus: 'not_checked',
			createdAt: '2023-08-07T09:13:15.593Z',
			updatedAt: '2023-08-07T09:13:15.593Z'
		},
		S51AdviceResponseBody: {
			id: 1,
			caseId: 29,
			title: 'title',
			firstName: 'first name',
			lastName: 'last name',
			enquirer: 'organisation',
			enquiryMethod: 'meeting',
			enquiryDate: '2023-01-11T00:00:00.000Z',
			enquiryDetails: 'title',
			adviser: 'person',
			adviceDate: '2023-02-11T00:00:00.000Z',
			adviceDetails: 'title',
			referenceNumber: 1,
			redactedStatus: 'redacted',
			publishedStatus: 'not_checked',
			createdAt: '2023-08-07T09:13:15.593Z',
			updatedAt: '2023-08-07T09:13:15.593Z'
		},
		documentsPropertiesRequestBody: {
			version: 1,
			createdAt: '2023-02-27T10:00:00Z',
			lastModified: '2023-02-27T12:00:00Z',
			documentType: 'PDF',
			documentReference: 'B123-000001',
			published: false,
			sourceSystem: 'Salesforce',
			origin: 'Email',
			representative: 'John Doe',
			description: 'Marketing Brochure',
			documentGuid: 'ab12cd34-5678-90ef-ghij-klmnopqrstuv',
			datePublished: '2023-03-01T10:00:00Z',
			owner: 'Jane Doe',
			author: 'Marketing Team',
			securityClassification: 'Confidential',
			mime: 'application/pdf',
			horizonDataID: '123456789',
			fileMD5: 'f60c381d96dcedec4b4fb4b9e1f6e14e',
			path: '/documents/marketing/ab12cd34-5678-90ef-ghij-klmnopqrstuv.pdf',
			virusCheckStatus: 'Clean',
			size: 1024,
			stage: 3,
			filter1: 'Marketing',
			filter2: 'Brochure',
			fromFrontOffice: true
		},
		documentsMetadataResponseBody: {
			version: 1,
			documentId: 'a6f9f2e0-12c9-49b7-8a1c-3b5edc34dd99',
			datePublished: '',
			caseRef: 'BC0210002',
			documentName: '5',
			privateBlobContainer: 'document-service-uploads',
			privateBlobPath: '/application/BC010001/1111-2222-3333/my doc.pdf',
			from: 'joe blogs',
			dateCreated: 1_677_585_578,
			size: 0,
			fileType: '',
			redacted: false,
			status: 'awaiting_upload',
			description: '',
			agent: '',
			documentType: '',
			webFilter: ''
		},
		ApplicationsForCaseTeam: [
			{
				id: 1,
				modifiedDate: 1_655_298_882,
				reference: 'REFERENCE',
				sector: {
					abbreviation: 'BB',
					displayNameCy: 'Sector Name Cy',
					displayNameEn: 'Sector Name En',
					name: 'sector'
				},
				subSector: {
					abbreviation: 'AA',
					displayNameCy: 'Sub Sector Name Cy',
					displayNameEn: 'Sub Sector Name En',
					name: 'sub_sector'
				},
				status: 'status'
			}
		],
		ApplicationsForCaseAdminOfficer: [
			{
				id: 1,
				modifiedDate: 1_655_298_882,
				reference: 'REFERENCE',
				sector: {
					abbreviation: 'BB',
					displayNameCy: 'Sector Name Cy',
					displayNameEn: 'Sector Name En',
					name: 'sector'
				},
				subSector: {
					abbreviation: 'AA',
					displayNameCy: 'Sub Sector Name Cy',
					displayNameEn: 'Sub Sector Name En',
					name: 'sub_sector'
				},
				status: 'status'
			}
		],
		ApplicationsForInspector: [
			{
				id: 1,
				modifiedDate: 1_655_298_882,
				reference: 'REFERENCE',
				sector: {
					abbreviation: 'BB',
					displayNameCy: 'Sector Name Cy',
					displayNameEn: 'Sector Name En',
					name: 'sector'
				},
				subSector: {
					abbreviation: 'AA',
					displayNameCy: 'Sub Sector Name Cy',
					displayNameEn: 'Sub Sector Name En',
					name: 'sub_sector'
				},
				status: 'status'
			}
		],
		ApplicationsForSearchCriteriaRequestBody: {
			query: 'BC',
			role: 'case-team',
			pageNumber: 1,
			pageSize: 1
		},
		ApplicationsForSearchCriteria: {
			page: 1,
			pageSize: 1,
			pageCount: 1,
			itemCount: 1,
			items: [
				{
					id: 3,
					status: 'open',
					reference: 'EN010003',
					title: 'EN010003 - NI Case 3 Name',
					modifiedDate: 1_655_298_882,
					datePublished: null
				}
			]
		},
		DocumentsInCriteriaRequestBody: {
			pageNumber: 1,
			pageSize: 1
		},
		documentsMetadataRequestBody: {
			documentId: '123',
			version: 1,
			sourceSystem: 'ABC',
			documentGuid: '456',
			fileName: 'document.pdf',
			datePublished: '2022-12-21T12:42:40.885Z',
			privateBlobPath: '/documents/123.pdf',
			privateBlobContainer: 'my-blob-storage',
			author: 'John Smith',
			dateCreated: '2022-12-21T12:42:40.885Z',
			publishedStatus: 'published',
			redactedStatus: 'not redacted',
			size: 1024,
			mime: 'application/pdf',
			description: 'This is a sample document.',
			representative: 'Jane Doe',
			filter1: 'some filter value',
			filter2: 'some filter value',
			documentType: 'contract',
			caseRef: 'ABC-123',
			examinationRefNo: 'EXM-456'
		},
		DocumentDetails: {
			documentId: '123',
			version: 1,
			sourceSystem: 'ABC',
			documentGuid: '456',
			fileName: 'document.pdf',
			datePublished: 1_646_822_400,
			privateBlobPath: '/documents/123.pdf',
			privateBlobContainer: 'my-blob-storage',
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
		PaginatedDocumentDetails: [
			{
				page: 1,
				pageDefaultSize: 50,
				pageCount: 1,
				itemCount: 1,
				items: [
					{
						documentId: '123',
						version: 1,
						sourceSystem: 'ABC',
						documentGuid: '456',
						fileName: 'document.pdf',
						originalFilename: 'original_document.pdf',
						datePublished: 1_646_822_400,
						privateBlobPath: '/documents/123.pdf',
						privateBlobContainer: 'my-blob-storage',
						author: 'John Smith',
						dateCreated: 1_646_822_400,
						publishedStatus: 'published',
						redactedStatus: 'not_redacted',
						size: 1024,
						mime: 'application/pdf',
						status: 'active',
						description: 'This is a sample document.',
						representative: 'Jane Doe',
						stage: 'draft',
						filter1: 'some filter value',
						filter2: 'some filter value',
						documentType: 'contract',
						caseRef: 'ABC-123',
						examinationRefNo: 'EXM-456'
					}
				]
			}
		],
		AppealToValidate: {
			AppealId: 1,
			AppealReference: 'APP/Q9999/D/21/1345264',
			AppellantName: 'Lee Thornton',
			AppealStatus: 'new',
			Received: '18 Mar 2022',
			AppealSite: {
				AddressLine1: '96 The Avenue',
				AddressLine2: '',
				Town: 'Maidstone',
				County: 'Kent',
				PostCode: 'MD21 5XY'
			},
			LocalPlanningDepartment: 'Maidstone Borough Council',
			PlanningApplicationReference: '48269/APP/2021/1482',
			Documents: [
				{
					Type: '',
					Filename: '',
					URL: ''
				}
			],
			reason: {
				inflammatoryComments: true,
				missingApplicationForm: true,
				missingDecisionNotice: true,
				missingGroundsForAppeal: true,
				missingSupportingDocuments: true,
				namesDoNotMatch: true,
				openedInError: true,
				otherReasons: 'Some other weird reason',
				sensitiveInfo: true,
				wrongAppealTypeUsed: true
			}
		},
		AppealDetailsAfterStatementUpload: {
			AppealId: 2,
			AppealReference: 'ABC',
			canUploadStatementsUntil: '08 March 2022'
		},
		AppealDetailsAfterFinalCommentUpload: {
			AppealId: 2,
			AppealReference: 'ABC',
			canUploadFinalCommentsUntil: '08 March 2022'
		},
		AppealsToValidate: [
			{
				AppealId: 1,
				AppealReference: 'APP/Q9999/D/21/1345264',
				AppealStatus: { '@enum': ['new', 'incomplete'] },
				Received: '18 Mar 2022',
				AppealSite: {
					AddressLine1: '96 The Avenue',
					AddressLine2: '',
					Town: 'Maidstone',
					County: 'Kent',
					PostCode: 'MD21 5XY'
				}
			}
		],
		ChangeAppeal: {
			$AppellantName: 'John Doe',
			$Address: {
				$AddressLine1: '',
				$AddressLine2: '',
				$Town: '',
				$County: '',
				$PostCode: ''
			},
			$LocalPlanningDepartment: '',
			$PlanningApplicationReference: ''
		},
		ValidationDecision: {
			$AppealStatus: { '@enum': ['invalid', 'incomplete', 'valid'] },
			$descriptionOfDevelopment: '',
			$Reason: {
				$namesDoNotMatch: true,
				$sensitiveInfo: true,
				$missingApplicationForm: true,
				$missingDecisionNotice: true,
				$missingGroundsForAppeal: true,
				$missingSupportingDocuments: true,
				$inflammatoryComments: true,
				$openedInError: true,
				$wrongAppealTypeUsed: true,
				$outOfTime: true,
				$noRightOfAppeal: true,
				$notAppealable: true,
				$lPADeemedInvalid: true,
				$otherReasons: ''
			}
		},
		AppealDetailsWhenUploadingStatementsAndFinalComments: {
			AppealId: 1,
			AppealReference: '',
			AppealSite: {
				AddressLine1: '',
				AddressLine2: '',
				Town: '',
				County: '',
				PostCode: ''
			},
			LocalPlanningDepartment: '',
			acceptingStatements: false,
			acceptingFinalComments: true
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
			allocationDetails: 'F / General Allocation',
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
			isParentAppeal: true,
			linkedAppeals: [
				{
					appealId: 1,
					appealReference: 'APP/Q9999/D/21/725284'
				}
			],
			localPlanningDepartment: 'Wiltshire Council',
			lpaQuestionnaireId: 1,
			otherAppeals: [
				{
					appealId: 1,
					appealReference: 'APP/Q9999/D/21/725284'
				}
			],
			planningApplicationReference: '48269/APP/2021/1482',
			procedureType: 'Written',
			siteVisit: {
				visitDate: '2022-03-31T12:00:00.000Z'
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
				appealStatement: 'appeal-statement.pdf',
				applicationForm: 'application-form.pdf',
				designAndAccessStatement: 'design-and-access-statement.pdf',
				decisionLetter: 'decision-letter.pdf',
				newPlansOrDrawings: ['new-plans-or-drawings-1.pdf', 'new-plans-or-drawings-2.pdf'],
				newSupportingDocuments: ['newsupporting-doc-1.pdf', 'newsupporting-doc-2.pdf'],
				planningObligation: 'planning-obligation.pdf',
				plansDrawingsSupportingDocuments: [
					'plans-drawings-supporting-documents-1.pdf',
					'plans-drawings-supporting-documents-2.pdf'
				],
				separateOwnershipCertificate: 'separate-ownership-certificate.pdf'
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
			statutoryConsulteesDetails: 'Some other people need to be consulted'
		},
		UpdateAppellantCaseRequest: {
			incompleteReasons: [1, 2, 3],
			invalidReasons: [1, 2, 3],
			validationOutcome: 'valid'
		},
		UpdateAppellantCaseResponse: {},
		AllAppellantCaseIncompleteReasonsResponse: [
			{
				id: 1,
				name: 'Other'
			}
		],
		AllAppellantCaseInvalidReasonsResponse: [
			{
				id: 1,
				name: 'Other'
			}
		],
		AppealsForCaseOfficer: {
			$AppealId: 1,
			$AppealReference: '',
			$QuestionnaireDueDate: '01 Jun 2022',
			$AppealSite: {
				$AddressLine1: '96 The Avenue',
				$AddressLine2: '',
				$Town: 'Maidstone',
				$County: 'Kent',
				$PostCode: 'MD21 5XY'
			},
			$QuestionnaireStatus: { '@enum': ['awaiting', 'received', 'overdue'] }
		},
		AppealForCaseOfficer: {
			$AppealId: 1,
			$AppealReference: '',
			$LocalPlanningDepartment: '',
			$PlanningApplicationReference: '',
			$AppealSiteNearConservationArea: false,
			$WouldDevelopmentAffectSettingOfListedBuilding: false,
			$ListedBuildingDesc: '',
			$AppealSite: {
				$AddressLine1: '96 The Avenue',
				$AddressLine2: '',
				$Town: 'Maidstone',
				$County: 'Kent',
				$PostCode: 'MD21 5XY'
			},
			$Documents: [
				{
					$Type: '',
					$Filename: '',
					$URL: ''
				}
			]
		},
		MoreAppealsForInspector: {
			$appealId: 1,
			$appealAge: 10,
			$address: {
				$addressLine1: '',
				$addressLine2: '',
				$town: '',
				$county: '',
				$postCode: ''
			},
			$appealType: 'HAS',
			specialist: 'General',
			$provisionalSiteVisitType: { '@enum': ['unaccompanied', 'access required'] }
		},
		documentsMetadataResponse: {
			id: 1,
			caseRef: '',
			documentGuid: '1111-2222-3333',
			horizonDataID: '',
			version: '',
			path: '',
			virusCheckStatus: '',
			fileMD5: '',
			mime: '',
			fileSize: 0,
			fileType: '',
			createdAt: '',
			lastModified: '',
			datePublished: '',
			documentType: '',
			securityClassification: '',
			sourceSystem: '',
			origin: '',
			owner: '',
			author: '',
			representative: '',
			description: '',
			stage: 1
		},
		AppealsForInspector: {
			$appealId: 1,
			$appealAge: 10,
			$appealSite: {
				$addressLine1: '',
				$addressLine2: '',
				$town: '',
				$county: '',
				$postCode: ''
			},
			$appealType: 'HAS',
			$reference: '',
			$status: { '@enum': ['not yet booked', 'booked', 'decision due'] },
			$siteVisitType: { '@enum': ['accompanied', 'unaccompanied', 'access required'] },
			$provisionalSiteVisitType: { '@enum': ['unaccompanied', 'access required'] }
		},
		AppealDetailsForInspector: {
			appealId: 1,
			status: { '@enum': ['not yet booked', 'booked', 'decision due'] },
			reference: 'APP/2021/56789/4909983',
			availableForSiteVisitBooking: true,
			provisionalSiteVisitType: { '@enum': ['unaccompanied', 'access required'] },
			appellantName: 'Maria Sharma',
			email: 'maria.sharma@gmail.com',
			expectedSiteVisitBookingAvailableFrom: '19 June 2022',
			descriptionOfDevelopment: 'some description of development',
			appealReceivedDate: '12 December 2020',
			extraConditions: false,
			affectsListedBuilding: false,
			inGreenBelt: false,
			inOrNearConservationArea: false,
			emergingDevelopmentPlanOrNeighbourhoodPlan: false,
			emergingDevelopmentPlanOrNeighbourhoodPlanDescription: 'plans',
			appealAge: 12,
			localPlanningDepartment: 'some other department',
			bookedSiteVisit: {
				visitDate: '12 December 2022',
				visitSlot: '1pm - 2pm',
				visitType: { '@enum': ['accompanied', 'unaccompanied', 'access required'] }
			},
			address: {
				addressLine1: '66 Grove Road',
				postCode: 'BS16 2BP',
				town: 'Fishponds'
			},
			lpaAnswers: {
				canBeSeenFromPublic: true,
				canBeSeenFromPublicDescription: 'not visible from public land',
				inspectorNeedsToEnterSite: false,
				inspectorNeedsToEnterSiteDescription: 'inspector will want to enter site',
				inspectorNeedsAccessToNeighboursLand: false,
				inspectorNeedsAccessToNeighboursLandDescription: 'should be able to see ok',
				healthAndSafetyIssues: false,
				healthAndSafetyIssuesDescription: 'not really',
				appealsInImmediateArea: 'abcd, ABC/DEF/GHI'
			},
			appellantAnswers: {
				canBeSeenFromPublic: true,
				canBeSeenFromPublicDescription: 'site visit description',
				appellantOwnsWholeSite: true,
				appellantOwnsWholeSiteDescription: 'i own the whole site',
				healthAndSafetyIssues: false,
				healthAndSafetyIssuesDescription: 'everything is super safe'
			}
		},
		AppealsAssignedToInspector: {
			$successfullyAssigned: [
				{
					$appealId: 1,
					$reference: 'APP/Q9999/D/21/1345264',
					$appealType: 'HAS',
					$specialist: 'General',
					$provisionalVisitType: { '@enum': ['unaccompanied', 'access required'] },
					$appealSite: {
						$addressLine1: '96 The Avenue',
						$county: 'Kent',
						$town: 'Maidstone',
						$postCode: 'MD21 5XY'
					},
					$appealAge: 41
				}
			],
			$unsuccessfullyAssigned: [
				{
					$appealId: 4,
					$reference: 'APP/Q9999/D/21/1345264',
					$appealType: 'HAS',
					$specialist: 'General',
					$provisionalVisitType: { '@enum': ['unaccompanied', 'access required'] },
					$appealSite: {
						$addressLine1: '96 The Avenue',
						$county: 'Kent',
						$town: 'Maidstone',
						$postCode: 'MD21 5XY'
					},
					$appealAge: 41,
					$reason: { '@enum': ['appeal in wrong state', 'appeal already assigned'] }
				}
			]
		},
		UpdateAppealDetailsByCaseOfficer: {
			$listedBuildingDescription: ''
		},
		AppealAfterUpdateForCaseOfficer: {
			$appealStatus: [
				{
					$id: 2,
					$status: 'incomplete_lpa_questionnaire',
					$valid: true
				}
			],
			$createdAt: '2022-01-01T00:00:00.000Z',
			$id: 1,
			$localPlanningDepartment: 'Local planning dept',
			$lpaQuestionnaire: {
				$listedBuildingDescription: '*'
			},
			$planningApplicationReference: '0181/811/8181',
			$reference: 'APP/Q9999/D/21/323259',
			$updatedAt: '2022-01-01T00:00:00.000Z',
			$userId: 100
		},
		SendLPAQuestionnaireConfirmation: {
			reason: {
				applicationPlansToReachDecisionMissingOrIncorrect: true,
				applicationPlansToReachDecisionMissingOrIncorrectDescription: '',
				policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: true,
				policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription: '',
				policiesOtherRelevanPoliciesMissingOrIncorrect: true,
				policiesOtherRelevanPoliciesMissingOrIncorrectDescription: '',
				policiesSupplementaryPlanningDocumentsMissingOrIncorrect: true,
				policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription: '',
				siteConservationAreaMapAndGuidanceMissingOrIncorrect: true,
				siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription: '',
				siteListedBuildingDescriptionMissingOrIncorrect: true,
				siteListedBuildingDescriptionMissingOrIncorrectDescription: '',
				thirdPartyApplicationNotificationMissingOrIncorrect: true,
				thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses: false,
				thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: false,
				thirdPartyRepresentationsMissingOrIncorrect: true,
				thirdPartyRepresentationsMissingOrIncorrectDescription: '',
				thirdPartyAppealNotificationMissingOrIncorrect: true,
				thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses: false,
				thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: false
			}
		},
		BookSiteVisit: {
			$siteVisitType: {
				required: true,
				'@enum': /** @type {import('@pins/applications.api').Schema.SiteVisitType} */ ([
					'accompanied',
					'unaccompanied',
					'access required'
				])
			},
			$siteVisitDate: {
				required: true,
				type: 'string',
				format: 'date',
				example: '2022-01-01'
			},
			$siteVisitTimeSlot: {
				required: true,
				'@enum': [
					'8am to 10am',
					'9am to 11am',
					'10am to midday',
					'11am to 1pm',
					'midday to 2pm',
					'1pm to 3pm',
					'2pm to 4pm',
					'3pm to 5pm',
					'4pm to 6pm',
					'5pm to 7pm'
				]
			}
		},
		IssueDecision: {
			$decisionLetter: {
				type: 'file',
				required: true
			},
			$outcome: {
				required: true,
				'@enum':
					/** @type {import('@pins/applications.api').Schema.InspectorDecisionOutcomeType} */ ([
						'allowed',
						'dismissed',
						'split decision'
					])
			}
		},
		UploadStatement: {
			$statement: {
				type: 'file',
				required: true
			}
		},
		UploadFinalComment: {
			$finalcomment: {
				type: 'file',
				required: true
			}
		}
	},
	'@definitions': {
		ApplicationProjectUpdate: {
			allOf: [
				{ $ref: '#/definitions/ApplicationProjectUpdateCreateRequest' },
				{
					type: 'object',
					requiredProperties: ['id', 'caseId', 'dateCreated', 'sentToSubscribers'],
					properties: {
						id: { type: 'integer', minimum: 0 },
						caseId: { type: 'integer', minimum: 0 },
						dateCreated: {
							type: 'string',
							format: 'date-time',
							description: 'The date this update was created',
							example: '2022-12-21T12:42:40.885Z'
						},
						sentToSubscribers: {
							type: 'boolean',
							description: 'Has this update been emailed to subscribers?'
						},
						datePublished: {
							type: 'string',
							format: 'date-time',
							description: "The date this update's status was set to published",
							example: '2022-12-21T12:42:40.885Z'
						},
						type: {
							type: 'string',
							enum: ['general', 'applicationSubmitted', 'applicationDecided', 'registrationOpen'],
							description:
								'the type of update - which determines which subscribers will recieve the notification emails'
						}
					}
				}
			]
		},
		ApplicationProjectUpdateCreateRequest: {
			type: 'object',
			requiredProperties: ['emailSubscribers', 'status', 'htmlContent'],
			properties: {
				authorId: {
					type: 'integer',
					description: 'The back-office ID of the user who created this updated'
				},
				emailSubscribers: {
					type: 'boolean',
					description: 'Will this update be emailed to subscribers?'
				},
				status: {
					type: 'string',
					enum: ['draft', 'published', 'unpublished', 'archived'],
					description: 'The current status of this update'
				},
				title: {
					type: 'string',
					description: 'The internal title of this update'
				},
				htmlContent: {
					type: 'string',
					description:
						'The HTML content of this update, it can only include `<p> <a> <strong> <ul> <li> <br>` tags',
					example: '<strong>Important Update</strong> Something happened.'
				},
				htmlContentWelsh: {
					type: 'string',
					description:
						'The HTML content of this update in Welsh, it can only include `<p> <a> <strong> <ul> <li> <br>` tags',
					example: '<strong>Diweddariad Pwysig</strong> Digwyddodd rhywbeth.'
				}
			}
		},
		// similar to create, but no required properties
		ApplicationProjectUpdateUpdateRequest: {
			type: 'object',
			properties: {
				emailSubscribers: {
					type: 'boolean',
					description: 'Will this update be emailed to subscribers?'
				},
				status: {
					type: 'string',
					enum: ['draft', 'published', 'unpublished', 'archived'],
					description: 'The current status of this update'
				},
				title: {
					type: 'string',
					description: 'The internal title of this update'
				},
				htmlContent: {
					type: 'string',
					description:
						'The HTML content of this update, it can only include `<p> <a> <strong> <ul> <li> <br>` tags',
					example: '<strong>Important Update</strong> Something happened.'
				},
				htmlContentWelsh: {
					type: 'string',
					description:
						'The HTML content of this update in Welsh, it can only include `<p> <a> <strong> <ul> <li> <br>` tags',
					example: '<strong>Diweddariad Pwysig</strong> Digwyddodd rhywbeth.'
				},
				type: {
					type: 'string',
					enum: ['general', 'applicationSubmitted', 'applicationDecided', 'registrationOpen'],
					description:
						'the type of update - which determines which subscribers will recieve the notification emails'
				},
				sentToSubscribers: {
					type: 'boolean',
					description: 'Has this update been emailed to subscribers?'
				}
			}
		},
		ApplicationProjectUpdateCreateBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						emailSubscribers: {
							type: 'string',
							example: 'emailSubscribers is required'
						},
						status: {
							type: 'string',
							example: 'status is required'
						},
						htmlContent: {
							type: 'string',
							example: 'htmlContent is required'
						},
						title: {
							type: 'string',
							example: 'title must be a string'
						},
						htmlContentWelsh: {
							type: 'string',
							example: 'title must be a string'
						},
						type: {
							type: 'string',
							example: 'type must be a string'
						},
						sentToSubscribers: {
							type: 'string',
							example: 'sentToSubscribers must be a boolean'
						}
					}
				}
			}
		},
		ApplicationProjectUpdatesListBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						status: {
							type: 'string',
							example: 'status must be one of ...'
						},
						sentToSubscribers: {
							type: 'string',
							example: 'sentToSubscribers must be a boolean'
						},
						publishedBefore: {
							type: 'string',
							example: 'publishedBefore must be a valid date'
						},
						...paginationErrors
					}
				}
			}
		},
		ApplicationProjectUpdates: {
			type: 'object',
			properties: pagedResponseProperties('#/definitions/ApplicationProjectUpdate')
		},
		S51AdviceCreateRequestBody: {
			type: 'object',
			properties: {
				caseId: { type: 'integer', description: 'The application id', example: 1 },
				title: {
					type: 'string',
					description: 'Advice title',
					example: 'Advice regarding right to roam'
				},
				enquirer: {
					type: 'string',
					description: 'Name of enquiring company / organisation ',
					example: 'New Power Plc'
				},
				firstName: { type: 'string', description: 'First name of enquirer', example: 'John' },
				lastName: { type: 'string', description: 'Last name of enquirer', example: 'Keats' },
				enquiryMethod: {
					type: 'string',
					enum: ['phone', 'email', 'meeting', 'post'],
					description: 'Enquiry method',
					example: 'email'
				},
				enquiryDate: {
					type: 'string',
					description: 'Date of enquiry yyyy-mm-dd',
					example: '2023-03-01'
				},
				enquiryDetails: {
					type: 'string',
					description: 'Details of the enquiry',
					example: 'details of the advice sought'
				},
				adviser: {
					type: 'string',
					description: 'Name of who gave the advice',
					example: 'John Caseworker-Smith'
				},
				adviceDate: {
					type: 'string',
					description: 'Date advice given yyyy-mm-dd',
					example: '2023-03-01'
				},
				adviceDetails: {
					type: 'string',
					description: 'Details of the advive given',
					example: 'details of the advice provided'
				}
			}
		},
		S51AdviceCreateResponseBody: {
			type: 'object',
			properties: {
				id: { type: 'integer', description: 'The S51 Advice record id', example: 1 },
				caseId: { type: 'integer', description: 'The application id', example: 1 },
				title: {
					type: 'string',
					description: 'Advice title',
					example: 'Advice regarding right to roam'
				},
				firstName: { type: 'string', description: 'First name of enquirer', example: 'John' },
				lastName: { type: 'string', description: 'Last name of enquirer', example: 'Keats' },
				enquirer: {
					type: 'string',
					description: 'Name of enquiring company / organisation',
					example: 'New Power Plc'
				},
				enquiryMethod: {
					type: 'string',
					enum: ['phone', 'email', 'meeting', 'post'],
					description: 'Enquiry method',
					example: 'email'
				},
				enquiryDate: {
					type: 'date-time',
					description: 'Date of enquiry',
					example: '2023-02-01T00:00:00.000Z'
				},
				enquiryDetails: {
					type: 'string',
					description: 'Details of the enquiry',
					example: 'details of the advice sought'
				},
				adviser: {
					type: 'string',
					description: 'Name of who gave the advice',
					example: 'John Caseworker-Smith'
				},
				adviceDate: {
					type: 'date-time',
					description: 'Date advice given',
					example: '2023-02-01T00:00:00.000Z'
				},
				adviceDetails: {
					type: 'string',
					description: 'Details of the advive given',
					example: 'details of the advice provided'
				},
				referenceNumber: {
					type: 'integer',
					description: 'Advice reference number',
					example: '1'
				},
				redactedStatus: {
					type: 'string',
					enum: ['not_redacted', 'redacted'],
					description: 'Redacted status',
					example: 'not_redacted'
				},
				publishedStatus: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'Published status',
					example: 'published'
				},
				createdAt: {
					type: 'date-time',
					description: 'Date advice record was created',
					example: '2023-02-01T00:00:00.000Z'
				},
				updatedAt: {
					type: 'date-time',
					description: 'Date advice record was last updated',
					example: '2023-02-01T00:00:00.000Z'
				}
			}
		},
		S51AdviceDetails: {
			type: 'object',
			properties: {
				id: { type: 'integer', description: 'The S51 Advice record id', example: 1 },
				referenceNumber: {
					type: 'string',
					description: 'Advice reference 5 digits number',
					example: '00001'
				},
				referenceCode: {
					type: 'string',
					description: 'Advice reference number containing Case ref number',
					example: 'EN010001-Advice-00001'
				},
				title: {
					type: 'string',
					description: 'Advice title',
					example: 'Advice regarding right to roam'
				},
				enquirer: {
					type: 'string',
					description: 'Name of enquiring company / organisation',
					example: 'New Power Plc'
				},
				firstName: { type: 'string', description: 'First name of enquirer', example: 'John' },
				lastName: { type: 'string', description: 'Last name of enquirer', example: 'Keats' },
				enquiryMethod: {
					type: 'string',
					enum: ['phone', 'email', 'meeting', 'post'],
					description: 'Enquiry method',
					example: 'email'
				},
				enquiryDate: { type: 'number', description: 'Date of enquiry', example: 1_646_822_400 },
				enquiryDetails: {
					type: 'string',
					description: 'Details of the enquiry',
					example: 'details of the advice sought'
				},
				adviser: {
					type: 'string',
					description: 'Name of who gave the advice',
					example: 'John Caseworker-Smith'
				},
				adviceDate: { type: 'number', description: 'Date advice given', example: 1_646_822_400 },
				adviceDetails: {
					type: 'string',
					description: 'Details of the advive given',
					example: 'details of the advice provided'
				},
				redactedStatus: {
					type: 'string',
					enum: ['not_redacted', 'redacted'],
					description: 'Redacted status',
					example: 'not_redacted'
				},
				publishedStatus: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'Published status',
					example: 'published'
				},
				dateCreated: {
					type: 'number',
					description: 'Date advice record was created',
					example: 1_646_822_400
				},
				dateUpdated: {
					type: 'number',
					description: 'Date advice record was last updated',
					example: 1_646_822_400
				}
			}
		},
		S51AdvicePaginatedResponse: {
			type: 'object',
			properties: {
				page: {
					type: 'integer',
					description: 'The page number required',
					example: 1
				},
				pageDefaultSize: {
					type: 'integer',
					description: 'The default number of S51 Advice per page',
					example: 50
				},
				pageCount: {
					type: 'integer',
					description: 'The total number of pages',
					example: 1
				},
				itemCount: {
					type: 'integer',
					description: 'The total number of s51 Advice records on the case',
					example: 1
				},
				items: {
					type: 'array',
					items: { $ref: '#/definitions/S51AdviceDetails' }
				}
			}
		},
		S51AdvicePaginatedBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						pageNumber: {
							type: 'string',
							example: 'Page Number is not valid'
						},
						pageSize: {
							type: 'string',
							example: 'Page Size is not valid'
						},
						unknown: {
							type: 'string'
						}
					}
				}
			}
		},
		S51AdviceUpdateRequestBody: {
			title: 'title',
			firstName: 'first name',
			lastName: 'last name',
			enquirer: 'organisation',
			enquiryMethod: 'meeting',
			enquiryDate: '2023-01-11T00:00:00.000Z',
			enquiryDetails: 'title',
			adviser: 'person',
			adviceDate: '2023-02-11T00:00:00.000Z',
			adviceDetails: 'title',
			redactedStatus: 'redacted',
			publishedStatus: 'not_checked'
		},
		S51AdviceMultipleUpdateRequestBody: {
			type: 'object',
			properties: {
				redacted: {
					type: 'boolean',
					description: 'Redacted status',
					example: true
				},
				status: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'Published status',
					example: 'published'
				},
				items: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id: { type: 'integer', description: 'The S51 Advice record id', example: 1 }
						}
					}
				}
			}
		},
		S51AdviceUpdateResponseItem: {
			type: 'object',
			properties: {
				id: {
					type: 'integer',
					description: 'The S51 Advice record id',
					example: 1
				},
				status: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'Published status',
					example: 'published'
				},
				redactedStatus: {
					type: 'string',
					enum: ['not_redacted', 'redacted'],
					description: 'Redacted status',
					example: 'not_redacted'
				}
			}
		},
		S51AdviceMultipleUpdateResponseBody: {
			type: 'array',
			items: { $ref: '#/definitions/S51AdviceUpdateResponseItem' }
		},
		S51AdviceUpdateBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						items: {
							type: 'string',
							example: 'Unknown S51 Advice id 100'
						},
						unknown: {
							type: 'string'
						}
					}
				}
			}
		},
		ProjectUpdateNotificationLogList: {
			type: 'object',
			properties: pagedResponseProperties('#/definitions/ProjectUpdateNotificationLog')
		},
		ProjectUpdateNotificationLogListBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: paginationErrors
				}
			}
		},
		ProjectUpdateNotificationLogCreateRequest: {
			type: 'array',
			items: { $ref: '#/definitions/ProjectUpdateNotificationLog' }
		},
		ProjectUpdateNotificationLogCreateBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						'[*].projectUpdateId': {
							type: 'string',
							example: 'projectUpdateId is required'
						},
						'[*].subscriptionId': {
							type: 'string',
							example: 'subscriptionId is required'
						},
						'[*].entryDate': {
							type: 'string',
							example: 'entryDate is required'
						},
						'[*].emailSent': {
							type: 'string',
							example: 'emailSent must be a boolean'
						},
						'[*].functionInvocationId': {
							type: 'string',
							example: 'functionInvocationId must be a string'
						}
					}
				}
			}
		},
		ProjectUpdateNotificationLog: {
			type: 'object',
			requiredProperties: [
				'projectUpdateId',
				'subscriptionId',
				'entryDate',
				'emailSent',
				'functionInvocationId'
			],
			properties: {
				id: { type: 'integer', minimum: 0 },
				projectUpdateId: { type: 'integer', minimum: 0 },
				subscriptionId: { type: 'integer', minimum: 0 },
				entryDate: {
					type: 'string',
					format: 'date-time',
					description: 'the date this notification was handled',
					example: '2022-12-21T12:42:40.885Z'
				},
				emailSent: {
					type: 'boolean',
					description: 'whether an email was successfully sent'
				},
				functionInvocationId: {
					type: 'string',
					description: 'the ID of the Azure function run that handled this entry'
				}
			}
		},
		RepresentationSummary: {
			type: 'object',
			properties: {
				id: {
					type: 'number',
					example: 1
				},
				reference: {
					type: 'string',
					example: 'BC0110001-2'
				},
				status: {
					type: 'string',
					example: 'VALID'
				},
				redacted: {
					type: 'boolean',
					example: true
				},
				received: {
					type: 'string',
					example: '2023-03-14T14:28:25.704Z'
				},
				firstName: {
					type: 'string',
					example: 'James'
				},
				lastName: {
					type: 'string',
					example: 'Bond'
				},
				organisationName: {
					type: 'string',
					example: 'MI6'
				}
			}
		},
		Subscriptions: {
			type: 'object',
			properties: pagedResponseProperties('#/definitions/Subscription')
		},
		SubscriptionsListBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						type: {
							type: 'string',
							example: 'type must be one of ...'
						},
						caseReference: {
							type: 'string',
							example: 'must be a string'
						},
						...paginationErrors
					}
				}
			}
		},
		SubscriptionGetBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						caseReference: {
							type: 'string',
							example: 'caseReference is required'
						},
						emailAddress: {
							type: 'string',
							example: 'emailAddress is required'
						},
						unknown: {
							type: 'string'
						}
					}
				}
			}
		},
		SubscriptionCreateRequest: {
			type: 'object',
			required: ['caseReference', 'emailAddress', 'subscriptionType'],
			properties: {
				caseReference: {
					type: 'string',
					description: 'the case reference the subscription relates to'
				},
				emailAddress: {
					type: 'string',
					format: 'email',
					examples: ['alan.turing@planninginspectorate.gov.uk']
				},
				subscriptionTypes: {
					type: 'array',
					items: {
						type: 'string',
						enum: ['allUpdates', 'applicationSubmitted', 'applicationDecided', 'registrationOpen']
					},
					description: 'which updates does the subscriber wants to get notified of'
				},
				startDate: {
					type: 'string',
					format: 'date-time',
					description: 'The date to start getting updates'
				},
				endDate: {
					type: 'string',
					format: 'date-time',
					description: 'The date to stop getting updates'
				},
				language: {
					type: 'string',
					enum: ['English', 'Welsh'],
					default: 'English'
				}
			}
		},
		SubscriptionCreateBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						caseReference: {
							type: 'string',
							example: 'caseReference is required'
						},
						emailAddress: {
							type: 'string',
							example: 'emailAddress is required'
						},
						subscriptionTypes: {
							type: 'string',
							example: 'subscriptionTypes is required'
						},
						startDate: {
							type: 'string',
							example: 'startDate must be a valid date'
						},
						endDate: {
							type: 'string',
							example: 'endDate must be a valid date'
						},
						language: {
							type: 'string',
							example: "language must be one of 'English', 'Welsh'"
						},
						code: {
							type: 'string',
							example: 'P2002',
							description: 'prisma error code'
						},
						constraint: {
							type: 'string',
							example: 'caseReference and emailAddress combination must be unique'
						},
						unknown: {
							type: 'string'
						}
					}
				}
			}
		},
		SubscriptionUpdateRequest: {
			type: 'object',
			required: ['endDate'],
			properties: {
				endDate: {
					type: 'string',
					format: 'date-time',
					description: 'The date to stop getting updates'
				}
			}
		},
		SubscriptionUpdateBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						endDate: {
							type: 'string',
							example: 'endDate must be a valid date'
						},
						id: {
							type: 'string',
							example: "id must be a valid integer'"
						},
						code: {
							type: 'string',
							example: 'P2002',
							description: 'prisma error code'
						},
						notFound: {
							type: 'string',
							example: 'subscription not found'
						},
						unknown: {
							type: 'string'
						}
					}
				}
			}
		},
		SubscriptionNotFound: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						notFound: {
							type: 'string',
							example: 'subscription not found'
						}
					}
				}
			}
		},
		Subscription: {
			type: 'object',
			required: ['caseReference', 'emailAddress', 'subscriptionType'],
			properties: {
				id: {
					type: 'number',
					description: 'back office ID for this subscription'
				},
				caseReference: {
					type: 'string',
					description: 'the case reference the subscription relates to'
				},
				emailAddress: {
					type: 'string',
					format: 'email',
					examples: ['alan.turing@planninginspectorate.gov.uk']
				},
				subscriptionTypes: {
					type: 'array',
					items: {
						type: 'string',
						enum: ['allUpdates', 'applicationSubmitted', 'applicationDecided', 'registrationOpen']
					},
					description: 'which updates does the subscriber wants to get notified of'
				},
				startDate: {
					type: 'string',
					format: 'date-time',
					description: 'The date to start getting updates'
				},
				endDate: {
					type: 'string',
					format: 'date-time',
					description: 'The date to stop getting updates'
				},
				language: {
					type: 'string',
					enum: ['English', 'Welsh'],
					default: 'English'
				}
			}
		},
		GeneralError: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						message: {
							type: 'string',
							example: 'something went wrong'
						}
					}
				}
			}
		},
		InternalError: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						unknown: {
							type: 'string',
							example: 'unknown internal error'
						}
					}
				}
			}
		},
		NotFound: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						notFound: {
							type: 'string',
							example: 'resource not found'
						}
					}
				}
			}
		},
		ApplicationKeyDates: {
			type: 'object',
			properties: {
				preApplication: {
					type: 'object',
					properties: {
						datePINSFirstNotifiedOfProject: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						dateProjectAppearsOnWebsite: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						anticipatedSubmissionDateNonSpecific: {
							type: 'string',
							description: 'Quarter followed by year',
							example: 'Q1 2023'
						},
						anticipatedDateOfSubmission: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						screeningOpinionSought: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						screeningOpinionIssued: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						scopingOpinionSought: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						scopingOpinionIssued: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						section46Notification: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						}
					}
				},
				acceptance: {
					type: 'object',
					properties: {
						dateOfDCOSubmission: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						deadlineForAcceptanceDecision: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						dateOfDCOAcceptance: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						dateOfNonAcceptance: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						}
					}
				},
				preExamination: {
					type: 'object',
					properties: {
						dateOfRepresentationPeriodOpen: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						dateOfRelevantRepresentationClose: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						extensionToDateRelevantRepresentationsClose: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						dateRRepAppearOnWebsite: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						dateIAPIDue: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						rule6LetterPublishDate: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						preliminaryMeetingStartDate: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						notificationDateForPMAndEventsDirectlyFollowingPM: {
							type: 'number',
							example: 1_646_822_600
						},
						notificationDateForEventsDeveloper: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						}
					}
				},
				examination: {
					type: 'object',
					properties: {
						dateSection58NoticeReceived: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						confirmedStartOfExamination: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						rule8LetterPublishDate: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						deadlineForCloseOfExamination: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						dateTimeExaminationEnds: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						stage4ExtensionToExamCloseDate: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						}
					}
				},
				recommendation: {
					type: 'object',
					properties: {
						deadlineForSubmissionOfRecommendation: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						dateOfRecommendations: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						stage5ExtensionToRecommendationDeadline: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						}
					}
				},
				decision: {
					type: 'object',
					properties: {
						deadlineForDecision: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						confirmedDateOfDecision: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						stage5ExtensionToDecisionDeadline: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						}
					}
				},
				postDecision: {
					type: 'object',
					properties: {
						jRPeriodEndDate: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						}
					}
				},
				withdrawal: {
					type: 'object',
					properties: {
						dateProjectWithdrawn: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						}
					}
				}
			}
		}
	},
	components: {}
};

const outputFile = './src/server/swagger-output.json';
const endpointsFiles = [
	'./src/server/appeals/**/*.routes.js',
	'./src/server/applications/**/*.routes.js'
];

swaggerAutogen()(outputFile, endpointsFiles, document);
