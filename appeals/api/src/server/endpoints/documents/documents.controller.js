import { getDocumentsForAppeal, addDocumentsToAppeal } from './documents.service.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * @type {RequestHandler}
 * @returns {Promise<object>}
 */
const getDocuments = async (req, res) => {
	const { appealId } = req.params;
	const paths = await getDocumentsForAppeal(Number(appealId));

	return res.send(paths);
};

/**
 *
 * @type {import('express').RequestHandler<any, any, { blobStorageHost: string, blobStorageContainer: string, documents: { documentName: string, blobStoreUrl: string }[] } | any, any>}
 */
const addDocuments = async ({ params, body }, response) => {
	const { appealId } = params;
	const documentInfo = await addDocumentsToAppeal(body, Number(appealId));

	const storageInfo = {
		documents: documentInfo.documents.map((d) => {
			return {
				documentName: d.documentName,
				GUID: d.GUID,
				blobStoreUrl: d.blobStoreUrl
			};
		})
	};

	response.send(storageInfo);
};

export { getDocuments, addDocuments };
