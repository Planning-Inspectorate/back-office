/**
 * @typedef {object} RepresentationAction
 * @property {boolean|null} redactStatus
 * @property {boolean|null} previousRedactStatus
 * @property {string|null} previousStatus
 * @property {string|null} status
 * @property {string} type
 * @property {string} actionDate
 * @property {string} actionBy
 */

import { getRepresentaionDetailsPageUrl } from '../../representation/utils/get-representation-page-urls.js';

/**
 *
 * @param {boolean|null} toConvert
 * @return {string}
 */
const mapBooleanToRedacted = (toConvert) => (toConvert ? 'Redacted' : 'Unredacted');

/**
 *
 * @param {string} date
 * @return {number}
 */
const dateToTimestamp = (date) => Math.floor(new Date(date).getTime() / 1000);
/**
 *
 * @param {RepresentationAction[]}representationActions
 * @return {{head: string[], body: *}}
 */
const mapTaskLog = (representationActions) => ({
	head: ['Date', 'Log type', 'Change from', 'Change to', 'Author'],
	body: representationActions.map((action) => {
		let logType, from, to;

		switch (action.type) {
			case 'STATUS':
				logType = 'Status change';
				from = action.previousStatus ?? '';
				to = action.status ?? '';
				break;
			case 'REDACTION':
			case 'REDACT_STATUS':
				logType = 'Redacted change';
				from = mapBooleanToRedacted(action.previousRedactStatus);
				to = mapBooleanToRedacted(action.redactStatus);
				break;
			case 'EDIT':
				logType = 'Edit representation';
				from = mapBooleanToRedacted(action.previousRedactStatus);
				to = mapBooleanToRedacted(action.redactStatus);
				break;
			default:
				logType = action.type;
				from = mapBooleanToRedacted(action.previousRedactStatus);
				to = mapBooleanToRedacted(action.redactStatus);
		}

		return {
			date: dateToTimestamp(action.actionDate),
			isStatus: action.type === 'STATUS',
			logType,
			from,
			to,
			author: action.actionBy
		};
	})
});

/**
 *
 * @param {*} representationDetails
 * @param {string} caseId
 * @param {string} representationId
 * @param {*} represented
 * @return {{taskLog: {head: string[], body: *}, pageHeading: string, backLinkUrl: string, pageTitle: string, representationDetails: *}}
 */
export const getRepresentationDetailsTaskLogViewModel = (
	representationDetails,
	caseId,
	representationId,
	represented
) => ({
	representationDetails,
	backLinkUrl: getRepresentaionDetailsPageUrl(caseId, representationId),
	pageTitle: 'Task Log',
	pageHeading: represented.organisationName ? represented.organisationName : represented.fullName,
	taskLog: mapTaskLog(representationDetails.representationActions)
});
