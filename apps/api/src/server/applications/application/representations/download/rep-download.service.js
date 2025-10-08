import {
	getApplicationPublishedRepresentationForDownload,
	getApplicationValidRepresentationForDownload
} from '#repositories/representation.repository.js';

export async function getCaseRepresentationToDownloadInBatches(
	readableStream,
	batchSize,
	caseId,
	type
) {
	let skip = 0;
	let hasMore = true;
	const getRepresentation =
		type === 'published'
			? getApplicationPublishedRepresentationForDownload
			: getApplicationValidRepresentationForDownload;

	while (hasMore) {
		const items = await getRepresentation(caseId, skip, batchSize);

		// Set the CSV Header key to toggle the first csv string to capture headers
		if (skip === 0) items.setCSVHeader = true;
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
