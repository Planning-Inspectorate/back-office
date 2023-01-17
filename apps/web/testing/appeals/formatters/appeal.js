// @ts-ignore – to address through api tscheck fixes
import CaseTeamFormatter from '@pins/api/src/server/appeals/case-team/appeal-formatter.js';
// @ts-ignore – to address through api tscheck fixes
import { appealFormatter as inspectorFormatter } from '@pins/api/src/server/appeals/inspector/appeal-formatter.js';
// @ts-ignore – to address through api tscheck fixes
import validationFormatter from '@pins/api/src/server/appeals/validation/appeal-formatter.js';

/** @typedef {import('@pins/api').Schema.Appeal} RawAppeal */
/** @typedef {import('@pins/appeals').Validation.Appeal} ValidationAppeal */
/** @typedef {import('@pins/appeals').Validation.AppealSummary} ValidationAppealSummary */
/** @typedef {import('@pins/appeals').CaseTeam.Appeal} CaseTeamAppeal */
/** @typedef {import('@pins/appeals').CaseTeam.AppealSummary} CaseTeamAppealSummary */
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
 * @returns {CaseTeamAppeal} - TODO: Link this type to web/response definition
 */
const formatAppealDetailsForCaseTeam = ({ documents = [], ...other }) => {
	const formattedAppeal = CaseTeamFormatter.formatAppealForAppealDetails(other);

	return /** @type {CaseTeamAppeal} */ {
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
 * @returns {CaseTeamAppealSummary}
 */
const formatAppealSummaryForCaseTeam = (appeal) => ({
	...CaseTeamFormatter.formatAppealForAllAppeals(appeal),
	...CaseTeamFormatter.formatAppealForParallelStates(appeal)
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

export const CaseTeam = {
	formatAppealDetails: formatAppealDetailsForCaseTeam,
	formatAppealSummary: formatAppealSummaryForCaseTeam
};

export const validation = {
	formatAppealDetails: formatAppealDetailsForValidation,
	formatAppealSummary: formatAppealSummaryForValidation
};

export const inspector = {
	formatAppealSummary: formatAppealSummaryForInspector,
	formatAppealDetails: formatAppealDetailsForInspector
};
