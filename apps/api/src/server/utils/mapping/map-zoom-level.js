import { pick } from 'lodash-es';

/**
 *
 * @param {import('@pins/api').Schema.ZoomLevel} zoomLevel
 * @returns {{name: string, displayNameEn: string, displayNameCy: string}}
 */
export const mapZoomLevel = (zoomLevel) => {
	return pick(zoomLevel, ['id', 'name', 'displayNameEn', 'displayNameCy']);
};
