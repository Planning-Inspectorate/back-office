import request from './../../lib/request.js';

// TODO: JSDoc comment
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

		item.StatusTagColor = statusTagColor;

		if (item.QuestionnaireStatus === 'incomplete') {
			questionnairesListData.incompleteQuestionnaires.push(item);
		} else {
			questionnairesListData.incomingQuestionnaires.push(item);
		}
	});

	return questionnairesListData;
}

// TODO: JSDoc comment
export async function findQuestionnaireById(id) {
	const data = await request(`case-officer/${id}`);

	return data;
}
