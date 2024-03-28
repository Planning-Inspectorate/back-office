import { streamToString } from '../malware-detected/src/util.js';
import { YouTubeHTMLTemplate } from '../malware-detected/src/youtube-html-expectation.js';
import { blobClient } from './blob-client.js';
import config from './config.js';
import { extractBlobNameFromUri } from './util.js';

/**
 * @param {string} blobUri
 * @returns {Promise<boolean>}
 * */
export const isScannedFileHtml = async (blobUri) => {
	const blobName = extractBlobNameFromUri(blobUri);
	const blobProperties = await blobClient.getBlobProperties(config.BLOB_SOURCE_CONTAINER, blobName);
	return blobProperties.contentType === 'text/html';
};

/**
 * @param {string} blobUri
 * @param {import('@azure/functions').Logger} log
 * @returns {Promise<boolean>}
 * */
export const isUploadedHtmlValid = async (blobUri, log) => {
	const blobName = extractBlobNameFromUri(blobUri);
	const downloadBlockBlobResponse = await blobClient.downloadStream(
		config.BLOB_SOURCE_CONTAINER,
		blobName
	);

	if (!downloadBlockBlobResponse.readableStreamBody) {
		throw Error('No file stream received after attempting to download from Blob Container');
	}
	const htmlFileContentAsString = await streamToString(
		downloadBlockBlobResponse.readableStreamBody
	);
	const areHtmlStringsEqual = compareHtmlStringsIgnoringYoutubeUrl(
		htmlFileContentAsString,
		YouTubeHTMLTemplate
	);

	if (areHtmlStringsEqual) {
		log.info('HTML validity check successful');
	} else {
		log.warn('HTML validity check failed');
		log.warn(`Offending HTML as string:\n${htmlFileContentAsString}`);
	}
	return areHtmlStringsEqual;
};

/**
 * @param {string} html1
 * @param {string} html2
 * @returns {boolean}
 */
const compareHtmlStringsIgnoringYoutubeUrl = (html1, html2) => {
	// Regex matches `<iframe>` tags with `src` attributes containing YouTube URLs
	// (either `youtube.com/embed/` or `youtu.be/`), capturing the parts before
	// and after the URL for preservation. It works globally and case-insensitively.
	const youtubeIframeRegex =
		/(<iframe[^>]*src=["'])https?:\/\/(?:www\.)?(?:youtube\.com\/embed\/|youtu\.be\/)[^"']*(["'][^>]*><\/iframe>)/gi;

	// Function to replace YouTube URL in the iframe tag with a unique placeholder, keeping the rest of the tag
	/**
	 * @param {string} _match - The entire matched string (unused).
	 * @param {string} p1 - The part of the string before the YouTube URL.
	 * @param {string} p2 - The part of the string after the YouTube URL.
	 * @returns {string} - The modified string with YouTube URL replaced.
	 */
	const stringReplaceFunction = (_match, p1, p2) => `${p1}<youtube-link-placeholder>${p2}`;

	// Replace YouTube URLs within <iframe> tags in both HTML strings
	const modifiedHtml1 = html1.trim().replace(youtubeIframeRegex, stringReplaceFunction);
	const modifiedHtml2 = html2.trim().replace(youtubeIframeRegex, stringReplaceFunction);

	// Compare the modified strings
	return modifiedHtml1 === modifiedHtml2;
};
