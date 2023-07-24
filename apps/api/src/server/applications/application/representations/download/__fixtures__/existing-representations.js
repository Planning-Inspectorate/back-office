export const existingRepresentationsTestData = {
	reference: 'BC0110001-36',
	status: 'VALID',
	contacts: [
		{
			type: 'PERSON',
			firstName: 'James',
			lastName: 'Test',
			organisationName: null,
			contactMethod: null,
			email: 'test@example.com',
			address: {
				addressLine1: '96 The Avenue',
				addressLine2: 'Maidstone',
				town: null,
				county: 'Kent',
				postcode: 'MD21 5XY',
				country: null
			}
		},
		{
			type: 'AGENT',
			firstName: 'James',
			lastName: 'Bond',
			organisationName: '',
			contactMethod: null,
			email: 'test-agent@example.com',
			address: {
				addressLine1: 'Copthalls',
				addressLine2: 'Clevedon Road',
				town: 'West Hill',
				county: null,
				postcode: 'BS48 1PN',
				country: null
			}
		}
	]
};

export const existingRepresentationsTestDataNoAgent = {
	reference: 'BC0110001-36',
	status: 'VALID',
	contacts: [
		{
			type: 'PERSON',
			firstName: 'James',
			lastName: 'Test',
			organisationName: null,
			contactMethod: null,
			email: 'test@example.com',
			address: {
				addressLine1: '96 The Avenue',
				addressLine2: 'Maidstone',
				town: null,
				county: 'Kent',
				postcode: 'MD21 5XY',
				country: null
			}
		}
	]
};
