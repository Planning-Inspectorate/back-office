/**
 * Static data required by the back-office service
 */

/**
 *
 * @typedef {import('@prisma/client').Prisma.SectorCreateInput} SectorCreateInput
 * @typedef {import('@prisma/client').Prisma.RegionCreateInput} RegionCreateInput
 * @typedef {import('@prisma/client').Prisma.ZoomLevelCreateInput} ZoomLevelCreateInput
 * @typedef {import('@prisma/client').Prisma.ExaminationTimetableTypeCreateInput} ExaminationTimetableTypeCreateInput
 *
 * @typedef {{ abbreviation: string, name: string, displayNameEn: string, displayNameCy: string}} SubSectorPartial
 * @typedef {{ sectorName: string, subSector: SubSectorPartial}} SubSectorPartialWithSectorName
 */

/**
 * An object representing a sector.
 *
 * @type {SectorCreateInput[]}
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
	},
	{
		name: 'training',
		abbreviation: 'TRAIN',
		displayNameEn: 'Training',
		displayNameCy: 'Training'
	}
];

/**
 * Array of objects containing sub-sector details, grouped by sector.
 *
 * @type {SubSectorPartialWithSectorName[]}
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
	},
	{
		subSector: {
			name: 'training',
			abbreviation: 'TRAIN01',
			displayNameEn: 'Training',
			displayNameCy: 'Training'
		},
		sectorName: 'training'
	}
];

/**
 * An object representing a region.
 *
 * @type {RegionCreateInput[]}
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
 * @type {ZoomLevelCreateInput[]}
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
		name: 'none',
		displayOrder: 0,
		displayNameEn: 'None',
		displayNameCy: 'None'
	}
];

/**
 * An array of examination timetable types.
 *
 * @type {ExaminationTimetableTypeCreateInput[]}
 */
export const examinationTimetableTypes = [
	{
		name: 'Accompanied Site Inspection',
		templateType: 'accompanied-site-inspection',
		displayNameEn: 'Accompanied site inspection',
		displayNameCy: 'Accompanied site inspection'
	},
	{
		name: 'Compulsory Acquisition Hearing',
		templateType: 'compulsory-acquisition-hearing',
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
		templateType: 'deadline-for-close-of-examination',
		displayNameEn: 'Deadline for close of examination',
		displayNameCy: 'Deadline for close of examination'
	},
	{
		name: 'Issued By',
		templateType: 'issued-by',
		displayNameEn: 'Issued by',
		displayNameCy: 'Issued by'
	},
	{
		name: 'Issue Specific Hearing',
		templateType: 'issue-specific-hearing',
		displayNameEn: 'Issue specific hearing',
		displayNameCy: 'Issue specific hearing'
	},
	{
		name: 'Open Floor Hearing',
		templateType: 'open-floor-hearing',
		displayNameEn: 'Open floor hearing',
		displayNameCy: 'Open floor hearing'
	},
	{
		name: 'Other Meeting',
		templateType: 'other-meeting',
		displayNameEn: 'Other meeting',
		displayNameCy: 'Other meeting'
	},
	{
		name: 'Preliminary Meeting',
		templateType: 'preliminary-meeting',
		displayNameEn: 'Preliminary meeting',
		displayNameCy: 'Preliminary meeting'
	},
	{
		name: 'Procedural Deadline (Pre-Examination)',
		templateType: 'procedural-deadline',
		displayNameEn: 'Procedural deadline (pre-examination)',
		displayNameCy: 'Procedural deadline (pre-examination)'
	},
	{
		name: 'Procedural Decision',
		templateType: 'procedural-decision',
		displayNameEn: 'Procedural decision',
		displayNameCy: 'Procedural decision'
	},
	{
		name: 'Publication Of',
		templateType: 'publication-of',
		displayNameEn: 'Publication of',
		displayNameCy: 'Publication of'
	}
];

/**
 * seed static data into the database. Does not disconnect from the database or handle errors.
 *
 * @param {import('@prisma/client').PrismaClient} databaseConnector
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
}
