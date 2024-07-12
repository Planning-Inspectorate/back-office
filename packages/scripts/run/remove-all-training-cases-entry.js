import { removeAllTrainingCase } from '../src/remove-training-cases.js';

removeAllTrainingCase()
	.then(() => {
		console.log('Successfully removed all training cases from backoffice-applications');
	})
	.catch((error) => {
		throw new Error(
			`Error occurred while removing all training cases from backoffice-applications: ${JSON.stringify(
				error,
				null,
				2
			)}`
		);
	});
