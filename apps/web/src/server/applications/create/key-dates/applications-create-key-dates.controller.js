import {
	formatUpdateKeyDates,
	formatViewKeyDates
} from '../../components/form/form-key-dates-components.controller.js';
import { handleErrors } from '../case/applications-create-case.controller.js';

/** @typedef {import('./applications-create-key-dates.types').ApplicationsCreateKeyDatesProps} ApplicationsCreateKeyDatesProps */
/** @typedef {import('./applications-create-key-dates.types').ApplicationsCreateKeyDatesBody} ApplicationsCreateKeyDatesBody */

const keyDatesLayout = {
	pageTitle: 'What are the key dates of the case?',
	components: ['date-published', 'date-internal']
};

/**
 * View the key dates step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateKeyDatesProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateKeyDates(request, response) {
	const properties = await formatViewKeyDates(request, response.locals);

	return response.render('applications/case-form/case-form-layout', {
		...properties,
		layout: keyDatesLayout
	});
}

/**
 * View the key dates step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateKeyDatesProps,
 * {}, ApplicationsCreateKeyDatesBody, {}, {}>}
 */
export async function updateApplicationsCreateKeyDates(request, response) {
	const { properties, updatedApplicationId } = await formatUpdateKeyDates(request, response.locals);

	if (properties.errors || !updatedApplicationId) {
		return handleErrors(properties, keyDatesLayout, response);
	}

	return response.redirect(
		`/applications-service/create-new-case/${updatedApplicationId}/check-your-answers`
	);
}
