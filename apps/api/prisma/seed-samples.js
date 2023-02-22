/**
 * @typedef {import('../src/server/applications/application/application.js')} Sector
 * @typedef {import('../src/server/applications/application/application.js').Sector} SubSector
 * @typedef {import('apps/web/src/server/applications/applications.types').Region} Region
 * @typedef {import('apps/web/src/server/applications/applications.types').ZoomLevel} ZoomLevel
 * @typedef {import('apps/api/prisma/schema').CaseStatus} CaseStatus
 */

/**
 * An array of appellants, each containing a name and email address.
 *
 * @type {Array<{name: string, email: string}>}
 */
export const appellantsList = [
	{
		name: 'Lee Thornton',
		email: 'lee.thornton@gmail.com'
	},
	{
		name: 'Haley Eland',
		email: 'haley.eland@gmail.com'
	},
	{
		name: 'Roger Simmons',
		email: 'rg@gmail.com'
	},
	{
		name: 'Sophie Skinner',
		email: 'skinner@gmail.com'
	},
	{
		name: 'Ryan Marshall',
		email: 'marshall@gmail.com'
	},
	{
		name: 'Fiona Burgess',
		email: 'fi.bu@gmail.com'
	},
	{
		name: 'Kevin Fowler',
		email: 'kv@gmail.com'
	},
	{
		name: 'Bob Ross',
		email: 'bob@gmail.com'
	},
	{
		name: 'Eva Sharma',
		email: 'eva.sharma@gmail.com'
	},
	{
		name: 'Elaine Madsen',
		email: 'ellie@gmail.com'
	}
];

export const localPlanningDepartmentList = [
	'Maidstone Borough Council',
	'Barnsley Metropolitan Borough Council',
	'Worthing Borough Council',
	'Dorset Council',
	'Basingstoke and Deane Borough Council',
	'Wiltshire Council',
	'Waveney District Council',
	'Bristol City Council'
];

export const addressesList = [
	{
		addressLine1: '96 The Avenue',
		addressLine2: 'Maidstone',
		county: 'Kent',
		postcode: 'MD21 5XY'
	},
	{
		addressLine1: '55 Butcher Street',
		town: 'Thurnscoe',
		postcode: 'S63 0RB'
	},
	{
		addressLine1: '8 The Chase',
		town: 'Findon',
		postcode: 'BN14 0TT'
	},
	{
		addressLine1: '96 The Avenue',
		addressLine2: 'Maidstone',
		county: 'Kent',
		postcode: 'MD21 5XY'
	},
	{
		addressLine1: '44 Rivervale',
		town: 'Bridport',
		postcode: 'DT6 5RN'
	},
	{
		addressLine1: '92 Huntsmoor Road',
		town: 'Tadley',
		postcode: 'RG26 4BX'
	},
	{
		addressLine1: '1 Grove Cottage',
		addressLine2: 'Shotesham Road',
		town: 'Woodton',
		postcode: 'NR35 2ND'
	},
	{
		addressLine1: '19 Beauchamp Road',
		town: 'Bristol',
		postcode: 'BS7 8LQ'
	},
	{
		addressLine1: '92 Huntsmoor Road',
		county: 'Tadley',
		postcode: 'RG26 4BX'
	},
	{
		addressLine1: '72 Clapham High St',
		county: 'Wandsworth',
		postcode: 'SW4 7UL'
	},
	{
		addressLine1: '21 The Pavement',
		county: 'Wandsworth',
		postcode: 'SW4 0HY'
	},
	{
		addressLine1: 'Copthalls',
		addressLine2: 'Clevedon Road',
		town: 'West Hill',
		postcode: 'BS48 1PN'
	}
];

