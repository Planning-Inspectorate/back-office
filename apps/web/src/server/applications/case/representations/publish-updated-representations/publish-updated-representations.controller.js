import logger from '../../../../lib/logger.js';
import {
	getCase,
	getPublishableRepresentations,
	publishRepresentations
} from '../applications-relevant-reps.service.js';
import {
	getNumberOfRepresentationsPublished,
	getPublishRepresentationsPayload,
	getPublishedRepresentationsRedirectURL
} from '../utils/publish-representations.js';
import { getPublishUpdatedRepresentationsViewModel } from './publish-updated-representations.view-model.js';
import { formatRepresentationIds } from './utils/format-representation-ids.js';
import { publishRepresentationsErrorUrl } from '../config.js';
import { getFormattedErrorSummary } from '../representation/representation.utilities.js';

const view = 'applications/representations/publish-updated-representations.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getPublishUpdatedRepresentationsController = async (req, res) => {
	const { caseId } = res.locals;
	const {
		locals: { serviceUrl }
	} = res;

	const project = await getCase(caseId);
	const publishableRepresentations = await getPublishableRepresentations(caseId);

	return res.render(
		view,
		getPublishUpdatedRepresentationsViewModel(
			caseId,
			serviceUrl,
			project,
			publishableRepresentations
		)
	);
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const postPublishUpdatedRepresentationsController = async (req, res) => {
	try {
		const { body, errors, session } = req;
		const { caseId } = res.locals;
		const { representationId } = body;
		const {
			locals: { serviceUrl }
		} = res;

		if (errors) {
			const project = await getCase(caseId);
			const publishableRepresentations = await getPublishableRepresentations(caseId);

			return res.render(view, {
				...getPublishUpdatedRepresentationsViewModel(
					caseId,
					serviceUrl,
					project,
					publishableRepresentations
				),
				errors,
				errorSummary: getFormattedErrorSummary(errors)
			});
		}

		const representationIds = formatRepresentationIds(representationId);

		const publishRepresentationsPayload = getPublishRepresentationsPayload(
			session,
			representationIds
		);
		const publishRepresentationsResponse = await publishRepresentations(
			caseId,
			publishRepresentationsPayload
		);
		const numberOfRepresentationsPublished = getNumberOfRepresentationsPublished(
			publishRepresentationsResponse
		);
		const redirectURL = getPublishedRepresentationsRedirectURL(
			serviceUrl,
			caseId,
			numberOfRepresentationsPublished
		);

		return res.redirect(redirectURL);
	} catch {
		logger.info('No representations were published');
		return res.redirect(publishRepresentationsErrorUrl);
	}
};

export { getPublishUpdatedRepresentationsController, postPublishUpdatedRepresentationsController };
