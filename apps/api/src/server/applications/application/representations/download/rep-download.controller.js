import { getCaseRepresentationToDownloadInBatches } from './rep-download.service.js';
import { Readable } from 'stream';
import { TransformToCSV } from './utils/stream-transform-to-csv.js';
import { format } from 'date-fns';

export const getCaseRepDownload = async (req, res) => {
	const readableStream = new Readable({ objectMode: true });
	const transformToCSV = new TransformToCSV({ objectMode: true });
	const caseId = Number(req.params.id);

	const batchSize = 100;
	getCaseRepresentationToDownloadInBatches(readableStream, batchSize, caseId);

	readableStream._read = () => {};

	res.set(
		'Content-disposition',
		'attachment; filename=' +
			`relevant-reps-${caseId}-${format(new Date(), 'yyyy-MM-dd-HH_mm_ss')}.csv`
	);
	res.set('Content-Type', 'text/csv');

	readableStream.pipe(transformToCSV).pipe(res);
};
