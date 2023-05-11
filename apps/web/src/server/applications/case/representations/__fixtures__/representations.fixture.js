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
