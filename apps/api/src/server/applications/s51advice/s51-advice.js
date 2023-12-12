import { pick } from 'lodash-es';
import { formatS51AdviceReferenceCode } from '#utils/mapping/map-s51-advice-details.js';
import { getById as getCaseById } from '../../repositories/case.repository.js';

/**
 * @typedef {'phone' | 'email' | 'meeting' | 'post'} Method
 * @typedef {'checked' | 'unchecked' | 'readytopublish' | 'published' | 'donotpublish'} Status
 * @typedef {'unredacted' | 'redacted'} RedactionStatus
 * */

/**
 * NSIP S51 Advice
 *
 * @typedef {Object} NsipS51AdvicePayload
 * @property {number} adviceId
 * @property {string} adviceReference
 * @property {number} caseId
 * @property {string} caseReference
 * @property {string} title
 * @property {string} from
 * @property {string} agent
 * @property {Method} method
 * @property {string} enquiryDate
 * @property {string} enquiryDetails
 * @property {string} adviceGivenBy
 * @property {string} adviceDate
 * @property {string} adviceDetails
 * @property {Status} status
 * @property {RedactionStatus} redactionStatus
 * @property {string[]} attachmentIds
 * */

/**
 * @param {import('@prisma/client').S51Advice} s51Advice
 * @returns {Promise<NsipS51AdvicePayload>}
 * */
export const buildNsipS51AdvicePayload = async (s51Advice) => {
	const c = await getCaseById(s51Advice.caseId, {});
	const caseReference = c?.reference ?? '';

	return {
		...pick(s51Advice, ['caseId', 'title', 'enquiryDetails', 'adviceDetails']),
		enquiryDate: s51Advice.enquiryDate.toISOString(),
		adviceDate: s51Advice.adviceDate.toISOString(),
		caseReference,
		adviceId: s51Advice.id,
		adviceReference: formatS51AdviceReferenceCode(caseReference, s51Advice.referenceNumber),
		from: s51Advice.enquirer ?? '',
		agent: `${s51Advice.firstName} ${s51Advice.lastName}`,
		method: /** @type {Method} */ (s51Advice.enquiryMethod),
		adviceGivenBy: s51Advice.adviser,
		status: /** @type {Status} */ (s51Advice.publishedStatus),
		redactionStatus: /** @type {RedactionStatus} */ (s51Advice.redactedStatus),
		// @ts-ignore
		attachmentIds: s51Advice.S51AdviceDocument.map((doc) => doc.documentGuid)
	};
};
