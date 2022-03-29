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
			AppealSite: '96 The Avenue, Maidstone, Kent, MD21 5XY',
			LocalPlanningDepartment: 'Maidstone Borough Council',
			PlanningApplicationReference: '48269/APP/2021/1482',
			Documents: []
		},
		AppealsToValidate: [{
			AppealId: 1,
			AppealReference: 'APP/Q9999/D/21/1345264',
			AppealStatus: { '@enum': ['new', 'incomplete'] },
			Received: '18 Mar 2022',
			AppealSite: '96 The Avenue, Maidstone, Kent, MD21 5XY'
		}],
		ChangeAppeal: {
			$AppellandName: 'John Doe',
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
				$inflamatoryComments: true,
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
			$AppealSite: '',
			$QuestionnaireStatus: { '@enum': ['awaiting', 'received', 'overdue'] }
		},
		AppealForCaseOfficer: {
			$AppealId: 1,
			$AppealReference: '',
			$LocalPlanningDepartment: '',
			$PlanningApplicationReference: '',
			$AppealSiteNearConservationArea: false,
			$WouldDevelopmentAffectSettingOfListedBuilding: false,
			$ListedBuildingDesc: ''
		}
	},
	components: {}
};

const outputFile = './src/server/swagger-output.json';
const endpointsFiles = ['./src/server/app.js'];

swaggerAutogen()(outputFile, endpointsFiles, document_);
