import { migrationNsipDocumentsByReference } from '../common/migrators/nsip-document-migration.js';
import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';
import { app } from '@azure/functions';
import { Readable } from 'stream';

// /**
//  * @param {import("@azure/functions").Context} context
//  * @param {import("@azure/functions").HttpRequest} req
//  */
// export const index = async (
// 	context,
// 	req
// 	// { body: { caseReference, migrationOverwrite = false } }
// ) => {
// 	context.log('CONTEXT1: ' + JSON.stringify(context));
// 	context.log('CONTEXT2: ' + JSON.stringify(context.res));
// 	context.log('REQ1: ' + JSON.stringify(req));
// 	context.log('REQ2: ' + JSON.stringify(req.raw));
// 	const caseRef = req.body.caseReference;
// 	context.log({ caseRef });
// 	await handleMigrationWithResponse(context, req, {
// 		caseReferences: caseRef,
// 		entityName: 'document',
// 		migrationFunction: () => migrationNsipDocumentsByReference(context.log, req.body.caseReference),
// 		migrationOverwrite: req.body.migrationOverwrite
// 	});
// };

app.setup({ enableHttpStream: true });
app.http('nsip-document-migration', {
	methods: ['POST'],
	authLevel: 'anonymous',
	handler: async (request, context) => {
		console.log(JSON.stringify(context));
		const stream = await migrationNsipDocumentsByReference(
			context.log,
			request.params.caseReference
		);

		const responseStream = Readable.from(
			(async function* () {
				for await (const chunk of stream) {
					console.log('Chunk: ', chunk.toString());
					yield chunk;
				}
				console.log('Stream ended');
			})()
		);

		return {
			headers: { 'Content-Type': 'application/event-stream' },
			body: responseStream
		};
	}
});
