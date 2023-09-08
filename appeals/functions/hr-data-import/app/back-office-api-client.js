import got from 'got';
import config from './config.js';
/**
 *
 * @param {*} submission
 * @returns {Promise<{id: string | null}>}
 */
function post(submission) {
	return got
		.post(`https://${config.API_HOST}/appeals/employee-import`, {
			json: submission
		})
		.json();
}

export default {
	post
};
