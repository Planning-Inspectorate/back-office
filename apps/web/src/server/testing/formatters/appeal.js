import validationFormatter from '@pins/api/src/server/app/validation/appeal-formatter.js';

/** @typedef {import('@pins/api').Schema.Appeal} RawAppeal */
/** @typedef {import('@pins/appeals').Validation.Appeal} Appeal */
/** @typedef {import('@pins/appeals').Validation.AppealSummary} AppealSummary */

/**
 * @param {RawAppeal} appeal
 * @returns {Appeal} - TODO: Link this type to web/response definition
 */
const formatAppealDetails = ({ documents = [], ...other }) => {
	const formattedAppeal = validationFormatter.formatAppealForAppealDetails(other);

	return {
		...formattedAppeal,
		Documents: documents.map((document) => ({
			Type: document.type,
			Filename: document.filename,
			URL: document.url
		}))
	};
};

/**
 * @param {RawAppeal} appeal
 * @returns {AppealSummary} - TODO: Link this type to web/response definition
 */
const formatAppealSummary = validationFormatter.formatAppealForAllAppeals;

export const validation = {
	formatAppealDetails,
	formatAppealSummary
};
