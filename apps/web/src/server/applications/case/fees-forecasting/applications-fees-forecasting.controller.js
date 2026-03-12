import { getFeesForecastingIndexViewModel } from './applications-fees-forecasting-index.view-model.js';
import { getFeesForecastingEditViewModel } from './applications-fees-forecasting-edit.view-model.js';
import { getFeesForecastingDeleteViewModel } from './applications-fees-forecasting-delete.view-model.js';
import {
	deleteFee,
	deleteMeeting,
	getInvoice,
	getInvoices,
	getMeeting,
	getMeetings,
	postNewFee,
	postMeeting,
	updateFee,
	updateFeesForecasting,
	updateMeeting
} from './applications-fees-forecasting.service.js';
import { isValid } from 'date-fns';
import { url } from '../../../lib/nunjucks-filters/url.js';

/**
 * View the index of all the data on the fees and forecasting page
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}>}
 */
export async function getFeesForecastingIndex(request, response) {
	const { caseId } = response.locals;
	const [invoices, meetings] = await Promise.all([getInvoices(caseId), getMeetings(caseId)]);

	const indexViewModel = getFeesForecastingIndexViewModel({
		caseData: response.locals.case,
		invoices,
		meetings
	});

	return response.render(
		`applications/case-fees-forecasting/fees-forecasting-index.njk`,
		indexViewModel
	);
}

/**
 * View the fees and forecasting edit page
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, { sectionName?: string, caseId?: string, feeId?: string, meetingId?: string }>}
 */
export async function getFeesForecastingEditSection(request, response) {
	/** @type {boolean|undefined} */
	const isFeeEdit = /** @type {*} */ (request).isFeeEdit;
	/** @type {boolean|undefined} */
	const isProjectMeetingEdit = /** @type {*} */ (request).isProjectMeetingEdit;
	/** @type {boolean|undefined} */
	const isEvidencePlanMeetingEdit = /** @type {*} */ (request).isEvidencePlanMeetingEdit;
	const { caseId } = response.locals;
	const projectName = response.locals.case.title;
	let sectionName;

	if (isFeeEdit) {
		sectionName = 'manage-fee';
	} else if (isProjectMeetingEdit) {
		sectionName = 'manage-project-meeting';
	} else if (isEvidencePlanMeetingEdit) {
		sectionName = 'manage-evidence-plan-meeting';
	} else {
		sectionName = request.params.sectionName || '';
	}

	/** @type {Record<string, any>} */
	const editViewModel = getFeesForecastingEditViewModel(projectName, sectionName);
	const fieldName = editViewModel?.fieldName || '';
	/** @type {Record<string, any>} */
	let values = {};

	/**
	 * @param {string} template
	 */
	const renderTemplate = (template) => {
		return response.render(template, {
			...editViewModel,
			values
		});
	};

	switch (editViewModel.componentType) {
		case 'date-input':
			values[fieldName] = response.locals.case.keyDates.preApplication?.[fieldName] || '';
			return renderTemplate(
				`applications/case-fees-forecasting/fees-forecasting-edit-dateinput.njk`
			);
		case 'add-new-fee':
			return renderTemplate(`applications/case-fees-forecasting/fees-forecasting-manage-fee.njk`);
		case 'manage-fee': {
			const invoice = await getInvoice(caseId, request.params.feeId || '');
			if (invoice == null) {
				return response.status(404).render(`app/404`);
			}

			Object.entries(invoice).forEach(([key, value]) => {
				values[key] = value;
			});
			return renderTemplate(`applications/case-fees-forecasting/fees-forecasting-manage-fee.njk`);
		}
		case 'add-project-meeting':
			return renderTemplate(
				`applications/case-fees-forecasting/fees-forecasting-manage-project-meeting.njk`
			);
		case 'manage-project-meeting': {
			const meetingId = request.params.meetingId || '';
			const meeting = await getMeeting(caseId, meetingId);

			if (meeting == null) {
				return response.status(404).render(`app/404`);
			}

			Object.entries(meeting).forEach(([key, value]) => {
				values[key] = value;
			});

			values.meetingDate = Math.floor(new Date(meeting.meetingDate).getTime() / 1000);

			const radioAgendas = [
				'Project Update Meeting (PUM)',
				'Multi-Party Meeting (MPM)',
				'Draft document review'
			];

			if (!radioAgendas.includes(meeting.agenda)) {
				values.agenda = 'Other';
				values.otherAgenda = meeting.agenda || '';
			}

			return renderTemplate(
				`applications/case-fees-forecasting/fees-forecasting-manage-project-meeting.njk`
			);
		}
		case 'add-evidence-plan-meeting':
			return renderTemplate(
				`applications/case-fees-forecasting/fees-forecasting-manage-evidence-plan-meeting.njk`
			);
		case 'manage-evidence-plan-meeting': {
			const meetingId = request.params.meetingId || '';
			const meeting = await getMeeting(caseId, meetingId);

			if (meeting == null) {
				return response.status(404).render(`app/404`);
			}

			Object.entries(meeting).forEach(([key, value]) => {
				values[key] = value;
			});

			values.meetingDate = Math.floor(new Date(meeting.meetingDate).getTime() / 1000);

			return renderTemplate(
				`applications/case-fees-forecasting/fees-forecasting-manage-evidence-plan-meeting.njk`
			);
		}
	}
}

