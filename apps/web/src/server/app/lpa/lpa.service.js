import request from './../../lib/request.js';

/**
 * Call the API to get all incoming and incomplete questionnaires
 *
 * @returns {object} - questionnaires list data object containing two arrays, one for incoming questionnaires and one for incomplete questionnaires
 */
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

/**
 * Call the API to get all incoming and incomplete questionnaires
 *
 * @param {string} id - numerical appeal id of the desired questionnaire
 * @returns {object} - questionnaires list data object containing two arrays, one for incoming questionnaires and one for incomplete questionnaires
 */
export async function findQuestionnaireById(id) {
	const data = await request(`case-officer/${id}`);

	return data;
}
