import logger from '../../../../lib/logger.js';
import { getCase } from '../../../common/services/case.service.js';
import {
	getPublishableRepresentaions,
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
	const {
		params: { caseId }
	} = req;
	const {
		locals: { serviceUrl }
	} = res;

	const { title: projectName } = await getCase(Number(caseId));
	const { itemCount: publishableRepsCount } = await getPublishableRepresentaions(caseId);

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
		const {
			params: { caseId },
			session
		} = req;
		const {
			locals: { serviceUrl }
		} = res;

		const { items } = await getPublishableRepresentaions(caseId);

		const representationIds = items.map((/** @type {{ id: number; }} */ rep) => rep.id);

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
