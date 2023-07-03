import { patchRepresentationNoMap } from '../representation.service.js';
import { getFormattedErrorSummary } from '../representation.utilities.js';
import { getCheckAnswersViewModel } from './check-answers.view-model.js';
import { getCheckAnswerErrors } from './utils/get-check-answer-errors.js';

const view = 'applications/representations/representation/check-answers/index.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getCheckAnswersController = async (req, res) =>
	res.render(view, getCheckAnswersViewModel(req.params.caseId, res.locals));

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const postCheckAnswersController = async (req, res) => {
	const { errors, params, query } = req;
	const { locals } = res;
	const { caseId } = params;
	const { repId } = query;

	const checkAnswersErrors = errors ? getCheckAnswerErrors(locals, errors) : null;

	if (checkAnswersErrors) {
		return res.render(view, {
			...getCheckAnswersViewModel(caseId, locals),
			errors: checkAnswersErrors,
			errorSummary: getFormattedErrorSummary(checkAnswersErrors)
		});
	}

	await patchRepresentationNoMap(caseId, String(repId), '', {
		status: 'AWAITING_REVIEW'
	});

	return res.redirect(locals.representation.pageLinks.redirectUrl);
};
