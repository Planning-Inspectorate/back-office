import { isEmpty } from 'lodash-es';
import * as sectorRepository from '../../repositories/sector.repository.js';
import * as subSectorRepository from '../../repositories/sub-sector.repository.js';
import BackOfficeAppError from '../../utils/app-error.js';
import { getCache, setCache } from '../../utils/cache-data.js';
import { mapSector } from '../../utils/mapping/map-sector.js';

/**
 * @typedef {{name: string, displayNameEn: string, displayNameCy: string, abbreviation: string}} SectorResponse
 */

/**
 *
 * @param {import('@pins/api').Schema.Sector[]} sectors
 * @returns {SectorResponse[]}
 */
const mapSectors = (sectors) => {
	return sectors?.map((sector) => mapSector(sector));
};

/**
 *
 * @type {import('express').RequestHandler}
 */
export const getSectors = async (request, response) => {
	const sectorName = request.query.sectorName?.toString() || 'sectors';

	let sectors = await getCache(sectorName);

	if (!sectors) {
		sectors = await getSectorsFromRepository(request);
		setCache(sectorName, sectors);
	}

	response.send(mapSectors(sectors));
};

const getSectorsFromRepository = async (
	/** @type {import("express-serve-static-core").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>} */ request
) => {
	const sectors = isEmpty(request.query)
		? await sectorRepository.getAll()
		: await subSectorRepository.getBySector({ name: request.query.sectorName?.toString() });

	if (!sectors) {
		throw new BackOfficeAppError(`Sectors not found`, 404);
	}

	return sectors;
};
