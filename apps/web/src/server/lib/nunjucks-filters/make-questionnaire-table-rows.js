import appealSiteObjectToText from "./appeal-site-object-to-text.js";

export default function makeQuestionnaireTableRows (questionnairesListData, reviewQuestionnairePath) {
	const rows = [];

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

		rows.push([
			{ html: item.QuestionnaireStatus === 'received'
				? `<a href="/lpa/${reviewQuestionnairePath}/${item.AppealId}">${item.AppealReference}</a>`
				: item.AppealReference
			},
			{ text: item.QuestionnaireDueDate },
			// eslint-disable-next-line unicorn/no-array-reduce
			{ text: appealSiteObjectToText(item.AppealSite) },
			{ html: `<strong class="govuk-tag govuk-tag--${statusTagColor}">${item.QuestionnaireStatus}</strong>` }
		]);
	});

	return rows;
}
