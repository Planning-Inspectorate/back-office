import got from 'got';
import config from './config.js';
/**
 *
 * @param {*} submission
 * @returns {Promise<{reference: string | null}>}
 */
function post(submission) {
	return got
		.post(`https://${config.API_HOST}/appeals/case-submission`, {
			json: submission
		})
		.json();
}

export default {
	post
};
