/**
 * Register the url filter
 *
 * @param {string} key
 * @returns {string}
 */
export const url = (key) => {
	const domainUrl = '/appeals-service';

	switch (key) {
		case 'base-url':
			return `${domainUrl}`;

		default:
			return 'app/404';
	}
};
