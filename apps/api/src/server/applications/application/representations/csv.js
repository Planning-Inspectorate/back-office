import { Router as createRouter } from 'express';
import * as stream from 'stream';
import { getDataInBatches } from './chatres.js';
import { Readable } from 'stream';

const Transform = stream.Transform;

class TransformToCSV extends Transform {
	constructor(options) {
		super(options);
	}

	_transform(chunk, enc, cb) {
		for (const data of chunk) {
			this.push(`${data.id},${data.reference},${data.status},${data.caseId}\n`);
		}
		cb();
	}
}

const router = createRouter({ mergeParams: true });
router.get('/', async (req, res) => {
	console.time('Time to complete');
	const readableStream = new Readable({ objectMode: true });
	const transformToCSV = new TransformToCSV({ objectMode: true });

	const batchSize = 100;
	getDataInBatches(readableStream, batchSize, Number(req.params.id));

	readableStream._read = () => {};

	res.set('Content-disposition', 'attachment; filename=' + 'output.csv');
	res.set('Content-Type', 'text/csv');
	readableStream.pipe(transformToCSV).pipe(res);
	console.timeEnd('Time to complete');
});

export const csvRouter = router;
