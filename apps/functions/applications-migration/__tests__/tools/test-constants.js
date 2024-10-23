export const TEST_CONSTANTS_GENERIC = {
	caseId: 12345678,
	caseReference: 'BC010001',
	dates: {
		date1: '2020-02-01 00:00:00.0000000',
		date2: '2020-02-02 00:00:00.0000000',
		date3: '2020-02-03 00:00:00.0000000',
		date4: '2020-02-04 00:00:00.0000000'
	},
	emailAddress: 'test@planninginspectorate.gov.uk',
	publishStatus: {
		published: 'published'
	},
	sourceSystem: 'horizon'
};

export const TEST_CONSTANTS_PROJECT_ENTITY = {
	easting: 123456,
	mapZoomLevel: 'region',
	migrationStatus: {
		TRUE: true,
		FALSE: false
	},
	northing: 123456,
	projectDescriptionEnglish: 'This is a test description',
	projectDescriptionWelsh: 'Disgrifiad prawf yw hwn',
	projectLocation: 'Test Location',
	projectNameEnglish: 'Test Project Name',
	projectNameWelsh: 'Enw Prosiect Prawf',
	projectType: 'BC01 - Office Use',
	regions: JSON.stringify(['london']),
	sector: 'BC - Business and Commercial',
	serviceUserId: '12345678',
	stage: {
		preExamination: 'pre_examination'
	},
	welshLanguage: {
		TRUE: true,
		FALSE: false
	}
};
