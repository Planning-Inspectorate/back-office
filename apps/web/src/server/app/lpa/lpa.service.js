import request from './../../lib/request.js';

export async function findAllIncomingIncompleteQuestionnaires() {
	const data = await request('case-officer');

	return data;
}
