import addressRepository from '../repositories/address.repository.js';
import formatAddress from '../utils/address-formatter.js';
import { validation_states_strings } from '../state-machine/validation-states.js';
import formatDate from '../utils/date-formatter.js';

/**
 * @param {string} status appeal status
 * @returns {string} reformatted appeal status
 */
function mapAppealStatus(status) {
	return status == validation_states_strings.received_appeal ? 'new' : 'incomplete';
}

const appealFormatter = {
	formatAppealForAllAppeals: async function(appeal) {
		const address = await addressRepository.getById(appeal.addressId);
		const addressAsString = formatAddress(address);
		const appealStatus = mapAppealStatus(appeal.status);
		return {
			AppealId: appeal.id,
			AppealReference: appeal.reference,
			AppealStatus: appealStatus,
			Received: formatDate(appeal.createdAt),
			AppealSite: addressAsString
		};
	},
	formatAppealForAppealDetails: async function(appeal) {
		const address = await addressRepository.getById(appeal.addressId);
		const addressAsString = formatAddress(address);
		const appealStatus = mapAppealStatus(appeal.status);
		return {
			AppealId: appeal.id,
			AppealReference: appeal.reference,
			AppellantName: appeal.appellantName,
			AppealStatus: appealStatus,
			Received: formatDate(appeal.createdAt),
			AppealSite: addressAsString,
			LocalPlanningDepartment: appeal.localPlanningDepartment,
			PlanningApplicationReference: appeal.planningApplicationReference,
			Documents: [
				{
					Type: 'planning application form',
					Filename: 'planning-application.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'decision letter',
					Filename: 'decision-letter.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'appeal statement',
					Filename: 'appeal-statement.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'supporting document',
					Filename: 'other-document-1.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'supporting document',
					Filename: 'other-document-2.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'supporting document',
					Filename: 'other-document-3.pdf',
					URL: 'localhost:8080'
				}
			]
		};
	}
};

export default appealFormatter;
