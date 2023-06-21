/**
 * Static data required by the back-office service
 */

/**
 * @typedef {import('../../server/applications/application/application.js')} Sector
 * @typedef {import('../../server/applications/application/application.js').Sector} SubSector
 * @typedef {import('apps/web/src/server/applications/applications.types').Region} Region
 * @typedef {import('apps/web/src/server/applications/applications.types').ZoomLevel} ZoomLevel
 * @typedef {import('apps/web/src/server/applications/applications.types').ExaminationTimetableType} ExaminationTimetableType
 * @typedef {import('apps/api/src/database/schema.js').ProcedureType} ProcedureType
 * @typedef {import('apps/api/src/database/schema.js').DesignatedSiteDetails} DesignatedSiteDetails
 * @typedef {import('apps/api/src/database/schema.js').LPANotificationMethodDetails} LPANotificationMethodDetails
 * @typedef {import('apps/api/src/database/schema.js').ScheduleType} ScheduleType
 * @typedef {import('apps/api/src/database/schema.js').PlanningObligationStatus} PlanningObligationStatus
 * @typedef {import('apps/api/src/database/schema.js').KnowledgeOfOtherLandowners} KnowledgeOfOtherLandowners
 */

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
 * An array of examination timetable types.
 *
 * @type {ExaminationTimetableType[]}
 */
export const examinationTimetableTypes = [
	{
		name: 'Accompanied Site Inspection',
		templateType: 'starttime-mandatory',
		displayNameEn: 'Accompanied site inspection',
		displayNameCy: 'Accompanied site inspection'
	},
	{
		name: 'Compulsory Acquisition Hearing',
		templateType: 'starttime-mandatory',
		displayNameEn: 'Compulsory acquisition hearing',
		displayNameCy: 'Compulsory acquisition hearing'
	},
	{
		name: 'Deadline',
		templateType: 'deadline',
		displayNameEn: 'Deadline',
		displayNameCy: 'Deadline'
	},
	{
		name: 'Deadline For Close Of Examination',
		templateType: 'deadline',
		displayNameEn: 'Deadline for close of examination',
		displayNameCy: 'Deadline for close of examination'
	},
	{
		name: 'Issued By',
		templateType: 'no-times',
		displayNameEn: 'Issued by',
		displayNameCy: 'Issued by'
	},
	{
		name: 'Issue Specific Hearing',
		templateType: 'starttime-mandatory',
		displayNameEn: 'Issue specific hearing',
		displayNameCy: 'Issue specific hearing'
	},
	{
		name: 'Open Floor Hearing',
		templateType: 'starttime-mandatory',
		displayNameEn: 'Open floor hearing',
		displayNameCy: 'Open floor hearing'
	},
	{
		name: 'Other Meeting',
		templateType: 'starttime-mandatory',
		displayNameEn: 'Other meeting',
		displayNameCy: 'Other meeting'
	},
	{
		name: 'Preliminary Meeting',
		templateType: 'starttime-mandatory',
		displayNameEn: 'Preliminary meeting',
		displayNameCy: 'Preliminary meeting'
	},
	{
		name: 'Procedural Deadline (Pre-Examination)',
		templateType: 'deadline-startdate-mandatory',
		displayNameEn: 'Procedural deadline (pre-examination)',
		displayNameCy: 'Procedural deadline (pre-examination)'
	},
	{
		name: 'Procedural Decision',
		templateType: 'starttime-optional',
		displayNameEn: 'Procedural decision',
		displayNameCy: 'Procedural decision'
	},
	{
		name: 'Publication Of',
		templateType: 'no-times',
		displayNameEn: 'Publication of',
		displayNameCy: 'Publication of'
	}
];

/**
 * Appeal tyles
 *
 */
export const appealTypes = [
	{ shorthand: 'FPA', type: 'Full planning' },
	{ shorthand: 'HAS', type: 'Householder' }
];

/**
 * Seed static data into the database. Does not disconnect from the database or handle errors.
 * An array of procedure types.
 *
 * @type {ProcedureType[]}
 */
export const procedureTypes = [
	{
		name: 'Hearing'
	},
	{
		name: 'Inquiry'
	},
	{
		name: 'Written'
	}
];

/**
 * An array of designated sites.
 *
 * @type {DesignatedSiteDetails[]}
 */
