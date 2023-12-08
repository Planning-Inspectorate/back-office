import { copyBlob } from './blob.js';

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {*} msg
 */
export default async function (context, msg) {
	context.log.info('Document move', msg);
	try {
		const { originalURI, importedURI } = msg;
		await copyBlob(originalURI, importedURI);
	} catch (e) {
		context.log.error('Not enough information to process this request', e);
	}
}