/**
 * Update fees and forecasting data
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, Record<string, string>, {}, { sectionName?: string, feeId?: string, meetingId?: string }>}
 */
export async function updateFeesForecastingEditSection(request, response) {
	const { body, errors: validationErrors, params } = request;
	/** @type {boolean|undefined} */
	const isFeeEdit = /** @type {*} */ (request).isFeeEdit;
	/** @type {boolean|undefined} */
	const isProjectMeetingEdit = /** @type {*} */ (request).isProjectMeetingEdit;
	/** @type {boolean|undefined} */
	const isEvidencePlanMeetingEdit = /** @type {*} */ (request).isEvidencePlanMeetingEdit;
	const { caseId } = response.locals;
	const projectName = response.locals.case.title;
	let sectionName;

	if (isFeeEdit) {
		sectionName = 'manage-fee';
	} else if (isProjectMeetingEdit) {
		sectionName = 'manage-project-meeting';
	} else if (isEvidencePlanMeetingEdit) {
		sectionName = 'manage-evidence-plan-meeting';
	} else {
		sectionName = params.sectionName || '';
	}

	/** @type {Record<string, any>} */
	const editViewModel = getFeesForecastingEditViewModel(projectName, sectionName);

	/** @type {Record<string, any>} */
	let feesForecastingData = {};
	/** @type {Record<string, any>} */
	let values = {};
	/** @type {any} */
	let apiErrors;

	/**
	 * @param {string} fieldName
	 */
	const mapDateValues = (fieldName) => {
		const day = body[`${fieldName}.day`];
		const month = body[`${fieldName}.month`];
		const year = body[`${fieldName}.year`];

		// Allows date to be cleared if all three date fields are empty to align with key dates
		if (validationErrors && validationErrors[fieldName]) {
			validationErrors[fieldName].value = { day, month, year };
		} else {
			const date = new Date(`${year}-${month}-${day}`);
			if (isValid(date)) {
				values[fieldName] = Math.floor(date.getTime() / 1000);
				feesForecastingData[fieldName] = date;
			} else {
				feesForecastingData[fieldName] = null;
			}
		}
	};

	switch (editViewModel.componentType) {
		case 'date-input': {
			const fieldName = editViewModel?.fieldName || '';
			mapDateValues(fieldName);
			break;
		}
		case 'add-new-fee':
		case 'manage-fee': {
			Object.keys(body).forEach((key) => {
				const dateFieldMatch = key.match(
					/^(invoicedDate|paymentDueDate|paymentDate|refundIssueDate)\.(day|month|year)$/
				);
				if (dateFieldMatch) {
					mapDateValues(dateFieldMatch[1]);
				} else {
					values[key] = body[key] || null;
					feesForecastingData[key] = body[key] || null;
				}
			});

			break;
		}
		case 'add-project-meeting':
		case 'manage-project-meeting': {
			Object.keys(body).forEach((key) => {
				const dateFieldMatch = key.match(/^(meetingDate)\.(day|month|year)$/);

				if (dateFieldMatch) {
					mapDateValues(dateFieldMatch[1]);
				}
			});

			if (body.agenda === 'Other') {
				feesForecastingData.agenda = body?.otherAgenda || '';
				values.otherAgenda = body?.otherAgenda || '';
			} else {
				feesForecastingData.agenda = body.agenda;
			}

			values.agenda = body.agenda;
			feesForecastingData.meetingType = 'project';

			break;
		}
		case 'add-evidence-plan-meeting':
		case 'manage-evidence-plan-meeting': {
			Object.keys(body).forEach((key) => {
				const dateFieldMatch = key.match(/^(meetingDate)\.(day|month|year)$/);

				if (dateFieldMatch) {
					mapDateValues(dateFieldMatch[1]);
				} else {
					if (body[key] !== '') {
						values[key] = body[key];
						feesForecastingData[key] = body[key];
					}
				}
			});

			feesForecastingData.meetingType = 'evidence_plan';

			break;
		}
	}

	if (!validationErrors) {
		switch (editViewModel.componentType) {
			case 'date-input': {
				const { errors } = await updateFeesForecasting(caseId, sectionName, feesForecastingData);
				apiErrors = errors;
				break;
			}
			case 'add-new-fee': {
				const { errors } = await postNewFee(caseId, feesForecastingData);
				apiErrors = errors;
				break;
			}
			case 'manage-fee': {
				const { errors } = await updateFee(caseId, feesForecastingData, params.feeId || '');
				apiErrors = errors;
				break;
			}
			case 'add-project-meeting':
			case 'add-evidence-plan-meeting': {
				const { errors } = await postMeeting(caseId, feesForecastingData);
				apiErrors = errors;
				break;
			}
			case 'manage-project-meeting':
			case 'manage-evidence-plan-meeting': {
				const meetingId = params?.meetingId || '';
				const { errors } = await updateMeeting(caseId, meetingId, feesForecastingData);
				apiErrors = errors;
				break;
			}
		}
	}

	if (validationErrors || apiErrors) {
		/**
		 * @param {string} template
		 */
		const renderError = (template) => {
			return response.render(template, {
				...editViewModel,
				errors: validationErrors || apiErrors,
				values
			});
		};

		switch (editViewModel.componentType) {
			case 'date-input': {
				return renderError(
					`applications/case-fees-forecasting/fees-forecasting-edit-dateinput.njk`
				);
			}
			case 'add-new-fee':
			case 'manage-fee': {
				return renderError(`applications/case-fees-forecasting/fees-forecasting-manage-fee.njk`);
			}
			case 'add-project-meeting':
			case 'manage-project-meeting': {
				return renderError(
					`applications/case-fees-forecasting/fees-forecasting-manage-project-meeting.njk`
				);
			}
			case 'add-evidence-plan-meeting':
			case 'manage-evidence-plan-meeting': {
				return renderError(
					`applications/case-fees-forecasting/fees-forecasting-manage-evidence-plan-meeting.njk`
				);
			}
		}
	}

	return response.redirect(url('fees-forecasting', { caseId }));
}

