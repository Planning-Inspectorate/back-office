import { regenerateApiKeys } from '../src/regenerate-api-keys.js';

regenerateApiKeys()
	.then(() => {
		console.log('Successfully regenerated all backoffice-applications api keys');
	})
	.catch((error) => {
		throw new Error(`Error occurred while regenerating backoffice-applications api keys: ${error}`);
	});
