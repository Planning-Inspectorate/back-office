/** @typedef {import('@pins/appeals.api').Schema.Appellant} Appellant */
/** @typedef {import('@pins/appeals.api').Appeals.SingleAppellantResponse} SingleAppellantResponse */

/**
 * @param {Appellant} appellant
 * @returns {SingleAppellantResponse}
 */
const formatAppellant = (appellant) => ({
	agentName: appellant.agentName,
	appellantId: appellant.id,
	company: appellant.customer.organisationName,
	email: appellant.customer.email,
	name: appellant.name
});

export { formatAppellant };
