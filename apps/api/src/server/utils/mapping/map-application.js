import { pick } from 'lodash-es';
import { mapDateStringToUnixTimestamp } from '../../utils/mapping/map-date-string-to-unix-timestamp.js';
import { mapKeysUsingObject } from '../../utils/mapping/map-keys-using-object.js';
import { mapValuesUsingObject } from '../../utils/mapping/map-values-using-object.js';

/**
 *
 * @typedef {{id: number, reference: string, title: string, description: string, modifiedDate: number, stage: string}} ApplicationResponse
 */

/**
 *
 * @param {import('@pins/api').Schema.Application} application
 * @returns {ApplicationResponse}
 */
export const mapApplication = (application) => {
	/** @type {{id: number, reference: string, title: string, description: string, modifiedAt: Date, stage: string}} */
	const filtered = pick(application, [
		'id',
		'reference',
		'title',
		'description',
		'modifiedAt',
		'stage'
	]);

	/** @type {ApplicationResponse} */
	const mappedKeys = mapKeysUsingObject(filtered, { modifiedAt: 'modifiedDate' });

	/** @type {ApplicationResponse} */
	const mappedValues = mapValuesUsingObject(mappedKeys, {
		modifiedDate: mapDateStringToUnixTimestamp
	});

	return mappedValues;
};
