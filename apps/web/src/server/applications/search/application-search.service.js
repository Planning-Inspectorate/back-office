/** @typedef {import('./applications-search.types').SearchApplicationsRequestBody} SearchApplicationsRequestBody */
/** @typedef {import('../applications.types').Application} Application */

/**
 * @param {SearchApplicationsRequestBody} body
 * @returns {Promise<import('./applications-search.types').SearchApplicationResponse>}
 */
export const searchApplications = (body) => {
	const mockResponse = {
		page: body.pageNumber,
		pageSize: body.pageSize,
		pageCount: 1,
		itemCount: 2,
		items: [
			{
				id: 1,
				title: 'Bridge',
				reference: 'abc',
				modifiedDate: '2022-06-22T09:09:56.866Z',
				publishedDate: '2022-06-22T09:09:56.866Z'
			},
			{
				id: 2,
				title: 'Road',
				reference: 'xyz',
				modifiedDate: '2022-06-22T09:09:56.866Z',
				publishedDate: '2022-06-22T09:09:56.866Z'
			}
		]
	};

	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(mockResponse);
		}, 1000);
	});

	// return post('applications/search', {body});
};
