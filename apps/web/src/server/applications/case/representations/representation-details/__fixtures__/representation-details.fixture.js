export const representationDetailsFixture = {
	id: 1,
	reference: 'BC0110001-1',
	status: 'AWAITING_REVIEW',
	redacted: true,
	redactedBy: 'mock redacted by',
	redactedNotes: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
	redactedNotesExcerpt: '',
	redactedRepresentationExcerpt: '',
	representationExcerpt: '',
	received: '2023-04-27T11:23:45.755Z',
	originalRepresentation:
		'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla con.',
	redactedRepresentation:
		'(Redacted) Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla con.',
	user: null,
	type: 'mock type',
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
			contactMethod: '',
			address: {
				addressLine1: '44 Rivervale',
				addressLine2: null,
				town: 'Bridport',
				county: null,
				postcode: 'DT6 5RN'
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
			contactMethod: '',
			address: {
				addressLine1: '8 The Chase',
				addressLine2: null,
				town: 'Findon',
				county: null,
				postcode: 'BN14 0TT'
			}
		}
	],
	attachments: []
};
