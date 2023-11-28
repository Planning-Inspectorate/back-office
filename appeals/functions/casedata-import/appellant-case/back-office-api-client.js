import got from 'got';
import config from './config.js';
/**
 *
 * @param {*} submission
 * @returns {Promise<{caseReference: string | null}>}
 */
async function post(submission) {
	try {
		const result = await got
			.post(`https://${config.API_HOST}/appeals/case-submission`, {
				json: submission
			})
			.json();

		return result;
	} catch (err) {
		throw new Error(`post case submission failed with error: ${err}`);
	}
}

export default {
	post
};
