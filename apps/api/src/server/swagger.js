import swaggerAutogen from 'swagger-autogen';

const document_ = {
	info: {
		version: '2.0',      // by default: '1.0.0'
		title: 'My PINS Project',        // by default: 'REST API'
		description: 'My PINS Project AOI documentation from Swagger',  // by default: ''
	},
	host: 'localhost:3000',      // by default: 'localhost:3000'
	basePath: '',  // by default: '/'
	schemes: [],   // by default: ['http']
	consumes: [],  // by default: ['application/json']
	produces: [],  // by default: ['application/json']
	tags: [        // by default: empty Array
		{
			name: '',         // Tag name
			description: '',  // Tag description
		},
		// { ... }
	],
	securityDefinitions: {},  // by default: empty object (Swagger 2.0)
	definitions: {
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
			Documents: [{
				Type: '',
				Filename: '',
				URL: ''
			}],
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
				wrongAppealTypeUsed: true,
			}
		},
		AppealsToValidate: [{
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
		}],
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
				$missingGroundsForAppeal:true,
				$missingSupportingDocuments: true,
				$inflammatoryComments: true,
				$openedInError: true,
				$wrongAppealTypeUsed: true,
				$outOfTime: true,
				$noRightOfAppeal: true,
				$notAppealable: true,
				$lPADeemedInvalid: true,
				$otherReasons: '',
			}
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
			$Documents: [{
				$Type: '',
				$Filename: '',
				$URL: ''
			}]
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
		AppealsAssignedToInspector: {
			$successfullyAssigned: [{
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
			}],
			$unsuccessfullyAssigned: [{
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
			}]
		},
		BookSiteVisit: {
			$SiteVisitType: {
				required: true,
				'@enum': /** @type {import('@pins/inspector').SiteVisitType} */ ([
					'accompanied',
					'unaccompanied',
					'access required'
				])
			},
			$SiteVisitDate: {
				required: true,
				type: 'string',
				format: 'date',
				example: '2022-01-01'
			},
			$SiteVisitTimeSlot: {
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
	},
	components: {}
};

const outputFile = './src/server/swagger-output.json';
const endpointsFiles = ['./src/server/app.js'];

swaggerAutogen()(outputFile, endpointsFiles, document_);
