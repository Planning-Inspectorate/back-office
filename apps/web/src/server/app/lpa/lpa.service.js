import request from './../../lib/request.js';
import { lpaRoutesConfig as routes } from '../../config/routes.js';

export async function findAllIncomingIncompleteQuestionnaires() {
	const data = await request('case-officer');

	const questionnairesListData = {
		incomingQuestionnaires: [],
		incompleteQuestionnaires: []
	};

	// eslint-disable-next-line unicorn/no-array-for-each
	data.forEach((item) => {
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
				? `<a href="/lpa/${routes.reviewQuestionnaire.path}/${item.AppealId}">${item.AppealReference}</a>`
				: item.AppealReference
			},
			{ text: item.QuestionnaireDueDate },
			{ text: item.AppealSite },
			{ html: `<strong class="govuk-tag govuk-tag--${statusTagColor}">${item.QuestionnaireStatus}</strong>` }
		];

		if (item.QuestionnaireStatus === 'incomplete') {
			questionnairesListData.incompleteQuestionnaires.push(row);
		} else {
			questionnairesListData.incomingQuestionnaires.push(row);
		}
	});

	return questionnairesListData;
}

export async function findQuestionnaireById(id) {
	const data = await request(`case-officer/${id}`);

	const questionnaireData = {
		...data,
		AppealSiteHtml: data.AppealSite.replaceAll(',', '<br />')
	};

	return questionnaireData;
}
