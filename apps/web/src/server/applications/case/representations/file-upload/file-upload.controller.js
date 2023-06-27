import logger from '../../../../lib/logger.js';
import { createRepresentationAttachment } from './file-upload.service.js';

/**
 *
 * @param {object} request
 * @param {*} request.params
 * @param {*} request.body
 * @param {*} res
 * @return {Promise<any>}
 */
export const fileUploadController = async ({ params, body }, res) => {
	try {
		const { caseId, repId } = params;
		const response = await createRepresentationAttachment(caseId, repId, body);
		return res.json(response);
	} catch (e) {
		logger.info('Representation attachment failed: ', e);
	}
};
