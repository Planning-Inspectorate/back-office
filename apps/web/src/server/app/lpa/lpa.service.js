import { appendFilesToFormData } from '@pins/platform';
import FormData from 'form-data';
import { get, patch, post } from './../../lib/request.js';

/** @typedef {import('@pins/appeals').Lpa.Appeal} Appeal */
/** @typedef {import('@pins/appeals').AppealDocument} AppealDocument */
/** @typedef {import('@pins/appeals').Lpa.AppealSummary} AppealSummary */
/** @typedef {import('@pins/appeals').DocumentType} DocumentType */
/** @typedef {import('@pins/appeals').Lpa.Questionnaire} LpaQuestionnaire */

/**
 * @returns {Promise<AppealSummary[]>}
 */
export const findAllAppeals = () => get('case-officer');

/**
 * @param {number} appealId
 * @returns {Promise<Appeal>}
 */
export const findAppealById = (appealId) =>
	get(`case-officer/${appealId}`, {
		context: { ttl: 10_000 }
	});

/**
 * @param {number} appealId
 * @returns {Promise<Appeal>}
 */
export const findFullPlanningAppealById = (appealId) =>
	get(`case-officer/${appealId}/statements-comments`, {
		context: { ttl: 10_000 }
	});

/**
 * Mark a review questionnaire as completed. Internally, this marks all
 * missingOrIncorrect flags to `false`.
 *
 * @param {number} appealId
 * @param {LpaQuestionnaire} questionnaire
 * @returns {Promise<Appeal>}
 */
export function confirmQuestionnaireReview(appealId, questionnaire) {
	// todo: the updated appeal should be the api response
	return post(`case-officer/${appealId}/confirm`, {
		json: {
			reason: questionnaire
		}
	});
}

/**
 * @typedef {object} UploadDocumentData
 * @property {DocumentType} documentType
 * @property {Express.Multer.File[]} files
 */

/**
 * Upload one or more documents to an appeal.
 *
 * @param {number} appealId
 * @param {UploadDocumentData} data
 * @returns {Promise<AppealDocument[]>}
 */
export function uploadDocuments(appealId, { files, documentType }) {
	return Promise.resolve([]);
}

/**
 * @typedef {object} UploadFinalCommentsResponseBody
 * @property {number} AppealId 
 * @property {string} AppealReference
 * @property {string} date
 */

/**
 * Upload one or more final comments to the appeal.
 *
 * @param {number} appealId
 * @param {Express.Multer.File[]} files
 * @returns {Promise<UploadFinalCommentsResponseBody>}
 */
export function uploadFinalComments(appealId, files) {
	const formData = new FormData();
	appendFilesToFormData(formData, { key: 'finalcomments', files });

	return post(`case-officer/${appealId}/final-comment`, { body: formData });
}

/**
 * @typedef {object} UploadStatementsResponseBody
 * @property {number} AppealId 
 * @property {string} AppealReference
 * @property {string} date 
 */

/**
 * Upload one or more statements to the appeal.
 *
 * @param {number} appealId
 * @param {Express.Multer.File[]} files
 * @returns {Promise<UploadStatementsResponseBody>}
 */
export function uploadStatements(appealId, files) {
	const formData = new FormData();
	appendFilesToFormData(formData, { key: 'statements', files });

	return post(`case-officer/${appealId}/statement`, { body: formData });
}

/**
 * Update appeal details.
 *
 * @param {number} appealId
 * @param {{ listedBuildingDescription: string }} data
 * @returns {Promise<Appeal>}
 */
export const updateAppeal = (appealId, data) => patch(`case-officer/${appealId}`, { json: data });
