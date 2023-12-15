import api from './back-office-api-client.js';
import { isEmpty, pick } from 'lodash-es';

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
			'under18'
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
 * @param {import('@pins/api/src/message-schemas/commands/register-representation').RegisterRepresentation} msg
 */
export default async function (context, msg) {
	context.log('Handle register-representation event');

	const caseId = await api.getCaseID(msg.caseReference);
	if (!caseId) {
		throw new Error(`No case found with caseReference: ${msg.caseReference}`);
	}

	const representation = {
		reference: msg.referenceId,
		type: msg.representationType,
		originalRepresentation: msg.originalRepresentation,
		represented: mapContactDetails(msg.represented),
		representative: mapContactDetails(msg.representative),
		representedType: isEmpty(msg.representative) ? msg.represented?.type : 'AGENT',
		received: msg.dateReceived || new Date()
	};

	await api.postRepresentation(caseId, representation);
}
