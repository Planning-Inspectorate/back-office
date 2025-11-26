import { getFeesForecastingViewModel } from './applications-fees-forecasting-index.view-model.js';
import { getInvoices } from './applications-fees-forecasting.service.js';

/**
 * View the index of all the data on the fees and forecasting page
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}>}
 */
export async function getFeesForecastingIndex(request, response) {
	const { caseId } = response.locals;
	const invoices = await getInvoices(caseId);

	const viewModel = await getFeesForecastingViewModel({ caseData: response.locals.case, invoices });

	return response.render(
		`applications/case-fees-forecasting/fees-forecasting-index.njk`,
		viewModel
	);
}
