import {
	getUnpublishableCaseRepresentations,
	unpublishCaseRepresentations
} from './unpublish.service.js';
import { mapRepresentationSummary } from '../representation.mapper.js';

export const getUnpublishableRepresentations = async ({ params }, response) => {
	const unpublishableRepresentations = await getUnpublishableCaseRepresentations(params.id);

	return response.status(200).json({
		itemCount: unpublishableRepresentations.length,
		items: unpublishableRepresentations.map(mapRepresentationSummary)
	});
};

export const postUnpublishRepresentations = async ({ params, body }, response) => {
	const unpublishedRepresentations = await unpublishCaseRepresentations(
		params.id,
		body.representationIds,
		body.actionBy
	);

	if (unpublishedRepresentations.length > 0) {
		return response
			.status(200)
			.json({ unpublishedRepIds: unpublishedRepresentations.map((rep) => rep.id) });
	} else {
		return response
			.status(400)
			.json({ errors: { message: 'unable to unpublish representations' } });
	}
};
