import { mapDateStringToUnixTimestamp } from './map-date-string-to-unix-timestamp.js';

/**
 * @typedef {import('@pins/applications.api').Schema.S51Advice} S51Advice
 * @typedef {import('@pins/applications').S51AdviceDetails} S51AdviceDetails
 * @typedef {import('@prisma/client').Prisma.DocumentGetPayload<{include: {latestDocumentVersion: true}}>} DocumentWithLatestVersion
 * @typedef { {Document: DocumentWithLatestVersion}} DocumentWithLatestVersionObj
 * @typedef {import('@prisma/client').Prisma.S51AdviceGetPayload<{include: {S51AdviceDocument: true}}>} S51AdviceWithS51Documents
 * @typedef {import('@pins/applications.api').Api.S51AdviceDocumentDetails} S51AdviceDocumentDetails
 */

/**
 * @typedef {'checked' | 'unchecked' | 'readytopublish' | 'published' | 'donotpublish'} S51AdviceSchemaStatus
 */

/**
 * returns a formatted S52 Advice ref
 * eg for case EN01001 and advice number 12, returns EN010001-Advice-00012
 *
 * @param { string } caseRef
 * @param { number } adviceRef
 * @returns {string}
 */
export const formatS51AdviceReferenceCode = (caseRef, adviceRef) => {
	return `${caseRef}-Advice-` + String(adviceRef).padStart(5, '0');
};

/**
 * maps a single S51 Advice record to UI usable format
 *
 * @param { string } caseRef
 * @param { S51AdviceWithS51Documents |S51Advice } s51Advice
 * @param { S51AdviceDocumentDetails[] | DocumentWithLatestVersionObj[] } attachments
 * @returns { S51AdviceDetails }
 */
export const mapS51Advice = (caseRef, s51Advice, attachments, andMapAttachments = false) => {
	return {
		id: s51Advice.id,
		referenceCode: formatS51AdviceReferenceCode(caseRef, s51Advice.referenceNumber),
		referenceNumber: String(s51Advice.referenceNumber).padStart(5, '0'),
		title: s51Advice.title,
		enquirer: s51Advice.enquirer ?? '',
		firstName: s51Advice.firstName ?? '',
		lastName: s51Advice.lastName ?? '',
		enquiryMethod: s51Advice.enquiryMethod,
		enquiryDate: mapDateStringToUnixTimestamp(s51Advice.enquiryDate.toString()),
		enquiryDetails: s51Advice.enquiryDetails,
		adviser: s51Advice.adviser,
		adviceDate: mapDateStringToUnixTimestamp(s51Advice.adviceDate.toString()),
		adviceDetails: s51Advice.adviceDetails,
		publishedStatus: s51Advice.publishedStatus ?? '',
		redactedStatus: s51Advice.redactedStatus ?? '',
		dateCreated: mapDateStringToUnixTimestamp(s51Advice.createdAt.toString()),
		dateUpdated: mapDateStringToUnixTimestamp(s51Advice.updatedAt.toString()),
		attachments: andMapAttachments ? mapS51DocumentsToUI(attachments) : attachments,
		datePublished: s51Advice?.datePublished
			? mapDateStringToUnixTimestamp(s51Advice?.datePublished?.toString())
			: null,
		totalAttachments: attachments?.length
	};
};

/** maps an array of S51 Advice records into a UI usable format
 *
 * @param { string } caseRef
 * @param { S51Advice[] } s51Advices
 * @returns { S51AdviceDetails[]}
 */
export const mapManyS51Advice = (caseRef, s51Advices) => {
	return s51Advices.map((s51Advice) => mapS51Advice(caseRef, s51Advice, [], false));
};

/**
 * maps a single S51 Advice Document attached to an S51 advice, to UI usable format
 *
 * @param { DocumentWithLatestVersionObj } s51AdviceDoc
 * @returns { S51AdviceDocumentDetails } attachment
 */
export const mapS51DocumentToUI = (s51AdviceDoc) => {
	return {
		documentName: s51AdviceDoc.Document.latestDocumentVersion?.fileName ?? '',
		documentType: s51AdviceDoc.Document.latestDocumentVersion?.mime ?? '',
		documentSize: s51AdviceDoc.Document.latestDocumentVersion?.size ?? 0,
		dateAdded: mapDateStringToUnixTimestamp(
			(s51AdviceDoc.Document.latestDocumentVersion?.dateCreated ?? '').toString()
		),
		status: s51AdviceDoc.Document.latestDocumentVersion?.publishedStatus,
		documentGuid: s51AdviceDoc.Document.latestDocumentVersion?.documentGuid ?? '',
		version: s51AdviceDoc.Document.latestDocumentVersion?.version ?? 1
	};
};

/**
 * maps an array of S51 Advice Documents attached to an S51 advice, to UI usable format
 *
 * @param { DocumentWithLatestVersionObj[] } documentsWithDocumentVersion
 * @returns { S51AdviceDocumentDetails[] }
 */
export const mapS51DocumentsToUI = (documentsWithDocumentVersion) => {
	return documentsWithDocumentVersion.map((s51Document) => mapS51DocumentToUI(s51Document));
};

/**
 * Map the S51 Advice internal DB status to the schema status
 *
 * @param {string} status
 * @returns {S51AdviceSchemaStatus}
 */
export const mapS51AdviceStatusToSchemaStatus = (status) => {
	let schemaStatus = undefined;
	switch (status) {
		case 'checked':
			schemaStatus = 'checked';
			break;
		case 'not_checked':
			schemaStatus = 'unchecked';
			break;
		case 'ready_to_publish':
			schemaStatus = 'readytopublish';
			break;
		case 'published':
			schemaStatus = 'published';
			break;
		case 'do_not_publish':
			schemaStatus = 'donotpublish';
			break;
		default:
			throw new Error(`Unknown S51 Advice Status: "${status}"`);
	}

	// @ts-ignore
	return schemaStatus;
};
