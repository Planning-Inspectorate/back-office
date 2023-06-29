import * as zoomLevelsRepository from '../../repositories/zoom-level.repository.js';
import { getCache, setCache } from '../../utils/cache-data.js';
import { mapZoomLevel } from '../../utils/mapping/map-zoom-level.js';

/**
 *
 * @param {import('@pins/applications.api').Schema.ZoomLevel[]} zoomLevels
 * @returns {{name: string, displayOrder: number, displayNameEn: string, displayNameCy: string}[]}
 */
const mapZoomLevels = (zoomLevels) => {
	return zoomLevels.map((zoomLevel) => mapZoomLevel(zoomLevel));
};

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const getZoomLevels = async (_request, response) => {
	let zoomLevels = getCache('zoom-level');

	if (!zoomLevels) {
		zoomLevels = await zoomLevelsRepository.getAll();

		setCache('zoom-level', zoomLevels);
	}

	response.send(mapZoomLevels(zoomLevels));
};
