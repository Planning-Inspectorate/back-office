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
	let apiErrors;

	if (Object.keys(body).find((key) => key.includes('year'))) {
		const allDateFields = Object.keys(body)
			.filter((key) => key.indexOf('year') > 1)
			.map((key) => key.replace('.year', ''));

		allDateFields.forEach((dateField) => {
			const day = body[`${dateField}.day`];
			const month = body[`${dateField}.month`];
			const year = body[`${dateField}.year`];

			if (validationErrors && validationErrors[dateField]) {
				validationErrors[dateField].value = { day, month, year };
			} else {
				const date = new Date(`${year}-${month}-${day}`);

				if (isValid(date)) {
					feesForecastingData[dateField] = date;
				}
			}
		});
	}

	if (!validationErrors) {
		const { errors } = await updateFeesForecasting(caseId, sectionName, feesForecastingData);
		apiErrors = errors;
	}

	if (validationErrors || apiErrors) {
		const fieldName = editViewModel?.fieldName || '';
		const values = fieldName && validationErrors ? validationErrors[fieldName].value : {};

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
