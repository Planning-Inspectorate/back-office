import { getRepresentationPageUrl } from '../representation.utilities.js';
import { getCaseFolders } from '../../../documentation/applications-documentation.service.js';

const view = 'applications/representations/representation/attachment-upload.njk';

/**
 *  @type {import('@pins/express').RenderHandler<{}, {}, {}, { repId: string, repType: string }, {caseId: string}>}
 */
export const getRepresentationAttachmentUpload = async ({ query, params }, res) => {
	const { caseId } = params;
	const { repId, repType } = query;
	const folders = await getCaseFolders(Number(caseId));
	const folder = folders.find((el) => el.displayNameEn === 'Relevant representations');

	return res.render(view, {
		link: getRepresentationPageUrl('check-answers', repId, repType),
		caseId,
		folderId: folder?.id
	});
};
