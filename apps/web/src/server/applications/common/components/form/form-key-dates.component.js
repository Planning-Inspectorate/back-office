import { updateCase } from '../../services/case.service.js';

/** @typedef {import('../../../create-new-case/key-dates/applications-create-key-dates.types').ApplicationsCreateKeyDatesProps} ApplicationsCreateKeyDatesProps */

/**
 * Format properties for key dates page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {ApplicationsCreateKeyDatesProps}
 */
export function keyDatesData(request, locals) {
	const { currentCase } = locals;
	const { keyDates } = currentCase;
	const { submissionAtPublished, submissionAtInternal } = keyDates?.preApplication || {};

	const values = {
		'keyDates.preApplication.submissionAtPublished': submissionAtPublished,
		'keyDates.preApplication.submissionAtInternal': submissionAtInternal
	};

	return { values };
}

/**
 * Format properties for key dates update page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties: ApplicationsCreateKeyDatesProps, updatedCaseId?: number}>}
 */
export async function keyDatesDataUpdate({ body, errors: validationErrors }, locals) {
	const { caseId } = locals;
	const submissionInternalDay = body['keyDates.preApplication.submissionAtInternal.day'];
	const submissionInternalMonth = body['keyDates.preApplication.submissionAtInternal.month'];
	const submissionInternalYear = body['keyDates.preApplication.submissionAtInternal.year'];
	const submissionAtPublished = body['keyDates.preApplication.submissionAtPublished'];

	const submissionInternalDateSeconds =
		(Date.parse(`${submissionInternalYear}-${submissionInternalMonth}-${submissionInternalDay}`) ||
			0) / 1000;
	const submissionAtInternal =
		submissionInternalDateSeconds > 0 ? `${submissionInternalDateSeconds}` : '';
	const values = {
		'keyDates.preApplication.submissionAtPublished': submissionAtPublished,
		'keyDates.preApplication.submissionAtInternal': submissionAtInternal,
		'keyDates.preApplication.submissionAtInternal.day': submissionInternalDay,
		'keyDates.preApplication.submissionAtInternal.month': submissionInternalMonth,
		'keyDates.preApplication.submissionAtInternal.year': submissionInternalYear
	};

	const payload = {
		keyDates: {
			preApplication: {
				submissionAtPublished,
				submissionAtInternal: submissionAtInternal === '' ? null : submissionAtInternal
			}
		}
	};

	const { errors: apiErrors, id: updatedCaseId } = await updateCase(caseId, payload);

	const properties = {
		errors: validationErrors || apiErrors,
		values
	};

	return { properties, updatedCaseId };
}
