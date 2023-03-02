import { updateCase } from '../../services/case.service.js';

/** @typedef {import('../../../pages/create-new-case/key-dates/applications-create-key-dates.types').ApplicationsCreateKeyDatesProps} ApplicationsCreateKeyDatesProps */

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
 * @returns {Promise<{properties: ApplicationsCreateKeyDatesProps, updatedCaseId?: number}>}
 */
export async function keyDatesDataUpdate({ body, errors: validationErrors }, locals) {
	const { caseId } = locals;
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

	const { errors: apiErrors, id: updatedCaseId } = await updateCase(caseId, payload);

	const properties = {
		errors: validationErrors || apiErrors,
		values
	};

	return { properties, updatedCaseId };
}
