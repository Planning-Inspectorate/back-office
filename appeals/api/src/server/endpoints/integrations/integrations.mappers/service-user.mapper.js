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

export const mapServiceUserOut = (data) => {
	const user = {
		firstName: data.customer.firstName,
		lastName: data.customer.lastName,
		email: data.customer.email
	};
	return user;
};
