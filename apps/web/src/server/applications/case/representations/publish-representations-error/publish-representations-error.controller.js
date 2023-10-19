import { representationsUrl } from '../config.js';

const view = 'applications/representations/publish-representations-error.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getPublishRepresentationsErrorController = async (req, res) => {
	const { params } = req;
	const { caseId } = params;
	const {
		locals: { serviceUrl }
	} = res;

	return res.render(view, { backLinkUrl: `${serviceUrl}/case/${caseId}/${representationsUrl}` });
};
