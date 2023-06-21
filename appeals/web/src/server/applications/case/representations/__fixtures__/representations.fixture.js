export const representationsFixture = {
	page: 1,
	pageSize: 25,
	pageCount: 1,
	itemCount: 3,
	items: [
		{
			status: 'AWAITING_REVIEW',
			redacted: true,
			received: '2022-01-01',
			organisationName: 'org name 1',
			reference: 'mock reference',
			id: '1'
		},
		{
			status: 'VALID',
			redacted: false,
			received: '2022-01-01',
			organisationName: '',
			firstName: 'first',
			lastName: 'lastName',
			reference: 'mock reference',
			id: '2'
		}
	]
};

export const representationFixture = {
	id: 1,
	reference: 'BC0110001-11',
	status: 'ARCHIVED',
	redacted: true,
	received: '2023-05-31T07:49:38.077Z',
	originalRepresentation:
		'The proposals size, loss of food producing land, battery storage size and technology, joined up thinking between DCO applications',
	redactedRepresentation:
		'The proposals size, loss of food producing land, battery storage size and technology, joined up thinking between DCO (Redacted)',
	type: null,
	user: null,
	contacts: [
		{
			type: 'PERSON',
			firstName: 'Mrs',
			lastName: 'Sue',
			organisationName: null,
			jobTitle: null,
			under18: false,
			email: 'test@example.com',
			phoneNumber: '01234 567890',
			address: {
				addressLine1: '96 The Avenue',
				addressLine2: 'Maidstone',
				town: null,
				county: 'Kent',
				postcode: 'MD21 5XY'
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
				addressLine1: '92 Huntsmoor Road',
				addressLine2: null,
				town: null,
				county: 'Tadley',
				postcode: 'RG26 4BX'
			}
		}
	],
	attachments: [],
	representationActions: [
		{
			notes: 'applications',
			status: null,
			actionBy: 'Isobel Bahringer'
		}
	],
	redactedBy: 'Isobel Bahringer',
	redactedNotes: 'applications'
};
