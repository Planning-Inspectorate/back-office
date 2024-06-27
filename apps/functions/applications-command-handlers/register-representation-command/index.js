import api from './back-office-api-client.js';
import { isEmpty, pick } from 'lodash-es';

/**
 * @typedef {import('@pins/applications.api/src/message-schemas/commands/register-subscription').RegisterRepresentation} PrevRegisterRepresentation
 * @typedef {import('pins-data-model').Schemas.RegisterRepresentation} RegisterRepresentation
 */

const mapContactDetails = (entity) => {
	if (isEmpty(entity)) return {};

	return {
		...pick(entity, [
			'firstName',
			'lastName',
			'organisationName',
			'jobTitle',
			'email',
			'phoneNumber',
			'type',
			'under18',
			'contactMethod'
		]),
		...(!isEmpty(entity.address)
			? {
					address: pick(entity.address, [
						'addressLine1',
						'addressLine2',
						'town',
						'county',
						'postcode',
						'country'
					])
			  }
			: undefined)
	};
};

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {RegisterRepresentation | PrevRegisterRepresentation} msg
 */
export default async function (context, msg) {
	context.log('Handle register-representation event');

	const caseId = await api.getCaseID(msg.caseReference);
	if (!caseId) {
		throw new Error(`No case found with caseReference: ${msg.caseReference}`);
	}

	const representation = {
		reference: msg.referenceId,
		status: 'AWAITING_REVIEW',
		type: msg.representationType,
		originalRepresentation: msg.originalRepresentation,
		represented: mapContactDetails(msg.represented),
		representative: mapContactDetails(msg.representative),
		representedType: isEmpty(msg.representative) ? msg.representationFrom : 'AGENT',
		received: msg.dateReceived || new Date()
	};

	await api.postRepresentation(caseId, representation);
}
