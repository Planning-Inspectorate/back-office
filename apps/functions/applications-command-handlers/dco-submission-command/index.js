import api from './back-office-api-client.js';
import { buildDocumentsPayload } from './utils/build-documents-payload.js';
import { chunk } from 'lodash-es';

const BATCH_SIZE = Number(process.env.DOCUMENTS_BATCH_SIZE) || 50;

/**
 *
 * @param {import('@azure/functions').InvocationContext} context
 * @param {any} msg
 */
export default async function (context, msg) {
	context.log('Handle new DCO submission');

	const { mappedCaseData, mappedDocuments } = msg;
	const caseReference = mappedCaseData.case.reference;

	context.log(`Fetching caseId for case reference: ${caseReference}`);
	const caseId = await api.getCaseID(caseReference);
	if (!caseId) {
		throw new Error(`No case found with caseReference: ${caseReference}`);
	}

	const payload = await buildDocumentsPayload(mappedDocuments, caseId);

	if (!payload || payload.length === 0) {
		context.log(`No documents found in submission payload for case reference: ${caseReference}`);
		return;
	}

	const batches = chunk(payload, BATCH_SIZE);
	context.log(
		`Posting ${payload.length} documents in ${batches.length} batch(es) of up to ${BATCH_SIZE} for case reference ${caseReference}`
	);

	for (const [index, batch] of batches.entries()) {
		context.log(
			`Posting batch ${index + 1} of ${batches.length} (${batch.length} documents) for caseReference: ${caseReference}`
		);
		await api.postDocuments(caseId, batch);
	}
}
