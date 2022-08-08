import * as applicationsCreateCaseService from '../case/applications-create-case.service.js';

/** @typedef {import('./applications-create-key-dates.types').ApplicationsCreateKeyDatesProps} ApplicationsCreateKeyDatesProps */
/** @typedef {import('./applications-create-key-dates.types').ApplicationsCreateKeyDatesBody} ApplicationsCreateKeyDatesBody */

/**
 * View the key dates step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateKeyDatesProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateKeyDates(req, response) {
	const { applicationId } = response.locals;
	const { keyDates } = await applicationsCreateCaseService.getApplicationDraft(applicationId);
	const { submissionDatePublished, submissionDateInternal } = keyDates || {};

	const values = {
		'keyDates.submissionDatePublished': submissionDatePublished,
		'keyDates.submissionDateInternal': submissionDateInternal
	};

	return response.render('applications/create/key-dates/_key-dates', { values });
}

/**
 * View the key dates step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateKeyDatesProps,
 * {}, ApplicationsCreateKeyDatesBody, {}, {}>}
 */
export async function updateApplicationsCreateKeyDates(
	{ body, errors: validationErrors },
	response
) {
	const { applicationId } = response.locals;
	const {
		submissionDatePublished,
		submissionInternalDay,
		submissionInternalMonth,
		submissionInternalYear
	} = body;

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
			submissionDateInternal
		}
	};

	const { errors: apiErrors, id: updatedDraftId } =
		await applicationsCreateCaseService.updateApplicationDraft(applicationId, payload);

	if (validationErrors || apiErrors) {
		return response.render('applications/create/key-dates/_key-dates', {
			errors: validationErrors || apiErrors,
			values
		});
	}

	return response.redirect(`/applications-service/create-new-case/${updatedDraftId}/summary`);
}
