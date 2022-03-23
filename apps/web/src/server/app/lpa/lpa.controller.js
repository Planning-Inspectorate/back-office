import { to } from 'planning-inspectorate-libs';
import { findAllIncomingIncompleteQuestionnaires } from './lpa.service.js';
import { lpaRoutesConfig as routes } from '../../config/routes.js';

/**
 * GET the main dashboard.
 * It will fetch the questionnaires list (incoming, incomplete) and will render all.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export async function getLpaDashboard(request, response, next) {
	let error, questionnairesList;

	// eslint-disable-next-line prefer-const
	[error, questionnairesList] = await to(findAllIncomingIncompleteQuestionnaires());

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		return;
	}

	response.render(routes.home.view, {
		questionnairesList
	});
}
