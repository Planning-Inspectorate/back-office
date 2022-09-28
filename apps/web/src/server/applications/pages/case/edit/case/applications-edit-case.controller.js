import {
	caseNameAndDescriptionData,
	caseNameAndDescriptionDataUpdate
} from '../../../../components/form/form-case-components.controller.js';
import { handleErrors } from '../../../create/case/applications-create-case.controller.js';

// TODO: this is just a test. Complete developing of this page will follow

const nameLayout = {
	pageTitle: 'Enter project name (work in progress)',
	components: ['title'],
	isEdit: true,
	backLink: 'check-your-answers'
};
const descriptionLayout = {
	pageTitle: 'Edit description (work in progress)',
	components: ['description'],
	isEdit: true,
	backLink: 'check-your-answers'
};

/** @typedef {import('../../../create/case/applications-create-case.types').ApplicationsCreateCaseNameProps} ApplicationsCreateCaseNameProps */
/** @typedef {import('../../../create/case/applications-create-case.types').ApplicationsCreateCaseNameBody} ApplicationsCreateCaseNameBody */

/**
 * View the form step for editing the application title
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseNameProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsEditCaseName(request, response) {
	const properties = await caseNameAndDescriptionData(request, response.locals);

	response.render('applications/case-form/case-form-layout', { ...properties, layout: nameLayout });
}

/**
 * Edit the application name and description
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseNameProps, {}, ApplicationsCreateCaseNameBody, {}, {}>}
 */
export async function updateApplicationsEditCaseNameAndDescription(request, response) {
	const { properties, updatedApplicationId } = await caseNameAndDescriptionDataUpdate(
		request,
		response.locals
	);

	if (properties.errors || !updatedApplicationId) {
		return handleErrors(properties, nameLayout, response);
	}

	response.redirect(`/applications-service/case/${updatedApplicationId}`);
}

/**
 * View the form step for editing the case description
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseNameProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsEditCaseDescription(request, response) {
	const properties = await caseNameAndDescriptionData(request, response.locals);

	response.render('applications/case-form/case-form-layout', {
		...properties,
		layout: descriptionLayout
	});
}
