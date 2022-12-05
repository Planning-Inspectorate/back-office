const NodeClam = require('clamscan');

module.exports = async function (context, myBlob) {
	context.log('JavaScript trigger function processed a request.');

	const clamScan = await new NodeClam().init({
		debugMode: true,
		clamdscan: {
			path: 'localhost',
			port: 3310
		}
	});

	context.log('Connected!');

	const response = await clamScan.scanStream(myBlob);

	context.log('Scanned!');
	context.log(response);
};
