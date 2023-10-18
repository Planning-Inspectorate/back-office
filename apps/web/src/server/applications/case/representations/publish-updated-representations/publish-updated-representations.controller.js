import {
	getCase,
	getPublishableRepresentaions,
	publishRepresentations
} from '../applications-relevant-reps.service.js';
import {
	getPublishRepresentationsPayload,
	getPublishedRepresentationsRedirectURL,
	isAllRepresentationsPublished
} from '../utils/publish-representations.js';
import { getPublishUpdatedRepresentationsViewModel } from './publish-updated-representations.view-model.js';
import { formatRepresentationIds } from './utils/format-representation-ids.js';

const view = 'applications/representations/publish-representations.njk';

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
	const redirectURL = getPublishedRepresentationsRedirectURL(
		serviceUrl,
		caseId,
		isAllRepresentationsPublished(publishRepresentationsRespone, representationIds)
	);

	return res.redirect(redirectURL);
};

export { getPublishUpdatedRepresentationsController, postPublishUpdatedRepresentationsController };
