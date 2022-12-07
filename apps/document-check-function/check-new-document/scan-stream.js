import { clamAvClient } from './clam-av-client.js';

/**
 * @param {import('node:stream').Readable} blobStream
 * @returns {Promise<boolean>}
 */
export const scanStream = async (blobStream) => {
	const scanResult = await clamAvClient.scanStream(blobStream);

	return scanResult.isInfected;
};
