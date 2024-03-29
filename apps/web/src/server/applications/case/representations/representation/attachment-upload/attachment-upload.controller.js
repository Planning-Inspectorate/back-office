import { getCaseFolders } from '../../../documentation/applications-documentation.service.js';

const view = 'applications/representations/representation/attachment-upload.njk';

/**
 *  @type {import('@pins/express').RenderHandler<{}, {}, {}, { repId: string, repType: string }, {caseId: string}>}
 */
export const getRepresentationAttachmentUpload = async ({ params }, res) => {
	const { caseId } = params;
	const folders = await getCaseFolders(Number(caseId));
	const folder = folders.find((el) => el.displayNameEn === 'Relevant representations');
	const { locals } = res;

	return res.render(view, {
		backLinkUrl: locals.representation.pageLinks.backLinkUrl,
		link: locals.representation.pageLinks.redirectUrl,
		caseId,
		folderId: folder?.id
	});
};
