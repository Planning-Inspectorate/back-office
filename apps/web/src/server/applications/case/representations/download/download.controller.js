import { stream } from '../../../../lib/request.js';
/**
 *
 * @param {object} req
 * @param {*} req.params
 * @param {*} req.body
 * @param {object} res
 * @param {*} res.pipe
 * @return {Promise<any>}
 */
export const getRepDownloadController = async (req, res) =>
	stream(`applications/${req.params.caseId}/representations/download`).pipe(res);
