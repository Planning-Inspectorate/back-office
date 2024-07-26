import { removeSpecifiedCases } from '../src/remove-cases.js';

removeSpecifiedCases()
	.then(() => {
		console.log('Successfully removed specified cases from backoffice-applications');
	})
	.catch((error) => {
		throw new Error(
			`Error occurred while removing specified cases from backoffice-applications: ${JSON.stringify(
				error,
				null,
				2
			)}`
		);
	});
