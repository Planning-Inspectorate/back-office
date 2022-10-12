import {
	keyDatesData,
	keyDatesDataUpdate
} from '../../../components/form/form-key-dates-components.controller.js';
import { handleErrors } from '../../../lib/controllers/errors.controller.js';

/** @typedef {import('./applications-create-key-dates.types.js').ApplicationsCreateKeyDatesProps} ApplicationsCreateKeyDatesProps */
/** @typedef {import('./applications-create-key-dates.types.js').ApplicationsCreateKeyDatesBody} ApplicationsCreateKeyDatesBody */

const keyDatesLayout = {
	pageTitle: 'Enter the key dates of the project',
	components: ['date-published', 'date-internal']
};

/**
 * View the key dates step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateKeyDatesProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateKeyDates(request, response) {
	const properties = await keyDatesData(request, response.locals);

	return response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: keyDatesLayout
	});
}

/**
 * Update key dates
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateKeyDatesProps,
 * {}, ApplicationsCreateKeyDatesBody, {}, {}>}
 */
export async function updateApplicationsCreateKeyDates(request, response) {
	const { properties, updatedApplicationId } = await keyDatesDataUpdate(request, response.locals);

	if (properties.errors || !updatedApplicationId) {
		return handleErrors(properties, keyDatesLayout, response);
	}

	return response.redirect(
		`/applications-service/create-new-case/${updatedApplicationId}/check-your-answers`
	);
}
