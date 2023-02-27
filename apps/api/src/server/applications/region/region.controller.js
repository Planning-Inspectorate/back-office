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
 * @type {import('express').RequestHandler}
 * @throws {Error}
 */
export const getRegions = async (_request, response) => {
	let regions = getCache('regions');

	if (!regions) {
		regions = await regionRepository.getAll();

		setCache('regions', regions);
	}

	response.send(mapRegions(regions));
};
