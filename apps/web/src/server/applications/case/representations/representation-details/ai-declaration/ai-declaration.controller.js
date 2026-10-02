import { getRepresentationDetails } from '../applications-relevant-rep-details.service.js';
import { getAiDeclarationViewModel } from './ai-declaration.view-model.js';
import { patchRepresentationNoMap } from '../../representation/representation.service.js';
import { getFormattedErrorSummary } from '../../representation/representation.utilities.js';

const view = 'applications/representations/representation-details/ai-declaration.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const getAiDeclarationController = async (req, res) => {
	const { caseId, representationId } = res.locals;

	const representationDetails = await getRepresentationDetails(caseId, representationId);

	return res.render(view, {
		...getAiDeclarationViewModel(caseId, representationId, representationDetails, null)
	});
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const postAiDeclarationController = async ({ body, errors }, res) => {
	const { caseId, representationId } = res.locals;

	if (errors) {
		const representationDetails = await getRepresentationDetails(caseId, representationId);

		return res.render(view, {
			...getAiDeclarationViewModel(caseId, representationId, representationDetails, body.useOfAI),
			errors,
			errorSummary: getFormattedErrorSummary(errors)
		});
	}

	const payload = {
		useOfAI: body.useOfAI
	};

	await patchRepresentationNoMap(caseId, String(representationId), '', payload);

	res.redirect(
		`/applications-service/case/${caseId}/relevant-representations/${representationId}/representation-details`
	);
};
