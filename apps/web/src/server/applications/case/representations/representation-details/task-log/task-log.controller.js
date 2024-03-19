import { getRepresentationDetails } from '../applications-relevant-rep-details.service.js';
import { getRepresentationDetailsTaskLogViewModel } from './task-list.view-model.js';
import { formatContactDetails } from '../../representation/representation.utilities.js';

const view = 'applications/representations/representation-details/task-log.njk';

/**
 *  @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}, {caseId: string, representationId: string}>}
 */
export const getRepresentationDetailsTaskLogController = async (req, res) => {
	const { caseId, representationId } = res.locals;
	const representationDetails = await getRepresentationDetails(caseId, representationId);

	return res.render(
		view,
		getRepresentationDetailsTaskLogViewModel(
			representationDetails,
			caseId,
			representationId,
			formatContactDetails(representationDetails.represented)
		)
	);
};