/**
 * View the fees and forecasting delete confirmation page
 *
 * @param {import('express').Request<{ feeId: string, meetingId: string, caseId?: string }> & { isFeeDeletion?: boolean, isProjectMeetingDeletion?: boolean }} request
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
export async function getFeesForecastingDeleteSection(request, response) {
	const { caseId } = response.locals;
	const projectName = response.locals.case.title;
	let deleteSectionViewModel;

	if (request.isFeeDeletion) {
		const { feeId } = request.params;
		const invoice = await getInvoice(caseId, feeId);
		deleteSectionViewModel = getFeesForecastingDeleteViewModel(projectName, 'manage-fee', invoice);
	} else if (request.isProjectMeetingDeletion) {
		const { meetingId } = request.params;
		const meeting = await getMeeting(caseId, meetingId);
		deleteSectionViewModel = getFeesForecastingDeleteViewModel(
			projectName,
			'manage-project-meeting',
			meeting
		);
	}

	return response.render(
		`applications/case-fees-forecasting/fees-forecasting-delete-confirmation.njk`,
		deleteSectionViewModel
	);
}

/**
 * Handle the deletion of fees and forecasting data
 *
 * @param {import('express').Request<{ feeId: string, meetingId: string }> & { isFeeDeletion?: boolean, isProjectMeetingDeletion?: boolean }} request
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
export async function deleteFeesForecastingField(request, response) {
	const { caseId } = response.locals;
	const projectName = response.locals.case.title;

	if (request.isFeeDeletion) {
		const { feeId } = request.params;
		const { errors } = await deleteFee(caseId, feeId);

		if (errors) {
			const invoice = await getInvoice(caseId, feeId);
			const deleteSectionViewModel = getFeesForecastingDeleteViewModel(
				projectName,
				'manage-fee',
				invoice
			);
			return response.render(
				`applications/case-fees-forecasting/fees-forecasting-delete-confirmation.njk`,
				{
					...deleteSectionViewModel,
					errors
				}
			);
		}
	} else if (request.isProjectMeetingDeletion) {
		const { meetingId } = request.params;
		const meeting = await getMeeting(caseId, meetingId);
		const meetingAgenda = meeting?.agenda || 'Meeting';
		const { errors } = await deleteMeeting(caseId, meetingId, meetingAgenda);

		if (errors) {
			const deleteSectionViewModel = getFeesForecastingDeleteViewModel(
				projectName,
				'manage-project-meeting',
				meeting
			);
			return response.render(
				`applications/case-fees-forecasting/fees-forecasting-delete-confirmation.njk`,
				{
					...deleteSectionViewModel,
					errors
				}
			);
		}
	}

	return response.redirect(url('fees-forecasting', { caseId }));
}
