import { getCaseRepresentationToDownloadInBatches } from './rep-download.service.js';
import { Readable } from 'stream';
import { TransformToCSV } from './utils/stream-transform-to-csv.js';
import { format } from 'date-fns';

const getCaseRepDownload = async (req, res, type) => {
	const readableStream = new Readable({ objectMode: true });
	const transformToCSV = new TransformToCSV({ objectMode: true, type });
	const caseId = Number(req.params.id);

	const batchSize = 100;
	getCaseRepresentationToDownloadInBatches(readableStream, batchSize, caseId, type);

	readableStream._read = () => {};

	const filenamePrefix = type === 'published' ? 'mailing-list' : 'relevant-reps';
	res.set(
		'Content-disposition',
		'attachment; filename=' +
			`${filenamePrefix}-${caseId}-${format(new Date(), 'yyyy-MM-dd-HH_mm_ss')}.csv`
	);
	res.set('Content-Type', 'text/csv');

	readableStream.pipe(transformToCSV).pipe(res);
};

export const getPublishedCaseRepDownload = async (req, res) => {
	return getCaseRepDownload(req, res, 'published');
};

export const getValidCaseRepDownload = async (req, res) => {
	return getCaseRepDownload(req, res, 'valid');
};
