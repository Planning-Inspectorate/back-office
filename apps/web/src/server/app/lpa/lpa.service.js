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
		context: { ttl: 1000 }
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
 * @property {Express.Multer.File} file
 */

/**
 * Upload a document to an appeal according to a given `documentType`.
 *
 * @param {number} appealId
 * @param {UploadDocumentData} data
 * @returns {Promise<AppealDocument>}
 */
export const uploadDocument = (appealId, { file, documentType }) => {
	const formData = new FormData();
	formData.append('documentType', documentType);
	formData.append('file', file.buffer);

	// lpa/${appealId}/documents is not yet implemented so mock created resource
	return Promise.resolve({
		Filename: file.originalname,
		Type: documentType,
		URL: '*'
	});
};

/**
 * Update appeal details.
 *
 * @param {number} appealId
 * @param {{ listedBuildingDescription: string }} data
 * @returns {Promise<Appeal>}
 */
export const updateAppeal = (appealId, data) => {
	// patch(`lpa/${appealId}`, { json: data });
	return findAppealById(appealId);
};
