import {
	getPublishableCaseRepresentations,
	isRepresentationsPreviouslyPublished
} from './publishable.service.js';
import { mapRepresentationSummary } from '../representation.mapper.js';

export const getPublishableRepresentations = async ({ params }, response) => {
	const publishableRepresentations = await getPublishableCaseRepresentations(params.id);
	const previouslyPublished = await isRepresentationsPreviouslyPublished(params.id);

	return response.status(200).json({
		previouslyPublished,
		itemCount: publishableRepresentations.length,
		items: publishableRepresentations.map(mapRepresentationSummary)
	});
};