/**
 * An array of objects representing LPA questionnaire lists.
 *
 * @typedef {object[]} LPAQuestionnaireList
 * @property {boolean} affectsListedBuilding - Whether the proposed development affects a listed building.
 * @property {boolean} extraConditions - Whether there are any extra conditions attached to the planning permission.
 * @property {boolean} inGreenBelt - Whether the proposed development is in the green belt.
 * @property {boolean} inOrNearConservationArea - Whether the proposed development is in or near a conservation area.
 * @property {boolean} siteVisibleFromPublicLand - Whether the proposed development is visible from public land.
 * @property {string} siteVisibleFromPublicLandDescription - Description of the proposed development's visibility from public land.
 * @property {boolean} doesInspectorNeedToEnterSite - Whether the inspector needs to enter the site to view the proposed development.
 * @property {string} doesInspectorNeedToEnterSiteDescription - Description of why the inspector needs to enter the site to view the proposed development.
 * @property {boolean} doesInspectorNeedToAccessNeighboursLand - Whether the inspector needs to access the neighbour's land to view the proposed development.
 * @property {string} doesInspectorNeedToAccessNeighboursLandDescription - Description of why the inspector needs to access the neighbour's land to view the proposed development.
 * @property {boolean} healthAndSafetyIssues - Whether there are any health and safety issues associated with the proposed development.
 * @property {string} healthAndSafetyIssuesDescription - Description of the health and safety issues associated with the proposed development.
 * @property {string} appealsInImmediateAreaBeingConsidered - Appeals in the immediate area being considered.
 * @property {Date} sentAt - The date the questionnaire was sent.
 * @property {Date} receivedAt - The date the questionnaire was received.
 */
export const lpaQuestionnaireList = [
	{
		affectsListedBuilding: false,
		extraConditions: false,
		inGreenBelt: false,
		inOrNearConservationArea: false,
		siteVisibleFromPublicLand: false,
		siteVisibleFromPublicLandDescription:
			'The extension is to the read of the property, and the garden has high hedges',
		doesInspectorNeedToEnterSite: true,
		doesInspectorNeedToEnterSiteDescription:
			"The proposed development can only be viewed from the appellant's garden",
		doesInspectorNeedToAccessNeighboursLand: true,
		doesInspectorNeedToAccessNeighboursLandDescription: '54 Butcher Street',
		healthAndSafetyIssues: true,
		healthAndSafetyIssuesDescription: 'A defensive dog',
		appealsInImmediateAreaBeingConsidered: '893482, 372839',
		sentAt: new Date(2022, 3, 1),
		receivedAt: new Date(2022, 3, 20)
	},
	{
		affectsListedBuilding: false,
		extraConditions: false,
		inGreenBelt: false,
		inOrNearConservationArea: false,
		siteVisibleFromPublicLand: false,
		siteVisibleFromPublicLandDescription:
			'The extension is to the rear of the property, and the garden has high hedges',
		doesInspectorNeedToEnterSite: true,
		doesInspectorNeedToEnterSiteDescription:
			"The proposed development can only be viewed from the appellant's garden",
		doesInspectorNeedToAccessNeighboursLand: true,
		doesInspectorNeedToAccessNeighboursLandDescription: '72 Clapham High St',
		healthAndSafetyIssues: true,
		healthAndSafetyIssuesDescription: 'Unastable passage entrance',
		appealsInImmediateAreaBeingConsidered: '893482, 372839',
		sentAt: new Date(2022, 3, 2),
		receivedAt: new Date(2022, 3, 21)
	},
	{
		affectsListedBuilding: false,
		extraConditions: false,
		inGreenBelt: false,
		inOrNearConservationArea: false,
		siteVisibleFromPublicLand: false,
		siteVisibleFromPublicLandDescription:
			'The extension is to the read of the property, and the garden has high hedges',
		doesInspectorNeedToEnterSite: true,
		doesInspectorNeedToEnterSiteDescription:
			"The proposed development can only be viewed from the appellant's garden",
		doesInspectorNeedToAccessNeighboursLand: true,
		doesInspectorNeedToAccessNeighboursLandDescription: '21 The Pavement',
		healthAndSafetyIssues: false,
		appealsInImmediateAreaBeingConsidered: '893482, 372839',
		sentAt: new Date(2022, 3, 3),
		receivedAt: new Date(2022, 3, 22)
	},
	{
		affectsListedBuilding: false,
		extraConditions: false,
		inGreenBelt: false,
		inOrNearConservationArea: false,
		siteVisibleFromPublicLand: false,
		siteVisibleFromPublicLandDescription:
			'The extension is to the rear of the property, and the garden has high hedges.',
		doesInspectorNeedToEnterSite: true,
		doesInspectorNeedToEnterSiteDescription:
			"The proposed development can only be viewed from the appellant's garden",
		doesInspectorNeedToAccessNeighboursLand: true,
		doesInspectorNeedToAccessNeighboursLandDescription: '54 Butcher Street',
		healthAndSafetyIssues: true,
		healthAndSafetyIssuesDescription: 'A defensive dog',
		appealsInImmediateAreaBeingConsidered: '893482, 372839',
		sentAt: new Date(2022, 3, 1),
		receivedAt: new Date(2022, 3, 20)
	},
	{
		affectsListedBuilding: false,
		extraConditions: false,
		inGreenBelt: false,
		inOrNearConservationArea: false,
		siteVisibleFromPublicLand: false,
		siteVisibleFromPublicLandDescription:
			'The extension is to the read of the property, and the garden has high hedges',
		doesInspectorNeedToEnterSite: true,
		doesInspectorNeedToEnterSiteDescription:
			"The proposed development can only be viewed from the appellant's garden",
		doesInspectorNeedToAccessNeighboursLand: true,
		doesInspectorNeedToAccessNeighboursLandDescription: '54 Butcher Street',
		healthAndSafetyIssues: true,
		healthAndSafetyIssuesDescription: 'A defensive dog',
		appealsInImmediateAreaBeingConsidered: '893482, 372839',
		sentAt: new Date(2022, 3, 1),
		receivedAt: new Date(2022, 3, 20)
	}
];

