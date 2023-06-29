import { pick } from 'lodash-es';

/**
 *
 * @param {import('@pins/applications.api').Schema.Region} region
 * @returns {{name: string, displayNameEn: string, displayNameCy: string}}
 */
export const mapRegion = (region) => {
	return pick(region, ['id', 'name', 'displayNameEn', 'displayNameCy']);
};
