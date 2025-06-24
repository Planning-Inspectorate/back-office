import { examLibraryChecker } from '../src/exam-library-checker.js';

// Parse command line arguments
const [, , caseReference, targetEnv] = process.argv;
const validEnvironments = ['DEV', 'TEST', 'PROD'];
const args = process.argv.slice(2);
const doRedirectTest = args.includes('-doRedirectTest') ? true : false;
const doBlobStoreTest = args.includes('-doBlobStoreTest') ? true : false;

if (!caseReference || !targetEnv) {
	console.error(
		'Usage: node exam-library-checker.js <caseReference> <targetEnv (DEV|TEST|PROD)> <-doRedirectTest> <-doBlobStoreTest>'
	);
	process.exit(1);
}

if (!validEnvironments.includes(targetEnv)) {
	console.error(
		`Invalid target environment: ${targetEnv}. Valid options are: ${validEnvironments.join(', ')}`
	);

	process.exit(1);
}

examLibraryChecker(caseReference, targetEnv, doRedirectTest, doBlobStoreTest)
	.then(() => {
		console.log('Successfully checked the examination library doc links');
	})
	.catch((error) => {
		console.error(error);
	});
