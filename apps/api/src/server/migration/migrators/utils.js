import { databaseConnector } from '#utils/database-connector.js';
import { eventClient } from '#infrastructure/event-client.js';

/**
 * @typedef {Object} NSIPProjectMinimalCaseData
 * @property {string} caseReference
 * @property {string} caseName
 * @property {string} caseDescription
 * @property {string} caseStage
 */

const caseRefToIdCache = new Map();

/**
 * @param {string} reference
 *
 * @returns {Promise<number | undefined>} caseId
 */
export const getCaseIdFromRef = async (reference) => {
	const existingCaseId = caseRefToIdCache.get(reference);

	if (existingCaseId) {
		return existingCaseId;
	}

	// Check if the case exists in the database
	let existingCase = await databaseConnector.case.findFirst({
		where: { reference },
		select: {
			id: true
		}
	});

	return existingCase?.id;
};

/**
 * @param {{ emailAddress: string }} email
 * @returns {Promise<number>} serviceUserId
 */
export const getOrCreateServiceUserId = async ({ emailAddress: email }) => {
	const existingServiceUser = await databaseConnector.serviceUser.findFirst({
		where: { email },
		select: { id: true }
	});

	if (existingServiceUser) return existingServiceUser.id;

	const newServiceUser = await databaseConnector.serviceUser.create({
		data: {
			email
		},
		select: {
			id: true
		}
	});

	return newServiceUser.id;
};

/**
 * @param {NSIPProjectMinimalCaseData} projectUpdate
 *
 * @returns {Promise<number>} caseId
 */
export const getOrCreateMinimalCaseId = async ({
	caseReference: reference,
	caseName: title,
	caseDescription: description,
	caseStage
}) => {
	let existingCaseId = await getCaseIdFromRef(reference);

	if (existingCaseId) {
		return existingCaseId;
	}

	// We're only creating (and not upserting) cases because upserts could be dangerous.
	// The stage is likely to change, but if we actually migrate nsip-project entities and re-run this job we would be in trouble
	const subSectorId = await getSubSectorIdFromReference(reference);

	const caseEntity = {
		reference,
		title,
		description,
		ApplicationDetails: {
			create: {
				subSector: {
					connect: { id: subSectorId }
				}
			}
		},
		CaseStatus: {
			create: { status: caseStage }
		}
	};

	const newCase = await databaseConnector.case.create({ data: caseEntity, select: { id: true } });

	caseRefToIdCache.set(reference, newCase.id);

	return newCase.id;
};

/**
 *
 * @param {string} reference
 *
 * @returns {Promise<number>} subSectorId
 */
export const getSubSectorIdFromReference = async (reference) => {
	const abbreviation = reference?.slice(0, 4);

	if (!abbreviation) {
		throw Error(`Unable to determine sub sector for reference ${reference}`);
	}

	const subSector = await databaseConnector.subSector.findUnique({
		where: {
			abbreviation
		}
	});

	if (!subSector) {
		throw Error(`No sub-sector found for abbreviation ${abbreviation}`);
	}

	return subSector.id;
};

/**
 * @typedef {Object} Mapping
 * @property {number} id
 * @property {string} name
 */

/**
 @type {Mapping[]}
 */
let mapZoomLevels = [];

/**
 *
 * @param {string} displayName
 *
 * @returns {Promise<number | undefined>} zoomLevelId
 */
export const getMapZoomLevelIdFromDisplayName = async (displayName) => {
	if (!displayName) return null;

	if (!mapZoomLevels.length) {
		mapZoomLevels = await databaseConnector.zoomLevel.findMany({
			select: {
				id: true,
				name: true
			}
		});
	}

	return mapZoomLevels.find(({ name }) => name === displayName)?.id;
};

/**
 @type {Mapping[]}
 */
let regions = [];

/**
 *
 * @param {("east_midlands" | "eastern" | "london" | "north_east" | "north_west" | "south_east" | "south_west" | "wales" | "west_midlands" | "yorkshire_and_the_humber")[]} regionNames
 *
 * @returns {Promise<number[]>} regionIds
 */
export const getRegionIdsFromNames = async (regionNames) => {
	if (!regionNames) {
		throw Error(`Missing required parameter regionNames`);
	}

	if (!regions.length) {
		regions = await databaseConnector.region.findMany({
			select: {
				id: true,
				name: true
			}
		});
	}

	return regionNames.map((name) => {
		const region = regions.find((r) => r.name === name);

		if (!region) {
			throw Error(`Could not find region ${name}`);
		}

		return region.id;
	});
};

/**
 @type {Mapping[]}
 */
let timetableItemTypes = [];

/**
 *
 * @param {string} examTimetableItemType
 *
 * @returns {Promise<number | undefined>} timetableTypeId
 */
export const getExamTimetableTypeIdFromName = async (examTimetableItemType) => {
	if (!examTimetableItemType) {
		throw Error('Missing required parameter examTimetableItemType');
	}

	if (!timetableItemTypes.length) {
		timetableItemTypes = await databaseConnector.examinationTimetableType.findMany({
			select: {
				id: true,
				name: true
			}
		});
	}

	return timetableItemTypes.find(({ name }) => name === examTimetableItemType)?.id;
};

// 100 events would allow each event to have a body size of 10kb which is more than enough
// I haven't seen an event in the test environment larger than 1kb
const eventChunkSize = 100;

/**
 *
 * @param {string} topic
 * @param {any[]} events
 * @param {import('./event-type.js').EventType} eventType
 * @param {Object.<string,any>?} [additionalProperties={}]
 */
export const sendChunkedEvents = async (topic, events, eventType, additionalProperties = {}) => {
	// Send messages in chunks to avoid 1mb throughput limit
	for (let i = 0; i < events.length; i += eventChunkSize) {
		const eventsChunk = events.slice(i, i + eventChunkSize);

		try {
			await eventClient.sendEvents(topic, eventsChunk, eventType, additionalProperties);
			console.info(`Broadcasted events from range ${i} - ${i + eventChunkSize}`);
		} catch (error) {
			console.error(`Failed to broadcast at range ${i} - ${i + eventChunkSize}`, error);
			throw error;
		}
	}
};

