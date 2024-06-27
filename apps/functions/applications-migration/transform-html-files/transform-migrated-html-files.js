import { loadApiConfig } from '../common/config.js';
import { makeGetRequest, makePostRequest } from '../common/back-office-api-client.js';
import { blobClient } from './blob-client.js';
import { streamToString, stringToStream } from '../common/utils.js';

/**
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {{ applicationId?: number, applicationRef?: string }} applicationInfo
 */
export const transformMigratedHtmlFiles = async (logger, applicationInfo) => {
	if (!applicationInfo.applicationId && !applicationInfo.applicationRef) {
		throw Error('Please pass in either an application ID or reference');
	}
	const applicationId = applicationInfo.applicationId
		? applicationInfo.applicationId
		: await getApplicationId(logger, applicationInfo.applicationRef);

	const htmlDocumentVersions = await getHtmlDocumentVersions(logger, applicationId);
	logger.info(
		`Obtained ${htmlDocumentVersions.length} HTML Document Version from BO for case id ${applicationId}`
	);

	await Promise.all(
		htmlDocumentVersions.map((htmlDocumentVersion) => {
			return downloadHtmlBlob(htmlDocumentVersion.privateBlobPath)
				.then((originalHtmlString) => processHtml(logger, originalHtmlString))
				.then((apiResponse) =>
					uploadNewFileVersion(
						htmlDocumentVersion.privateBlobPath,
						JSON.parse(apiResponse.body).html
					)
				)
				.then((uploadFileVersionResponse) =>
					addDocumentVersion(logger, applicationId, htmlDocumentVersion.documentGuid, {
						documentName: htmlDocumentVersion.fileName,
						documentSize: uploadFileVersionResponse.blobSize,
						documentType: htmlDocumentVersion.mime,
						folderId: htmlDocumentVersion.folderId,
						privateBlobPath: uploadFileVersionResponse.newBlobName,
						username: htmlDocumentVersion.owner
					})
				);
		})
	);
};

/**
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {string | undefined} applicationRef
 */
const getApplicationId = async (logger, applicationRef) => {
	const applicationObject = await makeGetRequest(
		logger,
		`/applications/reference/${applicationRef}`
	);
	if (!applicationObject.id) throw Error('No application ID returned from request');

	return applicationObject.id;
};

/**
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {number} applicationId
 */
const getHtmlDocumentVersions = async (logger, applicationId) => {
	// need to modify to deal with paginated responses
	const queryResponseData = await makeGetRequest(
		logger,
		`/applications/${applicationId}/documents?criteria=text/html`
	);
	if (!queryResponseData.items) throw Error('No items property returned from request');

	return queryResponseData.items;
};

/**
 *
 * @param {string} blobName
 */
const downloadHtmlBlob = async (blobName) => {
	const config = loadApiConfig();
	const downloadBlockBlobResponse = await blobClient.downloadStream(
		config.privateBlobContainer,
		blobName.replace('/', '')
	);
	if (!downloadBlockBlobResponse.readableStreamBody) {
		throw Error('No file stream received after attempting to download from Blob Container');
	}
	return streamToString(downloadBlockBlobResponse.readableStreamBody);
};

/**
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {string} htmlString
 */
const processHtml = (logger, htmlString) => {
	if (!(htmlString.includes('youtube') || htmlString.includes('youtu.be'))) {
		throw Error('No youtube link found in HTML');
	}
	return makePostRequest(logger, '/applications/documents/process-html', {
		html: htmlString
	});
};

/**
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {number} applicationId
 * @param {string} documentGuid
 * @param {*} versionProperties
 */
const addDocumentVersion = (logger, applicationId, documentGuid, versionProperties) => {
	return makePostRequest(
		logger,
		`/applications/${applicationId}/document/${documentGuid}/add-version`,
		versionProperties
	);
};

/**
 *
 * @param {string} blobName
 * @param {string} htmlAsString
 */
const uploadNewFileVersion = async (blobName, htmlAsString) => {
	const config = loadApiConfig();
	const htmlAsStream = stringToStream(htmlAsString);
	const blobNameWithIncrementedVersionNumber = incrementBlobVersionNumber(blobName);
	await blobClient.uploadStream(
		config.privateBlobContainer,
		htmlAsStream,
		blobNameWithIncrementedVersionNumber.replace('/', ''),
		'text/html'
	);
	return {
		newBlobName: blobNameWithIncrementedVersionNumber,
		blobSize: Buffer.from(htmlAsString, 'utf-8').length
	};
};

/**
 *
 * @param {string} blobName
 */
const incrementBlobVersionNumber = (blobName) => {
	const lastColonIndex = blobName.lastIndexOf(':');
	if (lastColonIndex === -1) {
		throw Error('Blob name not in expected format');
	}

	const prefix = blobName.substring(0, lastColonIndex + 1);
	const suffix = blobName.substring(lastColonIndex + 1);

	const firstNonDigitIndex = suffix.search(/\D/);

	const versionNumberPart =
		firstNonDigitIndex === -1 ? suffix : suffix.substring(0, firstNonDigitIndex);
	const rest = firstNonDigitIndex === -1 ? '' : suffix.substring(firstNonDigitIndex);

	const incrementedNumber = (parseInt(versionNumberPart, 10) + 1).toString();

	return prefix + incrementedNumber + rest;
};
