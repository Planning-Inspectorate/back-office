// @ts-nocheck
// TODO: schemas (PINS data model)
// TODO: local data model for service user

export const mapServiceUserIn = (data) => {
	const user = {
		create: {
			name: `${data.firstName} ${data.lastName}`,
			customer: {
				connectOrCreate: {
					where: { email: data.emailAddress },
					create: {
						firstName: data.firstName,
						lastName: data.lastName,
						email: data.emailAddress
					}
				}
			}
		}
	};
	return user;
};

export const mapServiceUserOut = (data, serviceUserType, caseReference) => {
	const user = {
		sourceSystem: 'back-office-appeals',
		sourceSuid: `back-office-appeals-${data.customer.id}`,
		ID: data.customer.id,
		firstName: data.customer.firstName,
		lastName: data.customer.lastName,
		emailAddress: data.customer.email,
		serviceUserType: serviceUserType,
		caseReference: caseReference,
		company: data.customer.organisationName
	};

	if (data.customer.address) {
		user.addressLine1 = data.customer.address.addressLine1;
		user.addressLine2 = data.customer.address.addressLine2;
		user.addressPostcode = data.customer.address.postcode;
		user.addressTown = data.customer.address.addressTown;
		user.addressCounty = data.customer.address.addressCounty;
	}

	return user;
};
