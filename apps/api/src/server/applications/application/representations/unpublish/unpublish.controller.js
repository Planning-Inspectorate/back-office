import { unpublishCaseRepresentations } from './unpublish.service.js';

export const unpublishRepresentations = async ({ params, body }, response) => {
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
