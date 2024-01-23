// @ts-nocheck
// TODO: schemas (PINS data model)
// TODO: local data model for service user

import { ODW_SYSTEM_ID } from '#endpoints/constants.js';

export const mapServiceUserIn = (data) => {
	if (data) {
		const serviceUser = {
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.emailAddress
		};
		return {
			create: serviceUser
		};
	}
};

export const mapServiceUserOut = (data, serviceUserType, caseReference) => {
	if (data) {
		const user = {
			sourceSystem: ODW_SYSTEM_ID,
			sourceSuid: data.id,
			id: data.id,
			firstName: data.firstName,
			lastName: data.lastName,
			emailAddress: data.email,
			serviceUserType: serviceUserType,
			caseReference: caseReference,
			company: data.organisationName
		};

		if (data.address) {
			user.addressLine1 = data.address.addressLine1;
			user.addressLine2 = data.address.addressLine2;
			user.addressPostcode = data.address.postcode;
			user.addressTown = data.address.addressTown;
			user.addressCounty = data.address.addressCounty;
		}

		return user;
	}

	return null;
};
