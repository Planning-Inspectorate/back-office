import { stringify } from 'csv-stringify/sync';
import { databaseConnector } from '#utils/database-connector.js';
import { Router as createRouter } from 'express';

import * as stream from 'stream';

const router = createRouter({ mergeParams: true });
router.get('/', async (req, res) => {
	console.time('Time to complete');
	const value = await databaseConnector.representation.findMany({
		where: { caseId: Number(req.params.id) }
	});

	console.log('Total data items: ', value.length, 'For case', req.params.id);
	value.map((id, reference, status, redacted, received, firstName, lastName, organisationName) => ({
		id,
		reference,
		status,
		redacted,
		received,
		name: organisationName ? organisationName : `${firstName} ${lastName}`
	}));
	const output = stringify(value, { header: true, escape_formulas: true });

	let fileContents = Buffer.from(output);

	let readStream = new stream.PassThrough();
	readStream.end(fileContents);

	res.set('Content-disposition', 'attachment; filename=' + 'output.csv');
	res.set('Content-Type', 'text/csv');

	readStream.pipe(res);
	console.timeEnd('Time to complete');
	// res.sendFile(output);
});

export const csvRouter = router;