/**
 * Sample incomplete review questionnaire data.
 *
 * @typedef {object} IncompleteReviewQuestionnaire
 * @property {Date} createdAt - The date when the questionnaire was created.
 * @property {boolean} complete - Indicates whether the questionnaire is complete or not.
 * @property {boolean} applicationPlanningOfficersReportMissingOrIncorrect - Indicates if the planning officer's report is missing or incorrect.
 * @property {boolean} applicationPlansToReachDecisionMissingOrIncorrect - Indicates if the plans to reach decision are missing or incorrect.
 * @property {string} applicationPlansToReachDecisionMissingOrIncorrectDescription - The description of the missing or incorrect plans to reach decision.
 * @property {boolean} policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect - Indicates if the statutory development plan policies are missing or incorrect.
 * @property {boolean} policiesOtherRelevantPoliciesMissingOrIncorrect - Indicates if other relevant policies are missing or incorrect.
 * @property {boolean} policiesSupplementaryPlanningDocumentsMissingOrIncorrect - Indicates if the supplementary planning documents are missing or incorrect.
 * @property {boolean} siteConservationAreaMapAndGuidanceMissingOrIncorrect - Indicates if the conservation area map and guidance are missing or incorrect.
 * @property {boolean} siteListedBuildingDescriptionMissingOrIncorrect - Indicates if the listed building description is missing or incorrect.
 * @property {boolean} thirdPartyApplicationNotificationMissingOrIncorrect - Indicates if the third party application notification is missing or incorrect.
 * @property {boolean} thirdPartyApplicationPublicityMissingOrIncorrect - Indicates if the third party application publicity is missing or incorrect.
 * @property {boolean} thirdPartyRepresentationsMissingOrIncorrect - Indicates if the third party representations are missing or incorrect.
 * @property {boolean} thirdPartyAppealNotificationMissingOrIncorrect - Indicates if the third party appeal notification is missing or incorrect.
 */

