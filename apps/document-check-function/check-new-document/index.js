import { checkMyBlob } from './check-my-blob.js';

/**
 * @param {import('./check-my-blob').Context} context
 * @param {import('node:stream').Readable} myBlob
 */
module.exports = async function (context, myBlob) {
	context.log(
		'JavaScript blob trigger function processed blob \n Blob:',
		context.bindingData.blobTrigger,
		'\n Blob Size:',
		myBlob.length,
		'Bytes'
	);
	await checkMyBlob(context, myBlob);
};
