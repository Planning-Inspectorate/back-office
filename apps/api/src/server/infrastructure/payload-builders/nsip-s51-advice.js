import { pick } from 'lodash-es';
import {
	formatS51AdviceReferenceCode,
	mapS51AdviceStatusToSchemaStatus
} from '#utils/mapping/map-s51-advice-details.js';
import { getById as getCaseById } from '#repositories/case.repository.js';

/**
 * @typedef {import('@planning-inspectorate/data-model').Schemas.S51Advice} NSIPS51AdviceSchema
 * @typedef {import('@prisma/client').Prisma.S51AdviceGetPayload<{include: {S51AdviceDocument: true}}>} S51AdviceWithS51AdviceDocuments
 * @typedef {'phone' | 'email' | 'meeting' | 'post'} Method
 * @typedef {'checked' | 'unchecked' | 'readytopublish' | 'published' | 'donotpublish'} Status
 * @typedef {'unredacted' | 'redacted'} RedactionStatus
 * */

/**
 * Build schema message payload for nsip-s51-advice
 *
 * @param {S51AdviceWithS51AdviceDocuments} s51Advice
 * @returns {Promise<NSIPS51AdviceSchema>}
 * */
export const buildNsipS51AdvicePayload = async (s51Advice) => {
	const c = await getCaseById(s51Advice.caseId, {});
	const caseReference = c?.reference ?? '';

	return {
		...pick(s51Advice, [
			'caseId',
			'title',
			'titleWelsh',
			'enquiryDetails',
			'enquiryDetailsWelsh',
			'adviceDetails',
			'adviceDetailsWelsh'
		]),
		enquiryDate: s51Advice.enquiryDate.toISOString(),
		adviceDate: s51Advice.adviceDate.toISOString(),
		caseReference,
		adviceId: s51Advice.id,
		adviceReference: formatS51AdviceReferenceCode(caseReference, s51Advice.referenceNumber),
		from: `${s51Advice.firstName} ${s51Advice.lastName}`,
		agent: s51Advice.enquirer ?? '',
		method: /** @type {Method} */ (s51Advice.enquiryMethod),
		adviceGivenBy: s51Advice.adviser,
		status: mapS51AdviceStatusToSchemaStatus(s51Advice.publishedStatus),
		// Note: schema only allows redacted or unredacted
		redactionStatus: /** @type {RedactionStatus} */ (
			s51Advice.redactedStatus === 'redacted' ? 'redacted' : 'unredacted'
		),
		// @ts-ignore
		attachmentIds: s51Advice.S51AdviceDocument
			? // @ts-ignore
			  s51Advice.S51AdviceDocument.map((doc) => doc.documentGuid)
			: []
	};
};
