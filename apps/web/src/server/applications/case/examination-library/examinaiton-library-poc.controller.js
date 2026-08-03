import { generateSampleData, sortRefCodes } from './_poc-utils/el-document-ref-ordering.js';
import { mapSampleRefsToTableRows } from './_poc-utils/view-model.js';
import { SAMPLE_DATA_QUERY_DEFAULTS } from './_poc-utils/constants.js';

export async function getExaminationLibraryPOC(req, res) {
	let { fetchDataFrom, sampleDataCount, sampleDataPrefixes, sampleDataOrder } = req.query;

	fetchDataFrom = fetchDataFrom || SAMPLE_DATA_QUERY_DEFAULTS.fetchDataFrom;
	sampleDataCount = sampleDataCount || SAMPLE_DATA_QUERY_DEFAULTS.sampleDataCount;
	sampleDataPrefixes = sampleDataPrefixes || SAMPLE_DATA_QUERY_DEFAULTS.sampleDataPrefixes;
	sampleDataOrder = sampleDataOrder || SAMPLE_DATA_QUERY_DEFAULTS.sampleDataOrder;

	let sampleData = [];

	console.log('sampleDataCount: ', sampleDataCount);
	console.log('sampleDataPrefixes: ', sampleDataPrefixes);
	console.log('sampleDataOrder: ', sampleDataOrder);

	if (fetchDataFrom === 'generate') {
		sampleData = generateSampleData(sampleDataCount, sampleDataPrefixes);
	} else {
		//get data from the db
	}

	const orderedSampleData = sortRefCodes(sampleData, sampleDataOrder);

	res.render('applications/case-el-poc/index.njk', {
		queryLegend: {
			sampleDataCount,
			sampleDataOrder,
			sampleDataPrefixes,
			fetchDataFrom
		},
		sampleRows: mapSampleRefsToTableRows(sampleData),
		orderedSampleRows: mapSampleRefsToTableRows(orderedSampleData)
	});
}
