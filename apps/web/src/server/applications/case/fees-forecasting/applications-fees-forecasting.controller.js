import { getFeesForecastingViewModel } from './applications-fees-forecasting-index.view-model.js';

/**
 * View the index of all the data on the fees and forecasting page
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}>}
 */
export async function getFeesForecastingIndex(request, response) {
	console.log(response.locals);
	console.log(response.locals.case.additionalDetails.numberBand2Inspectors);

	const viewModel = await getFeesForecastingViewModel({ caseData: response.locals.case });

	return response.render(
		`applications/case-fees-forecasting/fees-forecasting-index.njk`,
		viewModel
	);
}
