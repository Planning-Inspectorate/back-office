import config from '../src/server/config/config.js';
import { databaseConnector } from '../src/server/utils/database-connector.js';
import logger from '../src/server/utils/logger.js';
import {
	examinationTimetableTypes,
	regions,
	sectors,
	subSectors,
	zoomLevels
} from './seed-samples.js';

// create reference data only, no test data, as delivering to production DB

/**
 * Upserts data for sectors, sub-sectors, regions, zoom levels, and examination timetable types into the database.
 *
 * @throws {Error} If any database operation fails.
 * @returns {Promise<void>}
 */
const productionMain = async () => {
	try {
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
	} catch (error) {
		logger.error(error);
		throw error;
	} finally {
		await databaseConnector.$disconnect();
	}
};

await (config.NODE_ENV === 'production' ? productionMain() : null);
