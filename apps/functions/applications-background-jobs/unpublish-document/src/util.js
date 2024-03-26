import config from "../../common/config.js";
import { trimSlashes } from "../../publish-document/src/util.js";

/**
 *
 * @param {string} publishedDocumentURI
 * @param {string} [publishContainer]
 * @returns {string}
 */
export const extractPublishedBlobName = (publishedDocumentURI, publishContainer = config.BLOB_PUBLISH_CONTAINER) => {
    if (!publishedDocumentURI.includes(publishContainer)) {
        throw new Error(`invalid published URI, container not found: ${publishContainer} in ${publishedDocumentURI}`);
    }
	let [, blobName]  = publishedDocumentURI.split(publishContainer);
    blobName = trimSlashes(blobName);
    if (!blobName) {
        throw new Error(`blob name not found in ${publishedDocumentURI}`);
    }

	return blobName;
};