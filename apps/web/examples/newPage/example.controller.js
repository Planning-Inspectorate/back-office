import logger from '../../src/server/lib/logger.js';
import * as exampleService from './example.service.js';

/** @typedef {import('./example.types').Example} Example */

/**
 * @typedef {object} ViewAllExamplesRenderOptions
 * @property {Example[]} allExamplesFormatted
 */

/** @type {import('@pins/express').RenderHandler<ViewAllExamplesRenderOptions>}  */
export async function viewAllExamples(request, response) {
	const allExamples = await exampleService.getAllExample();

	// Best to check that we have data, as we likely will not be able to display a page if we don't
	if (allExamples) {
		// Question: should we create mapper to contain the code below
		const allExamplesFormatted = [];

		for (const example of allExamples) {
			if (example) {
				const formattedExample = {
					id: example.id,
					value: example.value
				};

				allExamplesFormatted.push({ ...formattedExample });
			}
		}

		return response.render('./example.njk', { allExamplesFormatted });
	}

	return response.render('../../src/server/views/app/404.njk');
}

/**
 *
 * @typedef {object} ViewExampleRenderOptions
 * @property {Example} exampleFormatted
 */

/** @type {import('@pins/express').RenderHandler<ViewExampleRenderOptions>}  */
export async function viewExampleById(request, response) {
	const example = await exampleService.getExampleById(request.params.id);

	// Best to check that we have data, as we likely will not be able to display a page if we don't
	if (example) {
		// Question: should we create mapper to contain the code below
		const exampleFormatted = {
			id: example.id,
			value: example.value
		};

		return response.render('./example.njk', { exampleFormatted });
	}

	return response.render('../../src/server/views/app/404.njk');
}

/**
 *
 * @typedef {object} SetExampleRenderOptions
 * @property {Example} apiResponse
 */

/** @type {import('@pins/express').RenderHandler<SetExampleRenderOptions>}  */
export async function setExample(request, response) {
	const dataToUpload = request.body;

	try {
		const apiResponse = await exampleService.setExample(dataToUpload);

		return response.render('./example.njk', { apiResponse });
	} catch (error) {
		logger.error(error, 'Attempted to set example but something went wrong');

		return response.render('../../src/server/views/app/500.njk');
	}
}

/**
 *
 * @typedef {object} UpdateExampleRenderOptions
 * @property {Example} apiResponse
 */

/** @type {import('@pins/express').RenderHandler<UpdateExampleRenderOptions>}  */
export async function updateExampleById(request, response) {
	const dataToUpdate = request.body;

	try {
		const apiResponse = await exampleService.updateExampleById(request.params.id, dataToUpdate);

		return response.render('./example.njk', { apiResponse });
	} catch (error) {
		logger.error(error, 'Attempted to update example but something went wrong');

		return response.render('../../src/server/views/app/500.njk');
	}
}
