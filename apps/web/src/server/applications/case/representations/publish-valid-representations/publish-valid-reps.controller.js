import { getCase } from '../../../common/services/case.service.js';
import { getPublishableReps } from '../applications-relevant-reps.service.js';

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
		backLinkUrl: `${serviceUrl}/case/${caseId}/relevant-representations`,
		pageHeading: 'Publish all valid representations',
		projectName,
		publishableRepsCount
	});
};
