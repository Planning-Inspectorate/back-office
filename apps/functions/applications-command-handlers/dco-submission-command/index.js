import api from './back-office-api-client.js';
import { buildDocumentsPayload } from './utils/build-documents-payload.js';

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {import('./logging-utils.js').RegisterNSIPSubscription} msg
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

	await api.postDocuments(caseId, payload);
}
