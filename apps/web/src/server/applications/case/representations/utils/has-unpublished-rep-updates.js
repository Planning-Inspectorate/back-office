/**
 * @typedef {import('../relevant-representation.types.js').PublishableReps} PublishableReps
 */

/**
 *
 * @param {PublishableReps} publishableReps
 * @returns {boolean}
 */
const hasUnpublishedRepUpdates = ({ previouslyPublished, itemCount }) =>
	previouslyPublished && itemCount > 0;

export { hasUnpublishedRepUpdates };
