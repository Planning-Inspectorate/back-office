import { getCaseRepresentationToDownloadInBatches } from './rep-download.service.js';
import { Readable } from 'stream';
import { TransformToCSV } from './utils/stream-transform-to-csv.js';

export const getCaseRepDownload = async (req, res) => {
	const readableStream = new Readable({ objectMode: true });
	const transformToCSV = new TransformToCSV({ objectMode: true });

	const batchSize = 100;
	getCaseRepresentationToDownloadInBatches(readableStream, batchSize, Number(req.params.id));

	readableStream._read = () => {};

	res.set('Content-disposition', 'attachment; filename=' + 'output.csv');
	res.set('Content-Type', 'text/csv');

	readableStream.pipe(transformToCSV).pipe(res);
};
