import validationFormatter from '@pins/api/src/server/app/validation/appeal-formatter.js';
import caseOfficerFormatter from '@pins/api/src/server/app/case-officer/appeal-formatter.js';

/** @typedef {import('@pins/api').Schema.Appeal} RawAppeal */
/** @typedef {import('@pins/appeals').Validation.Appeal} ValidationAppeal */
/** @typedef {import('@pins/appeals').Lpa.Appeal} LpaAppeal */
/** @typedef {import('@pins/appeals').Lpa.AppealSummary} LpaAppealSummary */

/**
 * @param {RawAppeal} appeal
 * @returns {ValidationAppeal} - TODO: Link this type to web/response definition
 */
const formatAppealDetailsForValidation = ({ documents = [], ...other }) => {
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
const formatAppealSummaryForValidation = validationFormatter.formatAppealForAllAppeals;

/**
 * @param {RawAppeal} appeal
 * @returns {LpaAppeal} - TODO: Link this type to web/response definition
 */
const formatAppealDetailsForCaseOfficer = ({ documents = [], ...other }) => {
	const formattedAppeal = caseOfficerFormatter.formatAppealForAppealDetails(other);

	return /** @type {LpaAppeal} */ {
		...formattedAppeal,
		Documents: documents.map((document) => ({
			Type: document.type,
			Filename: document.filename,
			URL: document.url
		})),
		acceptingStatements: other.appealStatus.some(
			({ status }) => status === 'available_for_statements'
		),
		acceptingFinalComments: other.appealStatus.some(
			({ status }) => status === 'available_for_final_comments'
		)
	};
};

/**
 * @param {RawAppeal} appeal
 * @returns {LpaAppealSummary}
 */
const formatAppealSummaryForCaseOfficer = (appeal) => ({
	...caseOfficerFormatter.formatAppealForAllAppeals(appeal),
	...caseOfficerFormatter.formatAppealForParallelStates(appeal)
});

export const caseOfficer = {
	formatAppealDetails: formatAppealDetailsForCaseOfficer,
	formatAppealSummary: formatAppealSummaryForCaseOfficer
};

export const validation = {
	formatAppealDetails: formatAppealDetailsForValidation,
	formatAppealSummary: formatAppealSummaryForValidation
};
