import { BlobStorageClient } from '@pins/blob-storage-client';
import { getDocumentsInCase } from '../../../applications/application/documents/document.service.js';
import { Readable } from 'stream';
import {
	extractYouTubeURLFromHTML,
	renderYouTubeTemplate
} from '../../../applications/documents/documents.service.js';
import config from '../../../config/config.js';

const privateBlobContainer = 'document-service-uploads';

/**
 * @param {NodeJS.ReadableStream} readableStream
 * @returns {Promise<string>}
 */
export const streamToString = async (readableStream) => {
	return new Promise((resolve, reject) => {
		/** @type {string[]} */
		const chunks = [];
		readableStream.on('data', (chunk) => {
			chunks.push(chunk.toString());
		});
		readableStream.on('end', () => {
			resolve(chunks.join(''));
		});
		readableStream.on('error', reject);
	});
};

/**
 *
 * @param {string} string
 */
export const stringToStream = (string) => {
	const readable = new Readable({
		read() {
			readable.push(string);
			readable.push(null);
		}
	});
	return readable;
};

/**
 *
 * @param {number} caseId
 */
export const getHtmlDocumentVersions = async (caseId) => {
	const response = await getDocumentsInCase(caseId, 'text/html', 1, 9999);
	return response.items;
};

const getBlobClient = () => {
	return BlobStorageClient.fromUrl(config.blobStorageUrl);
};
/**
 *
 * @param {string} blobName
 */
export const downloadHtmlBlob = async (blobName) => {
	const blobClient = getBlobClient();
	const downloadBlockBlobResponse = await blobClient.downloadStream(
		privateBlobContainer,
		blobName.replace('/', '')
	);
	if (!downloadBlockBlobResponse.readableStreamBody) {
		throw Error('No file stream received after attempting to download from Blob Container');
	}
	return streamToString(downloadBlockBlobResponse.readableStreamBody);
};

/**
 * @param {string} guid
 * @param {string} htmlString
 * @param {import("express").Response} res
 */
export const processHtml = (guid, htmlString, res) => {
	if (!(htmlString.includes('youtube') || htmlString.includes('youtu.be'))) {
		res.write(`No YouTube video found in document ${guid} with content: ${htmlString}`);
		throw Error('No YouTube video found in document');
	}

	const youtubeUrl = extractYouTubeURLFromHTML(htmlString);
	return renderYouTubeTemplate(youtubeUrl);
};

/**
 *
 * @param {string} blobName
 * @param {string} htmlAsString
 */
export const uploadNewFileVersion = async (blobName, htmlAsString) => {
	const blobClient = getBlobClient();
	const htmlAsStream = stringToStream(htmlAsString);
	const blobNameWithIncrementedVersionNumber = incrementBlobVersionNumber(blobName);
	await blobClient.uploadStream(
		privateBlobContainer,
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
export const incrementBlobVersionNumber = (blobName) => {
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
