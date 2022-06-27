import { isEmpty } from 'lodash-es';
import * as sectorRepository from '../../repositories/sector.repository.js';
import * as subSectorRepository from '../../repositories/sub-sector.repository.js';
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
	const sectors = isEmpty(request.query)
		? await sectorRepository.getAll()
		: await subSectorRepository.getBySector({ name: request.query.sectorName?.toString() });

	response.send(mapSectors(sectors));
};
