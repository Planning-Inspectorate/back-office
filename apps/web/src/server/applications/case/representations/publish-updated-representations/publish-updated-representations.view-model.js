import { format } from 'date-fns';
import { representationsUrl } from '../config.js';

/**
 * @typedef {import('../relevant-representation.types.js').PublishableReps} PublishableReps
 * @typedef {import('../relevant-representation.types.js').PublishableRep} PublishableRep
 */

/**
 * @param {PublishableRep[]} publishableReps
 * @returns {object}
 */
const getPublishableRepresentationItemsViewModel = (publishableReps) =>
	publishableReps.map(({ id, reference, status, received }) => ({
		id,
		reference,
		status,
		received: format(new Date(received), 'dd MMM yyyy')
	}));

/**
 * @typedef Case
 * @type {object}
 * @property {string} title
 */

/**
 * @param {string} caseId
 * @param {string} serviceUrl
 * @param {Case} case
 * @param {PublishableReps} publishableRepresentaions
 * @returns {object}
 */
const getPublishUpdatedRepresentationsViewModel = (
	caseId,
	serviceUrl,
	{ title },
	{ itemCount, items }
) => {
	return {
		backLinkUrl: `${serviceUrl}/case/${caseId}/${representationsUrl}`,
		project: {
			title
		},
		publishableRepresentations: {
			itemCount,
			items: getPublishableRepresentationItemsViewModel(items)
		}
	};
};

export { getPublishUpdatedRepresentationsViewModel };
