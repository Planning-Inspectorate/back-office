import { stream } from '../../../../lib/request.js';
/**
 *
 * @param {object} _
 * @param {object} res
 * @param {*} res.pipe
 * @param {{caseId: string}} res.locals
 * @return {Promise<any>}
 */
export const getPublishedRepDownloadController = async (_, res) => {
	const { caseId } = res.locals;

	return stream(`applications/${caseId}/representations/download/published`).pipe(res);
};

/**
 *
 * @param {object} _
 * @param {object} res
 * @param {*} res.pipe
 * @param {{caseId: string}} res.locals
 * @return {Promise<any>}
 */
export const getValidRepDownloadController = async (_, res) => {
	const { caseId } = res.locals;

	return stream(`applications/${caseId}/representations/download/valid`).pipe(res);
};
