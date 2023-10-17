import logger from '../../../../lib/logger.js';
import { getCase } from '../../../common/services/case.service.js';
import { getPublishableReps, publishPublishableReps } from '../applications-relevant-reps.service.js';
import { representationsUrl } from '../config.js';
import { getPublishableRepsPayload } from './_utils/getPublishableRepsPayload.js';

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
	const { itemCount: publishableRepsCount } = await getPublishableReps(caseId);

	res.render(view, {
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
	const { params: { caseId }, session } = req;
	const { locals: { serviceUrl } } = res;

	const { items }  = await getPublishableReps(caseId)
	const payload = getPublishableRepsPayload(session, items)

	const response = await publishPublishableReps(caseId, payload);

	if(response && response.publishedRepIds.length === payload.json.representationIds.length) {
		logger.info(`Successfully published ${response.publishedRepIds} representations for case ${caseId}`);
		res.redirect(`${serviceUrl}/case/${caseId}/${representationsUrl}?published=${response.publishedRepIds.length}`);
	} else {
		res.redirect(`${serviceUrl}/case/${caseId}/${representationsUrl}`);
	}
}