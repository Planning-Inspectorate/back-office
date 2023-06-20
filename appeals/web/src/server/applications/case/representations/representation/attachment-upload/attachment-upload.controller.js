import { getRepresentationPageUrl } from '../representation.utilities.js';

const view = 'applications/representations/representation/attachment-upload.njk';

/**
 *  @type {import('@pins/express').RenderHandler<{}, {}, {}, { repId: string, repType: string }, {}>}
 */
export const getRepresentationAttachmentUpload = async (req, res) => {
	const { query } = req;
	const { repId, repType } = query;
	return res.render(view, {
		link: getRepresentationPageUrl('check-answers', repId, repType)
	});
};
