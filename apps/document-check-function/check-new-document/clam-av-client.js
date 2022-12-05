import NodeClam from 'clamscan';

/**
 * @param {import('node:stream').Readable} blobStream
 * @returns {Promise<boolean>}
 */
export const scanStream = async (blobStream) => {
	const clamScan = await new NodeClam().init({
		debugMode: true,
		clamdscan: {
			host: '0.0.0.0',
			port: 3310
		}
	});

	const scanResult = await clamScan.scanStream(blobStream);

	return scanResult.isInfected;
};
