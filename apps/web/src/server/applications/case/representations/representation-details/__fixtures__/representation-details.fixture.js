export const representationDetailsFixture = {
	id: 1,
	reference: 'BC0110001-3',
	status: 'VALID',
	redacted: true,
	received: '2023-04-14T15:52:56.507Z',
	originalRepresentation:
		'The proposals size, loss of food producing land, battery storage size and technology, joined up thinking between DCO applications',
	redactedRepresentation:
		'The proposals size, loss of food producing land, battery storage size and technology, joined up thinking between DCO applications',
	user: {
		azureReference: 1
	},
	contacts: [
		{
			type: 'PERSON',
			firstName: 'Arthur',
			lastName: 'Test',
			organisationName: null,
			jobTitle: null,
			under18: false,
			email: 'test@example.com',
			phoneNumber: '01234 567890',
			address: {
				addressLine1: '21 The Pavement',
				addressLine2: null,
				town: null,
				county: 'Wandsworth',
				postcode: 'SW4 0HY'
			}
		},
		{
			type: 'AGENT',
			firstName: 'James',
			lastName: 'Bond',
			organisationName: '',
			jobTitle: null,
			under18: false,
			email: 'test-agent@example.com',
			phoneNumber: '01234 567890',
			address: {
				addressLine1: '96 The Avenue',
				addressLine2: 'Maidstone',
				town: null,
				county: 'Kent',
				postcode: 'MD21 5XY'
			}
		}
	],
	attachments: [],
	redactedBy: {
		azureReference: 1
	}
};
