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
	let error, questionnairesListData;
	const incomingQuestionnaires = [];
	const incompleteQuestionnaires = [];

	// eslint-disable-next-line prefer-const
	[error, questionnairesListData] = await to(findAllIncomingIncompleteQuestionnaires());

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		return;
	}

	// eslint-disable-next-line unicorn/no-array-for-each
	questionnairesListData.forEach((item) => {
		let statusTagColor;

		switch (item.QuestionnaireStatus) {
			case 'overdue':
				statusTagColor = 'red';
				break;
			case 'awaiting':
			case 'incomplete':
				statusTagColor = 'blue';
				break;
			case 'received':
			default:
				statusTagColor = 'green';
				break;
		}

		const row = [
			{ html: item.QuestionnaireStatus === 'received'
				? `<a href="/lpa/${routes.reviewQuestionnaireRoute.path}/${item.AppealId}">${item.AppealReference}</a>`
				: item.AppealReference
			},
			{ text: item.QuestionnaireDueDate },
			{ text: item.AppealSite },
			{ html: `<strong class="govuk-tag govuk-tag--${statusTagColor}">${item.QuestionnaireStatus}</strong>` }
		];

		if (item.QuestionnaireStatus === 'incomplete') {
			incompleteQuestionnaires.push(row);
		} else {
			incomingQuestionnaires.push(row);
		}
	});

	response.render(routes.home.view, {
		questionnairesList: {
			incomingQuestionnaires,
			incompleteQuestionnaires
		}
	});
}
