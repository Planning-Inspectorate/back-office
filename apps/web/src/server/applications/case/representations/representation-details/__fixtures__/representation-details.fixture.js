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
				postcode: 'DT6 5RN',
				country: 'Great Britain'
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
				postcode: 'BN14 0TT',
				country: 'Great Britain'
			}
		}
	],
	attachments: [
		{
			filename: 'a doc',
			id: 1,
			documentGuid: 'a doc guid'
		}
	],
	representationActions: [
		{
			type: 'REDACTION',
			actionBy: 'user 3',
			redactStatus: true,
			previousRedactStatus: true,
			status: null,
			previousStatus: null,
			invalidReason: null,
			referredTo: null,
			actionDate: '2023-06-30T12:51:32.769Z',
			notes: null
		},
		{
			type: 'REDACT_STATUS',
			actionBy: 'user 2',
			redactStatus: true,
			previousRedactStatus: true,
			status: null,
			previousStatus: null,
			invalidReason: null,
			referredTo: null,
			actionDate: '2023-06-30T12:51:37.492Z',
			notes: null
		},
		{
			type: 'STATUS',
			actionBy: 'user 1',
			redactStatus: null,
			previousRedactStatus: null,
			status: 'REFERRED',
			previousStatus: 'REFERRED',
			invalidReason: 'Duplicate',
			referredTo: 'Case Team',
			actionDate: '2023-06-30T10:54:24.136Z',
			notes: 'Some notes'
		}
	]
};
