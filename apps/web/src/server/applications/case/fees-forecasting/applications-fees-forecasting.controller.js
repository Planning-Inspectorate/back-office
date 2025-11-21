/**
 * View the index of all the data on the fees and forecasting page
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}>}
 */
export async function getFeesForecastingIndex(request, response) {
	return response.render(`applications/case-fees-forecasting/fees-forecasting-index.njk`, {
		selectedPageType: 'fees-forecasting'
	});
}
