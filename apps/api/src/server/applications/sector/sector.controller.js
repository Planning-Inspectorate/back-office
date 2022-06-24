import * as sectorRepository from '../../repositories/sector.repository.js';
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
	const sectors = request.query ? [] : await sectorRepository.getAll();

	response.send(mapSectors(sectors));
};
