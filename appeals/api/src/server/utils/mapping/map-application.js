import { pick } from 'lodash-es';
import { mapDateStringToUnixTimestamp } from './map-date-string-to-unix-timestamp.js';
import { mapKeysUsingObject } from './map-keys-using-object.js';
import { mapValuesUsingObject } from './map-values-using-object.js';

/**
 * @typedef {{id: number, reference: string, title:string, description: string, status: string, modifiedDate: number}} ApplicationResponse
 */

/**
 * @param {import('@pins/appeals.api').Schema.Case} application
 * @param {string[]} columnsToPick
 * @returns {ApplicationResponse}
 */
export const mapApplication = (
	application,
	columnsToPick = ['id', 'title', 'reference', 'description', 'modifiedAt']
) => {
	/** @type {{id: number, reference: string, modifiedAt: Date}} */
	const filtered = pick(application, columnsToPick);

	/** @type {ApplicationResponse} */
	const mappedKeys = mapKeysUsingObject(filtered, { modifiedAt: 'modifiedDate' });

	/** @type {ApplicationResponse} */
	const mappedValues = mapValuesUsingObject(mappedKeys, {
		modifiedDate: mapDateStringToUnixTimestamp
	});

	return mappedValues;
};
