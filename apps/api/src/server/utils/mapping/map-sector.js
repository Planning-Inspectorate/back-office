import { pick } from 'lodash-es';

/**
 * @typedef {{name?: string, displayNameEn?: string, displayNameCy?: string, abbreviation?: string}} SectorResponse
 */

/**
 *
 * @param {import('@pins/api').Schema.Sector | import('@pins/api').Schema.SubSector | null | undefined} sector
 * @returns {SectorResponse | null | undefined}
 */
export const mapSector = (sector) => {
	return pick(sector, ['name', 'abbreviation', 'displayNameEn', 'displayNameCy']);
};
