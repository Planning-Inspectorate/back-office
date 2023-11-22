import got from 'got';
import config from './config.js';
/**
 *
 * @param {*} submission
 * @returns {Promise<{id: string | null}>}
 */
async function post(submission) {
	try {
		const result = await got
			.post(`https://${config.API_HOST}/appeals/employee-import`, {
				json: submission
			})
			.json();

		return result;
	} catch (err) {
		throw new Error(`post employee submission failed with error: ${err}`);
	}
}

export default {
	post
};
