import request from './../../lib/request.js';

export async function findAllNewIncompleteAppeals() {
	const data = await request('validation');

	return data;
}
