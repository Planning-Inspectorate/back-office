import { post } from '../../lib/request.js';

/** @typedef {{documentName: string, fileRowId: string, blobStoreUrl?: string, failedReason?: string}} DocumentUploadInfo */
/** @typedef {{sasToken?: string, blobStorageHost: string, blobStorageContainer: string, documents: DocumentUploadInfo[]}} UploadInfo */

/**
 * @param {string} caseId
 * @param {DocumentUploadInfo[]} payload
 * @returns {Promise<UploadInfo>}
 */
export const createNewDocument = async (caseId, payload) => {
	return post(`applications/${caseId}/documents`, { json: payload });
};

/**
 * Generic controller for applications and appeals for files upload
 *
 * @param {{params: {caseId: string}, filesParameters: DocumentUploadInfo[]}} request
 * @param {*} response
 * @returns {Promise<{}>}
 */
export async function postDocumentsUpload({ params, filesParameters }, response) {
	const { caseId } = params;
	const uploadInfo = await createNewDocument(caseId, filesParameters);

	response.documents = uploadInfo.documents.map((document) => {
		const fileToUpload = filesParameters.find(
			(file) => file.documentName === document.documentName
		);
		const fileRowId = fileToUpload?.fileRowId || '';

		return { ...document, fileRowId };
	});

	// TODO: replace with AD auth and remove sasToken from UploadInfo jsdocstype
	const sasToken =
		'?sv=2021-08-06&ss=btqf&srt=sco&st=2022-11-11T10%3A45%3A51Z&se=2022-12-12T10%3A45%3A00Z&sp=rwlacu&sig=yWgU5FiQxBLCUQ9zoaAE0qFHAgcfmlg0JkCOAB2r9us%3D';

	return response.send({ sasToken, ...uploadInfo });
}
