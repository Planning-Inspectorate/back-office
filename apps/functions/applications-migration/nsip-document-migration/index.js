import { migrationNsipDocumentsByReference } from '../common/migrators/nsip-document-migration.js';
import { app } from '@azure/functions';
import { Readable } from 'stream';

app.setup({ enableHttpStream: true });
app.http('nsip-document-migration', {
	methods: ['POST'],
	authLevel: 'anonymous',
	handler: async (request, context) => {
		const stream = await migrationNsipDocumentsByReference(
			context.log,
			request.params.caseReference
		);

		const responseStream = Readable.from(
			(async function* () {
				for await (const chunk of stream) {
					console.log(chunk.toString());
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
