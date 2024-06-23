import logger from '../../../../lib/logger.js';
import { getCase } from '../../../common/services/case.service.js';
import {
	getPublishableRepresentations,
	publishRepresentations
} from '../applications-relevant-reps.service.js';
import { publishRepresentationsErrorUrl, representationsUrl } from '../config.js';
import {
	getNumberOfRepresentationsPublished,
	getPublishRepresentationsPayload,
	getPublishedRepresentationsRedirectURL
} from '../utils/publish-representations.js';

const view = 'applications/representations/publish-valid-representations/index.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getPublishValidRepsController = async (req, res) => {
	const { serviceUrl, caseId } = res.locals;

	const { title: projectName } = await getCase(Number(caseId));
	const { itemCount: publishableRepsCount } = await getPublishableRepresentations(caseId);

	return res.render(view, {
		backLinkUrl: `${serviceUrl}/case/${caseId}/${representationsUrl}`,
		pageHeading: 'Publish all valid representations',
		projectName,
		publishableRepsCount
	});
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const postPublishValidRepsController = async (req, res) => {
	try {
		const { session } = req;
		const { serviceUrl, caseId } = res.locals;

		const { items } = await getPublishableRepresentations(caseId);

		const representationIds = items.map((/** @type {{ id: number; }} */ rep) => rep.id);

		// Publish in batches of 1000 to avoid timeout from slow API response for large quantity of representations
		const batchSize = 1000;
		let numberOfRepresentationsPublished = 0;
		for (let i = 0; i < representationIds.length; i += batchSize) {
			const batch = representationIds.slice(i, i + batchSize);

			const publishRepresentationsPayload = getPublishRepresentationsPayload(session, batch);
			const publishRepresentationsResponse = await publishRepresentations(
				caseId,
				publishRepresentationsPayload
			);
			numberOfRepresentationsPublished += getNumberOfRepresentationsPublished(
				publishRepresentationsResponse
			);
			logger.info(`publishing representations from range ${i} - ${i + batch.length}`);
		}
		const redirectURL = getPublishedRepresentationsRedirectURL(
			serviceUrl,
			caseId,
			numberOfRepresentationsPublished
		);

		return res.redirect(redirectURL);
	} catch {
		logger.error('Failed to publish all representations');
		return res.redirect(publishRepresentationsErrorUrl);
	}
};
