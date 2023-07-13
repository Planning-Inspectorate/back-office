import { databaseConnector } from '#utils/database-connector.js';

import * as stream from 'stream';

export const streamUsers = ({ batchSize }, id) => {
	let cursorId = undefined;

	return new stream.Readable({
		objectMode: true,
		async read() {
			try {
				const items = await databaseConnector.representation.findMany({
					take: batchSize,
					skip: cursorId ? 1 : 0,
					cursor: cursorId ? { id: cursorId } : undefined,
					where: { caseId: id }
				});
				if (items.length === 0) {
					this.push(null);
				} else {
					for (const item of items) {
						this.push(item);
					}
					cursorId = items[items.length - 1].id;
				}
			} catch (err) {
				this.destroy(err);
			}
		}
	});
};
