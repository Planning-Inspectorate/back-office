import NodeClam from 'clamscan';

/**
 *
 * @param {any} context
 * @param {any} myBlob
 */
export default async (context, myBlob) => {
	const ClamScan = new NodeClam().init({
		debugMode: true,
		clamdscan: {
			// TODO: use env var here
			host: 'pins-app-clamav-dev-ukw-001.azurewebsites.net',
			port: 3310
		}
	});

	ClamScan.then(async (cs) => {
		const result = await cs.scanStream(myBlob);

		context.log(result);
	});
};
