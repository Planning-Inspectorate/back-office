import { pick } from 'lodash-es';
import { formatS51AdviceReferenceCode } from '#utils/mapping/map-s51-advice-details.js';

/**
 * NSIP S51 Advice
 *
 * @typedef {Object} NsipS51AdvicePayload
 * @property {number} adviceId
 * @property {string} adviceReference
 * @property {number} caseId
 * @property {string} title
 * @property {string} from
 * @property {string} agent
 * @property {'phone' | 'email' | 'meeting' | 'post'} method
 * @property {string} enquiryDate
 * @property {string} enquiryDetails
 * @property {string} adviceGivenBy
 * @property {string} adviceDate
 * @property {string} adviceDetails
 * @property {'checked' | 'unchecked' | 'readytopublish' | 'published' | 'donotpublish'} status
 * @property {'unredacted' | 'redacted'} redactionStatus
 * @property {string[]} attachmentIds
 * */

/**
 * @param {import('@prisma/client').S51Advice} s51Advice
 * @returns {NsipS51AdvicePayload}
 * */
export const buildNsipS51AdvicePayload = (s51Advice) => ({
	...pick(s51Advice, [
		'caseId',
		'title',
		'enquiryDate',
		'enquiryDetails',
		'adviceDate',
		'adviceDetails'
	]),
	adviceId: s51Advice.id,
	adviceReference: formatS51AdviceReferenceCode(s51Advice.caseId, s51Advice.referenceNumber),
	from: s51Advice.enquirer,
	agent: `${s51Advice.firstName} ${s51Advice.lastName}`,
	method: s51Advice.enquiryMethod,
	adviceGivenBy: s51Advice.adviser,
	status: s51Advice.publishedStatus,
	redactionStatus: s51Advice.redactedStatus,
	// @ts-ignore
	attachmentIds: s51Advice.S51AdviceDocument.map((doc) => doc.id)
});
