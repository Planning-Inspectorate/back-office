import { representationsUrl } from '../config.js';

const view = 'applications/representations/unpublish-representations-error.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getUnpublishRepresentationsErrorController = async (req, res) => {
	const caseId = req.params.caseId || req.query.caseId;
	const {
		locals: { serviceUrl }
	} = res;

	return res.render(view, { backLinkUrl: `${serviceUrl}/case/${caseId}/${representationsUrl}` });
};
