import { getCase, updateCase } from '../../lib/services/case.service.js';

/** @typedef {import('../../pages/create-new-case/key-dates/applications-create-key-dates.types').ApplicationsCreateKeyDatesProps} ApplicationsCreateKeyDatesProps */

/**
 * Format properties for key dates page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateKeyDatesProps>}
 */
export async function keyDatesData(request, locals) {
	const { applicationId } = locals;
	const { keyDates } = await getCase(applicationId, ['keyDates']);
	const { submissionDatePublished, submissionDateInternal } = keyDates || {};

	const values = {
		'keyDates.submissionDatePublished': submissionDatePublished,
		'keyDates.submissionDateInternal': submissionDateInternal
	};

	return { values };
}

/**
 * Format properties for key dates update page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties: ApplicationsCreateKeyDatesProps, updatedApplicationId?: number}>}
 */
export async function keyDatesDataUpdate({ body, errors: validationErrors }, locals) {
	const { applicationId } = locals;
	const { submissionInternalDay, submissionInternalMonth, submissionInternalYear } = body;
	const submissionDatePublished = body['keyDates.submissionDatePublished'];

	const submissionInternalDateSeconds =
		(Date.parse(`${submissionInternalYear}-${submissionInternalMonth}-${submissionInternalDay}`) ||
			0) / 1000;
	const submissionDateInternal =
		submissionInternalDateSeconds > 0 ? `${submissionInternalDateSeconds}` : '';
	const values = {
		'keyDates.submissionDatePublished': submissionDatePublished,
		'keyDates.submissionDateInternal': submissionDateInternal
	};

	const payload = {
		keyDates: {
			submissionDatePublished,
			...(submissionDateInternal ? { submissionDateInternal } : {})
		}
	};

	const { errors: apiErrors, id: updatedApplicationId } = await updateCase(applicationId, payload);

	const properties = {
		errors: validationErrors || apiErrors,
		values
	};

	return { properties, updatedApplicationId };
}
