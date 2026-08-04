import { unpublishCaseRepresentations } from './unpublish.service.js';
import { getAllPublishedRepresentationsByCaseId } from '#repositories/representation.repository.js';

export const getUnpublishableRepresentations = async ({ params }, response) => {
	const unpublishableRepresentationsCount = await getAllPublishedRepresentationsByCaseId(
		params.id,
		{
			countOnly: true
		}
	);

	return response.status(200).json({
		count: unpublishableRepresentationsCount
	});
};

export const postUnpublishRepresentations = async ({ params, body }, response) => {
	const unpublishedRepresentations = await unpublishCaseRepresentations(params.id, body.actionBy);

	if (unpublishedRepresentations.length > 0) {
		return response.status(200).json({ count: unpublishedRepresentations.length });
	} else {
		return response
			.status(400)
			.json({ errors: { message: 'unable to unpublish representations' } });
	}
};
