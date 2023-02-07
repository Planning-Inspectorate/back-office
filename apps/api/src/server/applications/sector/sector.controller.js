import { isEmpty } from 'lodash-es';
import * as sectorRepository from '../../repositories/sector.repository.js';
import * as subSectorRepository from '../../repositories/sub-sector.repository.js';
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
	return sectors.map((sector) => mapSector(sector));
};

/**
 *
 * @type {import('express').RequestHandler}
 */
export const getSectors = async (request, response) => {
	let sectors = await getCache(request.query.sectorName?.toString() || '');

	if (!sectors) {
		sectors = isEmpty(request.query)
			? await sectorRepository.getAll()
			: await subSectorRepository.getBySector({ name: request.query.sectorName?.toString() });

		// sort ascending order of subsector abbreviation, BC, EN, ... WA, WS, WW
		sectors.sort((a, b) => (a.abbreviation > b.abbreviation ? 1 : -1));

		setCache(request.query.sectorName?.toString() || '', sectors);
	}

	response.send(mapSectors(sectors));
};
