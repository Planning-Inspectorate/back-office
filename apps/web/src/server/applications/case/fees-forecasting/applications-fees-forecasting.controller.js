import { getFeesForecastingIndexViewModel } from './applications-fees-forecasting-index.view-model.js';
import { getFeesForecastingEditViewModel } from './applications-fees-forecasting-edit.view-model.js';
import {
	getInvoices,
	getMeetings,
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

	if (editViewModel.componentType === 'date-input') {
		values[fieldName] = response.locals.case.keyDates.preApplication?.[fieldName] || '';

		return response.render(
			`applications/case-fees-forecasting/fees-forecasting-edit-dateinput.njk`,
			{
				...editViewModel,
				values
			}
		);
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
	let apiErrors;

	if (editViewModel.componentType === 'date-input') {
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
	}

	if (!validationErrors) {
		if (editViewModel.componentType === 'date-input') {
			const { errors } = await updateFeesForecasting(caseId, sectionName, feesForecastingData);
			apiErrors = errors;
		}
	}

	if (validationErrors || apiErrors) {
		if (editViewModel.componentType === 'date-input') {
			return response.render(
				`applications/case-fees-forecasting/fees-forecasting-edit-dateinput.njk`,
				{
					...editViewModel,
					errors: validationErrors || apiErrors,
					values
				}
			);
		}
	}

	return response.redirect(`../fees-forecasting`);
}
