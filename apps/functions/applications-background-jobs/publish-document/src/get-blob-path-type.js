import { MIGRATION_BLOB_PATH_TYPE, STANDARD_BLOB_PATH_TYPE } from '../../common/constants.js';

/**
 * @param {string} documentURI
 */
export const getBlobPathType = (documentURI) => {
	if (documentURI.includes('horizonweb:')) {
		return MIGRATION_BLOB_PATH_TYPE;
	} else {
		return STANDARD_BLOB_PATH_TYPE;
	}
};
