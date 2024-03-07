import { stream } from '../../../../lib/request.js';
/**
 *
 * @param {object} _
 * @param {object} res
 * @param {*} res.pipe
 * @param {{caseId: string}} res.locals
 * @return {Promise<any>}
 */
export const getRepDownloadController = async (_, res) => {
	const { caseId } = res.locals;

	return stream(`applications/${caseId}/representations/download`).pipe(res);
};