export const designatedSites = [
	{
		name: 'cSAC',
		description: 'candidate special area of conservation'
	},
	{
		name: 'pSPA',
		description: 'potential special protection area'
	},
	{
		name: 'SAC',
		description: 'special area of conservation'
	},
	{
		name: 'SPA Ramsar',
		description: 'ramsar special protection area'
	},
	{
		name: 'SSSI',
		description: 'site of special scientific interest'
	},
	{
		name: 'Other',
		description: ''
	}
];

/**
 * An array of LPA notification methods.
 *
 * @type {LPANotificationMethodDetails[]}
 */
export const lpaNotificationMethods = [
	{
		name: 'A site notice'
	},
	{
		name: 'Letter/email to interested parties'
	},
	{
		name: 'A press advert'
	}
];

/**
 * An array of schedule types.
 *
 * @type {ScheduleType[]}
 */
export const scheduleTypes = [
	{
		name: 'Schedule 1'
	},
	{
		name: 'Schedule 2'
	}
];

/**
 * An array of planning obligation statuses.
 *
 * @type {Pick<PlanningObligationStatus, 'name'>[]}
 */
export const planningObligationStatuses = [
	{
		name: 'Finalised'
	},
	{
		name: 'Draft'
	},
	{
		name: 'Not started'
	}
];

/**
 * An array of knowledge of other landowners values.
 *
 * @type {Pick<KnowledgeOfOtherLandowners, 'name'>[]}
 */
export const knowledgeOfOtherLandownersValues = [
	{
		name: 'Yes'
	},
	{
		name: 'Some'
	},
	{
		name: 'No'
	}
];

/**
 * eed static data into the database. Does not disconnect from the database or handle errors.
 *
 * @param {import('#db-client').PrismaClient} databaseConnector
 */
export async function seedStaticData(databaseConnector) {
	for (const sector of sectors) {
		await databaseConnector.sector.upsert({
			create: sector,
			where: { name: sector.name },
			update: {}
		});
	}
	for (const { subSector, sectorName } of subSectors) {
		await databaseConnector.subSector.upsert({
			create: { ...subSector, sector: { connect: { name: sectorName } } },
			update: {},
			where: { name: subSector.name }
		});
	}
	for (const region of regions) {
		await databaseConnector.region.upsert({
			create: region,
			where: { name: region.name },
			update: {}
		});
	}
	for (const zoomLevel of zoomLevels) {
		await databaseConnector.zoomLevel.upsert({
			create: zoomLevel,
			where: { name: zoomLevel.name },
			update: {}
		});
	}
	for (const examinationTimetableType of examinationTimetableTypes) {
		await databaseConnector.examinationTimetableType.upsert({
			create: examinationTimetableType,
			where: { name: examinationTimetableType.name },
			update: {}
		});
	}
	for (const appealType of appealTypes) {
		await databaseConnector.appealType.upsert({
			create: appealType,
			where: { shorthand: appealType.shorthand },
			update: { type: appealType.type }
		});
	}
	for (const procedureType of procedureTypes) {
		await databaseConnector.procedureType.upsert({
			create: procedureType,
			where: { name: procedureType.name },
			update: {}
		});
	}
	for (const designatedSite of designatedSites) {
		await databaseConnector.designatedSite.upsert({
			create: designatedSite,
			where: { name: designatedSite.name },
			update: {}
		});
	}
	for (const lpaNotificationMethod of lpaNotificationMethods) {
		await databaseConnector.lPANotificationMethods.upsert({
			create: lpaNotificationMethod,
			where: { name: lpaNotificationMethod.name },
			update: {}
		});
	}
	for (const scheduleType of scheduleTypes) {
		await databaseConnector.scheduleType.upsert({
			create: scheduleType,
			where: { name: scheduleType.name },
			update: {}
		});
	}
	for (const planningObligationStatus of planningObligationStatuses) {
		await databaseConnector.planningObligationStatus.upsert({
			create: planningObligationStatus,
			where: { name: planningObligationStatus.name },
			update: {}
		});
	}
	for (const knowledgeOfOtherLandownersValue of knowledgeOfOtherLandownersValues) {
		await databaseConnector.knowledgeOfOtherLandowners.upsert({
			create: knowledgeOfOtherLandownersValue,
			where: { name: knowledgeOfOtherLandownersValue.name },
			update: {}
		});
	}
}
