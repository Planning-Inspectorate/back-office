export const representationsFixture = {
	items: [
		{
			status: 'AWAITING_REVIEW',
			redacted: true,
			received: '2022-01-01',
			organisationName: 'org name 1',
			reference: 'mock reference'
		},
		{
			status: 'VALID',
			redacted: false,
			received: '2022-01-01',
			organisationName: '',
			firstName: 'first',
			lastName: 'lastName',
			reference: 'mock reference'
		}
	]
};
