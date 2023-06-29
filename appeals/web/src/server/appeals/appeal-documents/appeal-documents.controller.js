import config from '@pins/appeals.web/environment/config.js';

/** @type {import('@pins/express').RenderHandler<object>}  */
export const upload = async (request, response) => {
	const { appealId, folderId } = request.params;

	return response.render('appeals/appeal/document-upload.njk', {
		caseId: appealId,
		folderId,
		blobEmulatorSasUrl: config.blobEmulatorSasUrl
	});
};

/** @type {import('@pins/express').RenderHandler<object>}  */
export const download = async (request, response) => {
	return response.render('appeals/appeal/document-download.njk', {
		blobEmulatorSasUrl: config.blobEmulatorSasUrl
	});
};
