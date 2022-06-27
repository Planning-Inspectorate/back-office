import { pick } from 'lodash-es';
import { mapDateStringToUnixTimestamp } from '../../utils/mapping/map-date-string-to-unix-timestamp.js';
import { mapKeysUsingObject } from '../../utils/mapping/map-keys-using-object.js';
import { mapValuesUsingObject } from '../../utils/mapping/map-values-using-object.js';

/**
 *
 * @typedef {{id: number, reference: string, title:string, description: string, status: string, modifiedDate: number}} ApplicationResponse
 */

/**
 *
 * @param {import('@pins/api').Schema.Application} application
 * @returns {ApplicationResponse}
 */
export const mapApplication = (application) => {
	/** @type {{id: number, reference: string, title:string, description: string, status: string, modifiedAt: Date}} */
	const filtered = pick(application, ['id', 'reference', 'modifiedAt', 'title', 'description', 'status']);

	/** @type {ApplicationResponse} */
	const mappedKeys = mapKeysUsingObject(filtered, { modifiedAt: 'modifiedDate' });

	/** @type {ApplicationResponse} */
	const mappedValues = mapValuesUsingObject(mappedKeys, {
		modifiedDate: mapDateStringToUnixTimestamp
	});

	return mappedValues;
};
