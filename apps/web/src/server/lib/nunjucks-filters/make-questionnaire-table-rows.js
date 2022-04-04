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
			{ text: Object.keys(item.AppealSite).reduce((accumulator, key) => {
				if (item.AppealSite[key]) accumulator += (accumulator.length > 0 ? ', ' : '') + item.AppealSite[key];
				return accumulator;
			}, '') },
			{ html: `<strong class="govuk-tag govuk-tag--${statusTagColor}">${item.QuestionnaireStatus}</strong>` }
		]);
	});

	return rows;
}