export const incompleteReviewQuestionnaireSample = {
	createdAt: new Date(2022, 3, 20),
	complete: false,
	applicationPlanningOfficersReportMissingOrIncorrect: false,
	applicationPlansToReachDecisionMissingOrIncorrect: true,
	applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Missing Documents XYZ',
	policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: false,
	policiesOtherRelevantPoliciesMissingOrIncorrect: false,
	policiesSupplementaryPlanningDocumentsMissingOrIncorrect: false,
	siteConservationAreaMapAndGuidanceMissingOrIncorrect: false,
	siteListedBuildingDescriptionMissingOrIncorrect: false,
	thirdPartyApplicationNotificationMissingOrIncorrect: false,
	thirdPartyApplicationPublicityMissingOrIncorrect: false,
	thirdPartyRepresentationsMissingOrIncorrect: false,
	thirdPartyAppealNotificationMissingOrIncorrect: false
};

/**
 * An array of objects representing appeal details provided by the appellant.
 *
 * @typedef {object[]} AppealDetailsFromAppellantList
 * @property {boolean} siteVisibleFromPublicLand - Indicates if the site is visible from public land.
 * @property {string} siteVisibleFromPublicLandDescription - Description of the site's visibility from public land.
 * @property {boolean} appellantOwnsWholeSite - Indicates if the appellant owns the whole site.
 * @property {string} appellantOwnsWholeSiteDescription - Description of the appellant's ownership of the whole site.
 * @property {boolean} healthAndSafetyIssues - Indicates if there are any health and safety issues with the site.
 * @property {string} healthAndSafetyIssuesDescription - Description of any health and safety issues with the site.
 */
export const appealDetailsFromAppellantList = [
	{
		siteVisibleFromPublicLand: true,
		siteVisibleFromPublicLandDescription: 'site visit description',
		appellantOwnsWholeSite: true,
		appellantOwnsWholeSiteDescription: 'i own the whole site',
		healthAndSafetyIssues: false,
		healthAndSafetyIssuesDescription: 'everything is super safe'
	},
	{
		siteVisibleFromPublicLand: true,
		siteVisibleFromPublicLandDescription: 'site visit description',
		appellantOwnsWholeSite: true,
		appellantOwnsWholeSiteDescription: 'i own the whole site',
		healthAndSafetyIssues: false,
		healthAndSafetyIssuesDescription: 'everything is super safe'
	}
];

/**
 * An object representing a sample of an incomplete validation decision.
 *
 * @typedef {object} IncompleteValidationDecisionSample
 * @property {string} decision - The decision status, which should be "incomplete".
 * @property {boolean} namesDoNotMatch - Indicates if the names do not match.
 * @property {boolean} sensitiveInfo - Indicates if there is sensitive information missing.
 * @property {boolean} missingApplicationForm - Indicates if the application form is missing.
 * @property {boolean} missingDecisionNotice - Indicates if the decision notice is missing.
 * @property {boolean} missingGroundsForAppeal - Indicates if the grounds for appeal are missing.
 * @property {boolean} missingSupportingDocuments - Indicates if the supporting documents are missing.
 * @property {boolean} inflammatoryComments - Indicates if there are any inflammatory comments.
 * @property {boolean} openedInError - Indicates if the decision was opened in error.
 * @property {boolean} wrongAppealTypeUsed - Indicates if the wrong appeal type was used.
 * @property {string} otherReasons - Any other reasons for the incomplete decision.
 */
export const incompleteValidationDecisionSample = {
	decision: 'incomplete',
	namesDoNotMatch: true,
	sensitiveInfo: true,
	missingApplicationForm: true,
	missingDecisionNotice: true,
	missingGroundsForAppeal: true,
	missingSupportingDocuments: true,
	inflammatoryComments: true,
	openedInError: true,
	wrongAppealTypeUsed: true,
	otherReasons: 'Some reason'
};

