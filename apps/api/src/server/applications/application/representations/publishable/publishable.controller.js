import { getPublishableCaseRepresentations } from './publishable.service.js';
import { mapRepresentationSummary } from '../representation.mapper.js';

export const getPublishableRepresentations = async ({ params }, response) => {
	const publishableRepresentations = await getPublishableCaseRepresentations(params.id);

	return response.status(200).json({
		itemCount: publishableRepresentations.length,
		items: publishableRepresentations.map(mapRepresentationSummary)
	});
};
