import { patchRepresentationNoMap } from '../representation/representation.service.js';
import { getFormattedErrorSummary } from '../representation/representation.utilities.js';
import { getRepresentationBaseUrl } from '../representation/utils/get-representation-page-urls.js';
import { getRepresentationDetailsViewModel } from './applications-relevant-rep-details.view-model.js';
import { getCheckAnswerErrors } from './utils/get-check-answer-errors.js';

const view = 'applications/representations/representation-details/index.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getRepresentationDetailsController = async (req, res) =>
	res.render(view, await getRepresentationDetailsViewModel(req.params, req.query, res.locals));

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const postRepresentationDetailsController = async (req, res) => {
	const { errors, params, query } = req;
	const { locals } = res;
	const { caseId, representationId } = params;

	const checkAnswersErrors = errors ? getCheckAnswerErrors(locals, errors) : null;

	if (checkAnswersErrors) {
		return res.render(view, {
			...(await getRepresentationDetailsViewModel(params, query, locals)),
			errors: checkAnswersErrors,
			errorSummary: getFormattedErrorSummary(checkAnswersErrors)
		});
	}

	await patchRepresentationNoMap(caseId, String(representationId), '', {
		status: 'AWAITING_REVIEW'
	});

	return res.redirect(getRepresentationBaseUrl(caseId));
};
