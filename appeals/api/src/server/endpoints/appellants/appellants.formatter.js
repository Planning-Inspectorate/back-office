/** @typedef {import('@pins/appeals.api').Schema.Appellant} Appellant */
/** @typedef {import('@pins/appeals.api').Appeals.SingleAppellantResponse} SingleAppellantResponse */

/**
 * @param {Appellant} appellant
 * @returns {SingleAppellantResponse}
 */
const formatAppellant = (appellant) => ({
	appellantId: appellant.id,
	name: appellant.name
});

export { formatAppellant };
