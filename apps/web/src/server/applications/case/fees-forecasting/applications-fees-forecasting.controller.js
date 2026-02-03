import { getFeesForecastingIndexViewModel } from './applications-fees-forecasting-index.view-model.js';
import { getFeesForecastingEditViewModel } from './applications-fees-forecasting-edit.view-model.js';
import {
	getInvoices,
	getMeetings,
	postNewFee,
	updateFeesForecasting
} from './applications-fees-forecasting.service.js';
import { isValid } from 'date-fns';

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
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, { sectionName: string }>}
 */
export function getFeesForecastingEditSection(request, response) {
	const projectName = response.locals.case.title;
	const sectionName = request.params.sectionName;

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
	}
}

/**
 * Update fees and forecasting data
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, Record<string, string>, {}, { sectionName: string }>}
 */
export async function updateFeesForecastingEditSection(
	{ body, errors: validationErrors, params },
	response
) {
	const { caseId } = response.locals;
	const projectName = response.locals.case.title;
	const { sectionName } = params;

	/** @type {Record<string, any>} */
	const editViewModel = getFeesForecastingEditViewModel(projectName, sectionName);

	/** @type {Record<string, any>} */
	let feesForecastingData = {};
	/** @type {Record<string, any>} */
	let values = {};
	/** @type {any} */
	let apiErrors;

	switch (editViewModel.componentType) {
		case 'date-input': {
			const fieldName = editViewModel?.fieldName || '';
			const day = body[`${fieldName}.day`];
			const month = body[`${fieldName}.month`];
			const year = body[`${fieldName}.year`];

			if (validationErrors && validationErrors[fieldName]) {
				validationErrors[fieldName].value = { day, month, year };
			} else {
				const date = new Date(`${year}-${month}-${day}`);

				values[fieldName] = Math.floor(date.getTime() / 1000);

				// To align with key dates, users can submit three empty date fields to clear the date from the index page, which requires a null value to be set to replace the existing date in the database.
				isValid(date)
					? (feesForecastingData[fieldName] = date)
					: (feesForecastingData[fieldName] = null);
			}

			break;
		}
		case 'add-new-fee': {
			Object.keys(body).forEach((key) => {
				const dateFieldMatch = key.match(
					/^(invoicedDate|paymentDueDate|paymentDate|refundIssueDate)\.(day|month|year)$/
				);
				if (dateFieldMatch) {
					const fieldName = dateFieldMatch[1];
					const day = body[`${fieldName}.day`];
					const month = body[`${fieldName}.month`];
					const year = body[`${fieldName}.year`];

					if (validationErrors && validationErrors[fieldName]) {
						validationErrors[fieldName].value = { day, month, year };
					} else {
						const date = new Date(`${year}-${month}-${day}`);
						if (isValid(date)) {
							values[fieldName] = Math.floor(date.getTime() / 1000);
							feesForecastingData[fieldName] = date;
						}
					}
				} else {
					if (body[key] !== '') {
						values[key] = body[key];
						feesForecastingData[key] = body[key];
					}
				}
			});

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
			case 'add-new-fee': {
				return renderError(`applications/case-fees-forecasting/fees-forecasting-manage-fee.njk`);
			}
		}
	}

	return response.redirect(`../fees-forecasting`);
}
