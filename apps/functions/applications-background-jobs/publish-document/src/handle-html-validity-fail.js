import { guidFromBlobURI } from '../../common/util.js';
import { sendDocumentStateAction } from './back-office-api-client.js';

/**
 *
 * @param {string} documentURI
 * @param {import('@azure/functions').Logger} log
 */
export const handleHtmlValidityFail = async (documentURI, log) => {
	const documentGuid = guidFromBlobURI(documentURI);
	if (!documentGuid) {
		throw Error(`stopped: no GUID for blob with URI ${documentURI}`);
	}

	await sendDocumentStateAction(documentGuid, 'failed_virus_check', log);
};
