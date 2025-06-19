import { examLibraryChecker } from '../src/exam-library-checker.js';

examLibraryChecker()
	.then(() => {
		console.log('Successfully checked the examination library doc links');
	})
	.catch((error) => {
		console.error(error);
	});