/**
 * An object representing a sample of an invalid validation decision.
 *
 * @typedef {object} InvalidValidationDecisionSample
 * @property {string} decision - The decision status, which should be "invalid".
 * @property {boolean} outOfTime - Indicates if the appeal is out of time.
 * @property {boolean} noRightOfAppeal - Indicates if there is no right of appeal.
 * @property {boolean} notAppealable - Indicates if the decision is not appealable.
 * @property {boolean} lPADeemedInvalid - Indicates if the Local Planning Authority deemed the appeal invalid.
 * @property {string} otherReasons - Any other reasons for the invalid decision.
 */
export const invalidValidationDecisionSample = {
	decision: 'invalid',
	outOfTime: true,
	noRightOfAppeal: true,
	notAppealable: true,
	lPADeemedInvalid: true,
	otherReasons: 'Some reason'
};

/**
 * An object representing a sample of a complete validation decision.
 *
 * @typedef {object} CompleteValidationDecisionSample
 * @property {string} decision - The decision status, which should be "complete".
 * @property {string} descriptionOfDevelopment - The description of the development.
 */
export const completeValidationDecisionSample = {
	decision: 'complete',
	descriptionOfDevelopment: 'Some Description'
};

/**
 * An object representing a sector.
 *
 * @type {Sector[]}
 */
export const sectors = [
	{
		name: 'business_and_commercial',
		abbreviation: 'BC',
		displayNameEn: 'Business and Commercial',
		displayNameCy: 'Business and Commercial'
	},
	{
		name: 'energy',
		abbreviation: 'EN',
		displayNameEn: 'Energy',
		displayNameCy: 'Energy'
	},
	{
		name: 'transport',
		abbreviation: 'TR',
		displayNameEn: 'Transport',
		displayNameCy: 'Transport'
	},
	{
		name: 'waste',
		abbreviation: 'WS',
		displayNameEn: 'Waste',
		displayNameCy: 'Waste'
	},
	{
		name: 'waste_water',
		abbreviation: 'WW',
		displayNameEn: 'Waste Water',
		displayNameCy: 'Waste Water'
	},
	{
		name: 'water',
		abbreviation: 'WA',
		displayNameEn: 'Water',
		displayNameCy: 'Water'
	}
];

/**
 * Array of objects containing sub-sector details, grouped by sector.
 *
 * @type {SubSector[]}
 */
