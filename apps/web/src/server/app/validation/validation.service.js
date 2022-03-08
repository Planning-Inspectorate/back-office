import request from './../../lib/request.js';

async function findAllNewAppeals() {
	const data = await request('validation');
	return data;
}

export {
	findAllNewAppeals
};
