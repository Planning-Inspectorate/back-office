// import {post} from "../../lib/request.js";

/** @typedef {{documentName: string, caseId: string, folderId: string, blobStoreURL?: string, failedReason?: string}[]} UploadInfo */

/**
 * @param {string} caseId
 * @param {UploadInfo} payload
 * @returns {Promise<UploadInfo>}
 */
export const createNewDocument = async (caseId, payload) => {
	// TODO: replace mock Promise with real endpoint
	// return post(`applications/${caseId}/documents`, payload);

	return new Promise((resolve) => {
		setTimeout(() => {
			const mockedResponse = payload.map((document) => {
				// this is mocking different types of responses based on the hardcoded filename

				return document.documentName === 'ab.jpg'
					? { ...document, failedReason: 'some_error_from_the_api' }
					: { ...document, blobStoreURL: 'blob_store_url' };
			});

			resolve(mockedResponse);
		}, 400);
	});
};

/**
 * Generic controller for applications and appeals for files upload
 *
 * @param {{params: {caseId: string}, body: UploadInfo}} request
 * @param {*} response
 * @returns {Promise<Response>}
 */
export async function postDocumentsUpload({ params, body }, response) {
	const { caseId } = params;
	const APIResponse = await createNewDocument(caseId, body);

	return response.send(APIResponse);
}
