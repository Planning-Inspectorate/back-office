import { databaseConnector } from '#utils/database-connector.js';

export async function getDataInBatches(readableStream, batchSize, caseId) {
	let skip = 0;
	let hasMore = true;

	while (hasMore) {
		const items = await databaseConnector.representation.findMany({
			take: batchSize,
			skip,
			where: { caseId }
		});

		skip += batchSize;
		hasMore = items.length === batchSize;

		if (items.length > 0) {
			// Push the batch of items to the readable stream
			readableStream.push(items);
		}
	}

	// Signal the end of the stream
	readableStream.push(null);
}
