import { getRepresentationDetails } from '../applications-relevant-rep-details.service.js';
import { getRepresentationDetailsTaskLogViewModel } from './task-list.view-model.js';
import { getContactDetailsByContactType } from '../../representation/representation.middleware.js';

const view = 'applications/representations/representation-details/task-log.njk';

/**
 *  @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {representationId: string, caseId: string}>}
 */
export const getRepresentationDetailsTaskLogController = async (req, res) => {
	const { caseId, representationId } = req.params;
	const representationDetails = await getRepresentationDetails(caseId, representationId);
	const { represented } = getContactDetailsByContactType(representationDetails);

	return res.render(
		view,
		getRepresentationDetailsTaskLogViewModel(
			representationDetails,
			caseId,
			representationId,
			represented
		)
	);
};
