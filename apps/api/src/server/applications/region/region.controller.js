import * as regionRepository from '../../repositories/region.repository.js';
import { getCache, setCache } from '../../utils/cache-data.js';
import { mapRegion } from '../../utils/mapping/map-region.js';

/**
 *
 * @param {import('@pins/api').Schema.Region[]} regions
 * @returns {{name: string, displayNameEn: string, displayNameCy: string}[]}
 */
const mapRegions = (regions) => {
	return regions.map((region) => mapRegion(region));
};

/**
 *
 * @param {import('express').Request} _request
 * @param {import('express').Response} response
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const getRegions = async (_request, response) => {
	let regions = getCache('regions');

	if (!regions) {
		regions = await regionRepository.getAll();

		setCache('regions', regions);
	}

	response.send(mapRegions(regions));
};
