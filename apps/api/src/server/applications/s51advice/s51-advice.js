import { pick } from 'lodash-es';
import { formatS51AdviceReferenceCode } from '#utils/mapping/map-s51-advice-details.js';
import { getById as getCaseById } from '../../repositories/case.repository.js';

/**
 * @typedef {import('../../../message-schemas/events/nsip-s51-advice.js').NSIPS51AdviceSchema} NSIPS51AdviceSchema
 * @typedef {'phone' | 'email' | 'meeting' | 'post'} Method
 * @typedef {'checked' | 'unchecked' | 'readytopublish' | 'published' | 'donotpublish'} Status
 * @typedef {'unredacted' | 'redacted'} RedactionStatus
 * */

/**
 * @param {import('@prisma/client').S51Advice} s51Advice
 * @returns {Promise<NSIPS51AdviceSchema>}
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
		attachmentIds: s51Advice.S51AdviceDocument
			? s51Advice.S51AdviceDocument.map((doc) => doc.documentGuid)
			: []
	};
};
