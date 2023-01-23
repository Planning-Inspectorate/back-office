import { appendFilesToFormData } from '@pins/express';
import FormData from 'form-data';
import { get, patch, post } from '../../lib/request.js';

/** @typedef {import('@pins/appeals').CaseOfficer.Appeal} Appeal */
/** @typedef {import('@pins/appeals').AppealDocument} AppealDocument */
/** @typedef {import('@pins/appeals').CaseOfficer.AppealSummary} AppealSummary */
/** @typedef {import('@pins/appeals').DocumentType} DocumentType */
/** @typedef {import('@pins/appeals').CaseOfficer.Questionnaire} CaseOfficerQuestionnaire */
/** @typedef {import('@pins/express').MulterFile} MulterFile */

/**
 * @returns {Promise<AppealSummary[]>}
 */
export const findAllAppeals = () => get('appeals/case-officer');

/**
 * @param {number} appealId
 * @returns {Promise<Appeal>}
 */
export const findAppealById = (appealId) => get(`appeals/case-officer/${appealId}`);

/**
 * @param {number} appealId
 * @returns {Promise<Appeal>}
 */
export const findFullPlanningAppealById = (appealId) =>
	get(`appeals/case-officer/${appealId}/statements-comments`);

/**
 * Mark a review questionnaire as completed. Internally, this marks all
 * missingOrIncorrect flags to `false`.
 *
 * @param {number} appealId
 * @param {CaseOfficerQuestionnaire} questionnaire
 * @returns {Promise<Appeal>}
 */
export function confirmQuestionnaireReview(appealId, questionnaire) {
	// todo: the updated appeal should be the api response
	return post(`appeals/case-officer/${appealId}/confirm`, {
		json: {
			reason: questionnaire
		}
	});
}

/**
 * @typedef {object} UploadDocumentData
 * @property {DocumentType} documentType
 * @property {MulterFile[]} files
 */

/**
 * Upload one or more documents to an appeal.
 *
 * @param {number} appealId
 * @param {UploadDocumentData} data
 * @returns {Promise<AppealDocument[]>}
 */
export function uploadDocuments(appealId, { files, documentType }) {
	return Promise.resolve(
		files.map(({ originalname }) => ({
			Type: documentType,
			Filename: originalname,
			URL: '#'
		}))
	);
}

/**
 * @typedef {object} UploadFpaStatementsResponseBody
 * @property {number} AppealId
 * @property {string} AppealReference
 * @property {string} date
 */

/**
 * Upload one or more final comments to the appeal.
 *
 * @param {number} appealId
 * @param {MulterFile[]} files
 * @returns {Promise<UploadFpaStatementsResponseBody>}
 */
export function uploadFinalComments(appealId, files) {
	const formData = new FormData();

	appendFilesToFormData(formData, { key: 'finalcomments', files });

	return post(`appeals/case-officer/${appealId}/final-comment`, { body: formData });
}

/**
 * Upload one or more statements to the appeal.
 *
 * @param {number} appealId
 * @param {MulterFile[]} files
 * @returns {Promise<UploadFpaStatementsResponseBody>}
 */
export function uploadStatements(appealId, files) {
	const formData = new FormData();

	appendFilesToFormData(formData, { key: 'statements', files });

	return post(`appeals/case-officer/${appealId}/statement`, { body: formData });
}

/**
 * Update appeal details.
 *
 * @param {number} appealId
 * @param {{ listedBuildingDescription: string }} data
 * @returns {Promise<Appeal>}
 */
export const updateAppeal = (appealId, data) =>
	patch(`appeals/case-officer/${appealId}`, { json: data });
