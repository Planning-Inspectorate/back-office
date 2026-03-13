import api from './back-office-api-client.js';
import { buildDocumentsPayload } from './utils/build-documents-payload.js';

const getDocName = new Date()
	.toLocaleString('en-GB', { hour12: false })
	.replace(',', '')
	.replace(/\//g, '-');

const msg = {
	mappedCaseData: {
		case: {
			reference: 'EN0110001',
			description: 'https://pins-ds.atlassian.net/browse/APPLICS-1596\r\n\r\ntest',
			applicant: {
				lastName: 'test',
				phoneNumber: '07700 900 982',
				email: 'emil.placheta@planninginspectorate.gov.uk',
				organisationName: 'EmilCorp',
				jobTitle: 'test',
				Address: {
					addressLine1: '1',
					addressLine2: 'test',
					town: 'test',
					county: null,
					country: 'test',
					postcode: 'SW1A 1AA'
				}
			},
			Representation: {
				representative: {
					Address: {}
				}
			},
			ApplicationDetails: {
				locationDescription: 'location',
				submissionAtInternal: '2026-03-12T11:28:18.233Z'
			},
			gridReference: {
				northing: 123456,
				easting: 123456
			}
		}
	},
	mappedDocuments: [
		{
			documentName: getDocName + '.pdf',
			//documentName: 'file2.pdf',
			documentSize: '13264',
			documentType: 'application/pdf',
			blobStoreUrl:
				'applications/WW0110046/environmental-statement/environmental-statement-appendices/file2.pdf',
			caseId: '69608b10-5f8c-4aba-8f3c-653736371279',
			folderName: 'Environmental statement',
			documentReference: 'Environmental statement appendices',
			username: 'emil.placheta@planninginspectorate.gov.uk'
		}
	]
};
const context = {
	log: console.log
};
/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {import('./logging-utils.js').RegisterNSIPSubscription} msg
 */
async function run(context, msg) {
	context.log('Handle new DCO submission');

	const { mappedCaseData, mappedDocuments } = msg;

	const caseId = await api.getCaseID(mappedCaseData.case.reference);
	if (!caseId) {
		throw new Error(`No case found with caseReference: ${mappedCaseData.case.reference}`);
	}

	const payload = await buildDocumentsPayload(mappedDocuments, caseId);

	const result = await api.postDocuments(caseId, payload);

	console.log(result);
}

run(context, msg).then(() => console.log('Done'));
