// import {post} from "../../lib/request.js";

/** @typedef {{documentName: string, blobStoreURL?: string, failedReason?: string}} DocumentUploadInfo */

/**
 * @param {string} caseId
 * @param {DocumentUploadInfo[]} payload
 * @returns {Promise<{blobStorageHost: string, blobStorageContainer: string, documents: DocumentUploadInfo[]}>}
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
					: { ...document, blobStoreURL: `folder/subfolder/${document.documentName}` };
			});

			resolve({
				documents: mockedResponse,
				blobStorageHost: 'http://127.0.0.1:10000/devstoreaccount1',
				blobStorageContainer: 'test-local-container'
			});
		}, 400);
	});
};

/**
 * Generic controller for applications and appeals for files upload
 *
 * @param {{params: {caseId: string}, body: DocumentUploadInfo[]}} request
 * @param {*} response
 * @returns {Promise<Response>}
 */
export async function postDocumentsUpload({ params, body }, response) {
	const { caseId } = params;
	const APIResponse = await createNewDocument(caseId, body);

	const sasToken =
		'?sv=2021-08-06&ss=btqf&srt=sco&st=2022-11-11T10%3A45%3A51Z&se=2022-12-12T10%3A45%3A00Z&sp=rwlacu&sig=yWgU5FiQxBLCUQ9zoaAE0qFHAgcfmlg0JkCOAB2r9us%3D';

	return response.send({ sasToken, ...APIResponse });
}
