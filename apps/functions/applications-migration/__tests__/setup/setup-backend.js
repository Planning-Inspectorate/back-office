// @ts-nocheck
import { startApi } from './start-api.js';
import { startDb, stopDb } from './start-db.js';
import kill from 'tree-kill';

let apiProcess;
// eslint-disable-next-line no-undef
beforeAll(async () => {
	try {
		startDb();
		apiProcess = await startApi(); // Wait for the API to be fully started before running tests
		console.log('API started successfully');
	} catch (error) {
		console.error('Failed to start API', error);
		process.exit(1); // Exit if the API fails to start
	}
});

// eslint-disable-next-line no-undef
afterAll(async () => {
	if (apiProcess) {
		await new Promise((resolve, reject) => {
			kill(apiProcess.pid, 'SIGTERM', (err) => {
				if (err) {
					console.error(`Failed to kill API process: ${err}`);
					reject(err);
				}
				resolve(null);
			});
		});
	}
	stopDb();
});
