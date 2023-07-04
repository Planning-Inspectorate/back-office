import { format } from 'date-fns';
import { getFinalRepPageUrl } from './utils/get-final-rep-page-url.js';
import { repModeLinkOptions } from './utils/get-rep-mode-links.js';

/**
 *
 * @param {object} arg
 * @param {string=} arg.organisationName
 * @param {string=} arg.firstName
 * @param {string=} arg.lastName
 * @returns {string}
 */
const getTitle = ({ organisationName, firstName, lastName }) =>
	organisationName || `${firstName} ${lastName}`;

const tag = 'govuk-tag';

/**
 *
 * @type {Object<string, string>}}
 */
const keyMap = {
	AWAITING_REVIEW: `${tag}--grey`,
	REFERRED: `${tag}--blue`,
	INVALID: `${tag}--blue`,
	VALID: `${tag}`,
	PUBLISHED: `${tag}--green`,
	WITHDRAWN: `${tag}--red`,
	ARCHIVED: `${tag}--green`
};
/**
 *
 * @param {object} arg
 * @param {string} arg.status
 * @returns {{text: string, class: string}}
 */
const getStatus = ({ status }) => ({
	text: status.replace('_', ' '),
	class: keyMap[status.toUpperCase()]
});

/**
 *
 * @param {object} arg
 * @param {string} arg.received
 * @returns {string}
 */
const formatDate = ({ received }) => format(new Date(received), 'dd MMM yyyy');

/**
 *
 * @param {object} arg
 * @param {boolean} arg.redacted
 * @returns {string}
 */
const getRedacted = ({ redacted }) => (redacted ? 'Redacted' : 'Unredacted');

/**
 *
 * @param {object} args
 * @param {Array.<{reference: string, organisationName?: string, firstName?: string , lastName?: string, received: string, redacted: boolean, status: string, id: string}>} args.items
 * @param {string} caseId
 * @returns {Array.<{}>}
 */
export function getRepresentationsViewModel({ items }, caseId) {
	return items.map((rep) => ({
		reference: rep.reference,
		title: getTitle(rep),
		received: formatDate(rep),
		redacted: getRedacted(rep),
		status: getStatus(rep),
		id: rep.id,
		link: getFinalRepPageUrl(rep, caseId, repModeLinkOptions.summary)
	}));
}

/**
 * @param {object} arg
 * @param {string} arg.title
 * @param {string} arg.status
 * @param {string} arg.reference
 * @returns {{reference: string, title: string, status: {text: string, class: string}}}
 */
export const getCaseReferenceViewModel = ({ title, status, reference }) => ({
	title,
	status: getStatus({ status }),
	reference
});
