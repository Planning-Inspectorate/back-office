import { mapDateStringToUnixTimestamp } from './map-date-string-to-unix-timestamp.js';

/** @typedef {import('@pins/applications.api').Schema.S51Advice} S51Advice */
/** @typedef {import('@pins/applications').S51AdviceDetails} S51AdviceDetails */

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
 * @param { S51Advice } s51Advice
 * @param { { documentName: any; documentType: string; documentSize: string; dateAdded: number; status: string; documentGuid: string, version: number }[] } attachments
 * @returns { S51AdviceDetails }
 */
export const mapS51Advice = (caseRef, s51Advice, attachments) => {
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
		attachments,
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
	return s51Advices.map((s51Advice) => mapS51Advice(caseRef, s51Advice));
};
