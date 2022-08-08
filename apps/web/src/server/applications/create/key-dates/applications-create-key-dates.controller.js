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
	const { firstNotifiedDate, submissionDate } = keyDates || {};

	const values = {
		'keyDates.firstNotifiedDate': firstNotifiedDate,
		'keyDates.submissionDate': submissionDate
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
		firstNotifiedDay,
		firstNotifiedMonth,
		firstNotifiedYear,
		submissionDay,
		submissionMonth,
		submissionYear
	} = body;

	const firstNotifiedSeconds =
		(Date.parse(`${firstNotifiedYear}-${firstNotifiedMonth}-${firstNotifiedDay}`) || 0) / 1000;
	const submissionDateSeconds =
		(Date.parse(`${submissionYear}-${submissionMonth}-${submissionDay}`) || 0) / 1000;
	const firstNotifiedDate = firstNotifiedSeconds > 0 ? `${firstNotifiedSeconds}` : '';
	const submissionDate = submissionDateSeconds > 0 ? `${submissionDateSeconds}` : '';
	const values = {
		'keyDates.firstNotifiedDate': firstNotifiedDate,
		'keyDates.submissionDate': submissionDate
	};

	const payload = {
		keyDates: {
			submissionDate,
			firstNotifiedDate
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
