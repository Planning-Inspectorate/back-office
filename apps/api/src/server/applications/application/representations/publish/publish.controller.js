import { publishCaseRepresentations } from './publish.service.js';

export const publishRepresentations = async ({ params, body }, response) => {
	const publishedRepresentations = await publishCaseRepresentations(
		params.id,
		body.representationIds,
		body.actionBy
	);

	if (publishedRepresentations.length > 0) {
		return response
			.status(200)
			.json({ publishedRepIds: publishedRepresentations.map((rep) => rep.id) });
	} else {
		return response.status(400).json({ errors: { message: 'unable to publish representations' } });
	}
};
