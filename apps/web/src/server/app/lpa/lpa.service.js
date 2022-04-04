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
