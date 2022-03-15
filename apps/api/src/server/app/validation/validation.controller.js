import { validationResult } from 'express-validator';
import appealRepository from '../repositories/appeal.repository.js';
import addressRepository from '../repositories/address.repository.js';
import formatDate from '../utils/date-formatter.js';
import formatAddress from '../utils/address-formatter.js';

const appealReview = {
	AppealId: 1,
	AppealReference: 'APP/Q9999/D/21/1345264',
	AppellantName: 'Lee Thornton',
	AppealStatus: 'new',
	Received: '23 Feb 2022',
	AppealSite: '96 The Avenue, Maidstone, Kent, MD21 5XY',
	LocalPlanningDepartment: 'Maindstone Borough Council',
	PlanningApplicationReference: '48269/APP/2021/1482'
};

const getAppealReview = function (request, response) {
	response.send(appealReview);
};

const getValidation = async function (request, response) {
	const appeals =  await appealRepository.getByStatuses(['submitted', 'awaiting_validation_info']);
	const formattedAppeals = await Promise.all(appeals.map(async (appeal) => formatAppeal(appeal)));
	response.send(formattedAppeals);
};

/**
 * @param {object} appeal appeal that requires formatting for the getValidation controller
 */
async function formatAppeal(appeal) {
	const address = await addressRepository.getById(appeal.addressId);
	const addressAsString = formatAddress(address);
	const appealStatus = appeal.status == 'submitted' ? 'new' : 'incomplete';
	return {
		AppealId: appeal.id, 
		AppealReference: appeal.reference, 
		AppealStatus: appealStatus,
		Received: formatDate(appeal.createdAt),
		AppealSite: addressAsString
	};
}

const updateValidation = function (request, response) {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		return response.status(400).json({ errors: errors.array() });
	}
	response.send();
};

const appealValidated = function (request, response) {
	response.send();
};

export { getValidation, getAppealReview, updateValidation, appealValidated };
