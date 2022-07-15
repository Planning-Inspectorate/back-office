import * as zoomLevelsRepository from '../../repositories/zoom-level.repository.js';
import { mapZoomLevel } from '../../utils/mapping/map-zoom-level.js';

/**
 *
 * @param {import('@pins/api').Schema.ZoomLevel[]} zoomLevels
 * @returns {{name: string, displayOrder: number, displayNameEn: string, displayNameCy: string}[]}
 */
const mapZoomLevels = (zoomLevels) => {
	return zoomLevels.map((zoomLevel) => mapZoomLevel(zoomLevel));
};

/** @type {import('express').RequestHandler} */
export const getZoomLevels = async (_request, response) => {
	const zoomLevels = await zoomLevelsRepository.getAll();

	response.send(mapZoomLevels(zoomLevels));
};
