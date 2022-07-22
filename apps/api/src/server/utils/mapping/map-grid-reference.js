import { pick } from 'lodash-es';

/**
 *
 * @param {import('@pins/api').Schema.GridReference} gridReference
 * @returns {{easting?: number | null, northing?: number | null}}
 */
export const mapGridReference = (gridReference) => {
	return pick(gridReference, ['easting', 'northing']);
};
