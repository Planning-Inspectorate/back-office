export const existingRepresentationsTestData = {
	reference: 'BC0110001-36',
	status: 'VALID',
	represented: {
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
	representative: {
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
	},
	_count: {
		attachments: 1
	},
	representationActions: [
		{
			status: 'VALID',
			actionDate: '2020-01-01T12:00:00.000Z'
		}
	],
	editedRepresentation: 'Edited comment for valid rep',
	originalRepresentation: 'Original comment for valid rep'
};

export const existingRepresentationsTestDataNoAgent = {
	reference: 'BC0110001-36',
	status: 'VALID',
	represented: {
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
	_count: {
		attachments: 0
	},
	representationActions: [
		{
			status: 'VALID',
			actionDate: '2020-01-01T12:00:00.000Z'
		}
	],
	editedRepresentation: '',
	originalRepresentation: 'Original comment for valid rep'
};
