import validationFormatter from '@pins/api/src/server/app/validation/appeal-formatter.js';
import caseOfficerFormatter from '@pins/api/src/server/app/case-officer/appeal-formatter.js';
import { appealFormatter as inspectorFormatter } from '@pins/api/src/server/app/inspector/appeal-formatter.js';

/** @typedef {import('@pins/api').Schema.Appeal} RawAppeal */
/** @typedef {import('@pins/appeals').Validation.Appeal} ValidationAppeal */
/** @typedef {import('@pins/appeals').Validation.AppealSummary} ValidationAppealSummary */
/** @typedef {import('@pins/appeals').Lpa.Appeal} LpaAppeal */
/** @typedef {import('@pins/appeals').Lpa.AppealSummary} LpaAppealSummary */
/** @typedef {import('@pins/appeals').Inspector.Appeal} InspectorAppeal */
/** @typedef {import('@pins/appeals').Inspector.AppealSummary} InspectorAppealSummary */

/**
 * @param {RawAppeal} appeal
 * @returns {ValidationAppeal} - TODO: Link this type to web/response definition
 */
const formatAppealDetailsForValidation = ({ documents = [], ...other }) => {
	const formattedAppeal = validationFormatter.formatAppealForAppealDetails(other);

	return /** @type {ValidationAppeal} */ ({
		...formattedAppeal,
		Documents: documents.map((document) => ({
			Type: document.type,
			Filename: document.filename,
			URL: document.url
		}))
	});
};

/**
 * @type {(appeal: RawAppeal) => ValidationAppealSummary}
 */
const formatAppealSummaryForValidation = /** @type {*} */ (
	validationFormatter.formatAppealForAllAppeals
);

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

/**
 * @type {(appeal: RawAppeal) => InspectorAppealSummary}
 */
const formatAppealSummaryForInspector = /** @type {*} */ (
	inspectorFormatter.formatAppealForAllAppeals
);

/**
 * @param {RawAppeal} appeal
 * @returns {InspectorAppeal}
 */
const formatAppealDetailsForInspector = inspectorFormatter.formatAppealForAppealDetails;

export const caseOfficer = {
	formatAppealDetails: formatAppealDetailsForCaseOfficer,
	formatAppealSummary: formatAppealSummaryForCaseOfficer
};

export const validation = {
	formatAppealDetails: formatAppealDetailsForValidation,
	formatAppealSummary: formatAppealSummaryForValidation
};

export const inspector = {
	formatAppealSummary: formatAppealSummaryForInspector,
	formatAppealDetails: formatAppealDetailsForInspector
};
