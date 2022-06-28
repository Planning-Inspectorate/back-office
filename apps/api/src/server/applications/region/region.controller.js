import * as regionRepository from '../../repositories/region.repository.js';
import { mapRegion } from '../../utils/mapping/map-region.js';

/**
 *
 * @param {import('@pins/api').Schema.Region[]} regions
 * @returns {{name: string, displayNameEn: string, displayNameCy: string}[]}
 */
const mapRegions = (regions) => {
	return regions.map((region) => mapRegion(region));
};

/** @type {import('express').RequestHandler} */
export const getRegions = async (_request, response) => {
	const regions = await regionRepository.getAll();

	response.send(mapRegions(regions));
};
