import NodeClam from 'clamscan';

const clamAvHost = process.env.CLAM_AV_HOST;
const clamAvPort = Number.parseInt(process.env.CLAM_AV_PORT, 10);

/**
 * @param {import('node:stream').Readable} blobStream
 * @returns {Promise<boolean>}
 */
export const scanStream = async (blobStream) => {
	const clamScan = await new NodeClam().init({
		debugMode: true,
		clamdscan: {
			host: clamAvHost,
			port: clamAvPort
		}
	});

	const scanResult = await clamScan.scanStream(blobStream);

	return scanResult.isInfected;
};