export const subSectors = [
	{
		subSector: {
			name: 'office_use',
			abbreviation: 'BC01',
			displayNameEn: 'Office Use',
			displayNameCy: 'Office Use'
		},
		sectorName: 'business_and_commercial'
	},
	{
		subSector: {
			name: 'research_and_development_of_products_or_processes',
			abbreviation: 'BC02',
			displayNameEn: 'Research and Development of Products or Processes',
			displayNameCy: 'Research and Development of Products or Processes'
		},
		sectorName: 'business_and_commercial'
	},
	{
		subSector: {
			name: 'an_industrial_process_or_processes',
			abbreviation: 'BC03',
			displayNameEn: 'An Industrial Process or Processes',
			displayNameCy: 'An Industrial Process or Processes'
		},
		sectorName: 'business_and_commercial'
	},
	{
		subSector: {
			name: 'storage_or_distribution_of_goods',
			abbreviation: 'BC04',
			displayNameEn: 'Storage or Distribution of Goods',
			displayNameCy: 'Storage or Distribution of Goods'
		},
		sectorName: 'business_and_commercial'
	},
	{
		subSector: {
			name: 'conferences',
			abbreviation: 'BC05',
			displayNameEn: 'Conferences',
			displayNameCy: 'Conferences'
		},
		sectorName: 'business_and_commercial'
	},
	{
		subSector: {
			name: 'exhibitions',
			abbreviation: 'BC06',
			displayNameEn: 'Exhibitions',
			displayNameCy: 'Exhibitions'
		},
		sectorName: 'business_and_commercial'
	},
	{
		subSector: {
			name: 'sport',
			abbreviation: 'BC07',
			displayNameEn: 'Sport',
			displayNameCy: 'Sport'
		},
		sectorName: 'business_and_commercial'
	},
	{
		subSector: {
			name: 'leisure',
			abbreviation: 'BC08',
			displayNameEn: 'Leisure',
			displayNameCy: 'Leisure'
		},
		sectorName: 'business_and_commercial'
	},
	{
		subSector: {
			name: 'tourism',
			abbreviation: 'BC09',
			displayNameEn: 'Tourism',
			displayNameCy: 'Tourism'
		},
		sectorName: 'business_and_commercial'
	},
	{
		subSector: {
			name: 'generating_stations',
			abbreviation: 'EN01',
			displayNameEn: 'Generating Stations',
			displayNameCy: 'Generating Stations'
		},
		sectorName: 'energy'
	},
	{
		subSector: {
			name: 'electric_lines',
			abbreviation: 'EN02',
			displayNameEn: 'Electric Lines',
			displayNameCy: 'Electric Lines'
		},
		sectorName: 'energy'
	},
	{
		subSector: {
			name: 'underground_gas_storage_facilities',
			abbreviation: 'EN03',
			displayNameEn: 'Underground Gas Storage Facilities',
			displayNameCy: 'Underground Gas Storage Facilities'
		},
		sectorName: 'energy'
	},
	{
		subSector: {
			name: 'lng_facilities',
			abbreviation: 'EN04',
			displayNameEn: 'LNG Facilities',
			displayNameCy: 'LNG Facilities'
		},
		sectorName: 'energy'
	},
	{
		subSector: {
			name: 'gas_reception_facilities',
			abbreviation: 'EN05',
			displayNameEn: 'Gas Reception Facilities',
			displayNameCy: 'Gas Reception Facilities'
		},
		sectorName: 'energy'
	},
	{
		subSector: {
			name: 'gas_transporter_pipe_lines',
			abbreviation: 'EN06',
			displayNameEn: 'Gas Transporter Pipe-lines',
			displayNameCy: 'Gas Transporter Pipe-lines'
		},
		sectorName: 'energy'
	},
	{
		subSector: {
			name: 'other_pipe_lines',
			abbreviation: 'EN07',
			displayNameEn: 'Other Pipe-lines',
			displayNameCy: 'Other Pipe-lines'
		},
		sectorName: 'energy'
	},
	{
		subSector: {
			name: 'highways',
			abbreviation: 'TR01',
			displayNameEn: 'Highways',
			displayNameCy: 'Highways'
		},
		sectorName: 'transport'
	},
	{
		subSector: {
			name: 'airports',
			abbreviation: 'TR02',
			displayNameEn: 'Airports',
			displayNameCy: 'Airports'
		},
		sectorName: 'transport'
	},
	{
		subSector: {
			name: 'harbour_facilities',
			abbreviation: 'TR03',
			displayNameEn: 'Harbour Facilities',
			displayNameCy: 'Harbour Facilities'
		},
		sectorName: 'transport'
	},
	{
		subSector: {
			name: 'railways',
			abbreviation: 'TR04',
			displayNameEn: 'Railways',
			displayNameCy: 'Railways'
		},
		sectorName: 'transport'
	},
	{
		subSector: {
			name: 'rail_freight_interchanges',
			abbreviation: 'TR05',
			displayNameEn: 'Rail Freight Interchanges',
			displayNameCy: 'Rail Freight Interchanges'
		},
		sectorName: 'transport'
	},
	{
		subSector: {
			name: 'hazardous_waste_facilities',
			abbreviation: 'WS01',
			displayNameEn: 'Hazardous Waste Facilities',
			displayNameCy: 'Hazardous Waste Facilities'
		},
		sectorName: 'waste'
	},
	{
		subSector: {
			name: 'waste_water_treatment_plants',
			abbreviation: 'WW01',
			displayNameEn: 'Waste Water Treatment Plants',
			displayNameCy: 'Waste Water Treatment Plants'
		},
		sectorName: 'waste_water'
	},
	{
		subSector: {
			name: 'dams_and_reservoirs',
			abbreviation: 'WA01',
			displayNameEn: 'Dams and Reservoirs',
			displayNameCy: 'Dams and Reservoirs'
		},
		sectorName: 'water'
	},
	{
		subSector: {
			name: 'transfer_of_water_resources',
			abbreviation: 'WA02',
			displayNameEn: 'Transfer of Water Resources',
			displayNameCy: 'Transfer of Water Resources'
		},
		sectorName: 'water'
	}
];

