import logger from '../../../../lib/logger.js';
import {
	getCase,
	getPublishableRepresentaions,
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

const view = 'applications/representations/publish-updated-representations.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getPublishUpdatedRepresentationsController = async (req, res) => {
	const { params } = req;
	const { caseId } = params;
	const {
		locals: { serviceUrl }
	} = res;

	const project = await getCase(caseId);
	const publishableRepresentaions = await getPublishableRepresentaions(caseId);

	return res.render(
		view,
		getPublishUpdatedRepresentationsViewModel(
			caseId,
			serviceUrl,
			project,
			publishableRepresentaions
		)
	);
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const postPublishUpdatedRepresentationsController = async (req, res) => {
	try {
		const { body, params, session } = req;
		const { caseId } = params;
		const { representationId } = body;
		const {
			locals: { serviceUrl }
		} = res;

		const representationIds = formatRepresentationIds(representationId);

		const publishRepresentationsPayload = getPublishRepresentationsPayload(
			session,
			representationIds
		);
		const publishRepresentationsRespone = await publishRepresentations(
			caseId,
			publishRepresentationsPayload
		);
		const numberOfRepresentationsPublished = getNumberOfRepresentationsPublished(
			publishRepresentationsRespone
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
