import { blobClient } from '../../common/blob-client.js';

/**
 * Downloads the ZIP at `blobName` from `container` and returns it as a Buffer.
 * Logs progress and warns if the download appears incomplete.
 *
 * @param {string} container
 * @param {string} blobName
 * @param {object} context - Azure Function context for logging
 * @returns {Promise<Buffer>}
 */
export const downloadZipBuffer = async (container, blobName, context) => {
	const downloadResponse = await blobClient.downloadStream(container, blobName);
	const contentLength = downloadResponse.contentLength || 0;
	const chunks = [];

	for await (const chunk of downloadResponse.readableStreamBody) {
		const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		chunks.push(buf);
	}

	const buffer = Buffer.concat(chunks);

	if (contentLength > 0 && buffer.length < contentLength) {
		context.log.warn(
			`[SHAPEFILE] Incomplete download: received ${
				buffer.length
			}/${contentLength} bytes (${Math.round((buffer.length / contentLength) * 100)}%)`
		);
	}

	return buffer;
};
