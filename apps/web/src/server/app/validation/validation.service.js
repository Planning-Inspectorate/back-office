import request from './../../lib/request.js';

export async function findAllNewIncompleteAppeals() {
	const data = await request('validation');

	return data;
}

export async function findAppealById(id) {
	const data = await request(`validation/${id}`);

	return data;
}
