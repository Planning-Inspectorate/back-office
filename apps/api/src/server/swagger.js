import swaggerAutogen from 'swagger-autogen';

const document = {
	info: {
		// by default: '1.0.0'
		version: '2.0',
		// by default: 'REST API'
		title: 'My PINS Project',
		// by default: ''
		description: 'My PINS Project AOI documentation from Swagger'
	},
	// by default: 'localhost:3000'
	host: 'localhost:3000',
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
		Sectors: [
			{
				abbreviation: 'BB',
				displayNameCy: 'Sector Name Cy',
				displayNameEn: 'Sector Name En',
				name: 'sector'
			}
		],
		ApplicationsForCaseOfficer: [
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
				}
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
				}
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
				}
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
				'@enum': /** @type {import('@pins/api').Schema.SiteVisitType} */ ([
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
				'@enum': /** @type {import('@pins/api').Schema.InspectorDecisionOutcomeType} */ ([
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
	components: {}
};

const outputFile = './src/server/swagger-output.json';
const endpointsFiles = [
	'./src/server/appeals/**/*.routes.js',
	'./src/server/applications/**/*.routes.js'
];

swaggerAutogen()(outputFile, endpointsFiles, document);