/**
 * An object representing a region.
 *
 * @type {Region[]}
 */
export const regions = [
	{
		name: 'east_midlands',
		displayNameEn: 'East Midlands',
		displayNameCy: 'East Midlands'
	},
	{
		name: 'eastern',
		displayNameEn: 'Eastern',
		displayNameCy: 'Eastern'
	},
	{
		name: 'london',
		displayNameEn: 'London',
		displayNameCy: 'London'
	},
	{
		name: 'north_east',
		displayNameEn: 'North East',
		displayNameCy: 'North East'
	},
	{
		name: 'north_west',
		displayNameEn: 'North West',
		displayNameCy: 'North West'
	},
	{
		name: 'south_east',
		displayNameEn: 'South East',
		displayNameCy: 'South East'
	},
	{
		name: 'south_west',
		displayNameEn: 'South West',
		displayNameCy: 'South West'
	},
	{
		name: 'wales',
		displayNameEn: 'Wales',
		displayNameCy: 'Wales'
	},
	{
		name: 'west_midlands',
		displayNameEn: 'West Midlands',
		displayNameCy: 'West Midlands'
	},
	{
		name: 'yorkshire_and_the_humber',
		displayNameEn: 'Yorkshire and the Humber',
		displayNameCy: 'Yorkshire and the Humber'
	}
];

/**
 * An array of zoom levels.
 *
 * @type {ZoomLevel[]}
 */
export const zoomLevels = [
	{
		name: 'country',
		displayOrder: 900,
		displayNameEn: 'Country',
		displayNameCy: 'Country'
	},
	{
		name: 'region',
		displayOrder: 800,
		displayNameEn: 'Region',
		displayNameCy: 'Region'
	},
	{
		name: 'county',
		displayOrder: 700,
		displayNameEn: 'County',
		displayNameCy: 'County'
	},
	{
		name: 'borough',
		displayOrder: 600,
		displayNameEn: 'Borough',
		displayNameCy: 'Borough'
	},
	{
		name: 'district',
		displayOrder: 500,
		displayNameEn: 'District',
		displayNameCy: 'District'
	},
	{
		name: 'city',
		displayOrder: 400,
		displayNameEn: 'City',
		displayNameCy: 'City'
	},
	{
		name: 'town',
		displayOrder: 300,
		displayNameEn: 'Town',
		displayNameCy: 'Town'
	},
	{
		name: 'junction',
		displayOrder: 200,
		displayNameEn: 'Junction',
		displayNameCy: 'Junction'
	},
	{
		name: 'none',
		displayOrder: 0,
		displayNameEn: 'None',
		displayNameCy: 'None'
	}
];

/**
 * An array of case status names.
 *
 * @type {CaseStatus[]}
 */
export const caseStatusNames = [
	{ name: 'draft' },
	{ name: 'pre_application' },
	{ name: 'acceptance' },
	{ name: 'pre_examination' },
	{ name: 'examination' },
	{ name: 'recommendation' },
	{ name: 'decision' },
	{ name: 'post_decision' },
	{ name: 'withdrawn' }
];
