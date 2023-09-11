import { publishCaseRepresentations } from './publish.service.js';

export const publishRepresentations = async ({ params, body }, response) => {
	const publishedRepresentations = await publishCaseRepresentations(
		params.id,
		body.representationIds,
		body.actionBy
	);

	const publishedRepIds = publishedRepresentations.map((rep) => rep.id);

	return response.status(200).json({ publishedRepIds });
};
