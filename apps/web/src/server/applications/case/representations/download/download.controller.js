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
export const getRepDownloadController = async (req, res) => {
	const { caseId } = req.params;
	if (Number(caseId) < 0) throw new Error('Bad request');

	return stream(`applications/${caseId}/representations/download`).pipe(res);
};
